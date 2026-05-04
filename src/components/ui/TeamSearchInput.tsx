"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Search, X, ChevronDown } from "lucide-react";

interface TeamResult {
  id: number;
  name: string;
  logo: string;
  country: string;
}

const L = (id: number) => `https://media.api-sports.io/football/teams/${id}.png`;

const POPULAR_TEAMS: TeamResult[] = [
  { id: 50,  name: "Manchester City",   logo: L(50),  country: "England" },
  { id: 42,  name: "Arsenal",           logo: L(42),  country: "England" },
  { id: 40,  name: "Liverpool",         logo: L(40),  country: "England" },
  { id: 49,  name: "Chelsea",           logo: L(49),  country: "England" },
  { id: 33,  name: "Manchester United", logo: L(33),  country: "England" },
  { id: 47,  name: "Tottenham",         logo: L(47),  country: "England" },
  { id: 541, name: "Real Madrid",       logo: L(541), country: "Spain" },
  { id: 529, name: "FC Barcelona",      logo: L(529), country: "Spain" },
  { id: 530, name: "Atletico Madrid",   logo: L(530), country: "Spain" },
  { id: 157, name: "Bayern Munich",     logo: L(157), country: "Germany" },
  { id: 165, name: "Borussia Dortmund", logo: L(165), country: "Germany" },
  { id: 489, name: "AC Milan",          logo: L(489), country: "Italy" },
  { id: 496, name: "Juventus",          logo: L(496), country: "Italy" },
  { id: 505, name: "Inter Milan",       logo: L(505), country: "Italy" },
  { id: 85,  name: "Paris Saint-Germain", logo: L(85), country: "France" },
  { id: 645, name: "Galatasaray",       logo: L(645), country: "Turkey" },
  { id: 630, name: "Fenerbahçe",        logo: L(630), country: "Turkey" },
  { id: 641, name: "Beşiktaş",          logo: L(641), country: "Turkey" },
  { id: 601, name: "Trabzonspor",       logo: L(601), country: "Turkey" },
];

interface TeamSearchInputProps {
  label: string;
  onSelect: (team: TeamResult) => void;
  accentColor?: string;
}

export default function TeamSearchInput({
  label,
  onSelect,
  accentColor = "#39FF14",
}: TeamSearchInputProps) {
  const [query, setQuery] = useState("");
  const [apiResults, setApiResults] = useState<TeamResult[]>([]);
  const [selected, setSelected] = useState<TeamResult | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Popüler takımları query'ye göre filtrele
  const filteredPopular = query.length === 0
    ? POPULAR_TEAMS
    : POPULAR_TEAMS.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.country.toLowerCase().includes(query.toLowerCase())
      );

  const displayResults = apiResults.length > 0 ? apiResults : filteredPopular;

  const searchApi = useCallback(async (q: string) => {
    if (q.length < 2) { setApiResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/football/search-teams?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.results?.length > 0) setApiResults(data.results);
      else setApiResults([]);
    } catch {
      setApiResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selected) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => searchApi(query), 500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, searchApi, selected]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(team: TeamResult) {
    setSelected(team);
    setQuery(team.name);
    setOpen(false);
    setApiResults([]);
    onSelect(team);
  }

  function handleClear() {
    setSelected(null);
    setQuery("");
    setApiResults([]);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
        {label}
      </label>

      <div
        className="flex items-center gap-2 bg-pitch-dark border border-pitch-border rounded px-3 py-2 transition-colors focus-within:border-zinc-600 cursor-text"
        style={selected ? { borderColor: `${accentColor}40` } : {}}
        onClick={() => !selected && setOpen(true)}
      >
        <Search size={13} className="text-zinc-600 flex-shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Takım adı yaz veya seç..."
          className="bg-transparent text-sm font-mono text-white placeholder-zinc-600 focus:outline-none w-full"
        />

        {loading && (
          <svg className="animate-spin flex-shrink-0" width={13} height={13} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1e1e1e" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {selected ? (
          <button onClick={handleClear} className="text-zinc-600 hover:text-zinc-400 flex-shrink-0">
            <X size={13} />
          </button>
        ) : (
          <ChevronDown size={13} className="text-zinc-600 flex-shrink-0" />
        )}
      </div>

      {selected && (
        <p className="mt-1 text-[10px] font-mono tracking-wider" style={{ color: accentColor }}>
          ✓ {selected.country} · ID: {selected.id}
        </p>
      )}

      {/* Dropdown */}
      {open && !selected && (
        <div className="absolute z-50 top-full mt-1 w-full bg-pitch-card border border-pitch-border rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          {query.length === 0 && (
            <p className="px-3 py-2 text-[10px] font-mono text-zinc-500 tracking-widest uppercase border-b border-pitch-border">
              Popüler Takımlar
            </p>
          )}
          {displayResults.length === 0 && (
            <p className="px-3 py-3 text-sm font-mono text-zinc-500 text-center">Takım bulunamadı</p>
          )}
          {displayResults.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelect(team)}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-pitch-muted transition-colors border-b border-pitch-border/50 last:border-0"
            >
              {team.logo ? (
                <Image src={team.logo} alt={team.name} width={18} height={18} unoptimized className="object-contain flex-shrink-0" />
              ) : (
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-white leading-tight truncate">{team.name}</p>
                <p className="text-[10px] text-zinc-500">{team.country}</p>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 flex-shrink-0">#{team.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
