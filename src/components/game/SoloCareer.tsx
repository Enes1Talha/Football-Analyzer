"use client";
import {useEffect,useRef,useState} from 'react';
import {careerCorrect,careerPoints,pickCareer,type CareerTrail} from '@/lib/career';
import CareerRoute from './CareerRoute';
const primary='rounded-lg bg-neon-green px-5 py-3 font-bold text-black disabled:opacity-40';
const secondary='rounded-lg border border-pitch-border px-4 py-3 text-sm text-zinc-300';
const initial={played:0,correct:0,streak:0,bestStreak:0,bestClues:0,points:0};
export default function SoloCareer({onBack,onActive}:{onBack:()=>void;onActive:(active:boolean)=>void}) {
 const [trail,setTrail]=useState<CareerTrail|null>(null);
 const [phase,setPhase]=useState<'setup'|'countdown'|'playing'|'result'>('setup');
 const [revealed,setRevealed]=useState(2),[countdown,setCountdown]=useState(3);
 const [answer,setAnswer]=useState(''),[feedback,setFeedback]=useState(''),[won,setWon]=useState(false);
 const [stats,setStats]=useState(initial),[warning,setWarning]=useState(''),[confirm,setConfirm]=useState(false);
 const finished=useRef(true),readyAt=useRef(0),field=useRef<HTMLInputElement>(null);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('football-solo-career-v1')||'null');const value=saved?{...initial,...saved}:null;if(value&&Object.keys(initial).every(key=>Number.isSafeInteger(value[key])&&value[key]>=0))setStats(value);}catch{setWarning('Rekorlar bu tarayıcıda kaydedilemiyor.');}},[]);
 useEffect(()=>{if(phase!=='countdown')return;const tick=()=>{const left=Math.ceil((readyAt.current-performance.now())/1000);setCountdown(Math.max(0,left));if(left<=0)setPhase('playing');};const timer=setInterval(tick,50);tick();return()=>clearInterval(timer);},[phase]);
 useEffect(()=>{if(phase==='playing')field.current?.focus();},[phase]);
 function begin(){setTrail(pickCareer(trail?.id));setAnswer('');setFeedback('');setRevealed(2);setConfirm(false);setWon(false);finished.current=false;readyAt.current=performance.now()+3000;setCountdown(3);setPhase('countdown');onActive(true);}
 function finish(success:boolean){
  if(finished.current)return;finished.current=true;
  const streak=success?stats.streak+1:0;
  const next={played:stats.played+1,correct:stats.correct+Number(success),streak,bestStreak:Math.max(stats.bestStreak,streak),bestClues:success?Math.min(stats.bestClues||Infinity,revealed):stats.bestClues,points:stats.points+(success&&trail?careerPoints(trail.stages.length,revealed):0)};
  setStats(next);setWon(success);setFeedback('');setConfirm(false);setPhase('result');
  try{localStorage.setItem('football-solo-career-v1',JSON.stringify(next));}catch{setWarning('Rekor kaydedilemedi; bu oturumda tutuluyor.');}
 }
 function back(){if(!finished.current)finish(false);onActive(false);onBack();}
 return <section className="card-glow p-5 sm:p-6 space-y-5">
  <div><h2 className="text-2xl font-bold">Kariyer Rotası</h2><p className="mt-2 text-sm text-zinc-400">Kulüpleri takip et. Futbolcuyu bul.</p></div>
  <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-400">{[['Seri',stats.streak],['En iyi seri',stats.bestStreak],['En az ipucu',stats.bestClues||'—']].map(([label,value])=><div key={label} className="bg-pitch-dark rounded-lg p-3"><strong className="block text-xl text-neon-green">{value}</strong>{label}</div>)}</div>
  {phase==='setup'&&<><p className="text-sm text-zinc-400">İlk iki kulüp açılır. Bulamazsan sıradaki kulübü açabilirsin. Süre sınırı yok; az ipucuyla bilmek daha iyi. Son kulüp de açılır ama oyuncunun adı gizli kalır.</p><button onClick={begin} className={`${primary} w-full`}>Rotayı başlat</button></>}
  {phase==='countdown'&&<div role="status" className="py-8 text-center text-6xl font-black text-neon-green">{countdown||'…'}</div>}
  {trail&&(phase==='playing'||phase==='result')&&<>
   <p className="text-xs text-zinc-400">{phase==='result'?`${revealed} ipucuyla ${won?'bildin':'pas geçtin'}`:`${revealed} / ${trail.stages.length} kulüp açık`}</p>
   <CareerRoute stages={phase==='result'?trail.stages:trail.stages.slice(0,revealed)} total={trail.stages.length}/>
   {phase==='playing'?<>
    <p className="font-bold text-neon-green">Şimdi bilirsen +{careerPoints(trail.stages.length,revealed)} puan</p>
    <form className="space-y-3" onSubmit={e=>{e.preventDefault();if(finished.current)return;if(careerCorrect(trail,answer))finish(true);else setFeedback('Bu oyuncu değil. Tekrar dene veya bir ipucu aç.');}}>
     <label htmlFor="career-solo-answer" className="block text-sm">Bu futbolcu kim?</label><input ref={field} id="career-solo-answer" autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={80} value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback('');}} className="w-full rounded-lg border border-pitch-border bg-pitch-dark p-3 focus:ring-1 focus:ring-neon-green focus:outline-none"/>
     <button disabled={!answer.trim()} className={primary}>Cevapla</button>
    </form>
    <div className="flex flex-wrap gap-3"><button disabled={revealed>=trail.stages.length} className={`${secondary} disabled:opacity-40`} onClick={()=>setRevealed(n=>Math.min(n+1,trail.stages.length))}>{revealed>=trail.stages.length?'Tüm kulüpler açık':`Sonraki kulübü aç · ${careerPoints(trail.stages.length,revealed+1)} puana düşer`}</button><button className={secondary} onClick={()=>finish(false)}>Pas geç · Cevabı gör</button></div>
   </>:<div className="space-y-3"><p className="text-neon-cyan">{won?`Doğru cevap! +${careerPoints(trail.stages.length,revealed)} puan`:'Pas · 0 puan'}</p><h3 className="text-2xl font-bold">{trail.playerName}</h3><p className="text-xs text-zinc-500">{trail.note} <a href={trail.source} target="_blank" rel="noreferrer" className="underline">Kariyer kaynağı</a></p><button onClick={begin} className={`${primary} w-full`}>Sonraki oyuncu</button></div>}
  </>}
  {feedback&&<p role="status" className="text-sm text-neon-cyan">{feedback}</p>}
  {confirm?<div className="space-y-3"><p className="text-sm text-zinc-400">Turu bırakmak serini sıfırlar.</p><button onClick={back} className={secondary}>Turu bırak</button><button onClick={()=>setConfirm(false)} className="ml-4 text-sm">Devam et</button></div>:<button onClick={()=>finished.current?back():setConfirm(true)} className="text-sm text-zinc-400">Oyun seçimine dön</button>}
  <p className="text-xs text-zinc-500">{stats.points} antrenman puanı · {stats.correct} doğru / {stats.played} tur · Rekorlar bu tarayıcıda saklanır. Arkadaş maçlarının puanını etkilemez.</p>
  {warning&&<p role="alert" className="text-xs text-neon-yellow">{warning}</p>}
 </section>;
}
