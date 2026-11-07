import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { toCsvName } from "@/lib/supabase-football";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) throw new Error("Supabase env vars not set.");
  return createClient(url, key);
}

const TEAM_LOGOS: Record<string, number> = {
  "Arsenal": 42, "Aston Villa": 66, "Bournemouth": 35, "Brentford": 55,
  "Brighton": 51, "Chelsea": 49, "Crystal Palace": 52, "Everton": 45,
  "Fulham": 36, "Ipswich": 57, "Leicester": 46, "Liverpool": 40,
  "Man City": 50, "Man United": 33, "Newcastle": 34, "Nottm Forest": 65,
  "Southampton": 41, "Tottenham": 47, "West Ham": 48, "Wolves": 39,
  "Luton": 1359, "Burnley": 44, "Sheffield Utd": 62, "Watford": 38,
  "Leeds": 63, "Norwich": 71, "West Brom": 60, "Blackburn": 67,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teamName = searchParams.get("team") ?? "";
  const season   = searchParams.get("season") ?? "2024";

  if (!teamName) {
    return NextResponse.json({ error: "team parameter required" }, { status: 400 });
  }

  const csvName = toCsvName(teamName);
  const sl = `${season}/${String(parseInt(season) + 1).slice(-2)}`;

  try {
    const db = getDb();

    const { data, error } = await db
      .from("matches")
      .select("MatchDate,HomeTeam,AwayTeam,FullTimeHomeGoals,FullTimeAwayGoals,FullTimeResult")
      .or(`HomeTeam.eq.${csvName},AwayTeam.eq.${csvName}`)
      .eq("Season", sl)
      .not("FullTimeResult", "is", null)
      .order("MatchDate", { ascending: false });

    if (error) throw new Error(error.message);

    const matches = data ?? [];
    if (matches.length === 0) {
      return NextResponse.json({ error: "No data found", team: csvName, season: sl }, { status: 404 });
    }

    let w = 0, d = 0, l = 0, gf = 0, ga = 0;
    let homeW = 0, homeD = 0, homeL = 0;
    let awayW = 0, awayD = 0, awayL = 0;

    for (const m of matches) {
      const isHome = m.HomeTeam === csvName;
      const scored    = isHome ? (m.FullTimeHomeGoals ?? 0) : (m.FullTimeAwayGoals ?? 0);
      const conceded  = isHome ? (m.FullTimeAwayGoals ?? 0) : (m.FullTimeHomeGoals ?? 0);
      gf += scored; ga += conceded;

      const ftr = m.FullTimeResult;
      const win  = isHome ? ftr === "H" : ftr === "A";
      const draw = ftr === "D";

      if (win)       { w++; isHome ? homeW++ : awayW++; }
      else if (draw) { d++; isHome ? homeD++ : awayD++; }
      else           { l++; isHome ? homeL++ : awayL++; }
    }

    const played = matches.length;
    const form5 = matches.slice(0, 5).map((m) => {
      const isHome = m.HomeTeam === csvName;
      const ftr = m.FullTimeResult;
      if (ftr === "D") return "D";
      return (isHome ? ftr === "H" : ftr === "A") ? "W" : "L";
    });

    const teamId = TEAM_LOGOS[csvName] ?? 0;

    return NextResponse.json({
      team: {
        id: teamId,
        name: csvName,
        logo: teamId ? `https://media.api-sports.io/football/teams/${teamId}.png` : "",
      },
      season: sl,
      played, wins: w, draws: d, losses: l,
      goalsScored: gf, goalsConceded: ga,
      goalDiff: gf - ga,
      points: w * 3 + d,
      winRate: played > 0 ? Math.round((w / played) * 100) : 0,
      home: { played: homeW + homeD + homeL, wins: homeW, draws: homeD, losses: homeL },
      away: { played: awayW + awayD + awayL, wins: awayW, draws: awayD, losses: awayL },
      form5,
      lastMatch: matches[0] ? {
        date: matches[0].MatchDate,
        home: matches[0].HomeTeam,
        away: matches[0].AwayTeam,
        score: `${matches[0].FullTimeHomeGoals ?? "?"}–${matches[0].FullTimeAwayGoals ?? "?"}`,
      } : null,
    }, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=3600" },
    });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
