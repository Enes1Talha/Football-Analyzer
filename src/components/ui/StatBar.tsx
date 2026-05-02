"use client";

interface StatBarProps {
  label: string;
  valueA: number;
  valueB: number;
  max?: number;
  colorA?: string;
  colorB?: string;
}

export default function StatBar({
  label,
  valueA,
  valueB,
  max,
  colorA = "#39FF14",
  colorB = "#00FFFF",
}: StatBarProps) {
  const total = max ?? Math.max(valueA + valueB, 1);
  const pctA = Math.round((valueA / total) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-mono">
        <span style={{ color: colorA }} className="font-bold">
          {valueA}
        </span>
        <span className="text-zinc-500 text-[10px] tracking-widest uppercase">{label}</span>
        <span style={{ color: colorB }} className="font-bold">
          {valueB}
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-pitch-muted">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${pctA}%`, backgroundColor: colorA }}
        />
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${pctB}%`, backgroundColor: colorB }}
        />
      </div>
    </div>
  );
}
