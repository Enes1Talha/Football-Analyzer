# Game data workflow

The game uses a versioned snapshot, not a live Wikidata call during a round.

1. `node scripts/import-game-wikidata.mjs` fetches club memberships with positive P1350 (appearances) qualifiers and excludes deprecated statements. Club-scoped responses are cached under ignored `node_modules/.cache/game-import/` so a network interruption can resume. Remove only that cache when deliberately fetching a fresh snapshot.
2. Review `scripts/game-wikidata-candidates.json`: canonical club IDs, player identity, club links and statement evidence. Club IDs must refer to the senior football side, never a youth side, city or another sport. The importer selects up to 400 players with at least two supported clubs. The initial released sample favored more club links; future imports prioritize Turkish-club links and Messi before club-link count. This is a sample, not a complete player index. Do not remove previously published players accidentally when refreshing a sample: merge the previous snapshot or create an explicit reviewed removal migration.
3. `node scripts/prepare-game-catalog.mjs` validates the evidence and prepares the compact client JSON. Existing curated player IDs are preserved when names/aliases match. Review name collisions before publishing.
4. `npx tsx scripts/generate-game-catalog.ts supabase/migrations/NEW_TIMESTAMP_game_catalog.sql` creates a new additive server snapshot. Never modify old, applied migrations.
5. `npx tsx scripts/test-game-db.mjs`, TypeScript checks and production build must pass. Apply the new SQL migration before publishing the matching client.

Wikidata is community-maintained. A positive recorded appearance count is an admission filter, not an independent audit or guarantee of completeness. Do not label every imported row manually verified. Absence from the snapshot does not prove a player never played for a club. Existing curated links are retained even if missing from Wikidata. Loan spells with appearances count; youth-only and zero-appearance claims are not admitted by the importer.

Sources and license:
- https://www.wikidata.org/wiki/Wikidata:Data_access
- https://www.wikidata.org/wiki/Wikidata:Licensing (structured data: CC0)
- https://www.wikidata.org/wiki/Property:P54 (club membership)
- https://www.wikidata.org/wiki/Property:P1350 (appearances)

The checked-in evidence snapshot retains statement URLs and retrieval time. It does not contain player photos or club logos; their licenses are separate.
