"use client";

import Image from "next/image";
import { TeamInfo } from "@/types/football";
import { Swords } from "lucide-react";

interface VsHeaderProps {
  teamA: TeamInfo;
  teamB: TeamInfo;
  leagueName?: string;
  leagueLogo?: string;
  season?: number;
}

export default function VsHeader({ teamA, teamB, leagueName, leagueLogo, season }: VsHeaderProps) {
  return (
    <div className="card-glow p-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">

        {/* Team A */}
        <div className="flex flex-col items-center gap-3 flex-1">
          {teamA.logo ? (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
              <Image src={teamA.logo} alt={teamA.name} fill className="object-contain" unoptimized />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pitch-muted" />
          )}
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-center leading-tight neon-text-green">
            {teamA.name}
          </h2>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {leagueLogo && (
            <div className="relative w-8 h-8">
              <Image src={leagueLogo} alt={leagueName ?? "League"} fill className="object-contain opacity-70" unoptimized />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-zinc-600" />
            <span className="text-xl font-black font-mono text-zinc-500 tracking-widest">VS</span>
            <Swords size={18} className="text-zinc-600 scale-x-[-1]" />
          </div>
          {leagueName && (
            <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase text-center">
              {leagueName}
              {season && <span className="text-zinc-600"> · {season}/{String(season + 1).slice(2)}</span>}
            </p>
          )}
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-3 flex-1">
          {teamB.logo ? (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
              <Image src={teamB.logo} alt={teamB.name} fill className="object-contain" unoptimized />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pitch-muted" />
          )}
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-center leading-tight neon-text-cyan">
            {teamB.name}
          </h2>
        </div>

      </div>
    </div>
  );
}
