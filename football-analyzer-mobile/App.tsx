import { useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import type { ComparisonData, H2HMatch, StandingsData, TeamFormData } from "./types/football";

const apiBase = (process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000")).replace(/\/+$/, "");
const season = "2024";
const demoTeamIds: Record<string, string> = { Arsenal: "42", "Man City": "50", "Manchester City": "50" };
const resultColors = { W: "#86efac", D: "#fde68a", L: "#fda4af" };
const resultLabels = { W: "Galibiyet", D: "Beraberlik", L: "Mağlubiyet" };

function TeamForm({ data }: { data: TeamFormData }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{data.team.name}</Text>
      <View style={styles.badges}>
        {data.formString.map((result, index) => (
          <Text key={index} accessibilityLabel={resultLabels[result]}
            style={[styles.badge, { color: resultColors[result] }]}>
            {result}
          </Text>
        ))}
      </View>
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
  const [teamA, setTeamA] = useState("Arsenal");
  const [teamB, setTeamB] = useState("Man City");
  const [data, setData] = useState<ComparisonData | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function compare() {
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
      query.set("teamA", demoTeamIds[first] ?? "0");
      query.set("teamB", demoTeamIds[second] ?? "0");
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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>PREMIER LEAGUE · 2024/25</Text>
        <Text style={styles.title}>Takım Karşılaştırma</Text>
        <Text style={styles.muted}>Seçilen sezondaki son 5 lig maçı</Text>
        <TextInput accessibilityLabel="Birinci takım" value={teamA} onChangeText={setTeamA}
          editable={!loading} autoCorrect={false} style={styles.input} />
        <TextInput accessibilityLabel="İkinci takım" value={teamB} onChangeText={setTeamB}
          editable={!loading} autoCorrect={false} style={styles.input} />
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
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#263448" },
  tableNumber: { minWidth: 34, textAlign: "center", fontVariant: ["tabular-nums"] },
  tableTeam: { flex: 1, paddingHorizontal: 4 },
  highlightedRow: { backgroundColor: "#193328" },
  highlightedTeam: { color: "#86efac", fontWeight: "700" },
  warning: { color: "#fde68a" },
});
