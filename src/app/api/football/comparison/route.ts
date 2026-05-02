import { NextRequest, NextResponse } from "next/server";
import { fetchTeamForm, fetchTeamMidfieldStats } from "@/lib/api-football";
import { ComparisonData } from "@/types/football";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const teamA = parseInt(searchParams.get("teamA") ?? "50");
  const teamB = parseInt(searchParams.get("teamB") ?? "42");
  const league = parseInt(searchParams.get("league") ?? "39");
  const season = parseInt(searchParams.get("season") ?? "2023");

  if (isNaN(teamA) || isNaN(teamB) || isNaN(league) || isNaN(season)) {
    return NextResponse.json(
      { error: "Invalid query parameters. Expected: teamA, teamB, league, season (all numbers)." },
      { status: 400 }
    );
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
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("RAPIDAPI_KEY")) {
      return NextResponse.json(
        {
          error: "API key not configured",
          detail: message,
          hint: "Copy .env.example to .env.local and add your RapidAPI key.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch football data", detail: message },
      { status: 502 }
    );
  }
}
