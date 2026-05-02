import {
  TeamFormData,
  TeamMidfieldStats,
  Fixture,
  MatchResult,
  MidfieldMetrics,
} from "@/types/football";

const BASE_URL = "https://free-api-live-football-data.p.rapidapi.com";
const RAPIDAPI_HOST = "free-api-live-football-data.p.rapidapi.com";

function buildHeaders() {
  const key = process.env.RAPIDAPI_KEY;
  if (!key || key === "your_rapidapi_key_here") {
    throw new Error(
      "RAPIDAPI_KEY is not set. Add your key to .env.local — see .env.example for instructions."
    );
  }
  return {
    "X-RapidAPI-Key": key,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
    "Content-Type": "application/json",
  };
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: buildHeaders(),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API responded ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

// ── Types matching Free API Live Football Data response format ──────────────

interface RawMatch {
  id?: number;
  match_id?: number;
  date?: string;
  match_date?: string;
  home_team?: string;
  hometeam?: string;
  home_team_id?: number;
  hometeam_id?: number;
  home_team_logo?: string;
  away_team?: string;
  awayteam?: string;
  away_team_id?: number;
  awayteam_id?: number;
  away_team_logo?: string;
  home_score?: number | null;
  away_score?: number | null;
  match_hometeam_score?: number | null;
  match_awayteam_score?: number | null;
  status?: string;
  match_status?: string;
  league_name?: string;
  round?: string;
  [key: string]: unknown;
}

interface RawPlayer {
  id?: number;
  player_id?: number;
  name?: string;
  player_name?: string;
  number?: number;
  position?: string;
  photo?: string;
  player_image?: string;
  pass_accuracy?: number | string;
  tackles?: number;
  interceptions?: number;
  key_passes?: number;
  duels_won?: number;
  dribbles?: number;
  [key: string]: unknown;
}

function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["response", "matches", "fixtures", "data", "result", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
    // Try first array value found
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) return val;
    }
  }
  return [];
}

function deriveResult(
  teamId: number,
  homeId: number,
  homeScore: number | null,
  awayScore: number | null,
  isHome: boolean
): MatchResult {
  if (homeScore === null || awayScore === null) return "D";
  void teamId; void homeId;
  const scored = isHome ? homeScore : awayScore;
  const conceded = isHome ? awayScore : homeScore;
  if (scored > conceded) return "W";
  if (scored < conceded) return "L";
  return "D";
}

function safeNum(n: unknown): number {
  const v = Number(n);
  return isNaN(v) ? 0 : v;
}

// ── Team Form ───────────────────────────────────────────────────────────────

export async function fetchTeamForm(
  teamId: number,
  leagueId: number,
  season: number
): Promise<TeamFormData> {
  void season; // this API filters by league only

  const raw = await apiFetch<unknown>(
    `/football-get-all-matches-by-league?leagueid=${leagueId}`
  );

  const allMatches = extractArray(raw) as RawMatch[];

  // Filter by team and only finished matches, then take last 5
  const teamMatches = allMatches
    .filter((m) => {
      const hId = m.home_team_id ?? m.hometeam_id ?? 0;
      const aId = m.away_team_id ?? m.awayteam_id ?? 0;
      const status = (m.status ?? m.match_status ?? "").toLowerCase();
      const finished = status === "ft" || status === "finished" || status === "match finished";
      return (hId === teamId || aId === teamId) && finished;
    })
    .slice(-5);

  const fixtures: Fixture[] = teamMatches.map((m) => {
    const homeId = m.home_team_id ?? m.hometeam_id ?? 0;
    const awayId = m.away_team_id ?? m.awayteam_id ?? 0;
    const isHome = homeId === teamId;
    const homeScore = safeNum(m.home_score ?? m.match_hometeam_score) ?? null;
    const awayScore = safeNum(m.away_score ?? m.match_awayteam_score) ?? null;
    const result = deriveResult(teamId, homeId, homeScore, awayScore, isHome);

    return {
      id: m.id ?? m.match_id ?? Math.random(),
      date: m.date ?? m.match_date ?? "",
      homeTeam: {
        id: homeId,
        name: m.home_team ?? m.hometeam ?? "Home",
        logo: m.home_team_logo ?? "",
      },
      awayTeam: {
        id: awayId,
        name: m.away_team ?? m.awayteam ?? "Away",
        logo: m.away_team_logo ?? "",
      },
      score: { home: homeScore, away: awayScore },
      result,
      isHome,
      leagueName: m.league_name ?? "",
      leagueLogo: "",
      round: m.round ?? "",
    };
  });

  const teamName = fixtures[0]
    ? fixtures[0].isHome
      ? fixtures[0].homeTeam.name
      : fixtures[0].awayTeam.name
    : "Unknown";

  const wins = fixtures.filter((f) => f.result === "W").length;
  const draws = fixtures.filter((f) => f.result === "D").length;
  const losses = fixtures.filter((f) => f.result === "L").length;

  let goalsScored = 0;
  let goalsConceded = 0;
  fixtures.forEach((f) => {
    if (f.score.home !== null && f.score.away !== null) {
      goalsScored += f.isHome ? f.score.home : f.score.away;
      goalsConceded += f.isHome ? f.score.away : f.score.home;
    }
  });

  return {
    team: { id: teamId, name: teamName, logo: "" },
    fixtures,
    formString: fixtures.map((f) => f.result),
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
  };
}

// ── Midfield Stats ──────────────────────────────────────────────────────────

export async function fetchTeamMidfieldStats(
  teamId: number,
  leagueId: number,
  season: number
): Promise<TeamMidfieldStats> {
  void leagueId; void season;

  const raw = await apiFetch<unknown>(
    `/football-get-players-list-all-by-teamid?teamid=${teamId}`
  );

  const allPlayers = extractArray(raw) as RawPlayer[];

  // Prefer midfielders, fallback to first 6
  const mids = allPlayers.filter((p) => {
    const pos = (p.position ?? "").toLowerCase();
    const num = safeNum(p.number);
    return pos.includes("mid") || pos === "m" || [6, 8, 10].includes(num);
  });

  const targets = mids.length > 0 ? mids.slice(0, 6) : allPlayers.slice(0, 6);

  const players = targets.map((p) => {
    const metrics: MidfieldMetrics = {
      passAccuracy: safeNum(p.pass_accuracy),
      tackles: safeNum(p.tackles),
      interceptions: safeNum(p.interceptions),
      keyPasses: safeNum(p.key_passes),
      duelsWon: safeNum(p.duels_won),
      dribbles: safeNum(p.dribbles),
    };
    return {
      id: safeNum(p.id ?? p.player_id),
      name: p.name ?? p.player_name ?? "Unknown",
      number: safeNum(p.number),
      position: p.position ?? "M",
      photo: p.photo ?? p.player_image ?? "",
      metrics,
    };
  });

  const avg = (key: keyof MidfieldMetrics): number => {
    if (!players.length) return 0;
    return Math.round(
      players.reduce((sum, p) => sum + p.metrics[key], 0) / players.length
    );
  };

  return {
    team: { id: teamId, name: "", logo: "" },
    players,
    averageMetrics: {
      passAccuracy: avg("passAccuracy"),
      tackles: avg("tackles"),
      interceptions: avg("interceptions"),
      keyPasses: avg("keyPasses"),
      duelsWon: avg("duelsWon"),
      dribbles: avg("dribbles"),
    },
  };
}
