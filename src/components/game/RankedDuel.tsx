"use client";
import { useEffect, useState } from "react";
import { normalizeName, players } from "../../../football-analyzer-mobile/game/data";
import { roomAction, RoomState } from "@/lib/game";
const clubs = Array.from(new Set(players.flatMap((player) => [...player.clubs]))).sort();
const button = "rounded-lg bg-neon-green px-5 py-3 font-mono text-sm font-bold text-black disabled:opacity-40";
const input = "w-full rounded-lg border border-pitch-border bg-pitch-dark p-4 text-white focus:outline-none focus:ring-1 focus:ring-neon-green";

export default function RankedDuel({ initial, onExit }: { initial: RoomState; onExit: () => void }) {
  const [state, setState] = useState(initial);
  const [team, setTeam] = useState(initial.team || "");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const finished = state.status === "finished" || state.status === "void";
  function accept(next: RoomState) {
    setState((previous) => {
      if (previous.status === "finished" || previous.status === "void") return previous;
      if (previous.status === "playing" && next.status === "waiting") return previous;
      if (previous.remaining !== null && next.remaining !== null && next.remaining > previous.remaining) return previous;
      return next;
    });
  }
  useEffect(() => {
    if (finished) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try { const next = await roomAction("state", initial.code); if (active) { accept(next); setError(""); } }
      catch (e) { if (active) setError((e as Error).message); }
      if (active) timer = setTimeout(poll, 1000);
    }
    void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [initial.code, finished]);
  async function act(action: string, value = "") {
    setBusy(true); setError("");
    try {
      const next = await roomAction(action, state.code, value);
      if (next.incorrect) setFeedback("Bu eşleşme için başka bir futbolcu dene.");
      else { accept(next); setFeedback(""); }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  const suggestions = normalizeName(query).length >= 2 ? players.filter((p) => normalizeName(p.name).includes(normalizeName(query))) : [];
  const open = state.remaining === 0 && Boolean(state.opponentTeam);
  return <section className="card-glow p-5 sm:p-8 space-y-6">
    <div className="flex justify-between gap-4 font-mono text-xs text-zinc-400">
      <span>{state.opponent ? `RAKİP: @${state.opponent}` : "RAKİBİN BEKLENİYOR"}</span>
      <button onClick={() => finished ? onExit() : setConfirmLeave(true)}>Odadan çık</button>
    </div>
    {confirmLeave && !finished && <div className="rounded-lg border border-neon-yellow/30 p-4 space-y-3">
      <p className="text-sm">Oyun başladıysa çıkmak mağlubiyet sayılır. Geri sayım bitmeden çıkarsan oda puansız kapanır.</p>
      <div className="flex gap-4"><button disabled={busy} onClick={() => void act("leave")} className="text-neon-yellow">Çıkışı onayla</button><button onClick={() => setConfirmLeave(false)}>Vazgeç</button></div>
    </div>}
    {!finished && !state.opponent && <div className="rounded-xl border border-neon-cyan/30 p-5 text-center space-y-3">
      <p className="font-mono text-xs text-zinc-400">ODA KODU</p>
      <p className="font-mono text-3xl font-bold tracking-widest text-neon-cyan">{state.code}</p>
      <button className="text-neon-cyan text-sm" onClick={async () => {
        try { await navigator.clipboard.writeText(state.code); setCopied(true); }
        catch { setError("Kod kopyalanamadı. Ekrandaki kodu arkadaşına iletebilirsin."); }
      }}>{copied ? "Kod kopyalandı" : "Kodu kopyala"}</button>
    </div>}
    {!finished && state.remaining === null && <>
      <h2 className="text-xl font-black">Takımını gizli seç</h2>
      <p className="font-mono text-sm text-zinc-400">İkiniz de hazır olduğunuzda 3 saniyelik geri sayım başlayacak.</p>
      <label htmlFor="club" className="block text-sm">Senin takımın</label>
      <input id="club" list="duel-clubs" autoComplete="off" disabled={!!state.team || busy} className={input} value={state.team || team} onChange={(e) => setTeam(e.target.value)} placeholder="Takım adı yaz" />
      <datalist id="duel-clubs">{clubs.map((club) => <option key={club} value={club} />)}</datalist>
      <button disabled={!!state.team || busy} className={button} onClick={() => {
        const canonical = clubs.find((club) => normalizeName(club) === normalizeName(team));
        if (!canonical) { setError("Listeden bir takım seç."); return; }
        void act("ready", canonical);
      }}>{state.team ? "Seçimin kilitlendi" : "Hazırım"}</button>
      <p className="text-sm text-zinc-400">{state.opponentReady ? "Rakibin hazır · Takımı gizli" : "Rakibin seçimi bekleniyor · Takımı gizli"}</p>
      <p className="text-xs text-zinc-500">Deneme sürümü: oyuncu havuzu sınırlı. Cevabı bulunmayan eşleşmeler puan kazandırmaz.</p>
    </>}
    {!finished && state.remaining !== null && !open && <div aria-live="polite" className="py-12 text-center"><p className="font-mono text-neon-cyan">TAKIMLAR AÇILIYOR</p><p className="text-8xl font-black neon-text-green mt-6">{state.remaining || "…"}</p></div>}
    {open && <div className="text-center space-y-3"><h2 className="text-2xl font-black">{state.team}</h2><p className="text-neon-cyan">×</p><h2 className="text-2xl font-black">{state.opponentTeam}</h2></div>}
    {open && !finished && <>
      <label htmlFor="answer" className="block text-sm">İki takımda da oynamış futbolcuyu ilk sen bul</label>
      <input id="answer" className={input} value={query} onChange={(e) => { setQuery(e.target.value); setFeedback(""); }} placeholder="Futbolcu adı" />
      {suggestions.map((player) => <button key={player.id} disabled={busy} className="block w-full text-left rounded-lg bg-pitch-muted p-3 disabled:opacity-40" onClick={() => void act("answer", player.id)}>{player.name}</button>)}
      {query.length >= 2 && suggestions.length === 0 && <p className="text-zinc-400">Bu isim henüz oyuncu havuzunda yok.</p>}
      <p role="status" className="text-neon-yellow text-sm">{feedback}</p>
      <button onClick={() => setConfirmLeave(true)} className="text-sm text-zinc-400">Pes et</button>
    </>}
    {finished && <div aria-live="polite" className="rounded-xl border border-pitch-border p-5 text-center space-y-3">
      <h2 className={`text-3xl font-black ${state.won ? "text-neon-green" : "text-neon-cyan"}`}>{state.status === "void" ? "Puan değişmedi" : state.won ? "Kazandın! +3 puan" : "Bu kez rakibin kazandı"}</h2>
      <p className="text-sm text-zinc-400">{state.reason}{state.answer ? ` · ${state.answer}` : ""}</p>
      {state.status === "finished" && <p className="text-sm">Sonuç iki hesabın geçmişine kaydedildi.</p>}
      <button className={button} onClick={onExit}>Lobiye dön</button>
    </div>}
    {!!error && <p role="alert" className="text-neon-yellow text-sm">{error}</p>}
  </section>;
}
