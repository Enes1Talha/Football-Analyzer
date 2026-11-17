// Review aid: only corroborated links to already supported senior clubs are admitted.
// The input is a proposal, not proof. Wikidata and Wikipedia are not independent audits.
import { readFileSync, writeFileSync } from 'node:fs';
import { players, normalizeName } from '../football-analyzer-mobile/game/data';
const read = (path: string) => JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const batch = read('scripts/football_players_batch1.json');
const review = read('scripts/claude-batch1-review.json');
const entities: any[] = Object.values(read('scripts/claude-batch1-identities.json').entities);
const extraIds: Record<string,string> = { Guti:'Q194461', 'John Obi Mikel':'Q166984' };
const clubIds: Record<string,string> = {
 Q18656:'Manchester United',Q9617:'Arsenal',Q9616:'Chelsea',Q1130849:'Liverpool',
 Q8682:'Real Madrid',Q7156:'Barcelona',Q495299:'Galatasaray',Q6601875:'Fenerbahçe',
 Q172567:'Beşiktaş',Q192641:'Trabzonspor',Q1543:'AC Milan',Q631:'Inter',Q1422:'Juventus',
 Q81888:'Ajax',Q483020:'Paris Saint-Germain',Q15789:'Bayern Munich',Q128446:'Porto',
 Q131499:'Benfica',Q75729:'Sporting CP',Q2739:'Roma',Q8701:'Atlético Madrid',
 Q50602:'Manchester City',Q41420:'Borussia Dortmund',Q10329:'Sevilla',Q10333:'Valencia',
 Q704:'Lyon',Q132885:'Marseille',Q134241:'Feyenoord',Q18716:'Newcastle United'
};
const rows = Object.keys(clubIds).flatMap(id => read(`node_modules/.cache/game-import/${id}.json`));
const additions: any[] = [], audit: any[] = [];
for (const proposed of batch.players) {
 const initial = review.find((r:any) => r.name === proposed.commonName);
 if (initial.id) continue;
 const entity = entities.find(e => Object.values(e.labels || {}).some((l:any) => normalizeName(l.value) === normalizeName(proposed.commonName)));
 const id = extraIds[proposed.commonName] || entity?.id;
 const evidence = rows.filter((r:any) => id && r.player.value.endsWith('/'+id) && Number(r.appearances.value)>0)
   .map((r:any) => ({club:clubIds[r.club.value.split('/').pop()], appearances:Number(r.appearances.value), statement:r.statement.value}))
   .filter((e:any) => initial.newSupported.includes(e.club));
 const clubs: string[] = Array.from(new Set<string>(evidence.map((e:any)=>e.club)));
 const accepted = clubs.length >= 2;
 audit.push({ name:proposed.commonName, id:id || null, accepted, evidence,
   reason:accepted ? 'At least two proposed supported-club links have positive appearance statements.' : 'Unresolved identity or fewer than two corroborated supported-club links; deferred, not disproved.' });
 if (accepted) additions.push({id:'wd-'+id, name:proposed.commonName, clubs, source:'https://www.wikidata.org/wiki/'+id,
   aliases:Array.from(new Set([proposed.commonName,proposed.fullName,...Object.values(entity?.labels || {}).map((l:any)=>l.value)]))});
}
writeFileSync('scripts/claude-batch1-admission.json',JSON.stringify({policy:'Positive-appearance corroboration, not official manual verification. Counts are evidence only, never displayed as current totals.',players:audit},null,2)+'\n');
writeFileSync('football-analyzer-mobile/game/reviewed-players.json',JSON.stringify(additions,null,2)+'\n');
// Existing words keep their released difficulty. Only additions are emitted.
const oldWords = new Set(['MESSI','NANI','HAGI','FIGO','ETO O','VIDAL','DROGBA','ANELKA','BECKHAM','RONALDO','MORATA','CRESPO','VIEIRA','RIBERY','IBRAHIMOVIC','LEWANDOWSKI','AUBAMEYANG','SNEIJDER','QUARESMA','SEEDORF']);
const quote=(s:string)=>"'"+s.replace(/'/g,"''")+"'";
const words = batch.players.flatMap((p:any) => {
 const initial=review.find((r:any)=>r.name===p.commonName);
 const player=players.find(p=>p.id===initial.id) || additions.find(a=>a.name===p.commonName);
 if (!player) return [];
 const word=normalizeName(p.anagramName).replace(/\s/g,'').toUpperCase();
 if(oldWords.has(word)) return [];
 if (!/^[A-Z]{3,20}$/.test(word)) throw new Error('Invalid word: '+word);
 return [{word,player:player.name,difficulty:word.length<=5?'easy':word.length<=8?'medium':'hard'}];
});
if(new Set(words.map((w:any)=>w.word)).size!==words.length) throw new Error('Duplicate words');
writeFileSync('supabase/migrations/202611170005_batch_one_anagrams.sql',
 '-- Additions from reviewed batch one. Original word difficulties are preserved.\nbegin;\ninsert into public.game_anagrams(word,player_name,difficulty) values\n'+
 words.map((w:any)=>` (${quote(w.word)},${quote(w.player)},${quote(w.difficulty)})`).join(',\n')+
 '\non conflict(word) do nothing;\ncommit;\n',{flag:'wx'});
console.log(JSON.stringify({acceptedPlayers:additions.length,deferredPlayers:audit.filter(p=>!p.accepted).map(p=>p.name),newAnagrams:words.length}));
