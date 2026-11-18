import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {players,normalizeName} from '../football-analyzer-mobile/game/data';
const batch=JSON.parse(readFileSync('scripts/football_players_batch3.json','utf8'));
const words=JSON.parse(readFileSync('src/lib/solo-anagrams.json','utf8'));
const keys=new Set(words.map((w:any)=>w.word));
const knownClubs=new Set(players.flatMap(p=>Array.from(p.clubs)));
const added:any[]=[],newWords:any[]=[],trails:any[]=[];
const quote=(s:string)=>"'"+s.replace(/'/g,"''")+"'";
const path='supabase/migrations/202611170011_batch_three_anagrams.sql';
assert.ok(!existsSync(path));
function addWord(p:any,name:string) {
 assert.match(p.anagramKey,/^[A-Z]{3,24}$/);assert.ok(!keys.has(p.anagramKey),'Repeated word '+p.anagramKey);keys.add(p.anagramKey);
 newWords.push({word:p.anagramKey,playerName:name,difficulty:p.anagramKey.length<=5?'easy':p.anagramKey.length<=8?'medium':'hard'});
}
for(const p of batch.newPlayers) {
 assert.ok(!players.some(x=>[x.name,...(x.aliases||[])].some(n=>normalizeName(n)===normalizeName(p.commonName))),'Repeated player '+p.commonName);
 assert.ok(p.clubs.length>=2);
 for(const c of p.clubs){assert.ok(knownClubs.has(c.name));assert.equal(c.sourceType,'official');assert.equal(new URL(c.evidenceUrl).hostname,'www.uefa.com');assert.ok(c.evidenceNote);}
 const id='research-'+normalizeName(p.commonName).replace(/\s/g,'')+'-batch3';assert.ok(!added.some(x=>x.id===id));
 added.push({id,name:p.commonName,clubs:p.clubs.map((c:any)=>c.name),aliases:p.aliases,source:p.clubs[0].evidenceUrl});addWord(p,p.commonName);
}
for(const p of batch.anagramSuggestions){const existing=players.find(x=>x.id===p.existingPlayerId);assert.ok(existing);assert.ok([existing.name,...(existing.aliases||[])].some(n=>normalizeName(n)===normalizeName(p.commonName)));addWord(p,existing.name);}
// Defer overlapping loan/return periods and incomplete/uncertain career endings.
const deferred=['Ricardo Quaresma','Arda Turan','Roberto Carlos','Dirk Kuyt','Gheorghe Popescu'];
for(const p of batch.careerTrails) {
 if(deferred.includes(p.commonName))continue;
 const existing=players.find(x=>x.id===p.existingPlayerId);assert.ok(existing);assert.equal(normalizeName(existing.name),normalizeName(p.commonName));
 let stages=p.trail.map((s:any)=>({club:s.club,startYear:s.startYear,endYear:s.endYear,loan:s.loan}));
 if(p.commonName==='Raul Meireles')stages=[{...stages[1]}, {...stages[0],startYear:2003},...stages.slice(2)];
 for(let i=0;i<stages.length;i++){assert.ok(stages[i].club);assert.ok(stages[i].startYear<=stages[i].endYear);if(i)assert.ok(stages[i].startYear>=stages[i-1].startYear);}
 const short=p.commonName.split(' ').slice(-1)[0];
 const aliases=Array.from(new Set([existing.name,p.commonName,...(existing.aliases||[]),short,...(p.commonName==='Emre Belözoğlu'?['Emre']:[]),...(p.commonName==='Simão Sabrosa'?['Simão']:[])]));
 trails.push({id:existing.id,playerName:existing.name,aliases,stages,source:p.sources[0].url,sourceType:'secondary',note:'Kaynakta yer alan A takım kulüp dönemleri. Kiralık dönemlerde yıllar örtüşebilir.'});
}
assert.equal(trails.length,10);
writeFileSync('football-analyzer-mobile/game/batch-three-players.json',JSON.stringify(added,null,2)+'\n');
writeFileSync('src/lib/career-trails.json',JSON.stringify(trails,null,2)+'\n');
writeFileSync(path,'begin;\ninsert into public.game_anagrams(word,player_name,difficulty) values\n'+newWords.map(w=>` (${quote(w.word)},${quote(w.playerName)},${quote(w.difficulty)})`).join(',\n')+'\non conflict(word) do nothing;\ncommit;\n',{flag:'wx'});
writeFileSync('scripts/batch-three-review.json',JSON.stringify({newPlayers:added.length,newAnagrams:newWords.length,trails:trails.length,deferredTrails:deferred,preservedLinks:[{player:'Ferran Torres',club:'Paris Saint-Germain',source:'https://www.uefa.com/uefachampionsleague/clubs/players/250088320--ferran-torres/'},{player:'Rodri',club:'Barcelona',source:'https://www.uefa.com/uefachampionsleague/clubs/players/250082664--rodri/'}],careerCorrection:'Meireles: Aves 2001–2003 precedes Boavista senior appearances 2003–2004; checked Wikipedia narrative.',sourcePolicy:'New club links retain researcher-attributed UEFA evidence. Career sequences remain secondary sourced; not an official independent audit.'},null,2)+'\n');
console.log({players:added.length,words:newWords.length,trails:trails.length});
