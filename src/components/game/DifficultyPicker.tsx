"use client";
import {useId} from 'react';

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export default function DifficultyPicker({value,onChange}:{value:GameDifficulty;onChange:(value:GameDifficulty)=>void}) {
 const name=useId();
 return <fieldset className="relative space-y-3">
  <legend className="mb-2 text-sm text-zinc-400">Zorluk seç</legend>
  <div className="grid grid-cols-3 gap-2">
   {([['easy','Kolay',5],['medium','Orta',10],['hard','Zor',20]] as const).map(([id,label,seconds])=><label key={id} className={`relative flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center transition-colors focus-within:ring-2 focus-within:ring-neon-cyan ${value===id?'border-neon-cyan bg-neon-cyan text-black':'border-pitch-border bg-pitch-dark text-zinc-300 hover:border-neon-cyan/60'}`}>
    <input type="radio" name={name} value={id} checked={value===id} onChange={()=>onChange(id)} aria-label={`${label} · ${seconds} saniye`} className="absolute inset-0 h-full w-full cursor-pointer opacity-0"/>
    <span className="pointer-events-none font-bold">{label}</span>
    <span className="pointer-events-none text-xs">{seconds} saniye{value===id?' · Seçili':''}</span>
   </label>)}
  </div>
 </fieldset>;
}
