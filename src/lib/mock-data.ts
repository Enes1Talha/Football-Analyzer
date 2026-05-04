import { ComparisonData, H2HMatch, StandingsData } from "@/types/football";

const TEAM_LOGO = (id: number) => `https://media.api-sports.io/football/teams/${id}.png`;
const LEAGUE_LOGO = (id: number) => `https://media.api-sports.io/football/leagues/${id}.png`;
const PL_LOGO = LEAGUE_LOGO(39);

// ─── MOCK DATA — remove when real API is stable ───────────────────────────
export function getMockComparison(
  teamAId: number,
  teamBId: number,
  teamAName: string,
  teamBName: string
): ComparisonData {
  return {
    teamA: {
      team: { id: teamAId, name: teamAName, logo: TEAM_LOGO(teamAId) },
      fixtures: [
        {
          id: 1, date: "2024-12-08T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamAId, name: teamAName, logo: TEAM_LOGO(teamAId) },
          awayTeam: { id: 49, name: "Chelsea", logo: TEAM_LOGO(49) },
          score: { home: 3, away: 1 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 15",
        },
        {
          id: 2, date: "2024-12-04T20:00:00Z", isHome: false, result: "D",
          homeTeam: { id: 40, name: "Liverpool", logo: TEAM_LOGO(40) },
          awayTeam: { id: teamAId, name: teamAName, logo: TEAM_LOGO(teamAId) },
          score: { home: 2, away: 2 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 14",
        },
        {
          id: 3, date: "2024-11-30T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamAId, name: teamAName, logo: TEAM_LOGO(teamAId) },
          awayTeam: { id: 47, name: "Tottenham", logo: TEAM_LOGO(47) },
          score: { home: 2, away: 0 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 13",
        },
        {
          id: 4, date: "2024-11-23T15:00:00Z", isHome: false, result: "L",
          homeTeam: { id: 33, name: "Manchester United", logo: TEAM_LOGO(33) },
          awayTeam: { id: teamAId, name: teamAName, logo: TEAM_LOGO(teamAId) },
          score: { home: 2, away: 1 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 12",
        },
        {
          id: 5, date: "2024-11-09T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamAId, name: teamAName, logo: TEAM_LOGO(teamAId) },
          awayTeam: { id: 55, name: "Brentford", logo: TEAM_LOGO(55) },
          score: { home: 4, away: 1 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 11",
        },
      ],
      formString: ["W", "D", "W", "L", "W"],
      wins: 3, draws: 1, losses: 1,
      goalsScored: 12, goalsConceded: 5,
    },
    teamB: {
      team: { id: teamBId, name: teamBName, logo: TEAM_LOGO(teamBId) },
      fixtures: [
        {
          id: 6, date: "2024-12-07T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamBId, name: teamBName, logo: TEAM_LOGO(teamBId) },
          awayTeam: { id: 33, name: "Manchester United", logo: TEAM_LOGO(33) },
          score: { home: 2, away: 0 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 15",
        },
        {
          id: 7, date: "2024-12-04T20:00:00Z", isHome: false, result: "W",
          homeTeam: { id: 55, name: "Brentford", logo: TEAM_LOGO(55) },
          awayTeam: { id: teamBId, name: teamBName, logo: TEAM_LOGO(teamBId) },
          score: { home: 1, away: 3 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 14",
        },
        {
          id: 8, date: "2024-11-30T15:00:00Z", isHome: true, result: "D",
          homeTeam: { id: teamBId, name: teamBName, logo: TEAM_LOGO(teamBId) },
          awayTeam: { id: 40, name: "Liverpool", logo: TEAM_LOGO(40) },
          score: { home: 1, away: 1 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 13",
        },
        {
          id: 9, date: "2024-11-23T15:00:00Z", isHome: false, result: "L",
          homeTeam: { id: 49, name: "Chelsea", logo: TEAM_LOGO(49) },
          awayTeam: { id: teamBId, name: teamBName, logo: TEAM_LOGO(teamBId) },
          score: { home: 3, away: 1 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 12",
        },
        {
          id: 10, date: "2024-11-09T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamBId, name: teamBName, logo: TEAM_LOGO(teamBId) },
          awayTeam: { id: 47, name: "Tottenham", logo: TEAM_LOGO(47) },
          score: { home: 3, away: 0 }, leagueName: "Premier League", leagueLogo: PL_LOGO, round: "Round 11",
        },
      ],
      formString: ["W", "W", "D", "L", "W"],
      wins: 3, draws: 1, losses: 1,
      goalsScored: 10, goalsConceded: 5,
    },
    midfieldA: {
      team: { id: teamAId, name: teamAName, logo: TEAM_LOGO(teamAId) },
      players: [
        { id: 1, name: "Rodri", number: 16, position: "M", photo: "", metrics: { passAccuracy: 91, tackles: 4, interceptions: 3, keyPasses: 2, duelsWon: 7, dribbles: 1 } },
        { id: 2, name: "Kevin De Bruyne", number: 17, position: "M", photo: "", metrics: { passAccuracy: 88, tackles: 1, interceptions: 1, keyPasses: 5, duelsWon: 3, dribbles: 2 } },
        { id: 3, name: "Bernardo Silva", number: 20, position: "M", photo: "", metrics: { passAccuracy: 87, tackles: 2, interceptions: 2, keyPasses: 3, duelsWon: 4, dribbles: 3 } },
      ],
      averageMetrics: { passAccuracy: 89, tackles: 2, interceptions: 2, keyPasses: 3, duelsWon: 5, dribbles: 2 },
    },
    midfieldB: {
      team: { id: teamBId, name: teamBName, logo: TEAM_LOGO(teamBId) },
      players: [
        { id: 4, name: "Thomas Partey", number: 5, position: "M", photo: "", metrics: { passAccuracy: 85, tackles: 5, interceptions: 4, keyPasses: 1, duelsWon: 6, dribbles: 1 } },
        { id: 5, name: "Martin Ødegaard", number: 8, position: "M", photo: "", metrics: { passAccuracy: 89, tackles: 2, interceptions: 2, keyPasses: 4, duelsWon: 3, dribbles: 2 } },
        { id: 6, name: "Declan Rice", number: 41, position: "M", photo: "", metrics: { passAccuracy: 86, tackles: 4, interceptions: 3, keyPasses: 2, duelsWon: 5, dribbles: 1 } },
      ],
      averageMetrics: { passAccuracy: 87, tackles: 4, interceptions: 3, keyPasses: 2, duelsWon: 5, dribbles: 1 },
    },
    h2h: getMockH2H(teamAId, teamBId, teamAName, teamBName),
    standings: getMockStandings(teamAId, teamBId, teamAName, teamBName),
  };
}

function getMockH2H(aId: number, bId: number, aName: string, bName: string): H2HMatch[] {
  return [
    { date: "2024-09-22T13:00:00Z", homeId: aId, awayId: bId, homeTeam: aName, awayTeam: bName, homeScore: 2, awayScore: 2 },
    { date: "2024-03-31T15:30:00Z", homeId: bId, awayId: aId, homeTeam: bName, awayTeam: aName, homeScore: 0, awayScore: 0 },
    { date: "2023-10-08T15:30:00Z", homeId: aId, awayId: bId, homeTeam: aName, awayTeam: bName, homeScore: 1, awayScore: 0 },
    { date: "2023-04-26T20:00:00Z", homeId: bId, awayId: aId, homeTeam: bName, awayTeam: aName, homeScore: 3, awayScore: 3 },
    { date: "2022-10-19T19:45:00Z", homeId: aId, awayId: bId, homeTeam: aName, awayTeam: bName, homeScore: 3, awayScore: 1 },
    { date: "2022-04-01T15:30:00Z", homeId: bId, awayId: aId, homeTeam: bName, awayTeam: aName, homeScore: 0, awayScore: 2 },
  ];
}

function getMockStandings(aId: number, bId: number, aName: string, bName: string): StandingsData {
  const rows = [
    { rank: 1, teamId: 40, teamName: "Liverpool", teamLogo: TEAM_LOGO(40), played: 20, won: 15, drawn: 3, lost: 2, gf: 47, ga: 21, points: 48 },
    { rank: 2, teamId: aId, teamName: aName, teamLogo: TEAM_LOGO(aId), played: 20, won: 13, drawn: 3, lost: 4, gf: 42, ga: 22, points: 42 },
    { rank: 3, teamId: bId, teamName: bName, teamLogo: TEAM_LOGO(bId), played: 20, won: 12, drawn: 4, lost: 4, gf: 38, ga: 20, points: 40 },
    { rank: 4, teamId: 49, teamName: "Chelsea", teamLogo: TEAM_LOGO(49), played: 20, won: 11, drawn: 4, lost: 5, gf: 35, ga: 24, points: 37 },
    { rank: 5, teamId: 47, teamName: "Tottenham", teamLogo: TEAM_LOGO(47), played: 20, won: 10, drawn: 3, lost: 7, gf: 36, ga: 32, points: 33 },
    { rank: 6, teamId: 33, teamName: "Manchester United", teamLogo: TEAM_LOGO(33), played: 20, won: 8, drawn: 4, lost: 8, gf: 24, ga: 30, points: 28 },
    { rank: 7, teamId: 66, teamName: "Aston Villa", teamLogo: TEAM_LOGO(66), played: 20, won: 7, drawn: 5, lost: 8, gf: 30, ga: 31, points: 26 },
    { rank: 8, teamId: 34, teamName: "Newcastle", teamLogo: TEAM_LOGO(34), played: 20, won: 7, drawn: 4, lost: 9, gf: 26, ga: 30, points: 25 },
    { rank: 9, teamId: 39, teamName: "Wolves", teamLogo: TEAM_LOGO(39), played: 20, won: 5, drawn: 5, lost: 10, gf: 20, ga: 33, points: 20 },
    { rank: 10, teamId: 55, teamName: "Brentford", teamLogo: TEAM_LOGO(55), played: 20, won: 5, drawn: 4, lost: 11, gf: 22, ga: 38, points: 19 },
  ];

  // ensure the two compared teams always appear — if they were already inserted (rank 2 & 3) we're fine
  return {
    leagueName: "Premier League",
    leagueLogo: LEAGUE_LOGO(39),
    season: 2024,
    rows,
  };
}
