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

## Claude batch one (2026-11-17)

Solo practice uses the shared player catalog and a public word snapshot at `src/lib/solo-anagrams.json`. After adding anagram seed migrations, run `node scripts/generate-solo-anagrams.mjs` and `npx tsx scripts/test-game-db.mjs` to verify it matches the migrated database. The generator handles additive literal seeds only; edits/removals require a reviewed update. Local practice records are browser-local, separated by game and difficulty; they never call the ranked score RPCs. Manual two-device testing remains separate from solo code tests (`npx tsx scripts/test-solo-game.ts`).

`football_players_batch1.json` is the original untrusted research proposal: 50 players and 335 career links, plus reserves and uncertain records. Do not import it wholesale. `claude-batch1-review.json` captures the pre-import comparison: 30 existing players, 20 new candidates, and no new supported-club links for the existing players.

`claude-batch1-admission.json` retains positive-appearance Wikidata statements for the new candidates. Fourteen meet the existing two-supported-club admission rule, adding 32 links in `game/reviewed-players.json`. This is corroboration against the community dataset, not independent official verification: Wikipedia and Wikidata can share sources. Guti's proposal was also marked uncertain; his two memberships were separately matched to positive-appearance statements. No uncertain 2026 transfer or reserve-only entry was imported.

Six candidates are deferred: Pepe (identity unresolved in the automated title lookup), Davinson Sánchez (no matching positive-appearance statements in the cached subset), and Muslera, Mertens, Osimhen, Hamšík (only one supported club each). This does not dispute their careers. Other career clubs remain in the proposal for later expansion. No new selectable club is introduced here.

The 38 new anagram words use ASCII puzzles; the existing answer normalizer accepts accents/Turkish characters. Released words keep their difficulty. New words use up to five letters for easy, six to eight for medium, longer for hard, as an initial rule to tune after playtesting. The catalog now has 417 players and 58 anagram words after applying migrations 202611170004 and 202611170005. Neither file changes existing game results.

`review-claude-batch.ts` and `prepare-claude-batch.ts` are batch-one preparation tools, not a recurring refresh job. They require the original cached club data and saved identity responses; the latter refuses to overwrite the generated migration. Keep the pre-import review as an audit baseline. Future batches need their own evidence snapshot and new migration filenames.
