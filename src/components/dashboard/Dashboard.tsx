"use client";

import { useState, useCallback } from "react";
import { Activity, Zap, Github } from "lucide-react";
import TeamFormPanel from "./TeamFormPanel";
import MidfieldRadar from "./MidfieldRadar";
import VsHeader from "./VsHeader";
import FanPulse from "./FanPulse";
import TacticalBoard from "./TacticalBoard";
import TeamSelector from "./TeamSelector";
import ErrorBanner from "./ErrorBanner";
import Spinner from "@/components/ui/Spinner";
import Footer from "@/components/ui/Footer";
import HeadToHead from "./HeadToHead";
import Standings from "./Standings";
import { ComparisonData } from "@/types/football";


interface ApiError {
  error: string;
  detail?: string;
  hint?: string;
}

export default function Dashboard() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = useCallback(
    async (teamA: string, teamB: string, league: string, season: string, teamAName = "Team A", teamBName = "Team B") => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ teamA, teamB, league, season, teamAName, teamBName });
        const res = await fetch(`/api/football/comparison?${params}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json as ApiError);
          setData(null);
        } else {
          setData(json as ComparisonData);
        }
      } catch {
        setError({ error: "Network error", detail: "Could not reach the API." });
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-pitch-black">
      {/* ── Top nav ── */}
      <header className="border-b border-pitch-border bg-pitch-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity size={20} className="text-neon-green" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
            </div>
            <span className="font-bold tracking-tight text-sm">
              Football<span className="neon-text-green">Analyzer</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block section-label">
              Powered by API-Football
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="flex items-start gap-4 mb-2">
          <Zap size={28} className="text-neon-green mt-1 flex-shrink-0" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">
              FOOTBALL DATA
              <br />
              <span className="neon-text-green">&amp; FORM ANALYZER</span>
            </h1>
            <p className="text-zinc-500 text-sm font-mono mt-2">
              Real-time team form · Midfield engine comparison · Last 5 results
            </p>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-16 space-y-4 sm:space-y-6">
        {/* Team selector */}
        <TeamSelector
          onSearch={fetchData}
          loading={loading}
        />

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size={40} />
            <p className="text-zinc-500 font-mono text-sm animate-pulse">
              Veri çekiliyor...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <ErrorBanner
            message={error.error}
            hint={error.hint ?? error.detail}
          />
        )}

        {/* Empty state */}
        {!loading && !error && !hasFetched && (
          <div className="card-glow p-12 text-center">
            <Activity size={48} className="mx-auto mb-4 text-pitch-muted" />
            <p className="text-zinc-500 font-mono text-sm">
              Enter two team IDs and click{" "}
              <span className="text-neon-green font-bold">Analyze</span> to
              load the dashboard.
            </p>
            <p className="text-zinc-600 text-xs font-mono mt-2">
              Default: Man City (50) vs Arsenal (42) · Premier League (39) ·
              2023/24
            </p>
          </div>
        )}

        {/* Data panels */}
        {!loading && data && (
          <>
            {/* VS Header */}
            <VsHeader
              teamA={data.teamA.team}
              teamB={data.teamB.team}
              leagueName={data.teamA.fixtures[0]?.leagueName}
              leagueLogo={data.teamA.fixtures[0]?.leagueLogo}
            />

            {/* Form comparison */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-pitch-border" />
                <span className="section-label px-3">Team Form</span>
                <div className="h-px flex-1 bg-pitch-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TeamFormPanel
                  data={data.teamA}
                  accentColor="#39FF14"
                  side="left"
                />
                <TeamFormPanel
                  data={data.teamB}
                  accentColor="#00FFFF"
                  side="right"
                />
              </div>
            </div>

            {/* Midfield comparison */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-pitch-border" />
                <span className="section-label px-3">Midfield Engine</span>
                <div className="h-px flex-1 bg-pitch-border" />
              </div>
              <MidfieldRadar
                teamA={data.midfieldA}
                teamB={data.midfieldB}
              />
            </div>

            {/* Head to Head + Standings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-pitch-border" />
                  <span className="section-label px-3">Head to Head</span>
                  <div className="h-px flex-1 bg-pitch-border" />
                </div>
                <HeadToHead
                  teamA={data.teamA.team}
                  teamB={data.teamB.team}
                  matches={data.h2h}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-pitch-border" />
                  <span className="section-label px-3">Puan Durumu</span>
                  <div className="h-px flex-1 bg-pitch-border" />
                </div>
                <Standings
                  leagueName={data.standings.leagueName}
                  leagueLogo={data.standings.leagueLogo}
                  season={data.standings.season}
                  rows={data.standings.rows}
                  highlightIds={[data.teamA.team.id, data.teamB.team.id]}
                />
              </div>
            </div>

            {/* Fan Pulse */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-pitch-border" />
                <span className="section-label px-3">Taraftar Nabzı</span>
                <div className="h-px flex-1 bg-pitch-border" />
              </div>
              <FanPulse
                teamA={{ id: data.teamA.team.id, name: data.teamA.team.name }}
                teamB={{ id: data.teamB.team.id, name: data.teamB.team.name }}
              />
            </div>

            {/* Taktik Tahtası */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-pitch-border" />
                <span className="section-label px-3">Taktik Tahtası</span>
                <div className="h-px flex-1 bg-pitch-border" />
              </div>
              <TacticalBoard
                teamAName={data.teamA.team.name}
                teamBName={data.teamB.team.name}
              />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
