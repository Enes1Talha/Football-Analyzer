import { NextRequest, NextResponse } from "next/server";
import { fetchTeamForm, fetchTeamMidfieldStats } from "@/lib/api-football";
import { getMockComparison } from "@/lib/mock-data";
import { ComparisonData } from "@/types/football";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const teamA = parseInt(searchParams.get("teamA") ?? "50");
  const teamB = parseInt(searchParams.get("teamB") ?? "42");
  const league = parseInt(searchParams.get("league") ?? "39");
  const season = parseInt(searchParams.get("season") ?? "2023");
  const teamAName = searchParams.get("teamAName") ?? "Team A";
  const teamBName = searchParams.get("teamBName") ?? "Team B";

  if (isNaN(teamA) || isNaN(teamB) || isNaN(league) || isNaN(season)) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  try {
    const [formA, formB, midA, midB] = await Promise.all([
      fetchTeamForm(teamA, league, season),
      fetchTeamForm(teamB, league, season),
      fetchTeamMidfieldStats(teamA, league, season),
      fetchTeamMidfieldStats(teamB, league, season),
    ]);

    // Use mock h2h and standings until real API endpoints are integrated
    const mock = getMockComparison(teamA, teamB, teamAName, teamBName);
    const payload: ComparisonData = {
      teamA: formA,
      teamB: formB,
      midfieldA: midA,
      midfieldB: midB,
      h2h: mock.h2h,
      standings: mock.standings,
    };

    return NextResponse.json(payload, {
      // ISR: 24 saat cache — günde 1 kez API çağrısı
      headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate=86400" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("RAPIDAPI_KEY")) {
      return NextResponse.json(
        { error: "API key not configured", hint: "Copy .env.example to .env.local and add your RapidAPI key." },
        { status: 503 }
      );
    }

    // API limit dolduğunda veya hata alındığında mock'a düş
    return NextResponse.json(
      getMockComparison(teamA, teamB, teamAName, teamBName),
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
