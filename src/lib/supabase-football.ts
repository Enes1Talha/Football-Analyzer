import { createClient } from "@supabase/supabase-js";
import { TeamFormData, TeamInfo, Fixture, MatchResult } from "@/types/football";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) throw new Error("Supabase env vars not set.");
  return createClient(url, key);
}

interface MatchRow {
  Season: string;
  MatchDate: string;
  HomeTeam: string;
  AwayTeam: string;
  FullTimeHomeGoals: number | null;
  FullTimeAwayGoals: number | null;
  FullTimeResult: string | null;
}

// api-sports CDN team IDs — covers all PL teams from 2000 onward
const TEAM_LOGOS: Record<string, number> = {
  "Arsenal": 42, "Aston Villa": 66, "Bournemouth": 35, "Brentford": 55,
  "Brighton": 51, "Chelsea": 49, "Crystal Palace": 52, "Everton": 45,
  "Fulham": 36, "Ipswich": 57, "Leicester": 46, "Liverpool": 40,
  "Man City": 50, "Manchester City": 50, "Man United": 33, "Manchester United": 33,
  "Newcastle": 34, "Nottm Forest": 65, "Nottingham Forest": 65,
  "Southampton": 41, "Spurs": 47, "Tottenham": 47, "West Ham": 48,
  "Wolves": 39, "Wolverhampton": 39, "Luton": 1359, "Burnley": 44,
  "Sheffield Utd": 62, "Sheffield United": 62, "Watford": 38,
  "Leeds": 63, "Norwich": 71, "West Brom": 60, "Blackburn": 67,
  "Bolton": 76, "Charlton": 57, "Derby": 74, "Middlesbrough": 73,
  "Sunderland": 69, "Swansea": 70, "QPR": 68, "Reading": 37,
  "Stoke": 72, "Wigan": 75, "Hull": 80, "Cardiff": 79,
  "Swindon": 82, "Bradford": 78, "Coventry": 77, "Birmingham": 76,
  "Blackpool": 68, "Portsmouth": 71,
};

// Maps display names → CSV names (football-data.co.uk convention)
const NAME_MAP: Record<string, string> = {
  "Manchester City": "Man City",
  "Manchester United": "Man United",
  "Tottenham": "Spurs",
  "Wolverhampton": "Wolves",
  "Nottingham Forest": "Nottm Forest",
  "Newcastle United": "Newcastle",
  "Leicester City": "Leicester",
  "Brighton & Hove Albion": "Brighton",
  "West Bromwich Albion": "West Brom",
  "Sheffield United": "Sheffield Utd",
};

export function toCsvName(name: string): string {
  return NAME_MAP[name] ?? name;
}

function teamLogo(name: string): string {
  const id = TEAM_LOGOS[name] ?? TEAM_LOGOS[toCsvName(name)];
  return id ? `https://media.api-sports.io/football/teams/${id}.png` : "";
}

function toMatchResult(ftr: string | null, isHome: boolean): MatchResult {
  if (ftr === "H") return isHome ? "W" : "L";
  if (ftr === "A") return isHome ? "L" : "W";
  return "D";
}

