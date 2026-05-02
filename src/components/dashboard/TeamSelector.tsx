"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface TeamSelectorProps {
  labelA: string;
  labelB: string;
  teamA: string;
  teamB: string;
  league: string;
  season: string;
  onSearch: (teamA: string, teamB: string, league: string, season: string) => void;
  loading: boolean;
}

export default function TeamSelector({
  labelA,
  labelB,
  teamA,
  teamB,
  league,
  season,
  onSearch,
  loading,
}: TeamSelectorProps) {
  const [a, setA] = useState(teamA);
  const [b, setB] = useState(teamB);
  const [l, setL] = useState(league);
  const [s, setS] = useState(season);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(a, b, l, s);
  };

  const inputCls =
    "bg-pitch-dark border border-pitch-border rounded px-3 py-2 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-neon-green/50 transition-colors w-full";

  return (
    <form onSubmit={handleSubmit} className="card-glow p-4">
      <p className="section-label mb-4">Configure Match-up</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
            {labelA} ID
          </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="e.g. 50"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
            {labelB} ID
          </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="e.g. 42"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
            League ID
          </label>
          <input
            type="number"
            value={l}
            onChange={(e) => setL(e.target.value)}
            placeholder="e.g. 39"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
            Season
          </label>
          <input
            type="number"
            value={s}
            onChange={(e) => setS(e.target.value)}
            placeholder="e.g. 2023"
            className={inputCls}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 rounded font-mono text-sm font-bold tracking-wider uppercase transition-all
            bg-neon-green/10 text-neon-green border border-neon-green/30
            hover:bg-neon-green/20 hover:border-neon-green/60
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Search size={14} />
          {loading ? "Loading..." : "Analyze"}
        </button>
      </div>
    </form>
  );
}
