export interface RoomState {
  question?:import('@/components/game/MoreLess').ComparisonQuestion|null; myChoice?:string|null; opponentChoice?:string|null; opponentAnswered?:boolean;
  careerMatch?:boolean; round?:number; roundDone?:boolean; myScore?:number; opponentScore?:number; targetScore?:number;
  roundPoints?:number|null; lastRoundPoints?:number|null; roundWon?:boolean|null;
  gameKind?: "clubs" | "anagram" | "career" | "more_less"; difficulty?: "easy" | "medium" | "hard"; ready?: boolean;
  career?: import('./career').CareerStage[]; totalClues?:number; careerSource?:string|null; nextClueAt?:number|null;
  puzzle?: string | null; serverMs?: number; startsAt?: number | null; endsAt?: number | null;
  code: string; status: "waiting" | "playing" | "finished" | "void";
  host: boolean; opponent: string | null; team: string | null; opponentTeam: string | null;
  opponentReady: boolean; remaining: number | null; won: boolean | null;
  answer: string | null; reason: string | null; incorrect?: boolean;
}

// Requests can arrive out of order. A locked choice and a final result never regress.
export function mergeRoomState(previous: RoomState, next: RoomState): RoomState {
  if (next.incorrect || next.code !== previous.code) return previous;
  if (previous.status === "finished" || previous.status === "void") return previous;
  if (next.status === "finished" || next.status === "void") return next;
  if (previous.status === "playing" && next.status === "waiting") return previous;
  return {
    ...next,
    team: next.team ?? previous.team,
    opponent: next.opponent ?? previous.opponent,
    opponentTeam: next.opponentTeam ?? previous.opponentTeam,
    opponentReady: next.opponentReady || previous.opponentReady,
    remaining: previous.remaining === null ? next.remaining : next.remaining === null
      ? previous.remaining : Math.min(previous.remaining, next.remaining),
  };
}
