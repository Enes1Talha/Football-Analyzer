import { createClient } from "@supabase/supabase-js";
import { TeamFormData, TeamInfo, Fixture, MatchResult } from "@/types/football";

// Server-side client (service role for unrestricted reads)
function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key) throw new Error("Supabase env vars not set.");
  return createClient(url, key);
}

interface MatchRow {
  id: string;
  div: string;
  season: string;
  date: string;
  home_team: string;
  away_team: string;
  fthg: number | null;
  ftag: number | null;
  ftr: string | null;
}

// Logo: api-sports CDN by team name (fallback — will be empty string if no match)
const TEAM_LOGOS: Record<string, number> = {
  "Arsenal": 42, "Aston Villa": 66, "Bournemouth": 35, "Brentford": 55,
  "Brighton": 51, "Chelsea": 49, "Crystal Palace": 52, "Everton": 45,
  "Fulham": 36, "Ipswich": 57, "Leicester": 46, "Liverpool": 40,
  "Man City": 50, "Manchester City": 50, "Man United": 33, "Manchester United": 33,
  "Newcastle": 34, "Nottm Forest": 65, "Nottingham Forest": 65,
  "Southampton": 41, "Spurs": 47, "Tottenham": 47, "West Ham": 48,
  "Wolves": 39, "Wolverhampton": 39, "Luton": 1359, "Burnley": 44,
  "Sheffield Utd": 62, "Sheffield United": 62, "Watford": 38,
  "Leeds": 63, "Norwich": 71, "West Brom": 60,
};

function teamLogo(name: string): string {
  const id = TEAM_LOGOS[name];
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
    .select("id,div,season,date,home_team,away_team,fthg,ftag,ftr")
    .or(`home_team.eq.${teamName},away_team.eq.${teamName}`)
    .not("ftr", "is", null)
    .order("date", { ascending: false })
    .limit(limit);

  if (season) query = query.eq("season", season);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as MatchRow[];

  const team: TeamInfo = {
    id: TEAM_LOGOS[teamName] ?? 0,
    name: teamName,
    logo: teamLogo(teamName),
  };

  const fixtures: Fixture[] = rows.map((r) => {
    const isHome = r.home_team === teamName;
    const result = toMatchResult(r.ftr, isHome);
    return {
      id: r.id as unknown as number,
      date: r.date,
      isHome,
      result,
      homeTeam: { id: TEAM_LOGOS[r.home_team] ?? 0, name: r.home_team, logo: teamLogo(r.home_team) },
      awayTeam: { id: TEAM_LOGOS[r.away_team] ?? 0, name: r.away_team, logo: teamLogo(r.away_team) },
      score: { home: r.fthg, away: r.ftag },
      leagueName: "Premier League",
      leagueLogo: `https://media.api-sports.io/football/leagues/39.png`,
      round: "",
    };
  });

  const wins   = fixtures.filter((f) => f.result === "W").length;
  const draws  = fixtures.filter((f) => f.result === "D").length;
  const losses = fixtures.filter((f) => f.result === "L").length;
  const goalsScored    = fixtures.reduce((s, f) => s + (f.isHome ? (f.score.home ?? 0) : (f.score.away ?? 0)), 0);
  const goalsConceded  = fixtures.reduce((s, f) => s + (f.isHome ? (f.score.away ?? 0) : (f.score.home ?? 0)), 0);

  return {
    team,
    fixtures: fixtures.slice(0, 5),
    formString: fixtures.slice(0, 5).map((f) => f.result),
    wins, draws, losses,
    goalsScored, goalsConceded,
  };
}

export async function fetchH2HFromSupabase(teamA: string, teamB: string, limit = 6) {
  const db = getDb();

  const { data, error } = await db
    .from("matches")
    .select("date,home_team,away_team,fthg,ftag")
    .or(
      `and(home_team.eq.${teamA},away_team.eq.${teamB}),and(home_team.eq.${teamB},away_team.eq.${teamA})`
    )
    .not("fthg", "is", null)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((r: Record<string, unknown>) => ({
    date: r["date"] as string,
    homeTeam: r["home_team"] as string,
    awayTeam: r["away_team"] as string,
    homeId: TEAM_LOGOS[r["home_team"] as string] ?? 0,
    awayId: TEAM_LOGOS[r["away_team"] as string] ?? 0,
    homeScore: (r["fthg"] as number) ?? 0,
    awayScore: (r["ftag"] as number) ?? 0,
  }));
}

export async function fetchStandingsFromSupabase(season: string) {
  const db = getDb();

  // Aggregate points per team for the season
  const { data, error } = await db
    .from("matches")
    .select("home_team,away_team,fthg,ftag,ftr")
    .eq("season", season)
    .not("ftr", "is", null);

  if (error) throw new Error(error.message);

  const table: Record<string, { p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }> = {};

  const get = (name: string) => (table[name] ??= { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });

  for (const m of data ?? []) {
    const h = get(m.home_team);
    const a = get(m.away_team);
    h.p++; a.p++;
    h.gf += m.fthg ?? 0; h.ga += m.ftag ?? 0;
    a.gf += m.ftag ?? 0; a.ga += m.fthg ?? 0;
    if (m.ftr === "H") { h.w++; h.pts += 3; a.l++; }
    else if (m.ftr === "A") { a.w++; a.pts += 3; h.l++; }
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
