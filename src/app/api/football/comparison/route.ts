import { NextRequest, NextResponse } from "next/server";
import { fetchTeamForm, fetchTeamMidfieldStats } from "@/lib/api-football";
import { getMockComparison } from "@/lib/mock-data";
import { ComparisonData } from "@/types/football";

// Set to false when real API is stable
const USE_MOCK = process.env.USE_MOCK_DATA === "true";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const teamA = parseInt(searchParams.get("teamA") ?? "50");
  const teamB = parseInt(searchParams.get("teamB") ?? "42");
  const league = parseInt(searchParams.get("league") ?? "39");
  const season = parseInt(searchParams.get("season") ?? "2023");
  const teamAName = searchParams.get("teamAName") ?? "Team A";
  const teamBName = searchParams.get("teamBName") ?? "Team B";

  if (isNaN(teamA) || isNaN(teamB) || isNaN(league) || isNaN(season)) {
    return NextResponse.json(
      { error: "Invalid query parameters." },
      { status: 400 }
    );
  }

  if (USE_MOCK) {
    return NextResponse.json(getMockComparison(teamA, teamB, teamAName, teamBName));
  }

  try {
    const [formA, formB, midA, midB] = await Promise.all([
      fetchTeamForm(teamA, league, season),
      fetchTeamForm(teamB, league, season),
      fetchTeamMidfieldStats(teamA, league, season),
      fetchTeamMidfieldStats(teamB, league, season),
    ]);

    const payload: ComparisonData = {
      teamA: formA,
      teamB: formB,
      midfieldA: midA,
      midfieldB: midB,
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("RAPIDAPI_KEY")) {
      return NextResponse.json(
        { error: "API key not configured", hint: "Copy .env.example to .env.local and add your RapidAPI key." },
        { status: 503 }
      );
    }

    // Tüm API hatalarında (429, usage_exceeded, 404 vb.) mock'a düş
    return NextResponse.json(getMockComparison(teamA, teamB, teamAName, teamBName));
  }
}
