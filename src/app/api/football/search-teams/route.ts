import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TEAM_LOGOS: Record<string, number> = {
  "Arsenal": 42, "Aston Villa": 66, "Bournemouth": 35, "Brentford": 55,
  "Brighton": 51, "Chelsea": 49, "Crystal Palace": 52, "Everton": 45,
  "Fulham": 36, "Ipswich": 57, "Leicester": 46, "Liverpool": 40,
  "Man City": 50, "Man United": 33, "Newcastle": 34, "Nottm Forest": 65,
  "Southampton": 41, "Tottenham": 47, "West Ham": 48, "Wolves": 39,
  "Luton": 1359, "Burnley": 44, "Sheffield Utd": 62, "Watford": 38,
  "Leeds": 63, "Norwich": 71, "West Brom": 60, "Blackburn": 67,
  "Bolton": 76, "Charlton": 57, "Derby": 74, "Middlesbrough": 73,
  "Sunderland": 69, "Swansea": 70, "QPR": 68, "Reading": 37,
  "Stoke": 72, "Wigan": 75, "Hull": 80, "Cardiff": 79,
  "Portsmouth": 71, "Birmingham": 76, "Blackpool": 68, "Coventry": 77,
};

function teamLogo(name: string): string {
  const id = TEAM_LOGOS[name];
  return id ? `https://media.api-sports.io/football/teams/${id}.png` : "";
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || !key) {
    // Fallback: filter from known teams list
    const results = Object.keys(TEAM_LOGOS)
      .filter((name) => name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 10)
      .map((name) => ({ id: TEAM_LOGOS[name], name, logo: teamLogo(name) }));
    return NextResponse.json({ results });
  }

  try {
    const db = createClient(url, key);

    // Get distinct home teams matching the query
    const { data: homeRows } = await db
      .from("matches")
      .select("HomeTeam")
      .ilike("HomeTeam", `%${q}%`)
      .limit(20);

    const { data: awayRows } = await db
      .from("matches")
      .select("AwayTeam")
      .ilike("AwayTeam", `%${q}%`)
      .limit(20);

    const names = new Set<string>();
    for (const r of homeRows ?? []) names.add(r.HomeTeam);
    for (const r of awayRows ?? []) names.add(r.AwayTeam);

    const results = [...names].slice(0, 10).map((name) => ({
      id: TEAM_LOGOS[name] ?? 0,
      name,
      logo: teamLogo(name),
    }));

    return NextResponse.json({ results }, {
      headers: { "Cache-Control": "s-maxage=3600" },
    });
  } catch {
    // Fallback to static list on error
    const results = Object.keys(TEAM_LOGOS)
      .filter((name) => name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 10)
      .map((name) => ({ id: TEAM_LOGOS[name], name, logo: teamLogo(name) }));
    return NextResponse.json({ results });
  }
}
