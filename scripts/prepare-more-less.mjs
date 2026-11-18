import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const batch = JSON.parse(readFileSync(new URL('scripts/football_more_less_batch1.json', root), 'utf8'));
const players = new Map(batch.players.map(p => [p.id, p]));
assert.equal(players.size, batch.players.length, 'Duplicate player IDs');
const ids = new Set(), duplicates = new Set(), pairs = new Map(), usage = new Map();
const answers = {}, categories = {}, metricFamilies = {}, publishers = {};
for (const q of batch.questions) {
  assert(!ids.has(q.id), `Duplicate question ${q.id}`); ids.add(q.id);
  assert(players.has(q.playerAId) && players.has(q.playerBId), `Missing player ${q.id}`);
  assert.notEqual(q.playerAId, q.playerBId);
  assert(Number.isFinite(q.valueA) && q.valueA >= 0 && Number.isFinite(q.valueB) && q.valueB >= 0);
  assert.equal(q.correctAnswer, q.valueA > q.valueB ? 'A' : q.valueA < q.valueB ? 'B' : 'equal', q.id);
  assert(['easy', 'medium', 'hard'].includes(q.difficulty));
  const pair = [q.playerAId, q.playerBId].sort().join('|');
  const { competition, season, edition, startDate, endDate, stage, team } = q.scope;
  const key = JSON.stringify([pair, q.metric, competition, season, edition, startDate, endDate, stage, team]);
  assert(!duplicates.has(key), `Duplicate comparison ${q.id}`); duplicates.add(key);
  pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
  for (const id of [q.playerAId, q.playerBId]) usage.set(id, (usage.get(id) ?? 0) + 1);
  const supported = new Set();
  const questionPublishers = new Set();
  for (const evidence of q.evidence) {
    const host = new URL(evidence.url).hostname.replace(/^www\./, '');
    assert(['uefa.com', 'tff.org', 'fifa.com'].includes(host), `Unexpected source ${q.id}`);
    questionPublishers.add(host);
    for (const field of evidence.supports) supported.add(field);
  }
  assert(supported.has('valueA') && supported.has('valueB'), `Missing evidence coverage ${q.id}`);
  for (const host of questionPublishers) publishers[host] = (publishers[host] ?? 0) + 1;
  answers[q.correctAnswer] = (answers[q.correctAnswer] ?? 0) + 1;
  categories[q.category] = (categories[q.category] ?? 0) + 1;
  const family = q.metric.startsWith('goals') ? 'goals' : q.metric.startsWith('appearances') ? 'appearances' : q.metric;
  metricFamilies[family] = (metricFamilies[family] ?? 0) + 1;
}
assert(Math.max(...pairs.values()) <= 2, 'Pair used more than twice');
assert(Math.max(...usage.values()) <= 8, 'Player used more than eight times');
assert(Math.max(...Object.values(categories)) / batch.questions.length <= .3, 'Category exceeds 30%');

// Independently read official player tables on 2026-11-18. Explicit IDs AND
// values prevent future edits/additions from inheriting approval accidentally.
const verified = [
  ['david-villa','semih-senturk',4,3,'2008','goals_tournament'],
  ['arda-turan','semih-senturk',2,3,'2008','goals_tournament'],
  ['lukas-podolski','semih-senturk',3,3,'2008','goals_tournament'],
  ['roman-pavlyuchenko','arda-turan',3,2,'2008','goals_tournament'],
  ['gareth-bale','antoine-griezmann',3,6,'2016','goals_tournament'],
  ['antoine-griezmann','cristiano-ronaldo',6,3,'2016','goals_tournament'],
  ['cristiano-ronaldo','patrik-schick',5,5,'2020','goals_tournament'],
  ['karim-benzema','patrik-schick',4,5,'2020','goals_tournament'],
  ['cristiano-ronaldo','emil-forsberg',5,4,'2020','goals_tournament'],
  ['ugurcan-cakir','kasper-schmeichel',18,18,'2020','saves'],
  ['ugurcan-cakir','yann-sommer',18,21,'2020','saves'],
  ['mike-maignan','mert-gunok',16,15,'2024','saves'],
  ['jordan-pickford','giorgi-mamardashvili',17,29,'2024','saves'],
  ['kylian-mbappe','harry-kane',15,14,'2025/26','goals_season'],
  ['erling-haaland','anthony-gordon',8,10,'2025/26','goals_season'],
  ['victor-osimhen','harry-kane',25,23,'2025/26','shots_on_target'],
  ['lucas-torreira','aurelien-tchouameni',36,39,'2025/26','tackles'],
  ['thibaut-courtois','ugurcan-cakir',56,48,'2025/26','saves'],
  ['paul-onuachu','eldor-shomurodov',22,22,'2025-26','goals_league'],
  ['arif-erdem','ilhan-mansiz',21,21,'2001-02','goals_league'],
];
const approved = verified.map((expected, i) => {
  const q = batch.questions.find(q => q.id === `more-less-001-${String(81+i).padStart(3,'0')}`);
  assert(q, 'Missing verified question');
  assert.deepEqual([q.playerAId,q.playerBId,q.valueA,q.valueB,q.scope.edition ?? q.scope.season,q.metric], expected);
  const sourceUrl = i < 13
    ? `https://www.uefa.com/uefaeuro/history/seasons/${expected[4]}/statistics/`
    : i < 18 ? 'https://www.uefa.com/uefachampionsleague/history/seasons/2026/statistics/'
      : 'https://www.tff.org/default.aspx?pageID=545';
  assert(q.evidence.some(e => e.url.replace('http:', 'https:') === sourceUrl));
  return { ...q, review: { checkedAt: '2026-11-18', status: 'values-verified', sourceUrl,
    note: 'Official player statistics table checked; fixed season/tournament. Saves follows UEFA Saves definition; shoot-out treatment not independently established.' } };
});
const approvedIds = new Set(approved.map(q => q.id));
const pending = batch.questions.filter(q => !approvedIds.has(q.id)).map(q => ({
  id: q.id, reason: 'Career values and common source cutoff require individual review. Retirement is not evidence of a cutoff.'
}));
const report = {
  reviewedAt: '2026-11-18', questionCount: batch.questions.length, playerCount: players.size,
  referencedPlayers: usage.size, answers, categories, metricFamilies, questionsByPublisher: publishers,
  maxPairUsage: Math.max(...pairs.values()), maxPlayerUsage: Math.max(...usage.values()),
  approvedCount: approved.length, pendingCount: pending.length, pending,
  warnings: [
    'Structural checks do not establish factual accuracy. Only the explicit approved subset has independently checked values.',
    'Goals and appearances each exceed the original 30% metric-family limit. Category diversity is not metric diversity.',
    'Career source dates can exist: Spain UEFA article explicitly says Last updated 22:00 CET on 30/05/2026. Review other sources separately.',
    'This is preparation data, not a released game or a database import. Reserve candidates and needsReview are not admitted.'
  ]
};
const approvedPlayerIds = new Set(approved.flatMap(q => [q.playerAId,q.playerBId]));
for (const [file, value] of [
  ['scripts/more-less-review.json',report],
  ['scripts/more-less-approved.json',{ reviewedAt: report.reviewedAt, players: batch.players.filter(p => approvedPlayerIds.has(p.id)), questions: approved }]
]) writeFileSync(new URL(file,root), JSON.stringify(value,null,2)+'\n');
console.log(JSON.stringify({ ...report, pending: undefined },null,2));
