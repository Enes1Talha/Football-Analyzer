export type MatchResult = "W" | "D" | "L";

export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
}

export interface FixtureScore {
  home: number | null;
  away: number | null;
}

export interface Fixture {
  id: number;
  date: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  score: FixtureScore;
  result: MatchResult;
  isHome: boolean;
  leagueName: string;
  leagueLogo: string;
  round: string;
}

export interface MidfieldMetrics {
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  keyPasses: number;
  duelsWon: number;
  dribbles: number;
}

export interface TeamMidfieldStats {
  team: TeamInfo;
  players: Array<{
    id: number;
    name: string;
    number: number;
    position: string;
    photo: string;
    metrics: MidfieldMetrics;
  }>;
  averageMetrics: MidfieldMetrics;
}

export interface TeamFormData {
  team: TeamInfo;
  fixtures: Fixture[];
  formString: MatchResult[];
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
}

export interface H2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeId: number;
  awayId: number;
  homeScore: number;
  awayScore: number;
}

export interface StandingRow {
  rank: number;
  teamId: number;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

export interface StandingsData {
  leagueName: string;
  leagueLogo: string;
  season: number;
  rows: StandingRow[];
}

export interface ComparisonData {
  teamA: TeamFormData;
  teamB: TeamFormData;
  midfieldA: TeamMidfieldStats;
  midfieldB: TeamMidfieldStats;
  h2h: H2HMatch[];
  standings: StandingsData;
}

export interface ApiFootballFixtureResponse {
  response: Array<{
    fixture: {
      id: number;
      date: string;
    };
    league: {
      name: string;
      logo: string;
      round: string;
    };
    teams: {
      home: { id: number; name: string; logo: string; winner: boolean | null };
      away: { id: number; name: string; logo: string; winner: boolean | null };
    };
    goals: {
      home: number | null;
      away: number | null;
    };
  }>;
}

export interface ApiFootballPlayerResponse {
  response: Array<{
    player: {
      id: number;
      name: string;
      photo: string;
    };
    statistics: Array<{
      team: { id: number; name: string; logo: string };
      games: {
        number: number;
        position: string;
        minutes: number | null;
      };
      passes: {
        total: number | null;
        accuracy: string | null;
        key: number | null;
      };
      tackles: {
        total: number | null;
        interceptions: number | null;
      };
      duels: {
        total: number | null;
        won: number | null;
      };
      dribbles: {
        attempts: number | null;
        success: number | null;
      };
    }>;
  }>;
}
