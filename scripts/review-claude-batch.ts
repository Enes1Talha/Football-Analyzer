import { readFileSync, writeFileSync } from 'node:fs';
import { players, normalizeName } from '../football-analyzer-mobile/game/data';
const batch=JSON.parse(readFileSync(process.argv[2], 'utf8'));
const clubs=new Set(players.flatMap(p=>[...p.clubs]));
const clubAliases: Record<string,string> = {'Inter Milan':'Inter','PSV Eindhoven':'PSV'};
const clubName=(name:string)=>(clubAliases[name]||name);
const report=batch.players.map((p:any)=>{
 const existing=players.find(x=>[x.name,...(x.aliases||[])].some(n=>[p.fullName,p.commonName].some(v=>normalizeName(n)===normalizeName(v))));
 return {name:p.commonName,id:existing?.id||null,anagram:p.anagramName,difficulty:p.difficulty,
 known:p.clubs.filter((c:any)=>existing?.clubs.includes(clubName(c.name))).map((c:any)=>clubName(c.name)),
 newSupported:p.clubs.filter((c:any)=>clubs.has(clubName(c.name))&&!existing?.clubs.includes(clubName(c.name))).map((c:any)=>clubName(c.name)),
 outsideScope:p.clubs.filter((c:any)=>!clubs.has(clubName(c.name))).map((c:any)=>clubName(c.name))};
});
writeFileSync('scripts/claude-batch1-review.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({players:report.length,links:batch.players.reduce((n:number,p:any)=>n+p.clubs.length,0),existing:report.filter((r:any)=>r.id).length,newPlayers:report.filter((r:any)=>!r.id),newSupported:report.filter((r:any)=>r.id&&r.newSupported.length)},null,2));
