"use client";

import Link from "next/link";
import { useState } from "react";
import { answersFor, normalizeName, pairs, players } from "../../../football-analyzer-mobile/game/data";

export default function PlayPage() {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [answerId, setAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const pair = pairs[index];
  const answers = answersFor(pair);
  const answer = players.find((player) => player.id === answerId);
  const search = normalizeName(query);
  const suggestions = search.length >= 2 ? players.filter((player) => normalizeName(player.name).includes(search)) : [];

  function next() {
    setIndex((value) => (value + 1) % pairs.length);
    setQuery("");
    setAnswerId(null);
    setFeedback("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-5 py-8">
      <nav aria-label="Ana menü" className="mx-auto max-w-xl flex gap-6 mb-12">
        <Link href="/" className="text-slate-300 hover:text-white">Karşılaştır</Link>
        <Link href="/oyna" aria-current="page" className="text-emerald-300 font-bold">Oyna</Link>
      </nav>
      <section className="mx-auto max-w-xl space-y-6">
        <p className="text-cyan-300 tracking-widest text-sm">ORTAK FUTBOLCU</p>
        <h1 className="text-4xl font-bold">İki kulüp. Bir isim.</h1>
        <p className="text-slate-400">İki kulübün A takımında da resmî maça çıkmış bir futbolcu bul. Kiralık dönemler dahil.</p>
        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">{pair[0]}</h2>
          <p className="text-cyan-300 text-2xl">×</p>
          <h2 className="text-2xl font-bold">{pair[1]}</h2>
        </div>
        <p className="text-sm text-slate-400">İlk deneme sürümü · {pairs.length} eşleşme. Oyuncu listesi henüz sınırlı.</p>
        {!answer && (
          <div className="space-y-3">
            <label htmlFor="player" className="block">Futbolcu ara</label>
            <input id="player" value={query} autoComplete="off" placeholder="Oyuncu adı veya soyadı"
              onChange={(event) => { setQuery(event.target.value); setFeedback(""); }}
              className="w-full rounded-xl bg-slate-900 border border-slate-600 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            {suggestions.map((player) => (
              <button key={player.id} className="block w-full text-left rounded-xl bg-slate-800 hover:bg-slate-700 p-4"
                onClick={() => {
                  if (answers.some((item) => item.id === player.id)) {
                    setAnswerId(player.id);
                    setFeedback("Doğru! İki kulüpte de oynadı.");
                  } else setFeedback("Bu eşleşme için başka bir futbolcu dene.");
                }}>{player.name}</button>
            ))}
            {search.length >= 2 && suggestions.length === 0 && <p className="text-slate-400">Bu oyuncu henüz listemizde yok. Başka bir isim deneyebilirsin.</p>}
          </div>
        )}
        <p role="status" className="text-emerald-300">{feedback}</p>
        {answer ? (
          <>
            <div className="bg-slate-900 rounded-xl p-5 space-y-3">
              <p className="text-2xl font-bold">{answer.name}</p>
              <a href={answer.source} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">Kaynağı gör</a>
            </div>
            <button onClick={next} className="w-full bg-emerald-300 text-slate-950 font-bold rounded-xl p-4">Yeni eşleşme</button>
          </>
        ) : (
          <button className="w-full border border-slate-600 rounded-xl p-4 hover:bg-slate-800" onClick={() => {
            setAnswerId(answers[0].id);
            setFeedback("Geçerli cevaplardan biri");
          }}>Cevabı göster</button>
        )}
      </section>
    </main>
  );
}
