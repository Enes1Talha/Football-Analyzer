import { ComparisonData } from "@/types/football";

// ─── MOCK DATA — remove when real API is stable ───────────────────────────
export function getMockComparison(
  teamAId: number,
  teamBId: number,
  teamAName: string,
  teamBName: string
): ComparisonData {
  return {
    teamA: {
      team: { id: teamAId, name: teamAName, logo: "" },
      fixtures: [
        {
          id: 1, date: "2024-12-08T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamAId, name: teamAName, logo: "" },
          awayTeam: { id: 49, name: "Chelsea", logo: "" },
          score: { home: 3, away: 1 }, leagueName: "Premier League", leagueLogo: "", round: "Round 15",
        },
        {
          id: 2, date: "2024-12-04T20:00:00Z", isHome: false, result: "D",
          homeTeam: { id: 40, name: "Liverpool", logo: "" },
          awayTeam: { id: teamAId, name: teamAName, logo: "" },
          score: { home: 2, away: 2 }, leagueName: "Premier League", leagueLogo: "", round: "Round 14",
        },
        {
          id: 3, date: "2024-11-30T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamAId, name: teamAName, logo: "" },
          awayTeam: { id: 47, name: "Tottenham", logo: "" },
          score: { home: 2, away: 0 }, leagueName: "Premier League", leagueLogo: "", round: "Round 13",
        },
        {
          id: 4, date: "2024-11-23T15:00:00Z", isHome: false, result: "L",
          homeTeam: { id: 33, name: "Manchester United", logo: "" },
          awayTeam: { id: teamAId, name: teamAName, logo: "" },
          score: { home: 2, away: 1 }, leagueName: "Premier League", leagueLogo: "", round: "Round 12",
        },
        {
          id: 5, date: "2024-11-09T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamAId, name: teamAName, logo: "" },
          awayTeam: { id: 55, name: "Brentford", logo: "" },
          score: { home: 4, away: 1 }, leagueName: "Premier League", leagueLogo: "", round: "Round 11",
        },
      ],
      formString: ["W", "D", "W", "L", "W"],
      wins: 3, draws: 1, losses: 1,
      goalsScored: 12, goalsConceded: 5,
    },
    teamB: {
      team: { id: teamBId, name: teamBName, logo: "" },
      fixtures: [
        {
          id: 6, date: "2024-12-07T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamBId, name: teamBName, logo: "" },
          awayTeam: { id: 33, name: "Manchester United", logo: "" },
          score: { home: 2, away: 0 }, leagueName: "Premier League", leagueLogo: "", round: "Round 15",
        },
        {
          id: 7, date: "2024-12-04T20:00:00Z", isHome: false, result: "W",
          homeTeam: { id: 55, name: "Brentford", logo: "" },
          awayTeam: { id: teamBId, name: teamBName, logo: "" },
          score: { home: 1, away: 3 }, leagueName: "Premier League", leagueLogo: "", round: "Round 14",
        },
        {
          id: 8, date: "2024-11-30T15:00:00Z", isHome: true, result: "D",
          homeTeam: { id: teamBId, name: teamBName, logo: "" },
          awayTeam: { id: 40, name: "Liverpool", logo: "" },
          score: { home: 1, away: 1 }, leagueName: "Premier League", leagueLogo: "", round: "Round 13",
        },
        {
          id: 9, date: "2024-11-23T15:00:00Z", isHome: false, result: "L",
          homeTeam: { id: 49, name: "Chelsea", logo: "" },
          awayTeam: { id: teamBId, name: teamBName, logo: "" },
          score: { home: 3, away: 1 }, leagueName: "Premier League", leagueLogo: "", round: "Round 12",
        },
        {
          id: 10, date: "2024-11-09T15:00:00Z", isHome: true, result: "W",
          homeTeam: { id: teamBId, name: teamBName, logo: "" },
          awayTeam: { id: 47, name: "Tottenham", logo: "" },
          score: { home: 3, away: 0 }, leagueName: "Premier League", leagueLogo: "", round: "Round 11",
        },
      ],
      formString: ["W", "W", "D", "L", "W"],
      wins: 3, draws: 1, losses: 1,
      goalsScored: 10, goalsConceded: 5,
    },
    midfieldA: {
      team: { id: teamAId, name: teamAName, logo: "" },
      players: [
        { id: 1, name: "Rodri", number: 16, position: "M", photo: "", metrics: { passAccuracy: 91, tackles: 4, interceptions: 3, keyPasses: 2, duelsWon: 7, dribbles: 1 } },
        { id: 2, name: "Kevin De Bruyne", number: 17, position: "M", photo: "", metrics: { passAccuracy: 88, tackles: 1, interceptions: 1, keyPasses: 5, duelsWon: 3, dribbles: 2 } },
        { id: 3, name: "Bernardo Silva", number: 20, position: "M", photo: "", metrics: { passAccuracy: 87, tackles: 2, interceptions: 2, keyPasses: 3, duelsWon: 4, dribbles: 3 } },
      ],
      averageMetrics: { passAccuracy: 89, tackles: 2, interceptions: 2, keyPasses: 3, duelsWon: 5, dribbles: 2 },
    },
    midfieldB: {
      team: { id: teamBId, name: teamBName, logo: "" },
      players: [
        { id: 4, name: "Thomas Partey", number: 5, position: "M", photo: "", metrics: { passAccuracy: 85, tackles: 5, interceptions: 4, keyPasses: 1, duelsWon: 6, dribbles: 1 } },
        { id: 5, name: "Martin Ødegaard", number: 8, position: "M", photo: "", metrics: { passAccuracy: 89, tackles: 2, interceptions: 2, keyPasses: 4, duelsWon: 3, dribbles: 2 } },
        { id: 6, name: "Declan Rice", number: 41, position: "M", photo: "", metrics: { passAccuracy: 86, tackles: 4, interceptions: 3, keyPasses: 2, duelsWon: 5, dribbles: 1 } },
      ],
      averageMetrics: { passAccuracy: 87, tackles: 4, interceptions: 3, keyPasses: 2, duelsWon: 5, dribbles: 1 },
    },
  };
}
