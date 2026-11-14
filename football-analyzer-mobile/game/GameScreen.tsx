import { useState } from "react";
import { Keyboard, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { answersFor, normalizeName, pairs, players } from "./data";

export default function GameScreen() {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");
  const [resolved, setResolved] = useState(false);
  const [answerId, setAnswerId] = useState<string | null>(null);
  const pair = pairs[index];
  const answers = answersFor(pair);
  const answer = players.find((player) => player.id === answerId);
  const search = normalizeName(query);
  const suggestions = search.length >= 2
    ? players.filter((player) => normalizeName(player.name).includes(search))
    : [];

  function choose(id: string) {
    Keyboard.dismiss();
    if (answers.some((player) => player.id === id)) {
      setAnswerId(id);
      setResolved(true);
      setFeedback("Doğru! İki kulüpte de oynadı.");
      setQuery("");
    } else {
      setFeedback("Bu eşleşme için başka bir futbolcu dene.");
    }
  }

  function next() {
    setIndex((value) => (value + 1) % pairs.length);
    setQuery("");
    setFeedback("");
    setResolved(false);
    setAnswerId(null);
  }

  return (
    <View style={styles.section}>
      <Text style={styles.kicker}>ORTAK FUTBOLCU</Text>
      <Text style={styles.title}>İki kulüp. Bir isim.</Text>
      <Text style={styles.muted}>İki kulübün A takımında da resmî maça çıkmış bir futbolcu bul. Kiralık dönemler dahil.</Text>
      <View style={styles.clubs}>
        <Text style={styles.club}>{pair[0]}</Text>
        <Text style={styles.cross}>×</Text>
        <Text style={styles.club}>{pair[1]}</Text>
      </View>
      <Text style={styles.muted}>İlk deneme sürümü · {pairs.length} eşleşme. Oyuncu listesi henüz sınırlı.</Text>
      {!resolved && (
        <>
          <TextInput accessibilityLabel="Futbolcu ara" placeholder="Futbolcu adı veya soyadı"
            placeholderTextColor="#a9b8cb" autoCorrect={false} value={query}
            onChangeText={(value) => { setQuery(value); setFeedback(""); }} style={styles.input} />
          {suggestions.map((player) => (
            <Pressable accessibilityRole="button" key={player.id} onPress={() => choose(player.id)} style={styles.option}>
              <Text style={styles.text}>{player.name}</Text>
            </Pressable>
          ))}
          {search.length >= 2 && suggestions.length === 0 && (
            <Text style={styles.muted}>Bu oyuncu henüz listemizde yok. Başka bir isim deneyebilirsin.</Text>
          )}
        </>
      )}
      {!!feedback && <Text accessibilityLiveRegion="polite" style={styles.feedback}>{feedback}</Text>}
      {answer && (
        <View style={styles.option}>
          <Text style={styles.answer}>{answer.name}</Text>
          <Pressable accessibilityRole="link" onPress={() => {
            void Linking.openURL(answer.source).catch(() => setFeedback("Kaynak açılamadı. Bağlantını kontrol et."));
          }}>
            <Text style={styles.link}>Kaynağı gör</Text>
          </Pressable>
        </View>
      )}
      {resolved ? (
        <Pressable accessibilityRole="button" onPress={next} style={styles.button}>
          <Text style={styles.buttonText}>Yeni eşleşme</Text>
        </Pressable>
      ) : (
        <Pressable accessibilityRole="button" style={styles.option} onPress={() => {
          Keyboard.dismiss();
          setAnswerId(answers[0].id);
          setResolved(true);
          setFeedback("Geçerli cevaplardan biri");
          setQuery("");
        }}>
          <Text style={styles.text}>Cevabı göster</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 16 },
  kicker: { color: "#67e8f9", letterSpacing: 2, fontWeight: "700" },
  title: { color: "#f8fafc", fontSize: 30, fontWeight: "800" },
  muted: { color: "#a9b8cb", lineHeight: 22 },
  clubs: { backgroundColor: "#111a28", padding: 24, borderRadius: 20, alignItems: "center", gap: 14 },
  club: { color: "#f8fafc", fontSize: 24, fontWeight: "700", textAlign: "center" },
  cross: { color: "#67e8f9", fontSize: 24 },
  input: { backgroundColor: "#152030", color: "#f8fafc", padding: 16, borderRadius: 12, fontSize: 16 },
  option: { backgroundColor: "#152030", padding: 16, borderRadius: 12, gap: 12 },
  text: { color: "#f8fafc", fontSize: 16 },
  answer: { color: "#86efac", fontSize: 22, fontWeight: "700" },
  feedback: { color: "#86efac", fontSize: 16 },
  link: { color: "#67e8f9" },
  button: { backgroundColor: "#86efac", alignItems: "center", padding: 16, borderRadius: 12 },
  buttonText: { color: "#082313", fontSize: 16, fontWeight: "700" },
});
