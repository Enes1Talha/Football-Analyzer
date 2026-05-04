"use client";

import Image from "next/image";
import { TeamFormData } from "@/types/football";
import ResultBadge from "@/components/ui/ResultBadge";
import { Goal, Shield, TrendingUp } from "lucide-react";

interface TeamFormPanelProps {
  data: TeamFormData;
  accentColor: string;
  side: "left" | "right";
}

export default function TeamFormPanel({
  data,
  accentColor,
  side,
}: TeamFormPanelProps) {
  const isRight = side === "right";

  return (
    <div className="card-glow p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div
        className={`flex items-center gap-4 ${isRight ? "flex-row-reverse" : ""}`}
      >
        {data.team.logo ? (
          <div className="relative w-14 h-14 flex-shrink-0">
            <Image
              src={data.team.logo}
              alt={data.team.name}
              fill
              className="object-contain drop-shadow-lg"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-pitch-muted flex items-center justify-center flex-shrink-0">
            <Shield size={24} style={{ color: accentColor }} />
          </div>
        )}
        <div className={isRight ? "text-right" : ""}>
          <h2 className="text-lg font-bold tracking-tight leading-tight">
            {data.team.name}
          </h2>
          <p className="section-label mt-0.5">Last 5 matches</p>
        </div>
      </div>

      {/* Form String */}
      <div>
        <p className="section-label mb-3">Recent Form</p>
        <div
          className={`flex items-center gap-2 ${isRight ? "flex-row-reverse justify-end" : ""}`}
        >
          {data.formString.map((r, i) => (
            <ResultBadge key={i} result={r} size="lg" index={i} />
          ))}
          {data.formString.length === 0 && (
            <span className="text-zinc-600 text-sm font-mono">No data</span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div
        className={`grid grid-cols-3 gap-3 ${isRight ? "direction-rtl" : ""}`}
      >
        {[
          { label: "Wins", value: data.wins, icon: TrendingUp },
          { label: "Draws", value: data.draws, icon: Shield },
          { label: "Losses", value: data.losses, icon: Goal },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-pitch-dark border border-pitch-border rounded-lg p-3 text-center"
          >
            <Icon size={14} className="mx-auto mb-1 text-zinc-500" />
            <div
              className="text-xl font-bold font-mono"
              style={{ color: accentColor }}
            >
              {value}
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-pitch-dark border border-pitch-border rounded-lg p-3 text-center">
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: accentColor }}
          >
            {data.goalsScored}
          </div>
          <div className="section-label mt-1">Scored</div>
        </div>
        <div className="bg-pitch-dark border border-pitch-border rounded-lg p-3 text-center">
          <div className="text-2xl font-bold font-mono text-zinc-400">
            {data.goalsConceded}
          </div>
          <div className="section-label mt-1">Conceded</div>
        </div>
      </div>

      {/* Fixture List */}
      <div>
        <p className="section-label mb-3">Match Log</p>
        <div className="space-y-2">
          {data.fixtures.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between bg-pitch-dark border border-pitch-border rounded px-3 py-2 text-xs font-mono"
            >
              <ResultBadge result={f.result} size="sm" />
              <span className="text-zinc-400 mx-2 flex-1 text-center truncate">
                {f.homeTeam.name}{" "}
                <span className="text-white font-bold">
                  {f.score.home ?? "?"}–{f.score.away ?? "?"}
                </span>{" "}
                {f.awayTeam.name}
              </span>
              <span className="text-zinc-600 text-[10px]">
                {new Date(f.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
