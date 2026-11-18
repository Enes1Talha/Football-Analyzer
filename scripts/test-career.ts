import assert from 'node:assert/strict';
import {careerTrails,pickCareer,careerCorrect,careerPoints} from '../src/lib/career';
assert.deepEqual([2,3,4,5,6,7,8,9].map(n=>careerPoints(9,n)),[100,80,60,40,20,20,20,20]);
assert.equal(careerPoints(4,4),60); // Short routes do not introduce a larger final deduction.
assert.equal(careerTrails.length,10);
assert.equal(new Set(careerTrails.map(t=>t.id)).size,careerTrails.length);
for(const trail of careerTrails){
 assert.ok(trail.stages.length>=3);
 assert.ok(careerCorrect(trail,trail.playerName));
 assert.ok(!careerCorrect(trail,'not a player'));
 for(const alias of trail.aliases)assert.ok(careerCorrect(trail,alias));
 for(let i=1;i<trail.stages.length;i++)assert.ok(trail.stages[i].startYear>=trail.stages[i-1].startYear);
 assert.notEqual(pickCareer(trail.id).id,trail.id);
}
assert.equal(careerTrails.find(t=>t.playerName==='Raul Meireles')?.stages[0].club,'Aves');
assert.ok(careerTrails.find(t=>t.playerName==='Didier Drogba')!.stages.filter(s=>s.club==='Chelsea').length===2);
console.log('PASS: career identities, accepted aliases, chronology, return spells and no immediate solo repeat.');
