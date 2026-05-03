import { NextRequest, NextResponse } from "next/server";
import { getMockComparison } from "@/lib/mock-data";

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

  // TODO: remove mock when API limit resets
  return NextResponse.json(
    getMockComparison(teamA, teamB, teamAName, teamBName),
    { headers: { "Cache-Control": "no-store" } }
  );
}
