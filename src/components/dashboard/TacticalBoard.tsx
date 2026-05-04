"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send, MessageSquare } from "lucide-react";

interface Entry {
  id: number;
  nickname: string;
  content: string;
  date: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
}

const MOCK_ENTRIES: Entry[] = [
  {
    id: 1,
    nickname: "pressing_teorisi",
    content:
      "city'nin 6 numarası rakip 8'in üzerine kapanmadan önce pozisyon alıyor. bu da arsenal'in çift 8 yapısının neden etkisiz kaldığını açıklıyor. ødegaard topu alabilmek için çok aşağıya inmek zorunda kalıyor ve ofansif etki sıfırlanıyor.",
    date: "04.05.2026 · 23:14",
    upvotes: 47,
    downvotes: 3,
    userVote: null,
  },
  {
    id: 2,
    nickname: "orta_saha_baronu",
    content:
      "declan rice'ın geçen sezon west ham'deki 8 numarası rolüyle şimdiki 6 numarası rolü arasındaki fark çok net. artık daha az top taşıyor ama alan kapatma ve ikinci top kazanma istatistikleri inanılmaz. orta sahanın gerçek efendisi diyorum.",
    date: "04.05.2026 · 22:51",
    upvotes: 31,
    downvotes: 7,
    userVote: null,
  },
  {
    id: 3,
    nickname: "tahtanin_analisti",
    content:
      "her iki takımın 10 numarası da farklı yorumluyor rolü. de bruyne klasik 10 değil zaten, sağ yarı alan oyuncusu gibi koşu yapıyor. bu radar chart tam olarak bunu gösteriyor; key pass farkı buradan geliyor.",
    date: "04.05.2026 · 21:33",
    upvotes: 58,
    downvotes: 2,
    userVote: null,
  },
];

interface TacticalBoardProps {
  teamAName: string;
  teamBName: string;
}

export default function TacticalBoard({ teamAName, teamBName }: TacticalBoardProps) {
  const [entries, setEntries] = useState<Entry[]>(MOCK_ENTRIES);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) { setError("Takma ad boş olamaz."); return; }
    if (content.trim().length < 10) { setError("Analiz en az 10 karakter olmalı."); return; }

    const newEntry: Entry = {
      id: Date.now(),
      nickname: nickname.trim().toLowerCase().replace(/\s+/g, "_"),
      content: content.trim(),
      date: new Date().toLocaleString("tr-TR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }).replace(",", " ·"),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    };

    setEntries([newEntry, ...entries]);
    setNickname("");
    setContent("");
    setError("");
  }

  function handleVote(id: number, type: "up" | "down") {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (e.userVote === type) {
          // Aynı oyu geri al
          return {
            ...e,
            upvotes: type === "up" ? e.upvotes - 1 : e.upvotes,
            downvotes: type === "down" ? e.downvotes - 1 : e.downvotes,
            userVote: null,
          };
        }
        // Önceki oyu iptal edip yeni oy ver
        return {
          ...e,
          upvotes: type === "up"
            ? e.upvotes + 1
            : e.userVote === "up" ? e.upvotes - 1 : e.upvotes,
          downvotes: type === "down"
            ? e.downvotes + 1
            : e.userVote === "down" ? e.downvotes - 1 : e.downvotes,
          userVote: type,
        };
      })
    );
  }

  const inputCls =
    "w-full bg-pitch-dark border border-pitch-border rounded px-3 py-2 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors";

  return (
    <div className="card-glow p-6 space-y-6 animate-slide-up">
      {/* Başlık */}
      <div className="flex items-start gap-3">
        <MessageSquare size={18} className="text-neon-cyan mt-0.5 flex-shrink-0" />
        <div>
          <p className="section-label">Taktik Tahtası</p>
          <h3 className="text-base font-bold tracking-tight mt-0.5">
            {teamAName} vs {teamBName} · Orta Saha Analizi
          </h3>
          <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
            {entries.length} giriş
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 border border-pitch-border rounded-lg p-4 bg-pitch-dark/50">
        <p className="section-label">Yeni Giriş Ekle</p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="takma_adın"
          maxLength={30}
          className={inputCls}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`${teamAName} ve ${teamBName}'ın orta saha dinamiklerini analiz et...`}
          rows={3}
          maxLength={500}
          className={`${inputCls} resize-none`}
        />
        {error && (
          <p className="text-[11px] font-mono text-neon-red">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-600">
            {content.length}/500
          </span>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-1.5 rounded font-mono text-xs font-bold tracking-wider uppercase
              bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30
              hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
          >
            <Send size={12} />
            Gönder
          </button>
        </div>
      </form>

      {/* Entry listesi */}
      <div className="space-y-px">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className="group border-b border-pitch-border/50 last:border-0 py-4 space-y-2"
          >
            {/* Index */}
            <div className="flex gap-4">
              <span className="text-[10px] font-mono text-zinc-700 mt-0.5 flex-shrink-0 w-6 text-right">
                {entries.length - idx}
              </span>

              <div className="flex-1 space-y-3">
                {/* İçerik */}
                <p className="text-sm text-zinc-300 leading-relaxed font-mono">
                  {entry.content}
                </p>

                {/* Alt satır: yazar + tarih + oylar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Upvote */}
                    <button
                      onClick={() => handleVote(entry.id, "up")}
                      className="flex items-center gap-1 text-[11px] font-mono transition-colors"
                      style={{ color: entry.userVote === "up" ? "#39FF14" : "#52525b" }}
                    >
                      <ThumbsUp size={12} />
                      <span>{entry.upvotes}</span>
                    </button>

                    {/* Downvote */}
                    <button
                      onClick={() => handleVote(entry.id, "down")}
                      className="flex items-center gap-1 text-[11px] font-mono transition-colors"
                      style={{ color: entry.userVote === "down" ? "#FF0044" : "#52525b" }}
                    >
                      <ThumbsDown size={12} />
                      <span>{entry.downvotes}</span>
                    </button>
                  </div>

                  {/* Yazar ve tarih — Ekşi Sözlük stili */}
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-neon-cyan/70 hover:text-neon-cyan transition-colors cursor-pointer">
                      {entry.nickname}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 ml-2">
                      {entry.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
