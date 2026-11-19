"use client";
import {useEffect,useRef,useState} from 'react';
import DifficultyPicker from './DifficultyPicker';
import SoloCareer from './SoloCareer';
import {SoloMoreLess} from './MoreLess';
import {answersFor,searchPlayers} from '../../../football-analyzer-mobile/game/data';
import {durations,emptyRecord,isCorrect,makeRound,recordResult,validRecord,type Difficulty,type SoloKind,type SoloRecord,type SoloRound} from '@/lib/solo-game';

const button='rounded-lg bg-neon-green px-5 py-3 font-bold text-black';
const secondary='rounded-lg border border-pitch-border px-4 py-3 text-sm text-zinc-300';
const labels={easy:'Kolay · 5 sn',medium:'Orta · 10 sn',hard:'Zor · 20 sn'};
export default function SoloGame({onActive}:{onActive:(active:boolean)=>void}) {
 const [kind,setKind]=useState<SoloKind|'career'|'more_less'>('anagram');
 const [difficulty,setDifficulty]=useState<Difficulty>('easy');
 const [round,setRound]=useState<SoloRound|null>(null);
 const [phase,setPhase]=useState<'setup'|'countdown'|'playing'|'result'>('setup');
 const [answer,setAnswer]=useState('');
 const [feedback,setFeedback]=useState('');
 const [now,setNow]=useState(0);
 const [won,setWon]=useState(false);
 const [record,setRecord]=useState<SoloRecord>({...emptyRecord});
 const [storageWarning,setStorageWarning]=useState('');
 const [confirmExit,setConfirmExit]=useState(false);
 const start=useRef(0),deadline=useRef(0),finished=useRef(true);
 const recordRef=useRef(record);
 const input=useRef<HTMLInputElement>(null);
 const storageKey=`football-solo-v1:${kind}:${kind==='anagram'?difficulty:'untimed'}`;
 useEffect(()=>{
  try {const raw=localStorage.getItem(storageKey);const next=raw?validRecord(JSON.parse(raw)):{...emptyRecord};recordRef.current=next;setRecord(next);setStorageWarning('');}
  catch {recordRef.current={...emptyRecord};setRecord({...emptyRecord});setStorageWarning('Bu tarayıcıda rekorlar kalıcı saklanamıyor.');}
 },[storageKey]);
 function finish(success:boolean,message:string) {
  if(finished.current)return;
  finished.current=true;
  const next=recordResult(recordRef.current,success,Math.max(0,performance.now()-start.current));
  recordRef.current=next;setRecord(next);setWon(success);setFeedback(message);setPhase('result');
  try{localStorage.setItem(storageKey,JSON.stringify(next));}catch{setStorageWarning('Rekor kaydedilemedi; bu tur yalnızca açık oturumda tutuluyor.');}
 }
 useEffect(()=>{
  if(phase!=='countdown'&&phase!=='playing')return;
  const tick=()=>{
   const time=performance.now();setNow(time);
   if(time>=start.current&&phase==='countdown')setPhase('playing');
   if(round?.kind==='anagram'&&time>=deadline.current)finish(false,'Süre doldu. Bir sonraki isimde tekrar dene.');
  };
  const timer=setInterval(tick,50);tick();
  return ()=>clearInterval(timer);
 // The active round fixes its mode, difficulty and storage key until completion.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[phase,round]);
 useEffect(()=>{if(phase==='playing')input.current?.focus();},[phase]);
 function begin() {
  if(kind==='career'||kind==='more_less')return;
  const next=makeRound(kind,difficulty,round?.key);
  start.current=performance.now()+3000;deadline.current=start.current+durations[difficulty]*1000;
  finished.current=false;setRound(next);setNow(performance.now());setAnswer('');setFeedback('');setConfirmExit(false);setPhase('countdown');onActive(true);
 }
 function leave() {
  if(!finished.current)finish(false,'Tur sonlandırıldı.');
  setPhase('setup');setConfirmExit(false);onActive(false);
 }
 function submit(event:React.FormEvent) {
  event.preventDefault();if(phase!=='playing'||finished.current||!round)return;
  if(round.kind==='anagram'&&performance.now()>=deadline.current){finish(false,'Süre doldu.');return;}
  if(isCorrect(round,answer))finish(true,'Doğru cevap!');
  else setFeedback('Bu cevap olmadı. Tekrar dene.');
 }
 const suggestions=phase==='playing'&&kind==='clubs'?searchPlayers(answer):[];
 if(kind==='more_less')return <SoloMoreLess onActive={onActive} onBack={()=>setKind('anagram')}/>;
 if(kind==='career')return <SoloCareer onActive={onActive} onBack={()=>setKind('anagram')}/>;
 return <section className="card-glow p-5 sm:p-6 space-y-5">
  <div><h2 className="text-xl font-bold">{phase==='setup'?'Kendi rekorunu geç':kind==='anagram'?'Karışık Harfler':'İki Kulüp, Bir İsim'}</h2><p className="mt-2 text-xs text-zinc-400">Tek kişilik · Rekabet puanını etkilemez</p></div>
  {phase==='setup'&&<>
   <div className="grid sm:grid-cols-2 gap-3">{([['anagram','Karışık Harfler','Süre dolmadan futbolcunun adını çöz.'],['clubs','İki Kulüp, Bir İsim','İki kulübün ortak futbolcusunu bul. Süre sınırı yok.'],['career','Kariyer Rotası','Kulüpler sırayla açılır. Bu futbolcu kim?'],['more_less','Hangisi Daha Fazla?','İki futbolcu, tek seçim. Sayıları karşılaştır.']] as const).map(([id,title,description])=><button key={id} aria-pressed={kind===id} onClick={()=>{setKind(id);setRound(null);}} className={`rounded-xl border p-4 text-left ${kind===id?'border-neon-green bg-neon-green/5':'border-pitch-border'}`}><strong className="block">{title}</strong><span className="block mt-2 text-xs text-zinc-400">{description}</span></button>)}</div>
   {kind==='anagram'&&<DifficultyPicker value={difficulty} onChange={setDifficulty}/>}
   <p className="text-sm text-zinc-400">Her turdan sonra devam etmek sana kalmış. Yanlış denemede tekrar cevaplayabilirsin; pas geçmek veya sürenin bitmesi serini sıfırlar.</p>
  </>}
  <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-400"><div className="bg-pitch-dark rounded-lg p-3"><strong className="block text-xl text-white">{record.streak}</strong>Doğru serisi</div><div className="bg-pitch-dark rounded-lg p-3"><strong className="block text-xl text-neon-green">{record.bestStreak}</strong>En iyi seri</div><div className="bg-pitch-dark rounded-lg p-3"><strong className="block text-xl text-white">{record.bestMs===null?'—':`${(record.bestMs/1000).toFixed(1)} sn`}</strong>En hızlı doğru</div></div>
  {phase==='setup'?<button onClick={begin} className={`${button} w-full`}>{kind==='anagram'?`${labels[difficulty]} · Başlat`:'Oyunu başlat'}</button>:<>
   {phase==='countdown'&&<div role="status" className="py-10 text-center"><p className="text-zinc-400 mb-3">Hazır ol</p><strong className="text-6xl text-neon-green">{Math.max(1,Math.ceil((start.current-now)/1000))}</strong></div>}
   {(phase==='playing'||phase==='result')&&round&&<>
    {kind==='anagram'?<div className="rounded-xl bg-pitch-dark p-5 text-center"><p className="text-xs text-zinc-400 mb-4">{phase==='playing'?`${Math.max(0,Math.ceil((deadline.current-now)/1000))} saniye`:'Tur tamamlandı'}</p><p aria-label="Karışık harfler" className="text-2xl sm:text-3xl font-bold tracking-widest break-words">{round.puzzle?.split('').join(' ')}</p></div>:<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center rounded-xl bg-pitch-dark p-5"><strong>{round.pair?.[0]}</strong><span className="text-neon-cyan">×</span><strong>{round.pair?.[1]}</strong></div>}
    {phase==='playing'&&<form onSubmit={submit} className="space-y-3"><label htmlFor="solo-answer" className="block text-sm">{kind==='anagram'?'Harflerdeki oyuncu adı':'Ortak futbolcu'}</label><input ref={input} id="solo-answer" value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback('');}} maxLength={100} autoComplete="off" autoCorrect="off" spellCheck={false} className="w-full rounded-lg border border-pitch-border bg-pitch-dark p-3 text-white focus:ring-1 focus:ring-neon-green focus:outline-none"/><p className="text-xs text-zinc-500">{kind==='anagram'?'Türkçe harf, büyük/küçük harf ve boşluk fark etmez.':'Adını yaz veya önerilerden seç, ardından cevabını gönder.'}</p>{suggestions.length>0&&<ul aria-label="Oyuncu önerileri" className="max-h-40 overflow-y-auto border border-pitch-border rounded-lg">{suggestions.map(player=><li key={player.id}><button type="button" onClick={()=>{setAnswer(player.name);input.current?.focus();}} className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">{player.name}</button></li>)}</ul>}<div className="flex flex-wrap gap-3"><button disabled={!answer.trim()} className={`${button} disabled:opacity-40`}>Cevapla</button><button type="button" onClick={()=>finish(false,'Pas geçtin. Yeni bir tur deneyebilirsin.')} className={secondary}>Pas geç</button></div></form>}
    {phase==='result'&&<div className="space-y-3"><h3 className={`text-xl font-bold ${won?'text-neon-green':'text-neon-cyan'}`}>{won?'Bildin!':'Cevabı görelim'}</h3>{kind==='anagram'?<p><strong>{round.word}</strong> · {round.playerName}</p>:<><p className="text-xs text-zinc-400">Havuzumuzdaki geçerli cevaplar:</p><p className="text-sm leading-relaxed">{answersFor(round.pair!).map(p=>p.name).join(' · ')}</p></>}<button onClick={begin} className={`${button} w-full`}>Sonraki tur</button></div>}
   </>}
   {feedback&&<p role="status" className="text-sm text-neon-cyan">{feedback}</p>}
   {confirmExit?<div className="rounded-lg border border-pitch-border p-4 space-y-3"><p className="text-sm">Bu turu bitirmek doğru serini sıfırlar. Çıkmak istiyor musun?</p><div className="flex gap-3"><button onClick={leave} className={secondary}>Turu bitir</button><button onClick={()=>setConfirmExit(false)} className={secondary}>Devam et</button></div></div>:<button onClick={()=>finished.current?leave():setConfirmExit(true)} className="text-sm text-zinc-400">Oyun seçimine dön</button>}
  </>}
  <p className="text-xs text-zinc-500">{record.correct} doğru / {record.played} tur · Rekorlar bu tarayıcıda saklanır; başka cihaza taşınmaz. {kind==='anagram'?'Her zorluğun rekoru ayrıdır.':''}</p>
  {storageWarning&&<p role="alert" className="text-xs text-neon-yellow">{storageWarning}</p>}
 </section>;
}
