/**
 * Usage:
 *   npx tsx scripts/seed-matches.ts
 *
 * Place CSV files in data/csv/ — one per season:
 *   data/csv/E0_2021.csv, E0_2022.csv, ... E0_2425.csv
 *
 * Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// Maps filename → season label  e.g. "E0_2425.csv" → "2024/25"
function seasonFromFilename(filename: string): string {
  const m = filename.match(/(\d{4})/);
  if (!m) return "unknown";
  const yy1 = m[1].slice(0, 2);
  const yy2 = m[1].slice(2, 4);
  return `20${yy1}/20${yy2}`;
}

// Parses DD/MM/YY or DD/MM/YYYY → ISO date string
function parseDate(raw: string): string | null {
  if (!raw) return null;
  const parts = raw.split("/");
  if (parts.length !== 3) return null;
  const [d, mo, y] = parts;
  const year = y.length === 2 ? `20${y}` : y;
  return `${year}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function int(v: string): number | null {
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

function float(v: string): number | null {
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

async function seedFile(filePath: string) {
  const filename = path.basename(filePath);
  const season = seasonFromFilename(filename);
  const rows: object[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (r: Record<string, string>) => {
        const date = parseDate(r["Date"]);
        if (!date || !r["HomeTeam"] || !r["AwayTeam"]) return;

        rows.push({
          div: (r["Div"] || "E0").trim(),
          season,
          date,
          home_team: r["HomeTeam"].trim(),
          away_team: r["AwayTeam"].trim(),
          fthg: int(r["FTHG"]),
          ftag: int(r["FTAG"]),
          ftr: r["FTR"]?.trim() || null,
          hthg: int(r["HTHG"]),
          htag: int(r["HTAG"]),
          htr: r["HTR"]?.trim() || null,
          hs: int(r["HS"]),
          aws: int(r["AS"]),
          hst: int(r["HST"]),
          ast: int(r["AST"]),
          hf: int(r["HF"]),
          af: int(r["AF"]),
          hc: int(r["HC"]),
          ac: int(r["AC"]),
          hy: int(r["HY"]),
          ay: int(r["AY"]),
          hr: int(r["HR"]),
          ar: int(r["AR"]),
          b365h: float(r["B365H"]),
          b365d: float(r["B365D"]),
          b365a: float(r["B365A"]),
        });
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // Upsert in batches of 500
  const BATCH = 500;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await db.from("matches").upsert(batch, {
      onConflict: "div,season,date,home_team,away_team",
      ignoreDuplicates: true,
    });
    if (error) {
      console.error(`  ✗ batch ${i / BATCH + 1} error:`, error.message);
    } else {
      console.log(`  ✓ ${filename} — rows ${i + 1}–${Math.min(i + BATCH, rows.length)} inserted`);
    }
  }

  console.log(`  → ${filename} done (${rows.length} rows, season ${season})\n`);
}

async function main() {
  const csvDir = path.join(process.cwd(), "data", "csv");

  if (!fs.existsSync(csvDir)) {
    console.error(`data/csv/ folder not found. Create it and place your CSV files there.`);
    process.exit(1);
  }

  const files = fs.readdirSync(csvDir).filter((f) => f.endsWith(".csv"));

  if (files.length === 0) {
    console.error("No CSV files found in data/csv/");
    process.exit(1);
  }

  console.log(`Found ${files.length} CSV file(s): ${files.join(", ")}\n`);

  for (const file of files.sort()) {
    console.log(`Seeding ${file}...`);
    await seedFile(path.join(csvDir, file));
  }

  console.log("All done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
