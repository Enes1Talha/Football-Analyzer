import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const snapshot=JSON.parse(readFileSync('scripts/game-wikidata-candidates.json','utf8'));
assert.equal(snapshot.license,'CC0');
const ids=new Set();
for(const p of snapshot.players) {
 assert.match(p.id,/^wd-Q\d+$/); assert.ok(!ids.has(p.id)); ids.add(p.id);
 assert.ok(p.name && !/^Q\d+$/.test(p.name));
 assert.ok(p.clubs.length>=2);
 for(const club of p.clubs) assert.ok(p.evidence.some(e=>e.club===club && e.appearances>0 && e.statement.startsWith('http://www.wikidata.org/entity/statement/')));
}
writeFileSync('football-analyzer-mobile/game/imported-players.json',JSON.stringify(snapshot.players.map(({id,name,clubs,source,aliases})=>({id,name,clubs,source,aliases})),null,2)+'\n');
console.log(`Prepared ${snapshot.players.length} players with positive appearance evidence; source snapshot retained for review.`);
