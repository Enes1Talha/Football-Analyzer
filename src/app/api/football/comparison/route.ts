import { NextRequest, NextResponse } from "next/server";
import {
  fetchTeamFormFromSupabase,
  fetchH2HFromSupabase,
  fetchStandingsFromSupabase,
  toCsvName,
} from "@/lib/supabase-football";
import { ComparisonData } from "@/types/football";

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const teamAName = searchParams.get("teamAName") ?? "Manchester City";
  const teamBName = searchParams.get("teamBName") ?? "Arsenal";
  const season    = searchParams.get("season") ?? "2024";
  const league = searchParams.get("league") ?? "39";
  if (league !== "39") {
    return NextResponse.json({ error: "Bu ligin maç verileri henüz yüklenmedi.", detail: "Şu anda karşılaştırma verisi yalnızca Premier League için mevcut." }, { status: 422 });
  }
  if (!/^\d{4}$/.test(season) || toCsvName(teamAName) === toCsvName(teamBName)) {
    return NextResponse.json({ error: "İki farklı takım ve geçerli bir sezon seç." }, { status: 400 });
  }

  // ── Supabase path ─────────────────────────────────────────────────────────
  if (hasSupabase) {
    try {
      const sl = `${season}/${String(parseInt(season) + 1).slice(-2)}`;
      const csvA = toCsvName(teamAName);
      const csvB = toCsvName(teamBName);

      console.log(`[comparison] Supabase ON — teams: "${csvA}" vs "${csvB}", season: "${sl}"`);

      const [formA, formB, h2h, standings] = await Promise.all([
        fetchTeamFormFromSupabase(csvA, sl, 10),
        fetchTeamFormFromSupabase(csvB, sl, 10),
        fetchH2HFromSupabase(csvA, csvB, 6),
        fetchStandingsFromSupabase(sl),
      ]);

      console.log(`[comparison] formA fixtures: ${formA.fixtures.length}, formB: ${formB.fixtures.length}`);

      if (!formA.fixtures.length || !formB.fixtures.length) {
        return NextResponse.json({ error: "Seçilen takım veya sezon için maç verisi bulunamadı.", detail: "Veri kapsamı Premier League ile sınırlı. Başka bir sezon veya takım seç." }, { status: 404 });
      }

      const payload: ComparisonData = {
        teamA: formA,
        teamB: formB,
        midfieldA: null,
        midfieldB: null,
        h2h,
        standings,
      };

      return NextResponse.json(payload, {
        headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=3600" },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      console.error("[comparison] Supabase error:", msg);
    }
  } else {
    console.warn("[comparison] Supabase env vars missing");
  }

  return NextResponse.json(
    { error: "Maç verileri şu anda alınamıyor.", detail: "Lütfen biraz sonra tekrar dene." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}
