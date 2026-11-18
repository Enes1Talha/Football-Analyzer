"use client";
import { useEffect, useRef, useState } from "react";
import { roomAction, type RoomState } from "@/lib/game";
import CareerRoute from './CareerRoute';
const button="rounded-lg bg-neon-green px-5 py-3 font-bold text-black disabled:opacity-40";
const labels={easy:"Kolay · 5 saniye",medium:"Orta · 10 saniye",hard:"Zor · 20 saniye"};

export default function AnagramDuel({initial,onExit,onNext}: {initial:RoomState;onExit:()=>void;onNext:(room:RoomState)=>void}) {
  const [state,setState]=useState(initial);
  const [answer,setAnswer]=useState("");
  const [error,setError]=useState("");
  const [feedback,setFeedback]=useState("");
  const [busy,setBusy]=useState(false);
  const [confirmLeave,setConfirmLeave]=useState(false);
  const [now,setNow]=useState(initial.serverMs||Date.now());
  const anchor=useRef({server:initial.serverMs||Date.now(),local:performance.now()});
  const latest=useRef(initial.serverMs||0);
  const field=useRef<HTMLInputElement>(null);
  const finished=state.status==='finished'||state.status==='void';
  const career=state.gameKind==='career';
  const open=(career?!!state.career?.length:!!state.puzzle)&&!finished;
  const seconds=Math.max(0,Math.ceil(((state.endsAt||now)-now)/1000));
  const countdown=Math.max(0,Math.ceil(((state.startsAt||now)-now)/1000));
  function accept(next:RoomState) {
    if((next.serverMs||0)<latest.current) return;
    latest.current=next.serverMs||0;
    anchor.current={server:next.serverMs||Date.now(),local:performance.now()};
    setState(previous=>previous.status==='finished'||previous.status==='void'?previous:next);
    setNow(next.serverMs||Date.now());
  }
  useEffect(()=>{
    if(finished)return;
    let active=true;let timer:ReturnType<typeof setTimeout>;
    async function poll(){
      try{const next=await roomAction('state',initial.code);if(active)accept(next);}
      catch(e){if(active)setError((e as Error).message);}
      if(active)timer=setTimeout(poll,250);
    }
    void poll();
    const clock=setInterval(()=>setNow(anchor.current.server+performance.now()-anchor.current.local),100);
    return()=>{active=false;clearTimeout(timer);clearInterval(clock);};
  },[initial.code,finished]);
  useEffect(()=>{if(open)field.current?.focus();},[open]);
  async function act(action:string,value=''){
    setBusy(true);setError('');
    try{const next=await roomAction(action,state.code,value);if(action==='rematch'){onNext(next);return;}accept(next);setFeedback(next.incorrect?'Doğru değil, tekrar dene.':'');}
    catch(e){setError((e as Error).message);}
    finally{setBusy(false);}
  }
  return <section className="card-glow p-5 sm:p-8 space-y-5">
    <div className="flex justify-between gap-3 text-sm text-zinc-400"><span>{career?'Kariyer Rotası':`Karışık Harfler · ${labels[state.difficulty||'easy']}`}</span><button onClick={()=>finished?onExit():setConfirmLeave(true)}>Odadan çık</button></div>
    <p className="text-sm text-neon-cyan">{state.opponent?`Rakibin: @${state.opponent}`:'Arkadaşın bekleniyor'}</p>
    {!state.opponent&&!finished&&<div className="rounded-xl border border-neon-cyan/30 p-5 text-center space-y-3"><p className="text-sm text-zinc-400">Arkadaşına oda kodunu gönder</p><p className="font-mono text-3xl font-bold tracking-widest text-neon-cyan">{state.code}</p><button onClick={async()=>{try{await navigator.clipboard.writeText(state.code);setFeedback('Kod kopyalandı.');}catch{setError('Kodu ekrandan kopyalayabilirsin.');}}} className="text-sm text-neon-cyan">Kodu kopyala</button></div>}
    {!finished&&state.status==='waiting'&&<div className="space-y-4"><h2 className="text-2xl font-bold">{career?'Kulüpleri takip et. Futbolcuyu bul.':'Harfler karışık. Cevap sende.'}</h2><p className="text-sm text-zinc-400">{career?'İkiniz de hazır olunca ilk iki kulüp açılır. Her 8 saniyede sıradaki kulüp ikinize de açılır. Son kulüpten sonra 20 saniye kalır. İlk doğru cevap kazanır.':'İkiniz de hazır olunca aynı harfler açılır. Ekrandaki harflerden futbolcunun kullanılan adını veya soyadını yaz ve gönder. İlk doğru cevap kazanır.'}</p><button className={button} disabled={busy||state.ready} onClick={()=>void act('ready')}>{state.ready?'Hazırsın':'Hazırım'}</button><p className="text-xs text-zinc-500">{state.opponentReady?'Rakibin hazır.':'Rakibinin hazır olması bekleniyor.'}</p></div>}
    {!finished&&state.status==='playing'&&!open&&<div className="py-10 text-center" aria-live="polite"><p className="text-neon-cyan">{career?'ROTA AÇILIYOR':'HARFLER AÇILIYOR'}</p><p className="mt-5 text-8xl font-black text-neon-green">{countdown||'…'}</p></div>}
    {open&&<><div className="flex justify-between items-center"><h2 className="text-xl font-bold">Futbolcuyu bul</h2><span role="timer" className={`font-mono text-2xl font-bold ${seconds<=3?'text-neon-yellow':'text-neon-cyan'}`}>{seconds} sn</span></div>{career?<div className="space-y-3"><CareerRoute stages={state.career||[]} total={state.totalClues||0}/><p className="text-xs text-zinc-400">{state.nextClueAt?`Sonraki kulüp: ${Math.max(0,Math.ceil((state.nextClueAt-now)/1000))} sn`:'Bütün kulüpler açık.'}</p></div>:<div className="flex flex-wrap justify-center gap-2 py-4" aria-label={`Karışık harfler: ${state.puzzle}`}>
      {state.puzzle?.split('').map((letter,index)=><span key={index} className="flex h-12 w-10 sm:h-14 sm:w-12 items-center justify-center rounded-lg border border-neon-green/40 bg-neon-green/5 text-2xl font-black text-neon-green">{letter}</span>)}
    </div>}<form className="flex flex-col sm:flex-row gap-3" onSubmit={event=>{event.preventDefault();void act('answer',answer);}}><label htmlFor="anagram-answer" className="sr-only">Cevabın</label><input ref={field} id="anagram-answer" value={answer} maxLength={80} autoComplete="off" autoCorrect="off" spellCheck={false} onChange={e=>{setAnswer(e.target.value);setFeedback('');}} className="min-w-0 flex-1 rounded-lg border border-pitch-border bg-pitch-dark p-4 text-white focus:outline-none focus:ring-1 focus:ring-neon-green" placeholder="Cevabını yaz" disabled={seconds===0}/><button className={button} disabled={busy||!answer.trim()||seconds===0}>Gönder</button></form><p className="text-xs text-zinc-500">{seconds===0?'Sonuç bekleniyor…':'Enter ile gönderebilirsin. Türkçe karakterler ve boşluklar sorun değil.'}</p></>}
    {confirmLeave&&!finished&&<div className="rounded-lg border border-neon-yellow/30 p-4 space-y-3"><p className="text-sm">Oyun açıldıktan sonra çıkmak mağlubiyet sayılır. Öncesinde oda puansız kapanır.</p><button disabled={busy} onClick={()=>void act('leave')} className="mr-5 text-neon-yellow">Çıkışı onayla</button><button onClick={()=>setConfirmLeave(false)}>Vazgeç</button></div>}
    {finished&&<div className="rounded-xl border border-pitch-border p-5 text-center space-y-4" aria-live="polite"><h2 className="text-3xl font-black text-neon-green">{state.status==='void'?'Puan değişmedi':state.won?'Kazandın! +3 puan':'Rakibin kazandı'}</h2>{state.answer&&<p className="text-2xl font-bold">{state.answer}</p>}<p className="text-sm text-zinc-400">{state.reason}</p>{career&&!!state.career?.length&&<div className="space-y-3 text-left"><CareerRoute stages={state.career} total={state.career.length}/><p className="text-xs text-zinc-500">Kaynakta yer alan A takım kulüp dönemleri; kiralık dönemlerde yıllar örtüşebilir. {state.careerSource&&<a href={state.careerSource} target="_blank" rel="noreferrer" className="underline">Kariyer kaynağı</a>}</p></div>}{state.opponent&&<button disabled={busy} className={button} onClick={()=>void act('rematch')}>Aynı rakiple tekrar oyna</button>}<button className="block mx-auto text-sm text-zinc-400" onClick={onExit}>Lobiye dön</button></div>}
    {feedback&&<p role="status" className="text-neon-cyan text-sm">{feedback}</p>}{error&&<p role="alert" className="text-neon-yellow text-sm">{error}</p>}
  </section>;
}
