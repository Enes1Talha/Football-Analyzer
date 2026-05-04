"use client";

import Image from "next/image";
import { TeamInfo } from "@/types/football";
import { Swords } from "lucide-react";

interface H2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeId: number;
  awayId: number;
  homeScore: number;
  awayScore: number;
}

interface HeadToHeadProps {
  teamA: TeamInfo;
  teamB: TeamInfo;
  matches: H2HMatch[];
}

export default function HeadToHead({ teamA, teamB, matches }: HeadToHeadProps) {
  const aWins = matches.filter((m) => {
    const aIsHome = m.homeId === teamA.id;
    return aIsHome ? m.homeScore > m.awayScore : m.awayScore > m.homeScore;
  }).length;

  const bWins = matches.filter((m) => {
    const bIsHome = m.homeId === teamB.id;
    return bIsHome ? m.homeScore > m.awayScore : m.awayScore > m.homeScore;
  }).length;

  const draws = matches.length - aWins - bWins;

  const total = matches.length || 1;
  const pctA = Math.round((aWins / total) * 100);
  const pctB = Math.round((bWins / total) * 100);
  const pctD = 100 - pctA - pctB;

  return (
    <div className="card-glow p-6 space-y-5 animate-slide-up">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <Swords size={16} className="text-neon-yellow flex-shrink-0" />
        <div>
          <p className="section-label">Head to Head</p>
          <h3 className="text-base font-bold tracking-tight mt-0.5">
            Son {matches.length} Karşılaşma
          </h3>
        </div>
      </div>

      {/* Özet bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-neon-green font-bold">{aWins} Galibiyet</span>
          <span className="text-zinc-500">{draws} Beraberlik</span>
          <span className="text-neon-cyan font-bold">{bWins} Galibiyet</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-pitch-muted">
          <div className="h-full bg-neon-green transition-all duration-700" style={{ width: `${pctA}%` }} />
          <div className="h-full bg-zinc-600 transition-all duration-700" style={{ width: `${pctD}%` }} />
          <div className="h-full bg-neon-cyan transition-all duration-700" style={{ width: `${pctB}%` }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
          <span>{teamA.name}</span>
          <span>{teamB.name}</span>
        </div>
      </div>

      {/* Maç listesi */}
      <div className="space-y-2">
        {matches.map((m, i) => {
          const aIsHome = m.homeId === teamA.id;
          const aScore = aIsHome ? m.homeScore : m.awayScore;
          const bScore = aIsHome ? m.awayScore : m.homeScore;
          const winner = aScore > bScore ? "a" : bScore > aScore ? "b" : "d";

          return (
            <div key={i} className="flex items-center gap-3 bg-pitch-dark border border-pitch-border rounded px-3 py-2">
              <span className="text-[10px] font-mono text-zinc-600 w-14 flex-shrink-0">
                {new Date(m.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "2-digit" })}
              </span>

              <div className="flex items-center gap-2 flex-1 justify-end">
                {teamA.logo && (
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Image src={teamA.logo} alt={teamA.name} fill className="object-contain" unoptimized />
                  </div>
                )}
                <span className={`text-xs font-mono truncate ${winner === "a" ? "text-white font-bold" : "text-zinc-500"}`}>
                  {teamA.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-sm font-bold font-mono w-4 text-right ${winner === "a" ? "text-neon-green" : "text-zinc-400"}`}>{aScore}</span>
                <span className="text-zinc-600 text-xs">–</span>
                <span className={`text-sm font-bold font-mono w-4 text-left ${winner === "b" ? "text-neon-cyan" : "text-zinc-400"}`}>{bScore}</span>
              </div>

              <div className="flex items-center gap-2 flex-1 justify-start">
                <span className={`text-xs font-mono truncate ${winner === "b" ? "text-white font-bold" : "text-zinc-500"}`}>
                  {teamB.name}
                </span>
                {teamB.logo && (
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Image src={teamB.logo} alt={teamB.name} fill className="object-contain" unoptimized />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
