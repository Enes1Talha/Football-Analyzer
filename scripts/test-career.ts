import assert from 'node:assert/strict';
import {careerTrails,pickCareer,careerCorrect,careerPoints} from '../src/lib/career';
import {searchPlayers,players} from '../football-analyzer-mobile/game/data';
assert.deepEqual([2,3,4,5,6,7,8,9].map(n=>careerPoints(9,n)),[100,80,60,40,20,0,0,0]);
assert.deepEqual([2,3,4].map(n=>careerPoints(4,n)),[100,80,0]);
assert.deepEqual([2,3].map(n=>careerPoints(3,n)),[100,0]);
assert.equal(careerTrails.length,10);
const emre=careerTrails.find(t=>t.id==='emre')!;
for(const answer of ['Emre','EMRE',' emre '])assert.equal(careerCorrect(emre,answer),false);
for(const answer of ['Emre Belözoğlu','emre belozoglu','Belözoğlu','BELOZOGLU'])assert.equal(careerCorrect(emre,answer),true);
assert.equal(new Set(careerTrails.map(t=>t.id)).size,careerTrails.length);
for(const trail of careerTrails){
 assert.ok(players.some(p=>p.id===trail.id));
 assert.ok(searchPlayers(trail.playerName).some(p=>p.id===trail.id),'Career player must be selectable: '+trail.playerName);
 assert.ok(trail.stages.length>=3);
 assert.ok(careerCorrect(trail,trail.playerName));
 assert.ok(!careerCorrect(trail,'not a player'));
 for(const alias of trail.aliases)assert.ok(careerCorrect(trail,alias));
 for(let i=1;i<trail.stages.length;i++)assert.ok(trail.stages[i].startYear>=trail.stages[i-1].startYear);
 assert.notEqual(pickCareer(trail.id).id,trail.id);
}
assert.ok(searchPlayers('Emre').some(p=>p.id==='emre'));
assert.ok(searchPlayers('Emre').some(p=>p.id!=='emre'),'Ambiguous names must show other players too.');
assert.equal(careerTrails.find(t=>t.playerName==='Raul Meireles')?.stages[0].club,'Aves');
assert.ok(careerTrails.find(t=>t.playerName==='Didier Drogba')!.stages.filter(s=>s.club==='Chelsea').length===2);
console.log('PASS: career identities, accepted aliases, chronology, return spells and no immediate solo repeat.');
