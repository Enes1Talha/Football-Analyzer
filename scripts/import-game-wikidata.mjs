// Public CC0 structured facts, fetched once for review; never called during a game.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
const clubs = {
 Q18656:'Manchester United',Q9617:'Arsenal',Q9616:'Chelsea',Q1130849:'Liverpool',
 Q8682:'Real Madrid',Q7156:'Barcelona',Q495299:'Galatasaray',Q6601875:'Fenerbahçe',
 Q172567:'Beşiktaş',Q192641:'Trabzonspor',Q1543:'AC Milan',Q631:'Inter',Q1422:'Juventus',
 Q81888:'Ajax',Q483020:'Paris Saint-Germain',Q15789:'Bayern Munich',Q128446:'Porto',
 Q131499:'Benfica',Q75729:'Sporting CP',Q2739:'Roma',Q8701:'Atlético Madrid',
 Q50602:'Manchester City',Q41420:'Borussia Dortmund',Q10329:'Sevilla',Q10333:'Valencia',
 Q704:'Lyon',Q132885:'Marseille',Q134241:'Feyenoord',Q18716:'Newcastle United'
};
const query = `SELECT ?player ?club ?statement ?appearances WHERE {
 VALUES ?club { ${Object.keys(clubs).map(id=>'wd:'+id).join(' ')} }
 ?player p:P54 ?statement.
 ?statement ps:P54 ?club; pq:P1350 ?appearances.
 FILTER(?appearances > 0)
 FILTER NOT EXISTS { ?statement wikibase:rank wikibase:DeprecatedRank }
}`;
const rows=[];
mkdirSync('node_modules/.cache/game-import',{recursive:true});
for (const clubId of Object.keys(clubs)) {
const cache='node_modules/.cache/game-import/'+clubId+'.json';
if(existsSync(cache)) { rows.push(...JSON.parse(readFileSync(cache,'utf8'))); continue; }
const clubQuery=query.replace(/VALUES \?club \{[^}]+\}/,`VALUES ?club { wd:${clubId} }`);
const response = await fetch('https://query.wikidata.org/sparql?format=json&query='+encodeURIComponent(clubQuery), {
 headers:{'User-Agent':'FootballAnalyzer/1.0 (https://github.com/Enes1Talha/Football-Analyzer)','Accept':'application/sparql-results+json'},
 signal:AbortSignal.timeout(90000)
});
if (!response.ok) throw new Error(`Wikidata ${response.status}; retry later, no existing data changed.`);
const payload=await response.json();
writeFileSync(cache,JSON.stringify(payload.results.bindings));
rows.push(...payload.results.bindings);
console.log(`${clubs[clubId]}: ${payload.results.bindings.length} club records`);
}
const candidates=new Map();
for(const row of rows) {
 const id=row.player.value.split('/').pop(), clubId=row.club.value.split('/').pop();
 if(!clubs[clubId] || !Number.isFinite(Number(row.appearances.value)) || Number(row.appearances.value)<=0) continue;
 const record=candidates.get(id)||{id:'wd-'+id,name:id,clubs:[],source:'https://www.wikidata.org/wiki/'+id,evidence:[]};
 if(!record.clubs.includes(clubs[clubId])) record.clubs.push(clubs[clubId]);
 record.evidence.push({clubId,club:clubs[clubId],appearances:Number(row.appearances.value),statement:row.statement.value});
 candidates.set(id,record);
}
const priority = p => p.id==='wd-Q615' ? 100 : p.clubs.some(c=>['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor'].includes(c)) ? 50 : 0;
const players=[...candidates.values()].filter(p=>p.clubs.length>=2).sort((a,b)=>priority(b)-priority(a) || b.clubs.length-a.clubs.length || a.id.localeCompare(b.id)).slice(0,400);
const ids=[...Object.keys(clubs),...players.map(p=>p.id.slice(3))];
const entities={};
for(let offset=0;offset<ids.length;offset+=50) {
 const r=await fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels%7Caliases&languages=tr%7Cen&ids='+ids.slice(offset,offset+50).join('%7C'));
 if(!r.ok) throw new Error('Label lookup failed: '+r.status);
 Object.assign(entities,(await r.json()).entities);
}
for(const p of players) {
 const e=entities[p.id.slice(3)]; p.name=e.labels?.tr?.value || e.labels?.en?.value || p.name;
 p.aliases=[...new Set([e.labels?.en?.value,...(e.aliases?.en||[]).map(a=>a.value),...(e.aliases?.tr||[]).map(a=>a.value)].filter(Boolean))];
}
writeFileSync('scripts/game-wikidata-candidates.json',JSON.stringify({retrievedAt:new Date().toISOString(),license:'CC0',query,clubMappings:Object.keys(clubs).map(id=>({id,name:clubs[id],sourceLabel:entities[id]?.labels?.en?.value})),players},null,2)+'\n');
console.log(JSON.stringify({players:players.length,links:rows.length,clubLabels:Object.keys(clubs).map(id=>[id,clubs[id],entities[id]?.labels?.en?.value])}));
