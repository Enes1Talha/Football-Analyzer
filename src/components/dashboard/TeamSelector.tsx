"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import TeamSearchInput from "@/components/ui/TeamSearchInput";

interface TeamResult {
  id: number;
  name: string;
  logo: string;
  country: string;
}

const POPULAR_LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 78, name: "Bundesliga" },
  { id: 135, name: "Serie A" },
  { id: 61, name: "Ligue 1" },
  { id: 2, name: "Champions League" },
  { id: 203, name: "Süper Lig" },
  { id: 94, name: "Primeira Liga" },
];

const SEASONS = [2024, 2023, 2022, 2021, 2020];

interface TeamSelectorProps {
  onSearch: (teamA: string, teamB: string, league: string, season: string) => void;
  loading: boolean;
}

export default function TeamSelector({ onSearch, loading }: TeamSelectorProps) {
  const [teamA, setTeamA] = useState<TeamResult | null>(null);
  const [teamB, setTeamB] = useState<TeamResult | null>(null);
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState("2023");

  const selectCls =
    "bg-pitch-dark border border-pitch-border rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-zinc-600 transition-colors w-full appearance-none";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teamA || !teamB) return;
    onSearch(String(teamA.id), String(teamB.id), league, season);
  }

  const ready = teamA && teamB && !loading;

  return (
    <form onSubmit={handleSubmit} className="card-glow p-4 space-y-4">
      <p className="section-label">Karşılaşma Seç</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeamSearchInput
          label="Ev Sahibi Takım"
          onSelect={setTeamA}
          accentColor="#39FF14"
        />
        <TeamSearchInput
          label="Deplasman Takımı"
          onSelect={setTeamB}
          accentColor="#00FFFF"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
            Lig
          </label>
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className={selectCls}
          >
            {POPULAR_LEAGUES.map((l) => (
              <option key={l.id} value={l.id} className="bg-pitch-dark">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
            Sezon
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className={selectCls}
          >
            {SEASONS.map((s) => (
              <option key={s} value={s} className="bg-pitch-dark">
                {s}/{String(s + 1).slice(2)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(!teamA || !teamB) && (
        <p className="text-[11px] font-mono text-zinc-600">
          {!teamA && !teamB
            ? "Her iki takımı da seç"
            : !teamA
            ? "Ev sahibi takımı seç"
            : "Deplasman takımını seç"}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!ready}
          className="flex items-center gap-2 px-5 py-2 rounded font-mono text-sm font-bold tracking-wider uppercase transition-all
            bg-neon-green/10 text-neon-green border border-neon-green/30
            hover:bg-neon-green/20 hover:border-neon-green/60
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Search size={14} />
          {loading ? "Yükleniyor..." : "Analiz Et"}
        </button>
      </div>
    </form>
  );
}
