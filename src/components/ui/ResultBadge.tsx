"use client";

import { MatchResult } from "@/types/football";

const LABELS: Record<MatchResult, string> = { W: "W", D: "D", L: "L" };
const CLASSES: Record<MatchResult, string> = {
  W: "badge-win",
  D: "badge-draw",
  L: "badge-loss",
};

interface ResultBadgeProps {
  result: MatchResult;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export default function ResultBadge({ result, size = "md" }: ResultBadgeProps) {
  return (
    <span className={`${CLASSES[result]} ${SIZE_CLASSES[size]} inline-flex items-center justify-center rounded`}>
      {LABELS[result]}
    </span>
  );
}
