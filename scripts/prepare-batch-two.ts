import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {players,normalizeName,type GamePlayer} from '../football-analyzer-mobile/game/data';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const batch=read('scripts/football_players_batch2.json');
const oldWords=read('src/lib/solo-anagrams.json');
const clubs=new Set(players.flatMap(p=>Array.from(p.clubs)));
const additions:GamePlayer[]=[],updates:GamePlayer[]=[],anagrams:any[]=[];
const normalized=(s:string)=>normalizeName(s.replace(/[øØ]/g,'o')).replace(/\s/g,'');
const sqlPath='supabase/migrations/202611170008_batch_two_anagrams.sql';
assert.ok(!existsSync(sqlPath),'Do not overwrite an applied migration');
const wordKeys=new Set(oldWords.map((p:any)=>normalized(p.word)));
function addWord(p:any,player:GamePlayer) {
 let word=p.anagramKey;
 if(player.name==='Diego Reyes')word='DIEGOREYES';
 if(player.name==='Bruno Alves')word='BRUNOALVES';
 assert.match(word,/^[A-Z]{3,20}$/);
 if(wordKeys.has(normalized(word)))return;
 wordKeys.add(normalized(word));
 anagrams.push({word,playerName:player.name,difficulty:word.length<=5?'easy':word.length<=8?'medium':'hard'});
}
function addPlayer(p:any,minimum=2) {
 const matching=players.filter(x=>[x.name,...(x.aliases||[])].some(n=>[p.commonName,p.fullName].filter(Boolean).some((v:string)=>normalized(n)===normalized(v))));
 assert.equal(matching.length,0,'Already exists: '+p.commonName);
 assert.ok(p.clubs.length>=minimum);
 for(const c of p.clubs) {
  assert.ok(clubs.has(c.name),'Unsupported club '+c.name);
  assert.ok(c.evidenceNote&&c.evidenceUrl);
  assert.ok(['official','secondary'].includes(c.sourceType));
  const host=new URL(c.evidenceUrl).hostname;
  assert.ok(c.sourceType==='official'?host==='www.uefa.com':host==='en.wikipedia.org');
 }
 const id='research-'+normalized(p.commonName)+'-'+(p.birthDate||'batch2');
 assert.ok(!additions.some(x=>x.id===id||normalized(x.name)===normalized(p.commonName)));
 const player={id,name:p.commonName,clubs:Array.from(new Set<string>(p.clubs.map((c:any)=>c.name))),source:p.clubs[0].evidenceUrl,
  aliases:Array.from(new Set<string>([p.fullName,...(p.aliases||[]),p.commonName.replace(/[øØ]/g,'o')].filter(Boolean)))};
 additions.push(player);return player;
}
for(const p of batch.newPlayers) addWord(p,addPlayer(p));
for(const p of batch.existingPlayerNewLinks) {
 const existing=players.find(x=>x.id===p.existingPlayerId);assert.ok(existing);
 for(const c of p.clubs){assert.ok(clubs.has(c.name));assert.ok(!existing.clubs.includes(c.name));assert.ok(c.evidenceUrl&&c.evidenceNote);}
 updates.push({...existing,clubs:Array.from(new Set([...existing.clubs,...p.clubs.map((c:any)=>c.name)]))});
}
for(const p of batch.anagramSuggestions) {
 const existing=players.find(x=>x.id===p.existingPlayerId);assert.ok(existing,'Missing ID '+p.existingPlayerId);
 assert.ok([existing.name,...(existing.aliases||[])].some(n=>normalized(n)===normalized(p.commonName)),'Identity mismatch '+p.commonName);
 addWord(p,existing);
}
const firstBatch=read('scripts/football_players_batch1.json');
for(const p of batch.deferredFollowUps) {
 const original=firstBatch.players.find((x:any)=>x.commonName===p.name);assert.ok(original);
 const evidence=p.newEvidence.filter((c:any)=>clubs.has(c.club)).map((c:any)=>({...c,name:c.club}));
 const player=addPlayer({...original,clubs:evidence},p.resolved?2:1);
 const proposal=p.anagramSuggestion||{anagramKey:normalized(original.anagramName).toUpperCase()};
 addWord(proposal,player);
}
writeFileSync('football-analyzer-mobile/game/batch-two-players.json',JSON.stringify([...updates,...additions],null,2)+'\n');
const quote=(s:string)=>"'"+s.replace(/'/g,"''")+"'";
writeFileSync(sqlPath,'-- Reviewed batch two word additions; original difficulties are unchanged.\nbegin;\ninsert into public.game_anagrams(word,player_name,difficulty) values\n'+anagrams.map(w=>` (${quote(w.word)},${quote(w.playerName)},${quote(w.difficulty)})`).join(',\n')+'\non conflict(word) do nothing;\ncommit;\n',{flag:'wx'});
const report={date:'2026-11-17',policy:'Accepted as attributed research. Secondary sources remain secondary; not every career was independently audited. Targeted official checks recorded in GAME_DATA.md.',newClubPlayers:additions.filter(p=>p.clubs.length>=2).length,anagramOnlyPlayers:additions.filter(p=>p.clubs.length<2).map(p=>p.name),existingUpdated:updates.map(p=>p.id),newAnagrams:anagrams.length,totalPlayers:players.length+additions.length,totalAnagrams:oldWords.length+anagrams.length,excludedUncertain:batch.uncertainRecords,wordOverrides:{'Diego Reyes':'DIEGOREYES','Bruno Alves':'BRUNOALVES'},newIds:additions.map(p=>({name:p.name,id:p.id}))};
writeFileSync('scripts/batch-two-admission.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