export async function fetchTeamFormFromSupabase(
  teamName: string,
  season?: string,
  limit = 10
): Promise<TeamFormData> {
  const db = getDb();

  let query = db
    .from("matches")
    .select("Season,MatchDate,HomeTeam,AwayTeam,FullTimeHomeGoals,FullTimeAwayGoals,FullTimeResult")
    .or(`HomeTeam.eq.${teamName},AwayTeam.eq.${teamName}`)
    .not("FullTimeResult", "is", null)
    .order("MatchDate", { ascending: false })
    .limit(limit);

  if (season) query = query.eq("Season", season);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as MatchRow[];

  const team: TeamInfo = {
    id: TEAM_LOGOS[teamName] ?? 0,
    name: teamName,
    logo: teamLogo(teamName),
  };

  const fixtures: Fixture[] = rows.map((r, i) => {
    const isHome = r.HomeTeam === teamName;
    const result = toMatchResult(r.FullTimeResult, isHome);
    return {
      id: i,
      date: r.MatchDate,
      isHome,
      result,
      homeTeam: { id: TEAM_LOGOS[r.HomeTeam] ?? 0, name: r.HomeTeam, logo: teamLogo(r.HomeTeam) },
      awayTeam: { id: TEAM_LOGOS[r.AwayTeam] ?? 0, name: r.AwayTeam, logo: teamLogo(r.AwayTeam) },
      score: { home: r.FullTimeHomeGoals, away: r.FullTimeAwayGoals },
      leagueName: "Premier League",
      leagueLogo: "https://media.api-sports.io/football/leagues/39.png",
      round: "",
    };
  });

  const last5 = fixtures.slice(0, 5);

  const wins        = last5.filter((f) => f.result === "W").length;
  const draws       = last5.filter((f) => f.result === "D").length;
  const losses      = last5.filter((f) => f.result === "L").length;
  const goalsScored   = last5.reduce((s, f) => s + (f.isHome ? (f.score.home ?? 0) : (f.score.away ?? 0)), 0);
  const goalsConceded = last5.reduce((s, f) => s + (f.isHome ? (f.score.away ?? 0) : (f.score.home ?? 0)), 0);

  return {
    team,
    fixtures: last5,
    formString: last5.map((f) => f.result),
    wins, draws, losses,
    goalsScored, goalsConceded,
  };
}

export async function fetchH2HFromSupabase(teamA: string, teamB: string, limit = 6) {
  const db = getDb();

  const { data, error } = await db
    .from("matches")
    .select("MatchDate,HomeTeam,AwayTeam,FullTimeHomeGoals,FullTimeAwayGoals")
    .or(
      `and(HomeTeam.eq.${teamA},AwayTeam.eq.${teamB}),and(HomeTeam.eq.${teamB},AwayTeam.eq.${teamA})`
    )
    .not("FullTimeHomeGoals", "is", null)
    .order("MatchDate", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((r: Record<string, unknown>) => ({
    date: r["MatchDate"] as string,
    homeTeam: r["HomeTeam"] as string,
    awayTeam: r["AwayTeam"] as string,
    homeId: TEAM_LOGOS[r["HomeTeam"] as string] ?? 0,
    awayId: TEAM_LOGOS[r["AwayTeam"] as string] ?? 0,
    homeScore: (r["FullTimeHomeGoals"] as number) ?? 0,
    awayScore: (r["FullTimeAwayGoals"] as number) ?? 0,
  }));
}

export async function fetchStandingsFromSupabase(season: string) {
  const db = getDb();

  const { data, error } = await db
    .from("matches")
    .select("HomeTeam,AwayTeam,FullTimeHomeGoals,FullTimeAwayGoals,FullTimeResult")
    .eq("Season", season)
    .not("FullTimeResult", "is", null);

  if (error) throw new Error(error.message);

  const table: Record<string, { p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }> = {};
  const get = (name: string) => (table[name] ??= { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });

  for (const m of data ?? []) {
    const h = get(m.HomeTeam);
    const a = get(m.AwayTeam);
    h.p++; a.p++;
    h.gf += m.FullTimeHomeGoals ?? 0; h.ga += m.FullTimeAwayGoals ?? 0;
    a.gf += m.FullTimeAwayGoals ?? 0; a.ga += m.FullTimeHomeGoals ?? 0;
    if (m.FullTimeResult === "H") { h.w++; h.pts += 3; a.l++; }
    else if (m.FullTimeResult === "A") { a.w++; a.pts += 3; h.l++; }
    else { h.d++; h.pts++; a.d++; a.pts++; }
  }

  const rows = Object.entries(table)
    .map(([name, s]) => ({
      rank: 0,
      teamId: TEAM_LOGOS[name] ?? 0,
      teamName: name,
      teamLogo: teamLogo(name),
      played: s.p, won: s.w, drawn: s.d, lost: s.l,
      gf: s.gf, ga: s.ga, points: s.pts,
    }))
    .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga))
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return {
    leagueName: "Premier League",
    leagueLogo: "https://media.api-sports.io/football/leagues/39.png",
    season: parseInt(season.slice(0, 4)),
    rows,
  };
}
