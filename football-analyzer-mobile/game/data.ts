import importedPlayers from "./imported-players.json";
import reviewedPlayers from "./reviewed-players.json";
import batchTwoPlayers from "./batch-two-players.json";
import batchThreePlayers from "./batch-three-players.json";
export interface GamePlayer { id: string; name: string; clubs: readonly string[]; source: string; aliases?: readonly string[] }
// Curated senior-club links, not exhaustive careers. Each entry keeps its evidence.
const curatedPlayers = [
  { id: "messi", name: "Lionel Messi", clubs: ["Barcelona", "Paris Saint-Germain"], source: "https://www.wikidata.org/wiki/Q615", aliases: ["Leo Messi", "Messi"] },
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

const importedMatches = (player: GamePlayer, curated: GamePlayer) =>
  [player.name, ...(player.aliases || [])].some(name => normalizeName(name) === normalizeName(curated.name));
const basePlayers: GamePlayer[] = [
  ...curatedPlayers.map(curated => {
    const imported = importedPlayers.find(p => importedMatches(p, curated));
    return imported ? { ...curated, clubs: Array.from(new Set([...curated.clubs, ...imported.clubs])), aliases: imported.aliases } : curated;
  }),
  ...importedPlayers.filter(p => !curatedPlayers.some(c => importedMatches(p, c))),
  ...reviewedPlayers.filter(p => !importedPlayers.some(i => i.id === p.id) && !curatedPlayers.some(c => importedMatches(p, c))),
];
export const players: GamePlayer[] = [
  ...basePlayers.map(p=>batchTwoPlayers.find(next=>next.id===p.id)||p),
  ...batchTwoPlayers.filter(p=>!basePlayers.some(existing=>existing.id===p.id)),
  ...batchThreePlayers,
];

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
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[øØ]/g, "o").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function searchPlayers(query: string) {
  const normalized = normalizeName(query);
  if (normalized.length < 2) return [];
  const tokens = normalized.split(/\s+/);
  return players.filter((player) => [player.name,...(player.aliases||[])].some(name => tokens.every(token => normalizeName(name).includes(token))))
    .sort((a,b) => Number(normalizeName(b.name).startsWith(normalized)) - Number(normalizeName(a.name).startsWith(normalized)) || a.name.localeCompare(b.name))
    .slice(0, 12);
}

export function resolveClub(query: string) {
  const aliases: Record<string, string> = { gs: "Galatasaray", fb: "Fenerbahçe", bjk: "Beşiktaş", ts: "Trabzonspor", "man utd": "Manchester United", "man united": "Manchester United", "man city": "Manchester City", psg: "Paris Saint-Germain", "real madrid": "Real Madrid", barca: "Barcelona", "bayern munih": "Bayern Munich", "atletico madrid": "Atlético Madrid" };
  const normalized = normalizeName(query);
  const available = Array.from(new Set(players.flatMap(p => [...p.clubs])));
  return available.find(club => normalizeName(club) === normalized || club === aliases[normalized]);
}

export function answersFor(pair: readonly string[]) {
  return players.filter((player) => pair.every((club) => (player.clubs as readonly string[]).includes(club)));
}
