import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const leagueid = request.nextUrl.searchParams.get("leagueid") ?? "39";
  const teamid = request.nextUrl.searchParams.get("teamid") ?? "";
  const type = request.nextUrl.searchParams.get("type") ?? "matches";

  const key = process.env.RAPIDAPI_KEY;
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 503 });

  const headers = {
    "X-RapidAPI-Key": key,
    "X-RapidAPI-Host": "free-api-live-football-data.p.rapidapi.com",
    "Content-Type": "application/json",
  };

  const BASE = "https://free-api-live-football-data.p.rapidapi.com";

  let url = "";
  if (type === "matches") url = `${BASE}/football-get-all-matches-by-league?leagueid=${leagueid}`;
  else if (type === "players") url = `${BASE}/football-get-list-player?teamid=${teamid}`;
  else if (type === "search") url = `${BASE}/football-teams-search?search=${leagueid}`;

  const res = await fetch(url, { headers });
  const text = await res.text();

  let json: unknown;
  try { json = JSON.parse(text); } catch { json = text; }

  // Return first item only to inspect structure
  if (Array.isArray(json)) {
    return NextResponse.json({ total: (json as unknown[]).length, first: (json as unknown[])[0] });
  }
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) {
        const arr = obj[key] as unknown[];
        return NextResponse.json({ key, total: arr.length, first: arr[0], second: arr[1] });
      }
    }
  }
  return NextResponse.json({ raw: json });
}
