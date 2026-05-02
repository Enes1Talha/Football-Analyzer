import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://free-api-live-football-data.p.rapidapi.com";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const key = process.env.RAPIDAPI_KEY;
  if (!key || key === "your_rapidapi_key_here") {
    return NextResponse.json({ error: "API key not configured" }, { status: 503 });
  }

  const res = await fetch(
    `${BASE_URL}/football-teams-search?search=${encodeURIComponent(q)}`,
    {
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": "free-api-live-football-data.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }

  const data = await res.json();

  // Extract teams array from any response shape
  let teams: unknown[] = [];
  if (Array.isArray(data)) teams = data;
  else if (data && typeof data === "object") {
    for (const key of ["response", "teams", "data", "results", "result"]) {
      if (Array.isArray((data as Record<string, unknown>)[key])) {
        teams = (data as Record<string, unknown>)[key] as unknown[];
        break;
      }
    }
  }

  // Normalize to { id, name, logo }
  const results = (teams as Record<string, unknown>[]).slice(0, 10).map((t) => ({
    id: t.team_id ?? t.id ?? 0,
    name: t.team_name ?? t.name ?? "Unknown",
    logo: t.team_badge ?? t.logo ?? t.team_logo ?? "",
    country: t.team_country ?? t.country ?? "",
  }));

  return NextResponse.json({ results });
}
