import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { players } from '../football-analyzer-mobile/game/data';
import { careerTrails } from '../src/lib/career';

const destination = '../claude-arastirma';
const moreLessQuestions = JSON.parse(readFileSync('src/lib/more-less-questions.json','utf8'));
mkdirSync(destination, {recursive:true});
const words = new Map<string,{word:string;playerName:string;difficulty:string}>();
// Current seed migrations use literal tuples; SQL escapes single quotes by doubling.
for (const file of readdirSync('supabase/migrations').filter(f=>/anagram.*\.sql$/.test(f)).sort()) {
 const sql=readFileSync('supabase/migrations/'+file,'utf8');
 const tuple=/\('((?:''|[^'])*)','((?:''|[^'])*)','(easy|medium|hard)'\)/g;
 const inserts=sql.match(/insert into public\.game_anagrams\b[^;]+;/g)?.join('\n') || '';
 for (const match of Array.from(inserts.matchAll(tuple))) {
  const word=match[1].replace(/''/g,"'");
  if (!words.has(word)) words.set(word,{word,playerName:match[2].replace(/''/g,"'"),difficulty:match[3]});
 }
}
const clubs=Array.from(new Set(players.flatMap(p=>Array.from(p.clubs)))).sort();
const turkish=new Set(['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor']);
const pairs=[];
for(let i=0;i<clubs.length;i++) for(let j=i+1;j<clubs.length;j++) {
 if(!turkish.has(clubs[i])&&!turkish.has(clubs[j])) continue;
 const count=players.filter(p=>p.clubs.includes(clubs[i])&&p.clubs.includes(clubs[j])).length;
 pairs.push({clubs:[clubs[i],clubs[j]],knownAnswers:count});
}
const pending=JSON.parse(readFileSync('scripts/claude-batch1-admission.json','utf8')).players.filter((p:any)=>!p.accepted&&!players.some(existing=>existing.name===p.name));
const snapshot={
 snapshotDate:'2026-11-19',purpose:'Research exclusion and gap list, not an official or exhaustive career database.',
 counts:{players:players.length,clubs:clubs.length,anagrams:words.size,careerTrails:careerTrails.length,moreLess:moreLessQuestions.length},supportedClubs:clubs,
 moreLessQuestions,
 careerTrails,
 players:players.map(p=>({id:p.id,name:p.name,aliases:p.aliases||[],clubs:p.clubs,source:p.source})).sort((a,b)=>a.name.localeCompare(b.name,'tr')),
 anagrams:Array.from(words.values()),
 priorityPairs:pairs.sort((a,b)=>a.knownAnswers-b.knownAnswers).slice(0,40),
 deferredFromBatchOne:pending.map((p:any)=>({name:p.name,id:p.id,reason:p.reason})),
 caveats:['Zero known answers means missing coverage, not proof that no such player exists.','Names and aliases are search hints; different players can share names.','Existing club lists are partial. New independently supported links may still be useful.']
};
if(players.length!==543 || words.size!==264 || careerTrails.length!==34) throw new Error('Snapshot counts changed; review before sharing.');
writeFileSync(destination+'/mevcut-oyun-havuzu.json',JSON.stringify(snapshot,null,2)+'\n');
writeFileSync(destination+'/mevcut-oyuncular.txt',snapshot.players.map(p=>p.name+' | '+p.clubs.join(', ')).join('\n')+'\n');
console.log(JSON.stringify({destination,...snapshot.counts}));
