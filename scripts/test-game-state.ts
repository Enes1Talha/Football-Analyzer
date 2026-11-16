import assert from "node:assert/strict";
import { mergeRoomState, type RoomState } from "../src/lib/game-room-state";
const waiting: RoomState = { code:"1234ABCD", status:"waiting",host:true,opponent:null,team:null,opponentTeam:null,opponentReady:false,remaining:null,won:null,answer:null,reason:null };
const locked = {...waiting,team:"Arsenal",opponent:"rival",opponentReady:true};
assert.deepEqual(mergeRoomState(locked,waiting),locked);
const playing: RoomState = {...locked,status:"playing",remaining:1};
assert.deepEqual(mergeRoomState(playing,waiting),playing);
assert.equal(mergeRoomState(playing,{...playing,remaining:3}).remaining,1);
const finished: RoomState = {...playing,status:"finished",won:true,remaining:0,answer:"Petr Čech"};
assert.deepEqual(mergeRoomState(finished,playing),finished);
// A pre-start cancellation must win even if its countdown is older.
const cancelled: RoomState = {...playing,status:"void",remaining:2,reason:"Cancelled"};
assert.deepEqual(mergeRoomState(playing,cancelled),cancelled);
assert.deepEqual(mergeRoomState(waiting,{...locked,code:"OTHER123"}),waiting);
console.log("PASS: stale waiting states, countdown order, locked choices, final results, cancellation and room isolation.");
