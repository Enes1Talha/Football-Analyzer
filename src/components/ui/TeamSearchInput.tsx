"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";

interface TeamResult {
  id: number;
  name: string;
  logo: string;
  country: string;
}

interface TeamSearchInputProps {
  label: string;
  onSelect: (team: TeamResult) => void;
  defaultTeam?: TeamResult;
  accentColor?: string;
}

export default function TeamSearchInput({
  label,
  onSelect,
  defaultTeam,
  accentColor = "#39FF14",
}: TeamSearchInputProps) {
  const [query, setQuery] = useState(defaultTeam?.name ?? "");
  const [results, setResults] = useState<TeamResult[]>([]);
  const [selected, setSelected] = useState<TeamResult | null>(defaultTeam ?? null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/football/search-teams?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selected) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query), 400);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, search, selected]);

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
    setResults([]);
    onSelect(team);
  }

  function handleClear() {
    setSelected(null);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-[10px] font-mono text-zinc-500 mb-1 tracking-widest uppercase">
        {label}
      </label>

      <div
        className="flex items-center gap-2 bg-pitch-dark border border-pitch-border rounded px-3 py-2 transition-colors focus-within:border-zinc-600"
        style={selected ? { borderColor: `${accentColor}40` } : {}}
      >
        {selected?.logo ? (
          <Image src={selected.logo} alt={selected.name} width={16} height={16} unoptimized className="object-contain flex-shrink-0" />
        ) : (
          <Search size={13} className="text-zinc-600 flex-shrink-0" />
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Takım ara..."
          className="bg-transparent text-sm font-mono text-white placeholder-zinc-600 focus:outline-none w-full"
        />

        {loading && (
          <svg className="animate-spin flex-shrink-0" width={13} height={13} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1e1e1e" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {selected && (
          <button onClick={handleClear} className="text-zinc-600 hover:text-zinc-400 flex-shrink-0">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Selected badge */}
      {selected && (
        <p className="mt-1 text-[10px] font-mono tracking-wider" style={{ color: accentColor }}>
          ID: {selected.id} · {selected.country}
        </p>
      )}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-pitch-card border border-pitch-border rounded-lg shadow-xl overflow-hidden">
          {results.map((team) => (
            <button
              key={team.id}
              onClick={() => handleSelect(team)}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-pitch-muted transition-colors"
            >
              {team.logo ? (
                <Image src={team.logo} alt={team.name} width={20} height={20} unoptimized className="object-contain flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-pitch-muted flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-mono text-white leading-tight">{team.name}</p>
                {team.country && (
                  <p className="text-[10px] text-zinc-500">{team.country}</p>
                )}
              </div>
              <span className="ml-auto text-[10px] font-mono text-zinc-600">#{team.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
