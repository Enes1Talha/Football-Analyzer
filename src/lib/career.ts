import data from './career-trails.json';
import {answerKey} from './solo-game';
export interface CareerStage {club:string;startYear:number;endYear:number;loan:boolean}
export interface CareerTrail {id:string;playerName:string;aliases:string[];stages:CareerStage[];source:string;note:string}
export const careerTrails:CareerTrail[]=data;
export function careerPoints(total:number,revealed:number) {
 return Math.max(20,Math.min(100,100-Math.round(80*Math.max(0,revealed-2)/Math.max(1,total-2))));
}
export function pickCareer(previous='') {
 const pool=careerTrails.filter(t=>t.id!==previous);
 return pool[Math.floor(Math.random()*pool.length)];
}
export function careerCorrect(trail:CareerTrail,value:string){return [trail.playerName,...trail.aliases].some(name=>answerKey(name)===answerKey(value));}
