import assert from 'node:assert/strict';
import {answerKey,emptyRecord,isCorrect,makeRound,recordResult,scramble,soloPairs,validRecord} from '../src/lib/solo-game';
import words from '../src/lib/solo-anagrams.json';
import {answersFor} from '../football-analyzer-mobile/game/data';

for(const word of words) for(let i=0;i<15;i++) {
 const puzzle=scramble(word.word);
 assert.equal(puzzle.split('').sort().join(''),answerKey(word.word).toUpperCase().split('').sort().join(''));
 assert.notEqual(puzzle,answerKey(word.word).toUpperCase());
}
assert.equal(answerKey('ŞÜKÜR'),answerKey('sukur'));
assert.equal(answerKey('ÖZİL'),answerKey('ozil'));
for(const pair of soloPairs) assert.ok(answersFor(pair).length>0);
for(const difficulty of ['easy','medium','hard'] as const) {
 const round=makeRound('anagram',difficulty);
 assert.ok(isCorrect(round,round.word!));
 assert.ok(!isCorrect(round,'not an answer'));
 assert.notEqual(makeRound('anagram',difficulty,round.key).key,round.key);
}
const clubs=makeRound('clubs','easy');
assert.ok(isCorrect(clubs,answersFor(clubs.pair!)[0].name));
assert.ok(!isCorrect(clubs,'not an answer'));
assert.notEqual(makeRound('clubs','easy',clubs.key).key,clubs.key);
const first=recordResult(emptyRecord,true,1200);
const second=recordResult(first,true,1500);
const missed=recordResult(second,false,9999);
assert.deepEqual(missed,{played:3,correct:2,streak:0,bestStreak:2,bestMs:1200});
assert.equal(recordResult(missed,true,800).bestMs,800);
assert.deepEqual(validRecord({played:-1}),emptyRecord);
assert.deepEqual(validRecord(JSON.parse(JSON.stringify(missed))),missed);
console.log(`PASS: ${words.length} anagrams preserve letters, ${soloPairs.length} answerable pairs, normalization, no immediate repeats and isolated practice records.`);
