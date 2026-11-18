"use client";
import {useEffect,useState} from 'react';
import GameLobby from './GameLobby';
import SoloGame from './SoloGame';
import DailyChallenge from './DailyChallenge';
import {supabase} from '@/lib/supabase';

export default function PlayModes() {
 const [mode,setMode]=useState<'solo'|'friends'|'daily'>('solo');
 const [active,setActive]=useState(false);
 useEffect(()=>{
  const params=new URLSearchParams(location.search);
  if(params.has('daily'))setMode('daily');
  if(params.has('room') || params.has('group') || location.hash.includes('access_token') || params.has('code')) setMode('friends');
  const {data}=supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY'){setMode('friends');setActive(false);}});
  return ()=>data.subscription.unsubscribe();
 },[]);
 return <div className="space-y-5">
  {!active && <div aria-label="Oynama biçimi" className="grid grid-cols-2 gap-3">{([['solo','Tek başına'],['friends','Arkadaşınla']] as const).map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>setMode(id)} className={`rounded-xl border px-4 py-4 font-bold ${mode===id?'border-neon-green bg-neon-green text-black':'border-pitch-border bg-pitch-dark text-zinc-400'}`}>{label}</button>)}</div>}
  {mode==='solo'&&<SoloGame onActive={setActive}/>}
  {!active&&mode!=='daily'&&<button onClick={()=>setMode('daily')} className="w-full rounded-xl border border-neon-cyan/40 p-4 text-left"><span className="block font-bold text-neon-cyan">Günün meydan okuması →</span><span className="text-sm text-zinc-400">Herkese aynı eşleşme · Bir cevap hakkı · Her gün yenilenir</span></button>}
  {mode==='daily'&&<DailyChallenge onLogin={()=>setMode('friends')}/>}
  <div hidden={mode!=='friends'}><GameLobby/></div>
 </div>;
}
