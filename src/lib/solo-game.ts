import { players, normalizeName } from '../../football-analyzer-mobile/game/data';
import words from './solo-anagrams.json';

export type SoloKind = 'clubs' | 'anagram';
export type Difficulty = 'easy' | 'medium' | 'hard';
export const durations = {easy:5, medium:10, hard:20};
export const answerKey = (value:string) => normalizeName(value).replace(/[^a-z0-9]/g,'');
export function scramble(value:string) {
 const original=answerKey(value).toUpperCase();
 const letters=original.split('');
 for(let i=letters.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [letters[i],letters[j]]=[letters[j],letters[i]]; }
 if(letters.join('')===original) {
  const different=letters.findIndex(letter=>letter!==letters[0]);
  if(different>0) [letters[0],letters[different]]=[letters[different],letters[0]];
 }
 return letters.join('');
}
const pairMap=new Map<string,[string,string]>();
for(const player of players) for(let i=0;i<player.clubs.length;i++) for(let j=i+1;j<player.clubs.length;j++) {
 const pair=[player.clubs[i],player.clubs[j]].sort() as [string,string];
 pairMap.set(pair.join('|'),pair);
}
export const soloPairs=Array.from(pairMap.values());
export interface SoloRound {key:string;kind:SoloKind;difficulty:Difficulty;pair?:[string,string];word?:string;playerName?:string;puzzle?:string}
export function makeRound(kind:SoloKind,difficulty:Difficulty,lastKey=''):SoloRound {
 if(kind==='clubs') {
  const available=soloPairs.filter(pair=>pair.join('|')!==lastKey);
  const pair=available[Math.floor(Math.random()*available.length)];
  return {key:pair.join('|'),kind,difficulty,pair};
 }
 const available=words.filter(word=>word.difficulty===difficulty&&word.word!==lastKey);
 const word=available[Math.floor(Math.random()*available.length)];
 return {key:word.word,kind,difficulty,word:word.word,playerName:word.playerName,puzzle:scramble(word.word)};
}
export function isCorrect(round:SoloRound,answer:string) {
 if(round.kind==='anagram') return answerKey(answer)===answerKey(round.word!);
 return players.some(p=>round.pair!.every(club=>p.clubs.includes(club))&&[p.name,...(p.aliases||[])].some(name=>answerKey(name)===answerKey(answer)));
}
export interface SoloRecord {played:number;correct:number;streak:number;bestStreak:number;bestMs:number|null}
export const emptyRecord:SoloRecord={played:0,correct:0,streak:0,bestStreak:0,bestMs:null};
export function validRecord(value:unknown):SoloRecord {
 const record=value as SoloRecord;
 if(!record || !['played','correct','streak','bestStreak'].every(k=>Number.isSafeInteger(record[k as keyof SoloRecord])&&Number(record[k as keyof SoloRecord])>=0) || !(record.bestMs===null || Number.isFinite(record.bestMs)&&Number(record.bestMs)>=0)) return {...emptyRecord};
 return record;
}
export function recordResult(record:SoloRecord,won:boolean,elapsed:number):SoloRecord {
 const streak=won?record.streak+1:0;
 return {played:record.played+1,correct:record.correct+Number(won),streak,bestStreak:Math.max(record.bestStreak,streak),bestMs:won?Math.min(record.bestMs??Infinity,elapsed):record.bestMs};
}
