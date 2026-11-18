"use client";
import {useState} from 'react';
import {searchPlayers} from '../../../football-analyzer-mobile/game/data';

export default function CareerPlayerPicker({id,disabled=false,confirmSelection=false,onSelect}:{id:string;disabled?:boolean;confirmSelection?:boolean;onSelect:(playerId:string)=>void}) {
 const [query,setQuery]=useState('');
 const suggestions=searchPlayers(query);
 return <div className="space-y-3">
  <label htmlFor={id} className="block text-sm">Bu futbolcu kim?</label>
  <input autoFocus id={id} value={query} onChange={e=>setQuery(e.target.value)} disabled={disabled} maxLength={80} autoComplete="off" autoCorrect="off" spellCheck={false} placeholder="Oyuncu adı yaz, listeden seç" aria-describedby={`${id}-help`} className="w-full rounded-lg border border-pitch-border bg-pitch-dark p-3 focus:outline-none focus:ring-1 focus:ring-neon-green disabled:opacity-40"/>
  <p id={`${id}-help`} className="text-xs text-zinc-400">En az iki harf yaz. {confirmSelection?'Oyuncuyu seç, ardından cevabını kilitle.':'Oyuncuya dokunduğunda cevabın gönderilir.'}</p>
  {suggestions.length>0&&<ul aria-label="Oyuncu önerileri" className="max-h-64 overflow-y-auto rounded-lg border border-pitch-border">{suggestions.map(player=><li key={player.id}><button type="button" disabled={disabled} onClick={()=>onSelect(player.id)} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 focus-visible:bg-white/10 disabled:opacity-40">{player.name}</button></li>)}</ul>}
  {query.trim().length>=2&&suggestions.length===0&&<p role="status" className="text-sm text-zinc-400">Bu isim oyuncu havuzunda bulunamadı.</p>}
 </div>;
}
