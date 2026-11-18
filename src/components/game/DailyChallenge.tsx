"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import {supabase} from '@/lib/supabase';
import {players} from '../../../football-analyzer-mobile/game/data';
import CareerPlayerPicker from './CareerPlayerPicker';
interface DailyState {day:string;nextAt:number;started:boolean;completed:boolean;points:number;streak:number;weeklyPoints:number;teams:string[];answers:{id:string;name:string}[]}
const button='rounded-lg bg-neon-green px-5 py-3 font-bold text-black disabled:opacity-40';
export default function DailyChallenge({onLogin}:{onLogin:()=>void}) {
 const [daily,setDaily]=useState<DailyState|null>(null),[logged,setLogged]=useState<boolean|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[selected,setSelected]=useState(''),[notice,setNotice]=useState('');
 const version=useRef(0),mutating=useRef(false);
 const load=useCallback(async()=>{
  if(mutating.current)return;
  const request=++version.current;const session=await supabase.auth.getSession();if(request!==version.current)return;
  setLogged(!!session.data.session);if(!session.data.session){setDaily(null);return;}
  const result=await supabase.rpc('game_daily');if(request!==version.current)return;
  if(result.error)setError(result.error.message);else{setDaily(result.data);setError('');}
 },[]);
 useEffect(()=>{void load();const timer=setInterval(()=>{if(document.visibilityState==='visible')void load();},30000);
  const listener=()=>{if(document.visibilityState==='visible')void load();};document.addEventListener('visibilitychange',listener);
  return()=>{version.current++;clearInterval(timer);document.removeEventListener('visibilitychange',listener);};},[load]);
 useEffect(()=>{setSelected('');setNotice('');},[daily?.day]);
 async function act(action:string){if(!daily||mutating.current)return;mutating.current=true;setBusy(true);setError('');++version.current;
  try{const result=await supabase.rpc('game_daily',{p_action:action,p_day:daily.day,p_player:selected});if(result.error)throw result.error;setDaily(result.data);}
  catch(e){setError((e as Error).message);}finally{mutating.current=false;setBusy(false);}
 }
 return <section className="card-glow p-5 sm:p-6 space-y-5">
  <div><p className="text-xs uppercase tracking-widest text-neon-cyan">Bugünün sorusu · Herkes için aynı</p><h2 className="mt-2 text-2xl font-bold">Günün meydan okuması</h2><p className="mt-2 text-sm text-zinc-400">İki kulübün ortak futbolcusunu bul. Bir cevap hakkın var: doğru 100, yanlış veya pas 0 puan. Süre sınırı yok; gün bitmeden tamamla.</p></div>
  {logged===null&&<p className="text-zinc-400">Oturum kontrol ediliyor…</p>}
  {logged===false&&<><p className="text-sm text-zinc-400">Günlük hakkın ve haftalık puanın hesabında saklanır.</p><button className={button} onClick={onLogin}>Giriş yap / Hesap oluştur</button></>}
  {daily&&<>
   <div className="flex flex-wrap justify-between gap-3 text-sm"><span>{daily.day} · Türkiye saati</span><span className="text-neon-cyan">{daily.streak} günlük katılım serisi · Bu hafta {daily.weeklyPoints} puan</span></div>
   {!daily.started&&<button className={`${button} w-full`} disabled={busy} onClick={()=>void act('start')}>Bugünün eşleşmesini aç</button>}
   {daily.started&&<div className="rounded-xl border border-neon-green/30 p-5 text-center text-xl font-bold">{daily.teams.join(' × ')}</div>}
   {daily.started&&!daily.completed&&<>
    <CareerPlayerPicker key={daily.day} id="daily-player" disabled={busy} confirmSelection onSelect={setSelected}/>
    {selected&&selected!=='__pass__'&&<div className="border border-neon-cyan/30 rounded-lg p-4 space-y-3"><p>Seçimin: <strong>{players.find(p=>p.id===selected)?.name}</strong></p><p className="text-xs text-zinc-400">Onayladığında bugünkü hakkın kullanılır. Cevabını değiştiremezsin.</p><button className={button} disabled={busy} onClick={()=>void act('answer')}>Cevabımı kilitle</button><button className="ml-4 text-sm text-zinc-400" onClick={()=>setSelected('')}>Vazgeç</button></div>}
    <button className="text-sm text-zinc-400" disabled={busy} onClick={()=>setSelected('__pass__')}>Pas geçmek istiyorum</button>
    {selected==='__pass__'&&<div className="space-y-2"><p className="text-sm">Bugünü 0 puanla tamamlayıp cevapları görmek istiyor musun?</p><button className={button} disabled={busy} onClick={()=>void act('pass')}>Pas geç · Cevapları gör</button></div>}
   </>}
   {daily.completed&&<div className="space-y-3" aria-live="polite"><h3 className="text-2xl font-bold text-neon-green">{daily.points===100?'Bildin! +100 puan':'Bugünkü mücadele tamamlandı · 0 puan'}</h3><p className="text-sm text-zinc-400">Havuzumuzdaki geçerli cevaplar:</p><p>{daily.answers.map(p=>p.name).join(' · ')}</p><p className="text-sm text-zinc-400">Bugünkü sonucun kaydedildi. Tekrar açmak yeni puan kazandırmaz. Yarın yeni bir eşleşme var.</p><button className="text-neon-cyan text-sm" onClick={async()=>{try{await navigator.clipboard.writeText(`Football Analyzer · ${daily.day}\nGünün meydan okuması: ${daily.points}/100\nSen kaç alacaksın? ${location.origin}/oyna?daily=1`);setNotice('Sonuç kopyalandı. Cevabı paylaşmadan arkadaşına gönderebilirsin.');}catch{setNotice('Sonuç kopyalanamadı.');}}}>Sonucumu kopyala · Arkadaşına meydan oku</button></div>}
   <p className="text-xs text-zinc-500">Her gün 00.00 (Türkiye) yenilenir. Günlük puanlar normal maç galibiyetlerine ve seviyene eklenmez.</p>
  </>}
  {notice&&<p role="status" className="text-sm text-neon-cyan">{notice}</p>}
  {error&&<div role="alert" className="text-sm text-neon-yellow space-y-2"><p>{error}</p><button onClick={()=>void load()}>Yenile</button><button className="ml-4" onClick={onLogin}>Hesabımı aç</button></div>}
 </section>;
}
