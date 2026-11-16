import { supabase } from "./supabase";
import type { RoomState } from "./game-room-state";
export type { RoomState } from "./game-room-state";
export const levelWins = [0, 1, 3, 5, 10, 20, 35, 50, 75, 100];
export function levelFor(wins: number) { return Math.min(10, levelWins.filter((n) => wins >= n).length); }
export interface GameProfile { id: string; username: string; wins: number; losses: number; rank: number }
export interface GameDashboard {
  profile: GameProfile | null; streak: number; leaderboard: GameProfile[];
  rivals: { opponent_id: string; opponent: string; wins: number; losses: number }[];
  history: { code: string; opponent: string; won: boolean; finished_at: string; host_team: string; guest_team: string; answer: string | null; reason: string }[];
}
export function gameError(error: { message?: string; code?: string }) {
  if (error.code === "PGRST202" || error.code === "42P01") return "Hesap ve oyun kayıt sistemi henüz etkinleştirilmedi. Lütfen daha sonra tekrar dene.";
  if (error.message?.includes("Failed to fetch")) return "Bağlantı kurulamadı. Tekrar dene.";
  return error.message || "İşlem tamamlanamadı. Tekrar dene.";
}
export async function roomAction(action: string, code = "", value = ""): Promise<RoomState> {
  const { data, error } = await supabase.rpc("game_room", { p_action: action, p_code: code, p_value: value });
  if (error) throw new Error(gameError(error));
  return data as RoomState;
}
