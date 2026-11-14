import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import GameScreen from "./game/GameScreen";
import type { ComparisonData, H2HMatch, MatchResult, StandingsData, TeamFormData } from "./types/football";

const apiBase = (process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000")).replace(/\/+$/, "");
const season = "2024";
const resultColors = { W: "#86efac", D: "#fde68a", L: "#fda4af" };
const resultLabels = { W: "Galibiyet", D: "Beraberlik", L: "Mağlubiyet" };

type SearchTeam = ComparisonData["teamA"]["team"];

type MatchSplit = { wins: number; draws: number; losses: number };
type TeamSummary = {
  team: SearchTeam;
  season: string;
  played: number;
  points: number;
  winRate: number;
  home: MatchSplit;
  away: MatchSplit;
  form5: MatchResult[];
  lastMatch: { date: string; home: string; away: string; score: string } | null;
};

function TeamSuggestions({ query, onSelect }: {
  query: string;
  onSelect: (team: SearchTeam) => void;
}) {
  const [results, setResults] = useState<SearchTeam[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${apiBase}/api/football/search-teams?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { results }: { results: SearchTeam[] } = await response.json();
        if (controller.signal.aborted) return;
        setResults(results);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <View style={styles.card}>
      {status === "loading" && <Text style={styles.muted}>Takımlar aranıyor…</Text>}
      {status === "error" && <Text style={styles.warning}>Takım araması şu an kullanılamıyor. Takım adını elle girebilirsin.</Text>}
      {status === "ready" && results.length === 0 && <Text style={styles.muted}>Takım bulunamadı.</Text>}
      {results.map((team) => (
        <Pressable key={team.name} accessibilityRole="button"
          style={styles.suggestion} onPress={() => onSelect(team)}>
          <Text style={styles.text}>{team.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function FormBadges({ results }: { results: MatchResult[] }) {
  return (
    <View style={styles.badges}>
      {results.map((result, index) => (
        <Text key={index} accessibilityLabel={resultLabels[result]}
          style={[styles.badge, { color: resultColors[result] }]}>
          {result}
        </Text>
      ))}
    </View>
  );
}

function TodayScreen({ favorite, onSelect }: {
  favorite: SearchTeam | null;
  onSelect: (team: SearchTeam) => void;
}) {
  const [query, setQuery] = useState("");
  const [summary, setSummary] = useState<TeamSummary | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!favorite) return;
    const controller = new AbortController();
    async function load(team: SearchTeam) {
      const params = new URLSearchParams({ team: team.name, season });
      try {
        const response = await fetch(`${apiBase}/api/football/team-summary?${params}`, {
          signal: controller.signal,
        });
        if (response.status === 404) {
          if (!controller.signal.aborted) setError("Bu takım için 2024/25 sezon kaydı bulunamadı.");
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: TeamSummary = await response.json();
        if (!controller.signal.aborted) setSummary(data);
      } catch {
        if (!controller.signal.aborted) setError("Takım özeti yüklenemedi.");
      }
    }
    void load(favorite);
    return () => controller.abort();
  }, [favorite, attempt]);

  const search = query.trim();
  const logo = summary?.team.logo || favorite?.logo;
  return (
    <>
      <Text style={styles.title}>Bugün</Text>
      <Text style={styles.muted}>Favori takımının 2024/25 lig özeti</Text>
      <TextInput accessibilityLabel="Favori takım ara" placeholder="Favori takım ara"
        placeholderTextColor="#a9b8cb" value={query} onChangeText={setQuery}
        autoCorrect={false} style={styles.input} />
      {search.length >= 2 && (
        <TeamSuggestions key={search} query={search} onSelect={(team) => {
          Keyboard.dismiss();
          setQuery("");
          if (favorite?.name === team.name && summary) return;
          setSummary(null);
          setError("");
          onSelect(team);
        }} />
      )}
      {favorite && (
        <View style={styles.card}>
          <View style={styles.teamHeader}>
            {!!logo && <Image source={{ uri: logo }} style={styles.teamLogo} />}
            <Text style={[styles.heading, styles.teamTitle]}>{summary?.team.name ?? favorite.name}</Text>
          </View>
          {!summary && !error && <ActivityIndicator color="#86efac" accessibilityLabel="Özet yükleniyor" />}
          {!!error && (
            <>
              <Text accessibilityRole="alert" style={styles.warning}>{error}</Text>
              <Pressable accessibilityRole="button" style={styles.suggestion} onPress={() => {
                setError("");
                setAttempt((value) => value + 1);
              }}>
                <Text style={styles.text}>Tekrar dene</Text>
              </Pressable>
            </>
          )}
          {summary && (
            <>
              <Text style={styles.text}>{summary.played} Maç · {summary.points} Puan · %{summary.winRate} kazanma</Text>
              <Text style={styles.muted}>Son 5 lig maçı</Text>
              <FormBadges results={summary.form5} />
              {summary.lastMatch && (
                <View style={styles.match}>
                  <Text style={styles.muted}>Son maç · {summary.lastMatch.date.slice(0, 10)}</Text>
                  <Text style={styles.text}>{summary.lastMatch.home} {summary.lastMatch.score} {summary.lastMatch.away}</Text>
                </View>
              )}
              <View style={styles.match}>
                <Text style={styles.text}>Ev: {summary.home.wins}G {summary.home.draws}B {summary.home.losses}M</Text>
                <Text style={styles.text}>Deplasman: {summary.away.wins}G {summary.away.draws}B {summary.away.losses}M</Text>
              </View>
            </>
          )}
        </View>
      )}
    </>
  );
}

function TeamForm({ data }: { data: TeamFormData }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{data.team.name}</Text>
      <FormBadges results={data.formString} />
      {data.fixtures.length === 0 && (
        <Text style={styles.muted}>Bu adla sezon kaydı bulunamadı. Takım adını kontrol et.</Text>
      )}
      {data.fixtures.map((match) => (
        <View key={match.id} style={styles.match}>
          <Text style={styles.muted}>{match.date.slice(0, 10)}</Text>
          <Text style={styles.text}>
            {match.homeTeam.name} {match.score.home ?? "–"} : {match.score.away ?? "–"} {match.awayTeam.name}
          </Text>
        </View>
      ))}
    </View>
  );
}

function H2HSection({ matches }: { matches: H2HMatch[] }) {
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.heading}>İkili Karşılaşmalar</Text>
      {matches.length === 0 && <Text style={styles.muted}>Karşılaşma kaydı bulunamadı.</Text>}
      {matches.map((match) => (
        <View key={`${match.date}-${match.homeTeam}-${match.awayTeam}`} style={styles.match}>
          <Text style={styles.muted}>{match.date.slice(0, 10)}</Text>
          <Text style={styles.text}>
            {match.homeTeam} {match.homeScore} : {match.awayScore} {match.awayTeam}
          </Text>
        </View>
      ))}
    </View>
  );
}

function StandingsSection({ standings, teamA, teamB }: {
  standings: StandingsData;
  teamA: string;
  teamB: string;
}) {
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.heading}>Puan Durumu</Text>
      {standings.rows.length === 0 ? (
        <Text style={styles.muted}>Bu sezon için puan durumu bulunamadı.</Text>
      ) : (
        <>
          <View style={styles.tableRow}>
            <Text style={[styles.muted, styles.tableNumber]}>#</Text>
            <Text style={[styles.muted, styles.tableTeam]}>Takım</Text>
            <Text accessibilityLabel="Oynanan maç" style={[styles.muted, styles.tableNumber]}>O</Text>
            <Text accessibilityLabel="Averaj" style={[styles.muted, styles.tableNumber]}>Av.</Text>
            <Text accessibilityLabel="Puan" style={[styles.muted, styles.tableNumber]}>P</Text>
          </View>
          {standings.rows.map((row) => {
            const highlighted = row.teamName === teamA || row.teamName === teamB;
            return (
              <View key={row.teamName} style={[styles.tableRow, highlighted && styles.highlightedRow]}>
                <Text style={[styles.text, styles.tableNumber]}>{row.rank}</Text>
                <Text style={[styles.text, styles.tableTeam, highlighted && styles.highlightedTeam]}>
                  {row.teamName}
                </Text>
                <Text style={[styles.text, styles.tableNumber]}>{row.played}</Text>
                <Text style={[styles.text, styles.tableNumber]}>{row.gf - row.ga}</Text>
                <Text style={[styles.text, styles.tableNumber]}>{row.points}</Text>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState<"compare" | "today" | "play">("play");
  const [favorite, setFavorite] = useState<SearchTeam | null>(null);
  const [teamA, setTeamA] = useState("Arsenal");
  const [teamB, setTeamB] = useState("Man City");
  const [teamAId, setTeamAId] = useState<string>();
  const [teamBId, setTeamBId] = useState<string>();
  const [searching, setSearching] = useState<"a" | "b" | null>(null);
  const [data, setData] = useState<ComparisonData | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function compare() {
    setSearching(null);
    const first = teamA.trim();
    const second = teamB.trim();
    setData(null);
    setError("");
    if (!first || !second || first.toLowerCase() === second.toLowerCase()) {
      setError("İki farklı takım adı gir.");
      return;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({ teamAName: first, teamBName: second, season });
      query.set("teamA", teamAId ?? "0");
      query.set("teamB", teamBId ?? "0");
      const response = await fetch(`${apiBase}/api/football/comparison?${query}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const comparison: ComparisonData = await response.json();
      setDemo(response.headers.get("cache-control") === "no-store");
      setData(comparison);
    } catch {
      setError("Karşılaştırma yüklenemedi. API adresini ve Next.js sunucusunu kontrol et.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView key={tab} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.tabs}>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === "compare" }}
            onPress={() => { setSearching(null); setTab("compare"); }}
            style={[styles.tab, tab === "compare" && styles.activeTab]}>
            <Text style={styles.text}>Karşılaştır</Text>
          </Pressable>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === "today" }}
            onPress={() => setTab("today")} style={[styles.tab, tab === "today" && styles.activeTab]}>
            <Text style={styles.text}>Bugün</Text>
          </Pressable>
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === "play" }}
            onPress={() => setTab("play")} style={[styles.tab, tab === "play" && styles.activeTab]}>
            <Text style={styles.text}>Oyna</Text>
          </Pressable>
        </View>
        {tab === "play" ? <GameScreen /> : tab === "today" ? <TodayScreen favorite={favorite} onSelect={setFavorite} /> : (
        <>
        <Text style={styles.eyebrow}>PREMIER LEAGUE · 2024/25</Text>
        <Text style={styles.title}>Takım Karşılaştırma</Text>
        <Text style={styles.muted}>Seçilen sezondaki son 5 lig maçı</Text>
        <TextInput accessibilityLabel="Birinci takım" value={teamA} onFocus={() => setSearching("a")}
          onChangeText={(value) => { setTeamA(value); setTeamAId(undefined); setSearching("a"); }}
          editable={!loading} autoCorrect={false} style={styles.input} />
        {searching === "a" && teamA.trim().length >= 2 && (
          <TeamSuggestions key={teamA.trim()} query={teamA.trim()} onSelect={(team) => {
            setTeamA(team.name);
            setTeamAId(String(team.id));
            setSearching(null);
          }} />
        )}
        <TextInput accessibilityLabel="İkinci takım" value={teamB} onFocus={() => setSearching("b")}
          onChangeText={(value) => { setTeamB(value); setTeamBId(undefined); setSearching("b"); }}
          editable={!loading} autoCorrect={false} style={styles.input} />
        {searching === "b" && teamB.trim().length >= 2 && (
          <TeamSuggestions key={teamB.trim()} query={teamB.trim()} onSelect={(team) => {
            setTeamB(team.name);
            setTeamBId(String(team.id));
            setSearching(null);
          }} />
        )}
        <Pressable accessibilityRole="button" disabled={loading} onPress={compare}
          style={[styles.button, loading && styles.disabled]}>
          <Text style={styles.buttonText}>Karşılaştır</Text>
        </Pressable>
        {loading && <ActivityIndicator color="#86efac" accessibilityLabel="Yükleniyor" />}
        {!!error && <Text accessibilityRole="alert" style={styles.warning}>{error}</Text>}
        {data && (
          <>
            {demo && <Text style={styles.warning}>Örnek veri · Gerçek maç verisi alınamadı.</Text>}
            <TeamForm data={data.teamA} />
            <TeamForm data={data.teamB} />
            <H2HSection matches={data.h2h} />
            <StandingsSection standings={data.standings} teamA={data.teamA.team.name} teamB={data.teamB.team.name} />
          </>
        )}
        </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#090e16" },
  content: { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 40, gap: 12 },
  eyebrow: { color: "#67e8f9", fontWeight: "700", letterSpacing: 1 },
  title: { color: "#f8fafc", fontSize: 30, fontWeight: "800" },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700" },
  tabs: { flexDirection: "row", gap: 8 },
  tab: { flex: 1, alignItems: "center", padding: 10, borderRadius: 8, backgroundColor: "#152030" },
  activeTab: { backgroundColor: "#193328", borderWidth: 1, borderColor: "#86efac" },
  teamHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  teamLogo: { width: 40, height: 40, resizeMode: "contain" },
  teamTitle: { flex: 1 },
  muted: { color: "#a9b8cb", fontSize: 14 },
  text: { color: "#f8fafc", fontSize: 15 },
  input: { backgroundColor: "#152030", color: "#f8fafc", padding: 14, borderRadius: 10, fontSize: 16 },
  button: { backgroundColor: "#86efac", alignItems: "center", padding: 14, borderRadius: 10 },
  buttonText: { color: "#082313", fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  card: { backgroundColor: "#111a28", padding: 16, borderRadius: 14, gap: 10 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  badge: { backgroundColor: "#1e2b3c", borderRadius: 6, padding: 8, fontWeight: "700" },
  match: { borderTopWidth: 1, borderTopColor: "#263448", paddingTop: 8, gap: 3 },
  suggestion: { paddingVertical: 8, gap: 3 },
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#263448" },
  tableNumber: { minWidth: 34, textAlign: "center", fontVariant: ["tabular-nums"] },
  tableTeam: { flex: 1, paddingHorizontal: 4 },
  highlightedRow: { backgroundColor: "#193328" },
  highlightedTeam: { color: "#86efac", fontWeight: "700" },
  warning: { color: "#fde68a" },
});
