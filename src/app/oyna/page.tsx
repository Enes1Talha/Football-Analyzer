"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import Duel from "@/components/game/Duel";

export default function PlayPage() {
  const [room, setRoom] = useState<string | null>(null);
  const [invite, setInvite] = useState<string | null>(null);
  const [host, setHost] = useState(false);
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("room");
    if (id && /^[0-9a-f-]{36}$/.test(id)) setInvite(id);
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
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">İKİ KULÜP.<br /><span className="neon-text-green">BİR İSİM.</span></h1>
        <p className="text-zinc-500 text-sm font-mono">Takımını gizle · Birlikte aç · Ortak futbolcuyu bul</p>
        {room ? <Duel key={room} room={room} host={host} onExit={() => {
          setRoom(null); setInvite(null); history.replaceState(null, "", "/oyna");
        }} /> : (
          <section className="card-glow p-6 space-y-6">
            <p className="text-zinc-400 leading-relaxed">Arkadaşınla kendi cihazlarından katılın. Birer takım seçin. İkiniz de hazır olunca 3, 2, 1… takımlar açılsın!</p>
            <button className="w-full rounded-lg bg-neon-green p-4 font-mono font-bold text-black" onClick={() => {
              setHost(!invite); setRoom(invite ?? crypto.randomUUID());
            }}>{invite ? "Oyuna katıl" : "Oyunu başlat"}</button>
            <p className="font-mono text-xs text-zinc-500">İki oyuncu · Davet bağlantısı · Süresiz cevap</p>
          </section>
        )}
      </div>
    </main>
  );
}
