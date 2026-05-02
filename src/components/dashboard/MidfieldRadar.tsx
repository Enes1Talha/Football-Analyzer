"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { TeamMidfieldStats } from "@/types/football";
import StatBar from "@/components/ui/StatBar";

interface MidfieldRadarProps {
  teamA: TeamMidfieldStats;
  teamB: TeamMidfieldStats;
}

const METRIC_LABELS: Record<string, string> = {
  passAccuracy: "Pass %",
  tackles: "Tackles",
  interceptions: "Intercept.",
  keyPasses: "Key Passes",
  duelsWon: "Duels Won",
  dribbles: "Dribbles",
};

const COLOR_A = "#39FF14";
const COLOR_B = "#00FFFF";

export default function MidfieldRadar({ teamA, teamB }: MidfieldRadarProps) {
  const radarData = Object.entries(METRIC_LABELS).map(([key, label]) => ({
    metric: label,
    [teamA.team.name]: teamA.averageMetrics[key as keyof typeof teamA.averageMetrics],
    [teamB.team.name]: teamB.averageMetrics[key as keyof typeof teamB.averageMetrics],
  }));

  return (
    <div className="card-glow p-6 space-y-6 animate-slide-up">
      <div>
        <p className="section-label">Midfield Engine</p>
        <h3 className="text-base font-bold mt-1 tracking-tight">
          Midfield Performance Comparison
        </h3>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          Avg. metrics per player — No. 6, 8 &amp; 10 profiles
        </p>
      </div>

      {/* Radar Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              tick={{ fill: "#374151", fontSize: 9 }}
              axisLine={false}
            />
            <Radar
              name={teamA.team.name}
              dataKey={teamA.team.name}
              stroke={COLOR_A}
              fill={COLOR_A}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Radar
              name={teamB.team.name}
              dataKey={teamB.team.name}
              stroke={COLOR_B}
              fill={COLOR_B}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                fontFamily: "monospace",
                paddingTop: "8px",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111111",
                border: "1px solid #1E1E1E",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#fff",
              }}
              labelStyle={{ color: "#9ca3af", marginBottom: "4px" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stat Bars */}
      <div className="space-y-3 pt-2 border-t border-pitch-border">
        <p className="section-label">Metric Breakdown</p>
        {Object.entries(METRIC_LABELS).map(([key, label]) => (
          <StatBar
            key={key}
            label={label}
            valueA={teamA.averageMetrics[key as keyof typeof teamA.averageMetrics]}
            valueB={teamB.averageMetrics[key as keyof typeof teamB.averageMetrics]}
            colorA={COLOR_A}
            colorB={COLOR_B}
          />
        ))}
      </div>

      {/* Player Roster */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-pitch-border">
        {[
          { stats: teamA, color: COLOR_A },
          { stats: teamB, color: COLOR_B },
        ].map(({ stats, color }) => (
          <div key={stats.team.id}>
            <p className="section-label mb-2">{stats.team.name}</p>
            <div className="space-y-1.5">
              {stats.players.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 text-xs font-mono"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{
                      backgroundColor: `${color}18`,
                      color,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    {p.number || "?"}
                  </span>
                  <span className="text-zinc-400 truncate">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
