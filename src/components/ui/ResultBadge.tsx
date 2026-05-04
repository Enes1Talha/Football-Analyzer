"use client";

import { MatchResult } from "@/types/football";

const LABELS: Record<MatchResult, string> = { W: "W", D: "D", L: "L" };
const CLASSES: Record<MatchResult, string> = {
  W: "badge-win",
  D: "badge-draw",
  L: "badge-loss",
};

const SIZE_CLASSES = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

interface ResultBadgeProps {
  result: MatchResult;
  size?: "sm" | "md" | "lg";
  index?: number; // animasyon gecikmesi için
}

export default function ResultBadge({ result, size = "md", index = 0 }: ResultBadgeProps) {
  return (
    <span
      className={`${CLASSES[result]} ${SIZE_CLASSES[size]} inline-flex items-center justify-center rounded opacity-0`}
      style={{
        animation: `slideUp 0.4s ease-out ${index * 0.08}s forwards`,
      }}
    >
      {LABELS[result]}
    </span>
  );
}
