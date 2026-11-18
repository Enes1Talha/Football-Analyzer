"use client";
import {useEffect,useRef,useState} from 'react';
import {roomAction,type RoomState} from '@/lib/game';
import CareerRoute from './CareerRoute';
const primary='rounded-lg bg-neon-green px-5 py-3 font-bold text-black disabled:opacity-40';
export default function CareerDuel({initial,onExit,onNext}:{initial:RoomState;onExit:()=>void;onNext:(room:RoomState)=>void}) {
 const [state,setState]=useState(initial),[answer,setAnswer]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[leave,setLeave]=useState(false);
 const [now,setNow]=useState(initial.serverMs||Date.now());
 const anchor=useRef({server:initial.serverMs||Date.now(),local:performance.now()}),latest=useRef(initial.serverMs||0);
 const field=useRef<HTMLInputElement>(null);
 const finished=state.status==='finished'||state.status==='void';
 const waiting=state.status==='waiting'||!!state.roundDone;
 const open=!finished&&!waiting&&!!state.career?.length;
 const seconds=Math.max(0,Math.ceil(((state.endsAt||now)-now)/1000));
 function accept(next:RoomState){
  if((next.serverMs||0)<latest.current)return;
  latest.current=next.serverMs||0;anchor.current={server:next.serverMs||Date.now(),local:performance.now()};
  setState(old=>old.status==='finished'||old.status==='void'?old:next);setNow(anchor.current.server);
 }
 useEffect(()=>{if(finished)return;let active=true;let timer:ReturnType<typeof setTimeout>;
  async function poll(){try{const next=await roomAction('state',initial.code);if(active)accept(next);}catch(e){if(active)setError((e as Error).message);}if(active)timer=setTimeout(poll,250);}
  void poll();const clock=setInterval(()=>setNow(anchor.current.server+performance.now()-anchor.current.local),100);
  return()=>{active=false;clearTimeout(timer);clearInterval(clock);};
 },[initial.code,finished]);
 useEffect(()=>{setAnswer('');setError('');},[state.round]);
 useEffect(()=>{if(open)field.current?.focus();},[open]);
 async function act(action:string,value=''){
  setBusy(true);setError('');try{const next=await roomAction(action,state.code,value);if(action==='rematch'){onNext(next);return;}accept(next);if(next.incorrect)setError('Bu oyuncu değil. Tekrar dene.');}
  catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 return <section className="card-glow p-5 sm:p-8 space-y-5">
  <div className="flex justify-between gap-4"><h2 className="text-xl font-bold">Kariyer Rotası</h2><button className="text-sm text-zinc-400" onClick={()=>finished?onExit():setLeave(true)}>Odadan çık</button></div>
  <div className="rounded-xl border border-neon-cyan/30 p-4 text-center" aria-live="polite"><p className="text-xs text-zinc-400">Hedef 300 · Tur {state.round||1}</p><p className="mt-2 text-2xl font-bold"><span className="text-neon-green">Sen {state.myScore||0}</span> — <span className="text-neon-cyan">{state.opponentScore||0} {state.opponent?`@${state.opponent}`:'Rakip'}</span></p></div>
  {!state.opponent&&!finished&&<div className="text-center space-y-2"><p className="text-sm text-zinc-400">Arkadaşına oda kodunu gönder</p><p className="font-mono text-3xl text-neon-cyan tracking-widest">{state.code}</p><button onClick={async()=>{try{await navigator.clipboard.writeText(state.code);}catch{setError('Kodu ekrandan kopyalayabilirsin.');}}}>Kodu kopyala</button></div>}
  {state.status==='waiting'&&<p className="text-sm text-zinc-400">İlk iki kulüple bilirsen 100 puan. Her 8 saniyede yeni kulüp açılır ve puan azalır; tüm kulüpler açıkken 20 puan. İlk doğru cevap tur puanını alır. İlk 300 puana ulaşan maçı kazanır.</p>}
  {!finished&&!waiting&&!open&&<div role="status" className="text-center py-8"><p>Yeni rota açılıyor</p><p className="text-6xl text-neon-green font-black">{Math.max(0,Math.ceil(((state.startsAt||now)-now)/1000))||'…'}</p></div>}
  {open&&<>
   <div className="flex justify-between items-center"><p className="text-neon-green font-bold">Şimdi bilirsen +{state.roundPoints} puan</p><span role="timer" className="font-mono text-neon-cyan">{seconds} sn</span></div>
   <CareerRoute stages={state.career||[]} total={state.totalClues||0}/>
   <p className="text-xs text-zinc-400">{state.nextClueAt?`Sonraki kulüp ${Math.max(0,Math.ceil((state.nextClueAt-now)/1000))} saniye sonra açılır ve tur puanı düşer.`:'Tüm kulüpler açık · En az 20 puan.'}</p>
   <form className="flex flex-col sm:flex-row gap-3" onSubmit={e=>{e.preventDefault();void act('career_answer',JSON.stringify({round:state.round,answer}));}}><label htmlFor="career-duel-answer" className="sr-only">Cevabın</label><input ref={field} id="career-duel-answer" value={answer} maxLength={80} autoComplete="off" autoCorrect="off" spellCheck={false} onChange={e=>setAnswer(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-pitch-border bg-pitch-dark p-3" placeholder="Futbolcunun adını yaz" disabled={seconds===0}/><button className={primary} disabled={busy||!answer.trim()||seconds===0}>Cevapla</button></form>
  </>}
  {(state.roundDone||finished)&&<div className="space-y-4" aria-live="polite">
   <h3 className="text-2xl font-bold text-neon-green">{finished?(state.status==='void'?'Maç puansız kapandı':state.won?'Maçı kazandın!':'Rakibin maçı kazandı'):state.lastRoundPoints?`${state.roundWon?'Sen':'Rakibin'} +${state.lastRoundPoints} puan`:'Tur bitti · 0 puan'}</h3>
   {state.answer&&<p className="text-xl font-bold">{state.answer}</p>}
   {!!state.career?.length&&<CareerRoute stages={state.career} total={state.career.length}/>}
   {state.careerSource&&<a href={state.careerSource} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 underline">Kariyer kaynağı</a>}
   <p className="text-sm text-zinc-400">{finished?state.reason:'Puanlar korundu. İkiniz de hazır olduğunuzda sıradaki tur başlar.'}</p>
   {finished&&state.status==='finished'&&<p className="text-sm text-zinc-400">Arkadaş rekabetine bir maç sonucu yazıldı. Tur puanı ile sıralama puanı ayrıdır.</p>}
  </div>}
  {!finished&&waiting&&<div className="space-y-2"><button className={primary} disabled={busy||state.ready} onClick={()=>void act('career_ready',String(state.round||0))}>{state.ready?'Hazırsın':state.roundDone?'Sonraki tura hazırım':'Hazırım'}</button><p className="text-xs text-zinc-400">{state.opponentReady?'Rakibin hazır.':'Rakibinin hazır olması bekleniyor.'}</p></div>}
  {finished&&<div className="flex flex-wrap gap-4">{state.opponent&&<button className={primary} disabled={busy} onClick={()=>void act('rematch')}>Yeni maç · Skorlar sıfırlanır</button>}<button onClick={onExit}>Lobiye dön</button></div>}
  {leave&&!finished&&<div className="space-y-3 border border-neon-yellow/30 rounded-lg p-4"><p className="text-sm">Başlamış maçı bırakmak, tur arasında da olsan mağlubiyet sayılır.</p><button className="text-neon-yellow mr-4" disabled={busy} onClick={()=>void act('leave')}>Maçı bırak</button><button onClick={()=>setLeave(false)}>Devam et</button></div>}
  {error&&<p role="alert" className="text-sm text-neon-yellow">{error}</p>}
 </section>;
}
