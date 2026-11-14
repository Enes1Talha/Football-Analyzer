"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import Duel from "@/components/game/Duel";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function createRoomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}

export default function PlayPage() {
  const [room, setRoom] = useState<string | null>(null);
  const [invite, setInvite] = useState<string | null>(null);
  const [host, setHost] = useState(false);
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("room");
    if (id && (/^[A-HJ-NP-Z2-9]{8}$/.test(id) || /^[0-9a-f-]{36}$/.test(id))) {
      setInvite(id);
      setCode(id);
      setJoining(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-pitch-black text-white">
      <header className="border-b border-pitch-border bg-pitch-dark/80">
        <nav aria-label="Ana menü" className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold tracking-tight">
            <Activity className="text-neon-green" size={20} />
            <span>Football<span className="neon-text-green">Analyzer</span></span>
          </Link>
          <div className="flex gap-5 font-mono text-xs">
            <Link href="/" className="text-zinc-400 hover:text-white">Karşılaştır</Link>
            <Link href="/oyna" aria-current="page" className="text-neon-green">Oyna</Link>
          </div>
        </nav>
      </header>
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <div aria-hidden="true" className="inline-flex items-center gap-2 rounded-2xl border border-neon-green/30 bg-neon-green/5 px-5 py-3 font-mono text-2xl font-black text-neon-green">
          <span>3</span><span className="text-neon-cyan">·</span><span>2</span><span className="text-neon-cyan">·</span><span>1</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">İKİ KULÜP.<br /><span className="neon-text-green">BİR İSİM.</span></h1>
        <p className="text-zinc-500 text-sm font-mono">Takımını gizle · Birlikte aç · Ortak futbolcuyu bul</p>
        {room ? <Duel key={room} room={room} host={host} onExit={() => {
          setRoom(null); setInvite(null); setCode(""); setJoining(false); setError(""); history.replaceState(null, "", "/oyna");
        }} /> : (
          <section className="card-glow p-6 space-y-6">
            <p className="text-zinc-400 leading-relaxed">Arkadaşınla kendi cihazlarından katılın. Birer takım seçin. İkiniz de hazır olunca 3, 2, 1… takımlar açılsın!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="rounded-lg bg-neon-green p-4 font-mono font-bold text-black" onClick={() => {
                setHost(true); setRoom(createRoomCode());
              }}>Oda aç</button>
              <button aria-expanded={joining} className="rounded-lg border border-neon-cyan/40 p-4 font-mono font-bold text-neon-cyan" onClick={() => setJoining(true)}>Odaya katıl</button>
            </div>
            {joining && <form className="space-y-3" onSubmit={(event) => {
              event.preventDefault();
              const normalized = code.trim().toUpperCase().replace(/[\s-]/g, "");
              const legacy = invite && code === invite && /^[0-9a-f-]{36}$/.test(invite);
              if (!legacy && !/^[A-HJ-NP-Z2-9]{8}$/.test(normalized)) {
                setError("8 karakterlik oda kodunu gir.");
                return;
              }
              setError(""); setHost(false); setRoom(legacy ? invite : normalized);
            }}>
              <label htmlFor="room-code" className="block font-mono text-sm text-zinc-400">Oda kodu</label>
              <input id="room-code" autoComplete="off" autoCapitalize="characters" spellCheck={false}
                value={code} onChange={(event) => { setCode(event.target.value); setError(""); }}
                placeholder="Örn. AB3D7K9M" className="w-full rounded-lg border border-pitch-border bg-pitch-dark p-4 font-mono tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-neon-cyan" />
              {!!error && <p role="alert" className="text-sm text-neon-yellow">{error}</p>}
              <button className="w-full rounded-lg bg-neon-cyan p-3 font-mono font-bold text-black">Katıl</button>
            </form>}
          </section>
        )}
      </div>
    </main>
  );
}
