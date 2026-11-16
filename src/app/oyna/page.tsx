import Link from "next/link";
import { Activity } from "lucide-react";
import GameLobby from "@/components/game/GameLobby";
import GameMark from "@/components/game/GameMark";

export default function PlayPage() {
  return <main className="min-h-screen bg-pitch-black text-white">
    <header className="border-b border-pitch-border bg-pitch-dark/80">
      <nav aria-label="Ana menü" className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-sm font-bold tracking-tight"><Activity className="text-neon-green" size={20} /><span>Football<span className="neon-text-green">Analyzer</span></span></Link>
        <div className="flex gap-5 font-mono text-xs"><Link href="/analiz" className="text-zinc-400 hover:text-white">Karşılaştır</Link><Link href="/oyna" aria-current="page" className="text-neon-green">Oyna</Link></div>
      </nav>
    </header>
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <GameMark className="h-24 w-[89px] drop-shadow-[0_0_16px_rgba(57,255,20,0.18)]" />
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">İKİ KULÜP.<br /><span className="neon-text-green">BİR İSİM.</span></h1>
      <p className="text-zinc-500 text-sm font-mono">Takımını gizle · Birlikte aç · Ortak futbolcuyu bul</p>
      <GameLobby />
    </div>
  </main>;
}
