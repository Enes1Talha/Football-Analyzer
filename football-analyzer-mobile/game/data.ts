// Curated senior-club links, not exhaustive careers. Each entry keeps its evidence.
export const players = [
  { id: "beckham", name: "David Beckham", clubs: ["Manchester United", "Real Madrid", "AC Milan"], source: "https://www.uefa.com/uefachampionsleague/news/01e1-0e73a5a40fd0-cf701112f836-1000--united-braced-for-beckham-reunion/" },
  { id: "cristiano", name: "Cristiano Ronaldo", clubs: ["Manchester United", "Real Madrid"], source: "https://www.uefa.com/MultimediaFiles/Download/competitions/Statistics/01/85/99/80/1859980_DOWNLOAD.pdf" },
  { id: "zlatan", name: "Zlatan Ibrahimović", clubs: ["Ajax", "Juventus", "Inter", "Barcelona", "AC Milan", "Paris Saint-Germain", "Manchester United"], source: "https://www.uefa.com/uefachampionsleague/news/023f-0e98047a7d5d-55052900dddf-1000--ibrahimovic-plays-for-seventh-champions-league-club/" },
  { id: "cech", name: "Petr Čech", clubs: ["Chelsea", "Arsenal"], source: "https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes" },
  { id: "cesc", name: "Cesc Fàbregas", clubs: ["Chelsea", "Arsenal"], source: "https://www.chelseafc.com/en/news/article/immediate-impact---chelsea-s-quickfire-substitutes" },
  { id: "emre", name: "Emre Belözoğlu", clubs: ["Galatasaray", "Fenerbahçe", "Inter", "Newcastle United"], source: "https://www.uefa.com/uefachampionsleague/news/01cf-0e6f8175da77-70f6f9a8645c-1000--fenerbahce-invite-emre-aboard/" },
  { id: "burak", name: "Burak Yılmaz", clubs: ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor"], source: "https://www.aa.com.tr/tr/futbol/burak-yilmaz-galatasarayin-basarisinin-altinda-yatan-sirri-acikladi/3564514" },
  { id: "kuyt", name: "Dirk Kuyt", clubs: ["Feyenoord", "Liverpool", "Fenerbahçe"], source: "https://www.liverpoolfc.com/news/first-team/120383-kuyt-agrees-fenerbahce-deal" },
  { id: "sneijder", name: "Wesley Sneijder", clubs: ["Ajax", "Real Madrid", "Inter", "Galatasaray"], source: "https://www.uefa.com/uefachampionsleague/news/0205-0e82f5488bd6-736eb926ee25-1000--galatasaray-signal-intent-with-sneijder-signing/" },
  { id: "drogba", name: "Didier Drogba", clubs: ["Marseille", "Chelsea", "Galatasaray"], source: "https://www.uefa.com/uefachampionsleague/news/0205-0e8303c5f5c4-8fae37114cb4-1000--galatasaray-bring-drogba-back-to-europe/" },
  { id: "podolski", name: "Lukas Podolski", clubs: ["Bayern Munich", "Arsenal", "Inter", "Galatasaray"], source: "https://www.uefa.com/uefachampionsleague/news/0253-0d80681a8b6a-835e118a60b8-1000--galatasaray-capture-world-cup-winner-podolski/" },
  { id: "van-persie", name: "Robin van Persie", clubs: ["Feyenoord", "Arsenal", "Manchester United", "Fenerbahçe"], source: "https://eredivisie.com/news/ex-man-utd-and-arsenal-forward-van-persie-retires-after-final-feyenoord-game/" },
] as const;

export const pairs = [
  ["Manchester United", "Real Madrid"],
  ["Chelsea", "Arsenal"],
  ["Barcelona", "Inter"],
  ["AC Milan", "Manchester United"],
  ["Ajax", "Paris Saint-Germain"],
  ["Juventus", "AC Milan"],
  ["Galatasaray", "Fenerbahçe"],
  ["Beşiktaş", "Trabzonspor"],
  ["Fenerbahçe", "Liverpool"],
  ["Galatasaray", "Chelsea"],
] as const;

export function normalizeName(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLowerCase().trim();
}

export function answersFor(pair: readonly string[]) {
  return players.filter((player) => pair.every((club) => (player.clubs as readonly string[]).includes(club)));
}
