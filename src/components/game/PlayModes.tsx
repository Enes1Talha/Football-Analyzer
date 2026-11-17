"use client";
import {useEffect,useState} from 'react';
import GameLobby from './GameLobby';
import SoloGame from './SoloGame';
import {supabase} from '@/lib/supabase';

export default function PlayModes() {
 const [mode,setMode]=useState<'solo'|'friends'>('solo');
 const [active,setActive]=useState(false);
 useEffect(()=>{
  if(new URLSearchParams(location.search).has('room') || location.hash.includes('access_token') || new URLSearchParams(location.search).has('code')) setMode('friends');
  const {data}=supabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY'){setMode('friends');setActive(false);}});
  return ()=>data.subscription.unsubscribe();
 },[]);
 return <div className="space-y-5">
  {!active && <div aria-label="Oynama biçimi" className="grid grid-cols-2 gap-3">{([['solo','Tek başına'],['friends','Arkadaşınla']] as const).map(([id,label])=><button key={id} aria-pressed={mode===id} onClick={()=>setMode(id)} className={`rounded-xl border px-4 py-4 font-bold ${mode===id?'border-neon-green bg-neon-green text-black':'border-pitch-border bg-pitch-dark text-zinc-400'}`}>{label}</button>)}</div>}
  {mode==='solo'&&<SoloGame onActive={setActive}/>}
  <div hidden={mode!=='friends'}><GameLobby/></div>
 </div>;
}
