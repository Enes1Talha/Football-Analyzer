import Link from "next/link";
import { Activity } from "lucide-react";
import GameLobby from "@/components/game/GameLobby";

export default function PlayPage() {
  return <main className="min-h-screen bg-pitch-black text-white">
    <header className="border-b border-pitch-border bg-pitch-dark/80">
      <nav aria-label="Ana menü" className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-sm font-bold tracking-tight"><Activity className="text-neon-green" size={20} /><span>Football<span className="neon-text-green">Analyzer</span></span></Link>
        <div className="flex gap-5 font-mono text-xs"><Link href="/" className="text-zinc-400 hover:text-white">Karşılaştır</Link><Link href="/oyna" aria-current="page" className="text-neon-green">Oyna</Link></div>
      </nav>
    </header>
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div aria-hidden="true" className="inline-flex items-center gap-2 rounded-2xl border border-neon-green/30 bg-neon-green/5 px-5 py-3 font-mono text-2xl font-black text-neon-green"><span>3</span><span className="text-neon-cyan">·</span><span>2</span><span className="text-neon-cyan">·</span><span>1</span></div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">İKİ KULÜP.<br /><span className="neon-text-green">BİR İSİM.</span></h1>
      <p className="text-zinc-500 text-sm font-mono">Takımını gizle · Birlikte aç · Ortak futbolcuyu bul</p>
      <GameLobby />
    </div>
  </main>;
}
