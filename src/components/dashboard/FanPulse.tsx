"use client";

import { useState, useEffect } from "react";
import { Zap, CheckCircle } from "lucide-react";

interface FanPulseProps {
  teamA: { id: number; name: string };
  teamB: { id: number; name: string };
}

interface VoteResult {
  a: number;
  b: number;
}

function storageKey(teamA: number, teamB: number) {
  return `fanpulse_${Math.min(teamA, teamB)}_${Math.max(teamA, teamB)}`;
}

export default function FanPulse({ teamA, teamB }: FanPulseProps) {
  const [voted, setVoted] = useState<"a" | "b" | null>(null);
  const [result, setResult] = useState<VoteResult | null>(null);
  const [loading, setLoading] = useState(false);

  // localStorage'dan önceki oy kontrolü
  useEffect(() => {
    const stored = localStorage.getItem(storageKey(teamA.id, teamB.id));
    if (stored === "a" || stored === "b") {
      setVoted(stored);
      fetchResult();
    }
  }, [teamA.id, teamB.id]);

  async function fetchResult() {
    const res = await fetch(`/api/vote?teamA=${teamA.id}&teamB=${teamB.id}`);
    const data = await res.json() as VoteResult;
    setResult(data);
  }

  async function handleVote(choice: "a" | "b") {
    if (voted || loading) return;
    setLoading(true);

    const res = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamA: teamA.id, teamB: teamB.id, vote: choice }),
    });

    const data = await res.json() as VoteResult;
    setResult(data);
    setVoted(choice);
    localStorage.setItem(storageKey(teamA.id, teamB.id), choice);
    setLoading(false);
  }

  const total = result ? result.a + result.b : 0;
  const pctA = total > 0 ? Math.round((result!.a / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="card-glow p-6 space-y-5 animate-slide-up">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <Zap size={18} className="text-neon-yellow flex-shrink-0" />
        <div>
          <p className="section-label">Fan Pulse · Taraftar Nabzı</p>
          <h3 className="text-base font-bold tracking-tight mt-0.5">
            Sence Orta Sahayı Kim Domine Eder?
          </h3>
        </div>
        {total > 0 && (
          <span className="ml-auto text-[10px] font-mono text-zinc-500">
            {total} oy
          </span>
        )}
      </div>

      {/* Oy verilmeden önce */}
      {!voted && (
        <div className="grid grid-cols-2 gap-3">
          {(["a", "b"] as const).map((side) => {
            const team = side === "a" ? teamA : teamB;
            const color = side === "a" ? "#39FF14" : "#00FFFF";
            return (
              <button
                key={side}
                onClick={() => handleVote(side)}
                disabled={loading}
                className="relative group rounded-lg border border-pitch-border bg-pitch-dark p-5 text-center transition-all duration-200 disabled:opacity-50 overflow-hidden"
                style={{ ["--accent" as string]: color }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
                  style={{ background: `radial-gradient(ellipse at center, ${color}10 0%, transparent 70%)` }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: color }}
                />
                <p
                  className="font-bold text-lg tracking-tight transition-colors duration-200 group-hover:text-white relative z-10"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = color)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                >
                  {team.name}
                </p>
                <p className="text-[10px] font-mono text-zinc-500 mt-1 relative z-10 tracking-widest uppercase">
                  Oy ver
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Oy verildikten sonra */}
      {voted && result && (
        <div className="space-y-4">
          {(["a", "b"] as const).map((side) => {
            const team = side === "a" ? teamA : teamB;
            const pct = side === "a" ? pctA : pctB;
            const color = side === "a" ? "#39FF14" : "#00FFFF";
            const isChosen = voted === side;

            return (
              <div key={side} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-mono">
                  <div className="flex items-center gap-2">
                    {isChosen && (
                      <CheckCircle size={13} style={{ color }} />
                    )}
                    <span className={isChosen ? "font-bold text-white" : "text-zinc-400"}>
                      {team.name}
                    </span>
                    {isChosen && (
                      <span className="text-[10px] tracking-widest uppercase" style={{ color }}>
                        · Senin oyun
                      </span>
                    )}
                  </div>
                  <span className="font-bold" style={{ color: isChosen ? color : "#6b7280" }}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-pitch-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color,
                      boxShadow: isChosen ? `0 0 8px ${color}80` : "none",
                    }}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-[10px] font-mono text-zinc-600 text-center pt-1">
            Bu cihazdan oy kullandınız · Sonuçlar anlık güncellenir
          </p>
        </div>
      )}
    </div>
  );
}
