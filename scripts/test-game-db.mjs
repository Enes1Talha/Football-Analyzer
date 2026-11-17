// Isolated PostgreSQL engine; no network and no production data.
// Install test engine: npm install --prefix node_modules/.cache/game-tests @electric-sql/pglite
import { PGlite } from '../node_modules/.cache/game-tests/node_modules/@electric-sql/pglite/dist/index.js';
import { readFileSync, readdirSync } from 'node:fs';
import { players, pairs, answersFor, normalizeName, searchPlayers, resolveClub } from '../football-analyzer-mobile/game/data.ts';
import assert from 'node:assert/strict';
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated,anon;
grant execute on function auth.uid() to authenticated,anon;`);
const migrations = new URL('../supabase/migrations/', import.meta.url);
for (const file of readdirSync(migrations).filter((name) => name.endsWith('.sql')).sort()) {
  await db.exec(readFileSync(new URL(file, migrations), 'utf8'));
}
const catalog = await db.query('select id,name,clubs from public.game_players order by id');
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
console.log('PASS: hidden choices, countdown, auth, membership, RLS, answer validation, cooldown, single winner, idempotency, void rounds, surrender, expiry, stats, streak, profile ownership, unique names, avatar constraints and preserved scores.');
await db.close();
