"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
import { StandingRow } from "@/types/football";

interface StandingsProps {
  leagueName: string;
  leagueLogo?: string;
  season: number;
  rows: StandingRow[];
  highlightIds: number[];
}

export default function Standings({ leagueName, leagueLogo, season, rows, highlightIds }: StandingsProps) {
  return (
    <div className="card-glow p-6 space-y-5 animate-slide-up">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <Trophy size={16} className="text-neon-yellow flex-shrink-0" />
        <div className="flex-1">
          <p className="section-label">Puan Durumu</p>
          <h3 className="text-base font-bold tracking-tight mt-0.5">
            {leagueName} · {season}/{String(season + 1).slice(2)}
          </h3>
        </div>
        {leagueLogo && (
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src={leagueLogo} alt={leagueName} fill className="object-contain opacity-80" unoptimized />
          </div>
        )}
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-zinc-600 border-b border-pitch-border">
              <th className="text-left pb-2 w-6">#</th>
              <th className="text-left pb-2">Takım</th>
              <th className="text-center pb-2 w-8">O</th>
              <th className="text-center pb-2 w-8">G</th>
              <th className="text-center pb-2 w-8">B</th>
              <th className="text-center pb-2 w-8">M</th>
              <th className="text-center pb-2 w-10">AG</th>
              <th className="text-center pb-2 w-8 text-white font-bold">P</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isHighlighted = highlightIds.includes(row.teamId);
              const gd = row.gf - row.ga;

              return (
                <tr
                  key={row.teamId}
                  className={`border-b border-pitch-border/40 last:border-0 transition-colors ${
                    isHighlighted ? "bg-pitch-muted/50" : "hover:bg-pitch-dark/50"
                  }`}
                >
                  <td className="py-2 text-zinc-500">{row.rank}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      {row.teamLogo ? (
                        <div className="relative w-4 h-4 flex-shrink-0">
                          <Image src={row.teamLogo} alt={row.teamName} fill className="object-contain" unoptimized />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-pitch-muted flex-shrink-0" />
                      )}
                      <span className={`truncate max-w-[100px] sm:max-w-none ${isHighlighted ? "text-white font-bold" : "text-zinc-300"}`}>
                        {row.teamName}
                      </span>
                      {isHighlighted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-green flex-shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="py-2 text-center text-zinc-500">{row.played}</td>
                  <td className="py-2 text-center text-zinc-400">{row.won}</td>
                  <td className="py-2 text-center text-zinc-400">{row.drawn}</td>
                  <td className="py-2 text-center text-zinc-400">{row.lost}</td>
                  <td className={`py-2 text-center ${gd > 0 ? "text-neon-green" : gd < 0 ? "text-neon-red" : "text-zinc-500"}`}>
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className={`py-2 text-center font-bold ${isHighlighted ? "text-white" : "text-zinc-300"}`}>
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
