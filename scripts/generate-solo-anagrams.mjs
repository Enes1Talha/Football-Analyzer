// Refresh the public practice snapshot after adding seed-only anagram migrations.
// Ranked rounds still select and validate their answer on the server.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
const words=new Map();
for(const file of readdirSync('supabase/migrations').filter(f=>/anagram.*\.sql$/.test(f)).sort()) {
 const sql=readFileSync('supabase/migrations/'+file,'utf8');
 const inserts=sql.match(/insert into public\.game_anagrams\b[^;]+;/g)?.join('\n')||'';
 for(const m of inserts.matchAll(/\('((?:''|[^'])*)','((?:''|[^'])*)','(easy|medium|hard)'\)/g)) {
  const word=m[1].replace(/''/g,"'");
  if(!words.has(word))words.set(word,{word,playerName:m[2].replace(/''/g,"'"),difficulty:m[3]});
 }
}
if(!words.size)throw new Error('No seed words found');
writeFileSync('src/lib/solo-anagrams.json',JSON.stringify(Array.from(words.values()),null,2)+'\n');
console.log(`Prepared ${words.size} practice words. Run test-game-db to check against the migrated server catalog.`);
