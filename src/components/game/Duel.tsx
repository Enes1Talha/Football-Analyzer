"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { answersFor, normalizeName, players } from "../../../football-analyzer-mobile/game/data";

type Choice = { team: string; salt: string };
type Snapshot = {
  id: string;
  host: boolean;
  peer: string | null;
  commitment: string | null;
  startsAt: number | null;
  reveal: Choice | null;
};
const clubs = Array.from(new Set(players.flatMap((player) => [...player.clubs]))).sort();
async function digest(choice: Choice) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(choice)));
  return Array.from(new Uint8Array(bytes), (value) => value.toString(16).padStart(2, "0")).join("");
}
const button = "rounded-lg bg-neon-green px-5 py-3 font-mono text-sm font-bold text-black disabled:opacity-40";
const input = "w-full rounded-lg border border-pitch-border bg-pitch-dark p-4 text-white focus:outline-none focus:ring-1 focus:ring-neon-green";

export default function Duel({ room, host, onExit }: { room: string; host: boolean; onExit: () => void }) {
  const own = useRef<Snapshot>({ id: crypto.randomUUID(), host, peer: null, commitment: null, startsAt: null, reveal: null });
  const secret = useRef<Choice | null>(null);
  const remote = useRef<Snapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [team, setTeam] = useState("");
  const [opponent, setOpponent] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [solved, setSolved] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastSeen = useRef(0);
  const send = useRef<() => void>(() => {});

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) { setError("Oda bağlantısı yapılandırılmamış."); return; }
    let active = true;
    let subscribed = false;
    const joinedAt = Date.now();
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    const channel = client.channel("football-duel-" + room, { config: { broadcast: { self: false } } });
    send.current = () => {
      if (subscribed) void channel.send({ type: "broadcast", event: "state", payload: own.current });
    };
    channel.on("broadcast", { event: "state" }, async ({ payload }) => {
      const next = payload as Snapshot;
      if (!next || typeof next.id !== "string" || next.id === own.current.id || next.host === host) return;
      if (own.current.peer && own.current.peer !== next.id) return;
      if (next.peer && next.peer !== own.current.id) return;
      own.current.peer = next.id;
      remote.current = next;
      lastSeen.current = Date.now();
      setError("");
      setPeerReady(Boolean(next.commitment));
      if (host && own.current.commitment && next.commitment && next.peer === own.current.id && !own.current.startsAt) {
        own.current.startsAt = Date.now() + 3000;
        send.current();
      }
      if (!host && next.startsAt && next.peer === own.current.id && own.current.commitment) {
        own.current.startsAt = next.startsAt;
      }
      if (next.reveal && own.current.startsAt && Date.now() >= own.current.startsAt) {
        const valid = typeof next.reveal.team === "string" && typeof next.reveal.salt === "string"
          && await digest(next.reveal) === next.commitment;
        if (!active) return;
        if (valid) setOpponent(next.reveal.team);
        else setError("Rakibin seçimi doğrulanamadı. Yeni oda açın.");
      }
    }).subscribe((status) => {
      if (!active) return;
      subscribed = status === "SUBSCRIBED";
      setConnected(subscribed);
      if (subscribed) { setError(""); send.current(); }
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setError("Odaya bağlanılamadı. Bağlantını kontrol et.");
    });
    const timer = setInterval(() => {
      const start = own.current.startsAt;
      if (start) {
        setRemaining(Math.min(3, Math.max(0, Math.ceil((start - Date.now()) / 1000))));
        if (Date.now() >= start && secret.current) {
          own.current.reveal = secret.current;
          setRevealed(true);
        }
      }
      if (lastSeen.current && Date.now() - lastSeen.current > 12000) setError("Rakibin bağlantısı kesilmiş olabilir. Yeniden bağlanması bekleniyor.");
      if (!host && subscribed && !lastSeen.current && Date.now() - joinedAt > 12000) {
        setError("Oda sahibi bulunamadı. Kodu kontrol et; oda sahibinin sayfası açık olmalı.");
      }
      send.current();
    }, 500);
    return () => { active = false; clearInterval(timer); send.current = () => {}; void client.removeChannel(channel); };
  }, [room, host]);

  async function lock() {
    const canonical = clubs.find((club) => normalizeName(club) === normalizeName(team));
    if (!canonical) { setError("Listeden bir takım seç."); return; }
    setLocked(true);
    try {
      const choice = { team: canonical, salt: crypto.randomUUID() };
      const commitment = await digest(choice);
      secret.current = choice;
      own.current.commitment = commitment;
      setTeam(canonical);
      setError("");
      send.current();
    } catch { setLocked(false); setError("Takım kilitlenemedi. Tekrar dene."); }
  }

  const pair = [team, opponent];
  const answers = answersFor(pair);
  const suggestions = normalizeName(query).length >= 2
    ? players.filter((player) => normalizeName(player.name).includes(normalizeName(query))) : [];
  const open = revealed && Boolean(opponent);
  return (
    <section className="card-glow p-5 sm:p-8 space-y-6">
      <div className="flex justify-between gap-4 font-mono text-xs text-zinc-400">
        <span>{connected ? "ODA BAĞLI" : "BAĞLANIYOR…"}</span>
        <button onClick={onExit} className="hover:text-white">Odadan çık</button>
      </div>
      {host && !open && (
        <div className="rounded-xl border border-neon-cyan/30 p-5 text-center space-y-3">
          <p className="font-mono text-xs text-zinc-400">ODA KODU</p>
          <p className="break-all font-mono text-3xl font-bold tracking-widest text-neon-cyan">{room}</p>
          <button className="font-mono text-sm text-neon-cyan" onClick={async () => {
            try { await navigator.clipboard.writeText(room); setCopied(true); }
            catch { setError("Kod kopyalanamadı. Ekrandaki kodu arkadaşına iletebilirsin."); }
          }}>{copied ? "Kod kopyalandı" : "Kodu kopyala"}</button>
          <p className="text-sm text-zinc-400">Arkadaşın Odaya katıl bölümüne bu kodu yazsın.</p>
        </div>
      )}
      {!open && remaining === null && (
        <>
          <h2 className="text-xl font-black tracking-tight">Takımını gizli seç</h2>
          <p className="font-mono text-sm text-zinc-400">İkiniz de hazır olduğunuzda geri sayım başlayacak.</p>
          <label htmlFor="club" className="block font-mono text-sm">Senin takımın</label>
          <input id="club" list="duel-clubs" autoComplete="off" disabled={locked} className={input}
            value={team} onChange={(event) => setTeam(event.target.value)} placeholder="Takım adı yaz" />
          <datalist id="duel-clubs">{clubs.map((club) => <option key={club} value={club} />)}</datalist>
          <button disabled={!connected || locked} onClick={lock} className={button}>{locked ? "Seçimin kilitlendi" : "Hazırım"}</button>
          <p className="font-mono text-sm text-zinc-400">{peerReady ? "Rakibin hazır · Takımı gizli" : "Rakibin seçimi bekleniyor · Takımı gizli"}</p>
          <p className="text-xs text-zinc-500">Deneme sürümü: oyuncu ve takım havuzu sınırlı.</p>
        </>
      )}
      {!open && remaining !== null && <div aria-live="polite" className="py-12 text-center">
        <p className="font-mono text-neon-cyan">TAKIMLAR AÇILIYOR</p>
        <p className="text-8xl font-black neon-text-green mt-6">{remaining || "…"}</p>
      </div>}
      {open && (
        <>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black">{team}</h2><p className="font-mono text-neon-cyan">×</p>
            <h2 className="text-2xl font-black">{opponent}</h2>
          </div>
          {team === opponent ? <p className="text-neon-yellow">Aynı takımı seçtiniz. Yeni oda açıp tekrar deneyin.</p> : <>
            <label htmlFor="answer" className="block font-mono text-sm">İki takımda da oynamış futbolcuyu bul</label>
            {!solved && <input id="answer" className={input} value={query} onChange={(event) => { setQuery(event.target.value); setResult(""); }} placeholder="Futbolcu adı" />}
            {!solved && suggestions.map((player) => <button key={player.id} className="block w-full text-left rounded-lg bg-pitch-muted p-3" onClick={() => {
              if (answers.some((answer) => answer.id === player.id)) { setResult("Doğru! " + player.name); setSolved(true); }
              else setResult("Bu eşleşme için başka bir futbolcu dene.");
            }}>{player.name}</button>)}
            {!solved && query.length >= 2 && suggestions.length === 0 && <p className="text-zinc-400">Bu isim henüz oyuncu havuzunda yok.</p>}
            <p role="status" className="font-mono text-neon-green">{result}</p>
            {!solved && <button className="font-mono text-sm text-neon-cyan" onClick={() => {
              setSolved(true);
              setResult(answers.length ? "Geçerli cevaplardan biri: " + answers[0].name : "Bu eşleşme için doğrulanmış cevabımız henüz yok.");
            }}>Cevabı göster</button>}
          </>}
          <button className={button} onClick={onExit}>Yeni oyun</button>
        </>
      )}
      {!!error && <p role="alert" className="text-neon-yellow text-sm">{error}</p>}
    </section>
  );
}
