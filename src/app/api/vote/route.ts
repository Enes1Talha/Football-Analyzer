import { NextRequest, NextResponse } from "next/server";

// In-memory store — sıfırlanır her deploy'da, gerçek DB'ye geçince burası değişir
const votes: Record<string, { a: number; b: number }> = {};

function getKey(teamA: number, teamB: number) {
  return `${Math.min(teamA, teamB)}_${Math.max(teamA, teamB)}`;
}

export async function GET(request: NextRequest) {
  const teamA = parseInt(request.nextUrl.searchParams.get("teamA") ?? "0");
  const teamB = parseInt(request.nextUrl.searchParams.get("teamB") ?? "0");
  const key = getKey(teamA, teamB);

  if (!votes[key]) votes[key] = { a: 0, b: 0 };

  return NextResponse.json(votes[key]);
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { teamA: number; teamB: number; vote: "a" | "b" };
  const { teamA, teamB, vote } = body;

  if (!teamA || !teamB || !["a", "b"].includes(vote)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const key = getKey(teamA, teamB);
  if (!votes[key]) votes[key] = { a: 0, b: 0 };
  votes[key][vote]++;

  return NextResponse.json(votes[key]);
}
