// Isolated PostgreSQL engine; no network and no production data.
// Install test engine: npm install --prefix node_modules/.cache/game-tests @electric-sql/pglite
import { PGlite } from '../node_modules/.cache/game-tests/node_modules/@electric-sql/pglite/dist/index.js';
import { readFileSync, readdirSync } from 'node:fs';
import { players, pairs, answersFor, normalizeName, searchPlayers, resolveClub } from '../football-analyzer-mobile/game/data.ts';
import assert from 'node:assert/strict';
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key);
-- Minimal fixture for the legacy CSV table, created outside the migration chain.
create table public.matches(id integer primary key, score integer);
insert into public.matches values(1,2);
grant all on public.matches to anon, authenticated;
create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated,anon;
grant execute on function auth.uid() to authenticated,anon;`);
const migrations = new URL('../supabase/migrations/', import.meta.url);
for (const file of readdirSync(migrations).filter((name) => name.endsWith('.sql')).sort()) {
  if(file.startsWith('20261118')) continue; // Exercise legacy rooms before upgrading in place below.
  await db.exec(readFileSync(new URL(file, migrations), 'utf8'));
}
for (const role of ['anon','authenticated']) {
 await db.exec(`set role ${role}`);
 assert.equal((await db.query('select score from public.matches where id=1')).rows[0].score,2);
 for (const sql of ['insert into public.matches values(2,0)', 'update public.matches set score=0 where id=1', 'delete from public.matches where id=1', 'truncate public.matches']) {
   await assert.rejects(db.exec(sql),/permission denied/);
 }
 await db.exec('reset role');
}
assert.equal((await db.query("select relrowsecurity from pg_class where oid='public.matches'::regclass")).rows[0].relrowsecurity,true);
const catalog = await db.query('select id,name,clubs from public.game_players order by id');
assert.equal((await db.query("select public.game_answer_key('Sørloth') as key")).rows[0].key,'sorloth');
assert.ok(answersFor(['Beşiktaş','Feyenoord']).some(p=>p.name==='Orkun Kökçü'));
assert.ok(answersFor(['Fenerbahçe','Juventus']).some(p=>p.id==='wd-Q109428'));
assert.ok(!answersFor(['Galatasaray','Inter']).some(p=>p.name==='Caner Erkin'));
assert.ok(players.find(p=>p.name==='Fernando Muslera').clubs.length===1);
const practiceWords=JSON.parse(readFileSync(new URL('../src/lib/solo-anagrams.json',import.meta.url),'utf8'));
assert.deepEqual((await db.query('select word,player_name,difficulty from public.game_anagrams order by word')).rows,
 practiceWords.map(({word,playerName,difficulty})=>({word,player_name:playerName,difficulty})).sort((a,b)=>a.word<b.word?-1:a.word>b.word?1:0));
assert.deepEqual(catalog.rows, players.map(({id,name,clubs}) => ({id,name,clubs:[...clubs]})).sort((a,b) => a.id.localeCompare(b.id)));
assert.equal(new Set(players.map(p => p.id)).size, players.length);
for (const pair of pairs) assert.ok(answersFor(pair).length > 0);
assert.equal(normalizeName('BEŞİKTAŞ'), normalizeName('besiktas'));
assert.equal(normalizeName('Burak Yılmaz'), normalizeName('burak yilmaz'));
assert.ok(answersFor(['Galatasaray','Fenerbahçe']).some(p=>p.id==='emre'));
assert.ok(searchPlayers('  YILMAZ   burak ').some(p=>p.id==='burak'));
assert.ok(searchPlayers('van-persie').some(p=>p.id==='van-persie'));
assert.equal(searchPlayers('a').length,0);
assert.equal(resolveClub('GS'),'Galatasaray'); assert.equal(resolveClub('man utd'),'Manchester United');
assert.equal(resolveClub('not a club'),undefined);
assert.ok(searchPlayers('CR7').some(p=>p.id==='cristiano'));
assert.ok(answersFor(['Barcelona','Paris Saint-Germain']).some(p=>p.id==='messi'));
assert.ok(answersFor(['Galatasaray','Beşiktaş']).some(p=>p.name==='Sergen Yalçın'));
assert.ok(answersFor(['Galatasaray','Real Madrid']).some(p=>p.name==='Gheorghe Hagi'));
const users=['00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003'];
for(const u of users) await db.query('insert into auth.users values($1)',[u]);
async function as(i) { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[users[i] || '']); await db.exec('set role authenticated'); }
async function rpc(action,code='',value='') { return (await db.query('select public.game_room($1,$2,$3) as data',[action,code,value])).rows[0].data; }
async function dash() { return (await db.query('select public.game_dashboard() as data')).rows[0].data; }
async function start(code) { await db.exec('reset role'); await db.query("update public.game_rooms set starts_at=now()-interval '1 second' where code=$1",[code]); await db.exec('set role authenticated'); }
for(let i=0;i<3;i++) { await as(i); await db.query('select public.game_set_username($1)',['player_'+i]); }
await as(2);
await assert.rejects(db.query("select public.game_set_username('PLAYER_0')"), /alınmış/);
await assert.rejects(db.query('select * from public.game_rooms'), /permission denied/);
await assert.rejects(db.query("update public.game_rooms set winner_id=$1",[users[2]]), /permission denied/);
await as(0); let room=await rpc('create'); const c=room.code;
await rpc('ready',c,'Manchester United');
await as(1); room=await rpc('join',c); assert.equal(room.opponentTeam,null); assert.equal(room.opponentReady,true);
await as(2); await assert.rejects(rpc('join',c), /dolu/); await assert.rejects(rpc('state',c), /dolu/);
await as(1); room=await rpc('ready',c,'Real Madrid'); assert.equal(room.remaining,3); assert.equal(room.opponentTeam,null);
await assert.rejects(rpc('answer',c,'beckham'), /Geri sayım/);
await start(c); room=await rpc('state',c); assert.equal(room.opponentTeam,'Manchester United');
assert.equal((await rpc('answer',c,'cech')).incorrect,true);
await assert.rejects(rpc('answer',c,'beckham'), /bir saniye/);
await as(0); room=await rpc('answer',c,'beckham'); assert.equal(room.won,true);
await as(1); room=await rpc('answer',c,'cristiano'); assert.equal(room.won,false); assert.equal(room.answer,'David Beckham');
for(let n=0;n<3;n++) await rpc('answer',c,'beckham');
let d=await dash(); assert.equal(d.profile.losses,1); assert.equal(d.profile.wins,0); assert.equal(d.history.length,1);
await as(0); d=await dash(); assert.equal(d.profile.wins,1); assert.equal(d.streak,1); assert.equal(d.rivals[0].wins,1);
// Same club and unsupported pair must never award wins.
const allClubs=[...new Set(players.flatMap(p=>p.clubs))];
const uncovered=allClubs.flatMap(a=>allClubs.filter(b=>a!==b&&!answersFor([a,b]).length).map(b=>[a,b]))[0];
assert.ok(uncovered,'Need an uncovered pair to test void behavior');
for(const pair of [['Arsenal','Arsenal'],uncovered]) {
 await as(0); const r=await rpc('create'); await rpc('ready',r.code,pair[0]);
 await as(1); await rpc('join',r.code); await rpc('ready',r.code,pair[1]); await start(r.code);
 assert.equal((await rpc('state',r.code)).status,'void');
}
// Early exit voids the match; surrender after countdown awards opponent once.
await as(0); room=await rpc('create'); await rpc('ready',room.code,'Chelsea');
await as(1); await rpc('join',room.code); await rpc('ready',room.code,'Arsenal');
assert.equal((await rpc('leave',room.code)).status,'void');
await as(0); room=await rpc('create'); await rpc('ready',room.code,'Chelsea');
await as(1); await rpc('join',room.code); await rpc('ready',room.code,'Arsenal'); await start(room.code);
await as(0); assert.equal((await rpc('leave',room.code)).won,false); await rpc('leave',room.code);
d=await dash(); assert.equal(d.profile.wins,1); assert.equal(d.profile.losses,1); assert.equal(d.streak,0); assert.equal(d.history.length,2);
await as(1); d=await dash(); assert.equal(d.profile.wins,1); assert.equal(d.profile.losses,1);
// Expired rooms cannot be joined by a new player.
await as(0); room=await rpc('create'); await db.exec('reset role');
await db.query("update public.game_rooms set created_at=now()-interval '25 hours' where code=$1",[room.code]);
await as(1); await assert.rejects(rpc('join',room.code), /dolu/);
await as(0); assert.equal((await rpc('state',room.code)).status,'void');
// A new Turkish-club answer is accepted by the same authoritative scoring path.
await as(0); room=await rpc('create'); await rpc('ready',room.code,'Galatasaray');
await as(1); await rpc('join',room.code); await rpc('ready',room.code,'Fenerbahçe'); await start(room.code);
room=await rpc('answer',room.code,'emre'); assert.equal(room.won,true); assert.equal(room.answer,'Emre Belözoğlu');
// Profile changes are scoped to the authenticated account; scores stay derived.
await as(0);
const beforeProfile = await dash();
const updateProfile = (name, display='', bio='', avatar='') => db.query('select public.game_update_profile($1,$2,$3,$4) as data',[name,display,bio,avatar]);
await assert.rejects(updateProfile('player_1'), /başka biri/);
await assert.rejects(updateProfile('bad name'), /3–20/);
await assert.rejects(updateProfile('player_0','x'.repeat(41)), /40/);
await assert.rejects(updateProfile('player_0','','x'.repeat(161)), /160/);
await assert.rejects(updateProfile('player_0','','','https://example.com/track'), /Fotoğraf/);
await assert.rejects(updateProfile('player_0','','','data:image/svg+xml;base64,abc'), /Fotoğraf/);
await assert.rejects(updateProfile('player_0','','','data:image/jpeg;base64,'+'A'.repeat(180000)), /Fotoğraf/);
await updateProfile('renamed_player','  Vito  ',' Football fan ','data:image/jpeg;base64,/9j/2Q==');
const ownDetails=(await db.query('select public.game_profile() as data')).rows[0].data;
assert.equal(ownDetails.display_name,'Vito'); assert.equal(ownDetails.bio,'Football fan');
assert.equal(ownDetails.username,'renamed_player'); assert.ok(ownDetails.avatar.startsWith('data:image/jpeg;'));
const afterProfile=await dash(); assert.equal(afterProfile.profile.wins,beforeProfile.profile.wins); assert.equal(afterProfile.profile.losses,beforeProfile.profile.losses); assert.equal(afterProfile.history.length,beforeProfile.history.length);
await as(1); assert.equal((await db.query('select public.game_profile() as data')).rows[0].data.username,'player_1');
await assert.rejects(db.query("update public.game_profiles set avatar=''"),/permission denied/);
await as(0); await updateProfile('renamed_player'); assert.equal((await db.query('select public.game_profile() as data')).rows[0].data.avatar,'');
await db.exec('reset role; set role anon'); await assert.rejects(db.query('select public.game_profile()'),/permission denied/);
await assert.rejects(updateProfile('attacker'),/permission denied/);
await assert.rejects(db.query('select public.game_dashboard()'),/permission denied/);
await as(-1); await assert.rejects(rpc('create'),/giriş/);
await as(0);
await assert.rejects(db.query("select public.game_club_room('create','','')"),/permission denied/);
await assert.rejects(db.query('select * from public.game_anagrams'),/permission denied/);
await assert.rejects(rpc('create_anagram','','invalid'),/zorluk/);
for (const [difficulty, seconds] of [['easy',5],['medium',10],['hard',20]]) {
 await as(0); const a=await rpc('create_anagram','',difficulty); assert.equal(a.gameKind,'anagram');
 await rpc('ready',a.code); assert.equal((await rpc('state',a.code)).puzzle,null);
 await as(2); await assert.rejects(rpc('answer',a.code,'x'),/dolu/);
 await as(1); await rpc('join',a.code); const ready=await rpc('ready',a.code);
 assert.equal(ready.puzzle,null); assert.equal(ready.answer,null); assert.equal(ready.endsAt-ready.startsAt,seconds*1000);
 await assert.rejects(rpc('answer',a.code,'x'),/Geri sayım/);
 await db.exec('reset role');
 const secret=(await db.query('select solution,puzzle from public.game_rooms where code=$1',[a.code])).rows[0];
 const key=(await db.query('select public.game_answer_key($1) as key',[secret.solution])).rows[0].key;
 assert.deepEqual(secret.puzzle.toLowerCase().split('').sort(),key.split('').sort()); assert.notEqual(secret.puzzle,key.toUpperCase());
 await as(0); await start(a.code); const viewA=await rpc('state',a.code);
 await as(1); const viewB=await rpc('state',a.code); assert.equal(viewA.puzzle,viewB.puzzle); assert.equal(viewB.answer,null);
 assert.equal((await rpc('answer',a.code,'not the answer')).incorrect,true);
 await assert.rejects(rpc('answer',a.code,secret.solution),/kısa bir süre/);
 await as(0); const winner=await rpc('answer',a.code,secret.solution.toLowerCase()); assert.equal(winner.won,true);
 await as(1); assert.equal((await rpc('answer',a.code,secret.solution)).won,false);
 await rpc('answer',a.code,secret.solution);
}
await as(0); assert.equal((await dash()).byGame.find(g=>g.kind==='anagram').wins,3);
const timeout=await rpc('create_anagram','','easy'); await rpc('ready',timeout.code);
await as(1); await rpc('join',timeout.code); await rpc('ready',timeout.code);
await db.exec('reset role'); await db.query("update public.game_rooms set starts_at=now()-interval '10 seconds',ends_at=now()-interval '1 second' where code=$1",[timeout.code]);
await as(0); const expired=await rpc('answer',timeout.code,'MESSI'); assert.equal(expired.status,'void'); assert.ok(expired.answer); assert.equal((await dash()).byGame.find(g=>g.kind==='anagram').wins,3);
const again=await rpc('rematch',timeout.code); assert.notEqual(again.code,timeout.code); assert.equal(again.status,'waiting'); assert.equal(again.ready,false);
await as(1); assert.equal((await rpc('rematch',timeout.code)).code,again.code);
assert.equal((await rpc('leave',again.code)).status,'void');
const surrender=await rpc('rematch',again.code); await rpc('ready',surrender.code);
await as(0); await rpc('ready',surrender.code); await start(surrender.code);
assert.equal((await rpc('leave',surrender.code)).won,false);
await as(2); await assert.rejects(rpc('rematch',surrender.code),/dolu/);
await db.exec('reset role');
assert.equal((await db.query("select public.game_answer_key('İBRAHİMOVİĆ') as key")).rows[0].key,'ibrahimovic');
assert.equal((await db.query("select public.game_answer_key('Ribéry') as key")).rows[0].key,'ribery');
assert.equal((await db.query('select count(*)::int as missing from public.game_anagrams a where not exists(select 1 from public.game_players p where p.name=a.player_name)')).rows[0].missing,0);
console.log('PASS: club game, profiles, anagram secrecy, shared puzzle, 5/10/20 second deadlines, answer cooldown, single winner, timeout, aliases, stats and access isolation.');
// Career rounds must hide the solution AND all future stages until their deadline.
await as(0); await assert.rejects(db.query('select * from public.game_careers'),/permission denied/);
const career=await rpc('create_career');assert.equal(career.gameKind,'career');
assert.deepEqual(career.career,[]);await rpc('ready',career.code);
await as(2);await assert.rejects(rpc('state',career.code),/dolu/);
await as(1);await rpc('join',career.code);const cr=await rpc('ready',career.code);
assert.deepEqual(cr.career,[]);assert.equal(cr.answer,null);assert.equal(cr.careerSource,null);
await assert.rejects(rpc('answer',career.code,'Sneijder'),/Geri sayım/);
await db.exec('reset role');
const secretCareer=(await db.query('select career_data from public.game_rooms where code=$1',[career.code])).rows[0].career_data;
assert.equal(cr.endsAt-cr.startsAt,((secretCareer.stages.length-2)*8+20)*1000);
await db.query("update public.game_rooms set starts_at=clock_timestamp()-interval '1 second' where code=$1",[career.code]);
await as(0);const firstCareer=await rpc('state',career.code);assert.equal(firstCareer.career.length,2);assert.equal(firstCareer.answer,null);assert.ok(!('aliases' in firstCareer));assert.ok(!('career_data' in firstCareer));
await as(1);assert.deepEqual((await rpc('state',career.code)).career,firstCareer.career);
await db.exec('reset role');await db.query("update public.game_rooms set starts_at=clock_timestamp()-interval '9 seconds' where code=$1",[career.code]);
await as(0);assert.equal((await rpc('state',career.code)).career.length,3);
await as(1);assert.equal((await rpc('answer',career.code,'not a player')).incorrect,true);
await assert.rejects(rpc('answer',career.code,secretCareer.playerName),/kısa bir süre/);
await as(0);const careerWin=await rpc('answer',career.code,secretCareer.aliases[0]);assert.equal(careerWin.won,true);assert.equal(careerWin.answer,secretCareer.playerName);assert.deepEqual(careerWin.career,secretCareer.stages);assert.equal(careerWin.careerSource,secretCareer.source);
await as(1);assert.equal((await rpc('answer',career.code,secretCareer.playerName)).won,false);
await as(0);assert.equal((await dash()).byGame.find(g=>g.kind==='career').wins,1);
const careerNext=await rpc('rematch',career.code);assert.equal(careerNext.gameKind,'career');assert.equal(careerNext.ready,false);assert.deepEqual(careerNext.career,[]);
await as(1);assert.equal((await rpc('rematch',career.code)).code,careerNext.code);await rpc('ready',careerNext.code);
await as(0);await rpc('ready',careerNext.code);
await db.exec('reset role');await db.query("update public.game_rooms set starts_at=clock_timestamp()-interval '10 minutes',ends_at=clock_timestamp()-interval '1 second' where code=$1",[careerNext.code]);
await as(0);const careerExpired=await rpc('answer',careerNext.code,'x');assert.equal(careerExpired.status,'void');assert.ok(careerExpired.answer);assert.equal(careerExpired.career.length,careerExpired.totalClues);assert.equal((await dash()).byGame.find(g=>g.kind==='career').wins,1);
await db.exec('reset role');
const careerFixture=JSON.parse(readFileSync(new URL('../src/lib/career-trails.json',import.meta.url),'utf8'));
assert.deepEqual((await db.query('select data from public.game_careers order by id')).rows.map(r=>r.data),careerFixture.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0));
console.log('PASS: career shared clues, countdown secrecy, reveal progression, early/late answers, single score, rematch isolation and full route reveal.');
await db.exec(readFileSync(new URL('202611180001_career_match_scoring.sql',migrations),'utf8'));
await db.exec(readFileSync(new URL('202611180002_career_fixed_point_steps.sql',migrations),'utf8'));
await db.exec(readFileSync(new URL('202611180003_career_zero_point_reveal.sql',migrations),'utf8'));
for(let total=3;total<=15;total++) {
 let previous=101;
 for(let revealed=2;revealed<=total;revealed++) {
  const actual=(await db.query('select public.career_points($1,$2) as points',[total,revealed])).rows[0].points;
  const expected=revealed===total?0:Math.max(0,100-20*(revealed-2));
  assert.equal(actual,expected);assert.ok(actual<=previous);previous=actual;
 }
 assert.equal(previous,0);
}
await as(0);
await assert.rejects(db.query("select public.game_room_before_match('state',$1,'')",[career.code]),/permission denied/);
assert.equal((await rpc('state',career.code)).status,'finished'); // Existing games survive the upgrade.
const baseCareerWins=(await dash()).byGame.find(g=>g.kind==='career').wins;
const match=await rpc('create_career_match');assert.equal(match.myScore,0);assert.equal(match.careerMatch,true);
await as(2);await assert.rejects(rpc('state',match.code),/dolu/);
await as(1);await rpc('join',match.code);
let round=0;
async function nextCareerRound(code) {
 await as(0);await rpc('career_ready',code,String(round));
 await as(1);const next=await rpc('career_ready',code,String(round));round++;
 assert.equal(next.round,round);assert.deepEqual(next.career,[]);assert.equal(next.answer,null);
 await assert.rejects(rpc('career_answer',code,JSON.stringify({round,answer:'x'})),/Geri sayım/);
 await db.exec('reset role');const secret=(await db.query('select career_data from public.game_rooms where code=$1',[code])).rows[0].career_data;
 await start(code);return secret;
}
let trail=await nextCareerRound(match.code);
await as(0);assert.equal((await rpc('state',match.code)).roundPoints,100);
await assert.rejects(rpc('career_answer',match.code,JSON.stringify({round:0,answer:trail.playerName})),/önceki tura/);
assert.equal((await rpc('career_answer',match.code,JSON.stringify({round,answer:'wrong'}))).incorrect,true);
await assert.rejects(rpc('career_answer',match.code,JSON.stringify({round,answer:trail.playerName})),/kısa bir süre/);
await db.exec('reset role');await db.query('update public.game_rooms set host_attempt=null where code=$1',[match.code]);
await as(0);let scored=await rpc('career_answer',match.code,JSON.stringify({round,answer:trail.playerName,points:99999}));
assert.equal(scored.myScore,100);assert.equal(scored.status,'playing');assert.equal(scored.roundDone,true);assert.deepEqual(scored.career,trail.stages);
assert.equal((await dash()).byGame.find(g=>g.kind==='career').wins,baseCareerWins);
await as(1);const duplicate=await rpc('career_answer',match.code,JSON.stringify({round,answer:trail.playerName}));assert.equal(duplicate.myScore,0);assert.equal(duplicate.opponentScore,100);
const previousId=trail.id;trail=await nextCareerRound(match.code);assert.notEqual(trail.id,previousId);
await db.exec('reset role');await db.query("update public.game_rooms set starts_at=clock_timestamp()-make_interval(secs=>$2), ends_at=clock_timestamp()+interval '20 seconds' where code=$1",[match.code,(trail.stages.length-2)*8+1]);
const guestPoints=0;
await as(1);assert.equal((await rpc('state',match.code)).roundPoints,guestPoints);
scored=await rpc('career_answer',match.code,JSON.stringify({round,answer:trail.aliases[0]}));assert.equal(scored.myScore,guestPoints);assert.equal(scored.opponentScore,100);
assert.equal(scored.roundDone,true);assert.equal(scored.roundWon,true);assert.equal(scored.status,'playing');assert.equal(scored.lastRoundPoints,0);
assert.equal((await rpc('career_answer',match.code,JSON.stringify({round,answer:trail.playerName}))).myScore,0);
trail=await nextCareerRound(match.code);
await db.exec('reset role');await db.query("update public.game_rooms set ends_at=clock_timestamp()-interval '1 second' where code=$1",[match.code]);
await as(0);const timed=await rpc('career_answer',match.code,JSON.stringify({round,answer:trail.playerName}));assert.equal(timed.roundDone,true);assert.equal(timed.status,'playing');assert.equal(timed.lastRoundPoints,0);assert.equal(timed.myScore,100);
for(let score=200;score<=300;score+=100){trail=await nextCareerRound(match.code);await as(0);scored=await rpc('career_answer',match.code,JSON.stringify({round,answer:trail.playerName}));assert.equal(scored.myScore,score);}
assert.equal(scored.status,'finished');assert.equal(scored.won,true);assert.equal(scored.opponentScore,guestPoints);
await rpc('career_answer',match.code,JSON.stringify({round,answer:trail.playerName}));
let dashboard=await dash();assert.equal(dashboard.byGame.find(g=>g.kind==='career').wins,baseCareerWins+1);
assert.equal(dashboard.rivalsByGame.find(g=>g.kind==='career'&&g.opponent_id===users[1]).wins,baseCareerWins+1);
assert.ok(dashboard.rivalsByGame.some(g=>g.kind==='anagram'));assert.ok(dashboard.rivalsByGame.some(g=>g.kind==='clubs'));
const newMatch=await rpc('rematch',match.code);assert.equal(newMatch.myScore,0);assert.equal(newMatch.opponentScore,0);assert.equal(newMatch.round,0);
await as(1);assert.equal((await rpc('rematch',match.code)).code,newMatch.code);
round=0;trail=await nextCareerRound(newMatch.code);
await as(0);await rpc('career_answer',newMatch.code,JSON.stringify({round,answer:trail.playerName}));
assert.equal((await rpc('leave',newMatch.code)).won,false); // Leaving between rounds is still a match loss.
await as(1);assert.equal((await rpc('state',newMatch.code)).won,true);
await as(0);const canceled=await rpc('create_career_match');assert.equal((await rpc('leave',canceled.code)).status,'void');
await db.exec('reset role');
console.log('PASS: 100–0 scoring, full reveal zeroes short routes, zero-point answer completes round without awarding score, 300-point match, timeout continuation, single match result and isolated friend records.');
await db.close();
