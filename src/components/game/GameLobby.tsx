"use client";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { GameDashboard, gameError, levelFor, levelWins, roomAction, RoomState, PlayerDetails } from "@/lib/game";
import RankedDuel from "./RankedDuel";
import AnagramDuel from "./AnagramDuel";
import ProfileAvatar from "./ProfileAvatar";
import ProfileEditor from "./ProfileEditor";

const input = "w-full rounded-lg border border-pitch-border bg-pitch-dark p-3 text-white focus:outline-none focus:ring-1 focus:ring-neon-green";
const button = "rounded-lg bg-neon-green p-3 font-bold text-black disabled:opacity-40";

export default function GameLobby() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [dashboard, setDashboard] = useState<GameDashboard | null>(null);
  const [details, setDetails] = useState<PlayerDetails | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [mode, setMode] = useState<"login" | "signup" | "reset" | "recovery">("login");
  const [tab, setTab] = useState<"play" | "rivals" | "leaderboard" | "history" | "profile">("play");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [gameKind,setGameKind]=useState<"clubs"|"anagram">("clubs");
  const [difficulty,setDifficulty]=useState("easy");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const { data, error: failure } = await supabase.rpc("game_dashboard");
    if (failure) { setError(gameError(failure)); return; }
    setDashboard(data as GameDashboard); setError("");
    const result = await supabase.rpc("game_profile");
    if (result.error) setError(gameError(result.error));
    else setDetails(result.data as PlayerDetails | null);
  }, []);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data, error: failure }) => {
      if (!active) return;
      if (failure) setError("Oturum kontrol edilemedi. Sayfayı yenile.");
      setUser(data.session?.user ?? null); setLoaded(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null); setLoaded(true);
      if (event === "PASSWORD_RECOVERY") setMode("recovery");
      if (event === "SIGNED_OUT") { setDashboard(null); setDetails(null); setRoom(null); setTab("play"); }
    });
    const invite = new URLSearchParams(location.search).get("room");
    if (invite) { setCode(invite.toUpperCase()); setJoining(true); }
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (user) { void refresh(); setUsername(String(user.user_metadata?.username || "")); }
  }, [user?.id, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  async function authenticate(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "recovery") {
        const { error: failure } = await supabase.auth.updateUser({ password });
        if (failure) throw failure;
        setMode("login"); setPassword(""); setNotice("Şifren güncellendi.");
      } else if (mode === "reset") {
        const { error: failure } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/oyna" });
        if (failure) throw failure;
        setNotice("Bu e-posta kayıtlıysa şifre yenileme bağlantısı gönderildi.");
      } else if (mode === "signup") {
        const { data, error: failure } = await supabase.auth.signUp({ email, password,
          options: { data: { username: username.toLowerCase().trim() }, emailRedirectTo: location.origin + "/oyna" } });
        if (failure) throw failure;
        setPassword("");
        setNotice(data.session ? "Şimdi kullanıcı adını tamamla." : "E-postandaki doğrulama bağlantısını aç, ardından giriş yap. Kullanıcı adın girişten sonra kesinleşecek.");
        setMode("login");
      } else {
        const { error: failure } = await supabase.auth.signInWithPassword({ email, password });
        if (failure) throw failure;
        setPassword("");
      }
    } catch (e) {
      const failure = e as { code?: string; message?: string };
      setError(failure.code === "invalid_credentials" ? "E-posta veya şifre hatalı." : failure.code === "email_not_confirmed" ? "Önce e-postandaki bağlantıyla hesabını doğrula." : gameError(failure));
    } finally { setBusy(false); }
  }
  async function claimName(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    const { error: failure } = await supabase.rpc("game_set_username", { p_username: username });
    if (failure) setError(gameError(failure));
    else { setNotice(""); await refresh(); }
    setBusy(false);
  }
  async function enter(action: "create" | "join") {
    setBusy(true); setError("");
    try {
      const next = await roomAction(action==='create'&&gameKind==='anagram'?'create_anagram':action, code.trim().toUpperCase(),gameKind==='anagram'?difficulty:'');
      setRoom(next); history.replaceState(null, "", "/oyna?room=" + next.code);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  const profile = dashboard?.profile;
  const level = levelFor(profile?.wins || 0);
  if (!loaded) return <p className="text-zinc-400">Oturum kontrol ediliyor…</p>;
  function exitRoom() {
    setRoom(null); setCode(""); setJoining(false); history.replaceState(null, "", "/oyna"); void refresh();
  }
  if(room&&user) return room.gameKind==='anagram'?<AnagramDuel key={room.code} initial={room} onExit={exitRoom} onNext={next=>{setRoom(next);history.replaceState(null,'','/oyna?room='+next.code);}}/>:<RankedDuel key={room.code} initial={room} onExit={exitRoom}/>;

  return <div className="space-y-5">
    {error && <p role="alert" className="rounded-lg border border-neon-yellow/30 p-4 text-sm text-neon-yellow">{error}</p>}
    {notice && <p role="status" className="text-sm text-neon-cyan">{notice}</p>}
    {(!user || mode === "recovery") ? <section className="card-glow p-6 space-y-5">
      <h2 className="text-xl font-bold">{mode === "signup" ? "Sahaya kendi adınla çık" : mode === "reset" ? "Şifreni yenile" : mode === "recovery" ? "Yeni şifreni belirle" : "Oyuna giriş yap"}</h2>
      <p className="text-sm text-zinc-400">Galibiyetlerin, seviyen ve arkadaşlarınla rekabetin hesabında saklansın.</p>
      <form onSubmit={authenticate} className="space-y-4">
        {mode === "signup" && <label className="block text-sm space-y-2"><span>Kullanıcı adı</span><input className={input} value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} pattern="[a-z0-9_]{3,20}" minLength={3} maxLength={20} required autoComplete="username" placeholder="ornek_oyuncu" /><span className="text-xs text-zinc-500">3–20 karakter; a-z, rakam ve alt çizgi. Başkaları bu adı görür.</span></label>}
        {mode !== "recovery" && <label className="block text-sm space-y-2"><span>E-posta</span><input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} /></label>}
        {mode !== "reset" && <label className="block text-sm space-y-2"><span>Şifre</span><input type="password" minLength={mode === "login" ? 1 : 8} required autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className={input} />{mode !== "login" && <span className="text-xs text-zinc-500">En az 8 karakter.</span>}</label>}
        <button disabled={busy} className={`${button} w-full`}>{busy ? "Bekle…" : mode === "signup" ? "Hesap oluştur" : mode === "reset" ? "Yenileme bağlantısı gönder" : mode === "recovery" ? "Şifreyi kaydet" : "Giriş yap"}</button>
      </form>
      {mode !== "recovery" && <div className="flex flex-wrap gap-4 text-sm"><button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} className="text-neon-cyan">{mode === "signup" ? "Zaten hesabım var" : "Hesap oluştur"}</button><button onClick={() => { setMode(mode === "reset" ? "login" : "reset"); setError(""); }} className="text-zinc-400">{mode === "reset" ? "Girişe dön" : "Şifremi unuttum"}</button></div>}
    </section> : !dashboard ? <section className="card-glow p-6"><button onClick={() => void refresh()} className={button}>Hesabımı yükle / Tekrar dene</button></section> : !profile ? <form onSubmit={claimName} className="card-glow p-6 space-y-4">
      <h2 className="text-xl font-bold">Kullanıcı adını tamamla</h2><p className="text-sm text-zinc-400">Sıralamada ve arkadaşlarının karşısında bu isim görünecek.</p>
      <label htmlFor="profile-name" className="block text-sm">Kullanıcı adı</label><input id="profile-name" className={input} value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} pattern="[a-z0-9_]{3,20}" maxLength={20} required />
      <p className="text-xs text-zinc-500">3–20 karakter: a-z, rakam veya alt çizgi.</p><button disabled={busy} className={button}>Kullanıcı adımı kaydet</button>
    </form> : <>
      <section className="card-glow p-6 space-y-4">
        <div className="flex justify-between gap-3 items-center"><button onClick={() => setTab("profile")} aria-label="Profilimi düzenle" className="flex min-w-0 items-center gap-3 text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"><ProfileAvatar photo={details?.avatar} /><span className="min-w-0"><span className="block font-bold text-lg break-words">{details?.display_name || `@${profile.username}`}</span><span className="block text-xs text-zinc-400">{details?.display_name ? `@${profile.username} · ` : ""}Profili düzenle</span></span></button><span className="shrink-0 rounded-full bg-neon-green/10 px-3 py-1 text-neon-green text-sm font-bold">Seviye {level}</span></div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[['Galibiyet',profile.wins],['Mağlubiyet',profile.losses],['Puan',profile.wins*3]].map(([label,value]) => <div key={label} className="rounded-lg bg-pitch-dark p-3"><p className="text-2xl font-bold">{value}</p><p className="text-xs text-zinc-400">{label}</p></div>)}
        </div>
        <div className="flex justify-between text-sm text-zinc-400"><span>{dashboard.streak} maçlık galibiyet serisi</span><span>#{profile.rank}</span></div>
        <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">{([['clubs','İki Kulüp'],['anagram','Karışık Harfler']] as const).map(([kind,label])=>{const stats=dashboard.byGame?.find(s=>s.kind===kind);return <p key={kind}>{label}: <span className="text-white">{stats?.wins||0} G · {stats?.losses||0} M</span></p>;})}</div>
        <progress aria-label="Seviye ilerlemesi" className="w-full accent-neon-green" value={level===10 ? 1 : profile.wins-levelWins[level-1]} max={level===10 ? 1 : levelWins[level]-levelWins[level-1]} />
        <p className="text-xs text-zinc-400">{level===10 ? "En yüksek seviyedesin!" : `Seviye ${level+1} için ${levelWins[level]-profile.wins} galibiyet daha.`}</p>
      </section>
      <nav aria-label="Oyuncu menüsü" className="flex gap-2 overflow-x-auto pb-1">
        {([['play','Oyna'],['rivals','Arkadaş rekabeti'],['leaderboard','Sıralama'],['history','Geçmiş'],['profile','Profilim']] as const).map(([id,label]) => <button key={id} aria-pressed={tab===id} onClick={() => { setTab(id); void refresh(); }} className={`flex-1 shrink-0 whitespace-nowrap rounded-lg px-3 py-3 text-sm ${tab===id ? 'bg-neon-green text-black font-bold' : 'bg-pitch-dark text-zinc-400'}`}>{label}</button>)}
      </nav>
      {tab==='profile' && (details ? <ProfileEditor key={user.id} details={details} email={user.email} onSaved={(saved) => { setDetails(saved); setDashboard((previous) => previous && ({ ...previous, profile: previous.profile && { ...previous.profile, username: saved.username } })); void refresh(); }} /> : <section className="card-glow p-5"><p className="text-zinc-400">Profil bilgileri henüz yüklenemedi.</p><button className={`${button} mt-3`} onClick={() => void refresh()}>Tekrar dene</button></section>)}
      {tab==='play' && <section className="card-glow p-6 space-y-5">
        <h2 className="text-xl font-bold">Hangi oyunu oynayalım?</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {([['clubs','İki Kulüp, Bir İsim','Takımını gizle. İki kulüpte oynamış futbolcuyu ilk sen bul.'],['anagram','Karışık Harfler','Harfleri çöz. Futbolcunun adını rakibinden önce gönder.']] as const).map(([id,title,description])=><button key={id} aria-pressed={gameKind===id} onClick={()=>setGameKind(id)} className={`rounded-xl border p-4 text-left space-y-2 ${gameKind===id?'border-neon-green bg-neon-green/5':'border-pitch-border bg-pitch-dark'}`}><span className={`block font-bold ${gameKind===id?'text-neon-green':'text-white'}`}>{title}</span><span className="block text-xs text-zinc-400">{description}</span></button>)}
        </div>
        {gameKind==='anagram'&&<fieldset className="space-y-2"><legend className="text-sm text-zinc-400 mb-2">Zorluk</legend><div className="flex flex-wrap gap-2">{[['easy','Kolay · 5 sn'],['medium','Orta · 10 sn'],['hard','Zor · 20 sn']].map(([id,label])=><button type="button" key={id} aria-pressed={difficulty===id} onClick={()=>setDifficulty(id)} className={`rounded-lg border px-3 py-2 text-sm ${difficulty===id?'border-neon-cyan text-neon-cyan':'border-pitch-border text-zinc-400'}`}>{label}</button>)}</div><p className="text-xs text-zinc-500">Kolay: kısa, tanınan isimler. Orta: daha uzun isimler. Zor: uzun veya yazımı daha zor isimler.</p></fieldset>}
        <p className="text-zinc-400 text-sm">Bir oda aç, kodu arkadaşına gönder. Katılan oyuncu odanın oyununa ve zorluğuna otomatik girer.</p>
        <div className="grid sm:grid-cols-2 gap-3"><button disabled={busy} onClick={() => void enter('create')} className={button}>Oda aç</button><button onClick={() => setJoining(true)} className="rounded-lg border border-neon-cyan/40 p-3 font-bold text-neon-cyan">Odaya katıl</button></div>
        {joining && <form onSubmit={(e) => { e.preventDefault(); void enter('join'); }} className="space-y-3"><label htmlFor="room-code" className="block text-sm">Oda kodu</label><input id="room-code" className={`${input} uppercase tracking-widest`} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} pattern="[A-Za-z0-9]{8}" maxLength={8} required placeholder="8 karakterlik kod" /><button disabled={busy} className={button}>Katıl / Odama dön</button></form>}
        <details className="text-sm text-zinc-400"><summary className="cursor-pointer">Puanlar ve seviyeler nasıl çalışır?</summary><p className="mt-3">İlk doğru cevap +1 galibiyet ve +3 puan. Rakibe +1 mağlubiyet. Pes etmek mağlubiyettir. Aynı takım, cevapsız eşleşme ve başlamadan kapanan oda puan vermez. Sıralama: galibiyet, ardından daha az mağlubiyet.</p><p className="mt-2">Seviye 1–10 galibiyet eşikleri: {levelWins.join(', ')}.</p><p className="mt-2">Bağlantı koparsa aynı oda koduyla dön. Tamamlanmayan odalar 24 saat sonra puansız kapanır.</p></details>
      </section>}
      {tab==='rivals' && <section className="card-glow p-5 space-y-4"><h2 className="text-lg font-bold">Arkadaşlarınla skorun</h2><p className="text-xs text-zinc-400">Birlikte oyun tamamladığın kişiler burada görünür. G: senin galibiyetlerin, M: mağlubiyetlerin.</p>{!dashboard.rivals.length && <p className="text-zinc-400">İlk oyununu tamamla, rekabet burada başlasın.</p>}{dashboard.rivals.map((r) => <div key={r.opponent_id} className="flex justify-between gap-4 border-b border-pitch-border py-3"><span className="break-all">@{r.opponent}</span><span className="shrink-0 font-mono"><span className="text-neon-green">{r.wins} G</span> · {r.losses} M</span></div>)}</section>}
      {tab==='leaderboard' && <section className="card-glow p-5 space-y-4"><h2 className="text-lg font-bold">Puan tablosu · İlk 50</h2><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-zinc-500"><tr>{['#','Oyuncu','Sv.','G / M','Puan'].map((h) => <th key={h} className="py-3 pr-3">{h}</th>)}</tr></thead><tbody>{dashboard.leaderboard.map((p) => <tr key={p.id} className={`border-t border-pitch-border ${p.id===user.id ? 'text-neon-green' : ''}`}><td className="py-3 pr-3">{p.rank}</td><td className="pr-3">@{p.username}</td><td className="pr-3">{levelFor(p.wins)}</td><td className="pr-3 whitespace-nowrap">{p.wins} / {p.losses}</td><td>{p.wins*3}</td></tr>)}</tbody></table></div></section>}
      {tab==='history' && <section className="card-glow p-5 space-y-4"><h2 className="text-lg font-bold">Son 20 oyun</h2>{!dashboard.history.length && <p className="text-zinc-400">Henüz tamamlanmış oyunun yok.</p>}{dashboard.history.map((h) => <article key={h.code} className="border-b border-pitch-border py-3 space-y-1"><div className="flex justify-between gap-3"><span className="break-all">@{h.opponent}</span><strong className={h.won ? 'text-neon-green' : 'text-zinc-400'}>{h.won ? 'Galibiyet' : 'Mağlubiyet'}</strong></div><p className="text-sm text-zinc-400">{h.reason.startsWith('Anagram') ? 'Karışık Harfler' : h.host_team + ' × ' + h.guest_team}</p><p className="text-xs text-zinc-500">{h.answer || h.reason} · {new Date(h.finished_at).toLocaleString('tr-TR')}</p></article>)}</section>}
    </>}
    {user && !room && <button className="text-xs text-zinc-500" onClick={async () => {
      const { error: failure } = await supabase.auth.signOut();
      if (failure) setError(gameError(failure));
      else { setMode('login'); setNotice(''); }
    }}>Hesaptan çık</button>}
  </div>;
}
