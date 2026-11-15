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

const SEASONS = [2025, 2024, 2023, 2022, 2021, 2020];

interface TeamSelectorProps {
  onSearch: (teamA: string, teamB: string, league: string, season: string, teamAName: string, teamBName: string) => void;
  loading: boolean;
  onSelectionChange: () => void;
}

export default function TeamSelector({ onSearch, loading, onSelectionChange }: TeamSelectorProps) {
  const [teamA, setTeamA] = useState<TeamResult | null>(null);
  const [teamB, setTeamB] = useState<TeamResult | null>(null);
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState("2024");

  const selectCls =
    "bg-pitch-dark border border-pitch-border rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-zinc-600 transition-colors w-full appearance-none";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teamA || !teamB || loading || league !== "39" || teamA.id === teamB.id) return;
    onSearch(String(teamA.id), String(teamB.id), league, season, teamA.name, teamB.name);
  }

  const ready = teamA && teamB && !loading;
  const countries: Record<string, string> = { England: "39", Spain: "140", Germany: "78", Italy: "135", France: "61", Turkey: "203" };
  function selectTeam(team: TeamResult | null, side: "a" | "b") {
    onSelectionChange();
    if (side === "a") setTeamA(team);
    else setTeamB(team);
    if (team && countries[team.country]) setLeague(countries[team.country]);
  }

  return (
    <form onSubmit={handleSubmit} className="card-glow p-4 space-y-4">
      <p className="section-label">Karşılaşma Seç</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeamSearchInput
          label="Ev Sahibi Takım"
          onSelect={(team) => selectTeam(team, "a")}
          accentColor="#39FF14"
        />
        <TeamSearchInput
          label="Deplasman Takımı"
          onSelect={(team) => selectTeam(team, "b")}
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
            onChange={(e) => { setLeague(e.target.value); onSelectionChange(); }}
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
            onChange={(e) => { setSeason(e.target.value); onSelectionChange(); }}
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

      {league !== "39" && <p className="text-sm font-mono text-neon-yellow">Bu ligin maç verileri henüz yüklenmedi. Şu anda Premier League karşılaştırmaları kullanılabilir.</p>}
      {teamA && teamB && teamA.id === teamB.id && <p className="text-sm text-neon-yellow">Karşılaştırmak için iki farklı takım seç.</p>}
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
          disabled={!ready || league !== "39" || teamA?.id === teamB?.id}
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
