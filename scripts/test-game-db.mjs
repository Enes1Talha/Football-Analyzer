// Isolated PostgreSQL engine; no network and no production data.
// Install test engine: npm install --prefix node_modules/.cache/game-tests @electric-sql/pglite
import { PGlite } from '../node_modules/.cache/game-tests/node_modules/@electric-sql/pglite/dist/index.js';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const db = new PGlite();
await db.exec(`create role anon; create role authenticated; create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth to authenticated,anon;
grant execute on function auth.uid() to authenticated,anon;`);
await db.exec(readFileSync(new URL('../supabase/migrations/202611150001_game_accounts.sql', import.meta.url),'utf8'));
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
for(const pair of [['Arsenal','Arsenal'],['Arsenal','Real Madrid']]) {
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
await db.exec('reset role; set role anon'); await assert.rejects(db.query('select public.game_dashboard()'),/permission denied/);
await as(-1); await assert.rejects(rpc('create'),/giriş/);
console.log('PASS: hidden choices, countdown, auth, membership, RLS, answer validation, cooldown, single winner, idempotency, void rounds, surrender, expiry, stats and streak.');
await db.close();
