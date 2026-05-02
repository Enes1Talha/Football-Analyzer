import {
  ApiFootballFixtureResponse,
  ApiFootballPlayerResponse,
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
  };
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: buildHeaders(),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API-Football responded ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

function deriveResult(
  teamId: number,
  homeId: number,
  awayId: number,
  homeGoals: number | null,
  awayGoals: number | null
): MatchResult {
  if (homeGoals === null || awayGoals === null) return "D";
  const isHome = teamId === homeId;
  const scored = isHome ? homeGoals : awayGoals;
  const conceded = isHome ? awayGoals : homeGoals;
  if (scored > conceded) return "W";
  if (scored < conceded) return "L";
  return "D";
}

export async function fetchTeamForm(
  teamId: number,
  leagueId: number,
  season: number
): Promise<TeamFormData> {
  const data = await apiFetch<ApiFootballFixtureResponse>(
    `/football-get-matches-by-league?leagueid=${leagueId}&season=${season}`
  );

  const fixtures: Fixture[] = data.response.map((item) => {
    const isHome = item.teams.home.id === teamId;
    const result = deriveResult(
      teamId,
      item.teams.home.id,
      item.teams.away.id,
      item.goals.home,
      item.goals.away
    );

    return {
      id: item.fixture.id,
      date: item.fixture.date,
      homeTeam: {
        id: item.teams.home.id,
        name: item.teams.home.name,
        logo: item.teams.home.logo,
      },
      awayTeam: {
        id: item.teams.away.id,
        name: item.teams.away.name,
        logo: item.teams.away.logo,
      },
      score: { home: item.goals.home, away: item.goals.away },
      result,
      isHome,
      leagueName: item.league.name,
      leagueLogo: item.league.logo,
      round: item.league.round,
    };
  });

  const teamInfo = fixtures[0]
    ? fixtures[0].isHome
      ? fixtures[0].homeTeam
      : fixtures[0].awayTeam
    : { id: teamId, name: "Unknown", logo: "" };

  const wins = fixtures.filter((f) => f.result === "W").length;
  const draws = fixtures.filter((f) => f.result === "D").length;
  const losses = fixtures.filter((f) => f.result === "L").length;

  let goalsScored = 0;
  let goalsConceded = 0;
  fixtures.forEach((f) => {
    if (f.score.home !== null && f.score.away !== null) {
      if (f.isHome) {
        goalsScored += f.score.home;
        goalsConceded += f.score.away;
      } else {
        goalsScored += f.score.away;
        goalsConceded += f.score.home;
      }
    }
  });

  return {
    team: teamInfo,
    fixtures,
    formString: fixtures.map((f) => f.result),
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
  };
}

function parseAccuracy(raw: string | null | undefined): number {
  if (!raw) return 0;
  const n = parseFloat(raw.replace("%", ""));
  return isNaN(n) ? 0 : n;
}

function safeNum(n: number | null | undefined): number {
  return n ?? 0;
}

export async function fetchTeamMidfieldStats(
  teamId: number,
  leagueId: number,
  season: number
): Promise<TeamMidfieldStats> {
  // Fetch midfielders for the team
  const data = await apiFetch<ApiFootballPlayerResponse>(
    `/players?team=${teamId}&league=${leagueId}&season=${season}&page=1`
  );

  const allPlayers = data.response;

  // Filter to midfielders (position "M") or typical mid numbers 6, 8, 10
  const midfielders = allPlayers.filter((p) => {
    const stats = p.statistics[0];
    if (!stats) return false;
    const pos = stats.games.position ?? "";
    const num = stats.games.number ?? 0;
    return pos === "M" || [6, 8, 10].includes(num);
  });

  // Fallback: use first 3 available players if no midfielders found
  const targets =
    midfielders.length > 0 ? midfielders.slice(0, 6) : allPlayers.slice(0, 3);

  const teamRef = allPlayers[0]?.statistics[0]?.team ?? {
    id: teamId,
    name: "Unknown",
    logo: "",
  };

  const players = targets.map((p) => {
    const s = p.statistics[0];
    const metrics: MidfieldMetrics = {
      passAccuracy: parseAccuracy(s?.passes?.accuracy),
      tackles: safeNum(s?.tackles?.total),
      interceptions: safeNum(s?.tackles?.interceptions),
      keyPasses: safeNum(s?.passes?.key),
      duelsWon: safeNum(s?.duels?.won),
      dribbles: safeNum(s?.dribbles?.success),
    };
    return {
      id: p.player.id,
      name: p.player.name,
      number: s?.games?.number ?? 0,
      position: s?.games?.position ?? "M",
      photo: p.player.photo,
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
    team: {
      id: teamRef.id,
      name: teamRef.name,
      logo: teamRef.logo,
    },
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
