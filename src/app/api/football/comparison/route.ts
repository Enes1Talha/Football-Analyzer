import { NextRequest, NextResponse } from "next/server";
import { getMockComparison } from "@/lib/mock-data";
import {
  fetchTeamFormFromSupabase,
  fetchH2HFromSupabase,
  fetchStandingsFromSupabase,
  toCsvName,
} from "@/lib/supabase-football";
import { ComparisonData } from "@/types/football";

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const teamAName = searchParams.get("teamAName") ?? "Manchester City";
  const teamBName = searchParams.get("teamBName") ?? "Arsenal";
  const season    = searchParams.get("season") ?? "2024";
  const teamA     = parseInt(searchParams.get("teamA") ?? "50");
  const teamB     = parseInt(searchParams.get("teamB") ?? "42");

  // ── Supabase path ─────────────────────────────────────────────────────────
  if (hasSupabase) {
    try {
      // "2024" → "2024/25"
      const sl = `${season}/${String(parseInt(season) + 1).slice(-2)}`;
      const csvA = toCsvName(teamAName);
      const csvB = toCsvName(teamBName);

      const [formA, formB, h2h, standings] = await Promise.all([
        fetchTeamFormFromSupabase(csvA, sl, 10),
        fetchTeamFormFromSupabase(csvB, sl, 10),
        fetchH2HFromSupabase(csvA, csvB, 6),
        fetchStandingsFromSupabase(sl),
      ]);

      // Midfield stats not in CSV — use mock values keyed to real team names
      const mock = getMockComparison(teamA, teamB, teamAName, teamBName);

      const payload: ComparisonData = {
        teamA: formA,
        teamB: formB,
        midfieldA: { ...mock.midfieldA, team: formA.team },
        midfieldB: { ...mock.midfieldB, team: formB.team },
        h2h,
        standings,
      };

      return NextResponse.json(payload, {
        headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=3600" },
      });
    } catch (err) {
      console.error("[comparison] Supabase error, falling back to mock:", err);
    }
  }

  // ── Mock fallback ─────────────────────────────────────────────────────────
  return NextResponse.json(
    getMockComparison(teamA, teamB, teamAName, teamBName),
    { headers: { "Cache-Control": "no-store" } }
  );
}
