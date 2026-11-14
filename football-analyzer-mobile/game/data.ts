export const players = [
  { id: "beckham", name: "David Beckham", clubs: ["Manchester United", "Real Madrid", "AC Milan"], source: "https://www.uefa.com/uefachampionsleague/news/01e1-0e73a5a40fd0-cf701112f836-1000--united-braced-for-beckham-reunion/" },
  { id: "cristiano", name: "Cristiano Ronaldo", clubs: ["Manchester United", "Real Madrid"], source: "https://www.uefa.com/MultimediaFiles/Download/competitions/Statistics/01/85/99/80/1859980_DOWNLOAD.pdf" },
  { id: "zlatan", name: "Zlatan Ibrahimović", clubs: ["Ajax", "Juventus", "Inter", "Barcelona", "AC Milan", "Paris Saint-Germain", "Manchester United"], source: "https://www.uefa.com/uefachampionsleague/news/023f-0e98047a7d5d-55052900dddf-1000--ibrahimovic-plays-for-seventh-champions-league-club/" },
  { id: "cech", name: "Petr Čech", clubs: ["Chelsea", "Arsenal"], source: "https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes" },
  { id: "cesc", name: "Cesc Fàbregas", clubs: ["Chelsea", "Arsenal"], source: "https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes" },
] as const;

export const pairs = [
  ["Manchester United", "Real Madrid"],
  ["Chelsea", "Arsenal"],
  ["Barcelona", "Inter"],
  ["AC Milan", "Manchester United"],
  ["Ajax", "Paris Saint-Germain"],
  ["Juventus", "AC Milan"],
] as const;

export function normalizeName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLowerCase().trim();
}

export function answersFor(pair: readonly string[]) {
  return players.filter((player) => pair.every((club) => (player.clubs as readonly string[]).includes(club)));
}
