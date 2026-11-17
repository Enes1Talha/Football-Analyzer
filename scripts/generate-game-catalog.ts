import { writeFileSync } from "node:fs";
import { players } from "../football-analyzer-mobile/game/data";

// Supply a NEW migration path; never overwrite an applied migration.
const destination = process.argv[2];
if (!destination || !/^supabase\/migrations\/\d+_[a-z_]+\.sql$/.test(destination)) {
  throw new Error("Usage: npx tsx scripts/generate-game-catalog.ts supabase/migrations/TIMESTAMP_name.sql");
}
const quote = (value: string) => `'${value.replace(/'/g, "''")}'`;
const rows = players.map((p) =>
  `-- ${p.source}\n (${quote(p.id)},${quote(p.name)},array[${p.clubs.map(quote).join(",")}])`
).join(",\n");
writeFileSync(destination, `-- Generated from football-analyzer-mobile/game/data.ts.\n-- Additive upsert: no profiles, rooms or scores are modified.\nbegin;\ninsert into public.game_players (id,name,clubs) values\n${rows}\non conflict (id) do update set name=excluded.name,clubs=excluded.clubs;\ncommit;\n`, { flag: "wx" });
console.log(`Created ${destination}: ${players.length} source-backed players.`);
