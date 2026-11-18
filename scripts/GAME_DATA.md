# Game data workflow

## Career match scoring (2026-11-18)

Migration `202611180001_career_match_scoring.sql` makes newly created career rooms multi-round matches. The first correct answer earns `100 - round(80 * (revealed - 2) / (total - 2))`, clamped to 20–100, calculated from server time and the stored route. First to at least 300 wins; overshoot is retained. A timed-out round earns zero and both players ready up for the next round. The match remains `playing` between rounds so only the final result contributes to win/loss and level calculations. Leaving after the first round begins, including between rounds or during subsequent countdowns, forfeits the match. Rematches start at zero. A round-number token rejects delayed answers; row locks prevent duplicate scoring. Used routes are excluded until the pool is exhausted, with no immediate repeat afterwards.

Previously created career rooms retain their single-round rules and history. Their protected legacy RPC is no longer callable directly. The public wrapper applies authentication and delegates old games unchanged. Friend records are grouped independently by game; daily/weekly leaderboards are a separate future feature. Solo awards the same 20–100 practice points in browser-local storage while retaining old records; it never alters ranked scores. The 300 target applies to friend matches only.

The database test suite first verifies legacy rooms, then applies the scoring upgrade and tests first/last-clue awards, score tampering, stale answers, cooldown, timeout continuation, single match result, forfeits and rematch resets. A production two-device playtest remains separate.

## Batch three and Career Route (2026-11-17)

Current total: 523 catalog players, 204 anagrams and 10 admitted career trails. Migrations 010–012 add the new catalog, 70 words and the career room implementation. Original results and released word difficulties are preserved. `football_players_batch3.json` retains the proposal; `batch-three-review.json` records admission decisions. The 113 new club connections are attributed to the researcher's official UEFA sources; they are partial European-competition histories, not independently audited complete careers.

The ten career trails retain secondary Wikipedia provenance. Club returns and loans are displayed. Quaresma, Arda Turan, Roberto Carlos, Kuyt and Popescu are deferred because their proposed chronology, senior appearances or completeness needs further review. Meireles starts with the Aves loan, followed by his senior Boavista spell. Ferran Torres–PSG and Rodri–Barcelona were not removed merely on the proposal's uncertainty flags: current UEFA player pages corroborate those clubs. Sources: https://www.uefa.com/uefachampionsleague/clubs/players/250088320--ferran-torres/ and https://www.uefa.com/uefachampionsleague/clubs/players/250082664--rodri/.

Solo starts with two clubs and manually reveals subsequent clues, with no deadline and browser-local practice records. Friend rooms reveal two clubs after the shared three-second countdown, then one club every eight seconds; the final club remains for twenty seconds. Only revealed stages are returned while playing; the full route, answer and source are returned after the round. Career tables are inaccessible directly to anonymous/authenticated clients. Server row locks, deadlines and the existing scoring flow determine the winner. The public solo catalog is practice content, not an anti-cheat secret; ranked opponents can research answers externally.

Run `scripts/test-career.ts`, `scripts/test-game-db.mjs`, the existing solo/state tests and the production build before release. Refresh the research exclusion snapshot with `scripts/export-claude-research.ts`; it now includes admitted career trails. Real two-device acceptance testing remains separate from these automated checks.

## Batch two (2026-11-17)

Current total: 473 catalog players, of which 469 have at least two supported clubs; 134 anagram words in both ranked and solo modes. Batch two adds 50 proposed new players, resolves Pepe and Davinson Sánchez, and admits Muslera/Mertens/Osimhen/Hamšík for anagrams only (one supported club; they create no two-club pairs). Diego Ribas retains `wd-Q109428` and gains Fenerbahçe. New records use local `research-` IDs rather than invented Wikidata identities.

`football_players_batch2.json` retains the researcher's per-link evidence and source classifications. `batch-two-admission.json` records the import scope. These are attributed research records, not a claim that every secondary-source career was independently audited. The original 50 candidates contain 19 official and 101 secondary-source links. Targeted checks opened UEFA's Pepe appearance-by-club list, Orkun Kökçü's Beşiktaş appearance page, Uğurcan Çakır and Davinson Sánchez's Galatasaray pages, Nélson Semedo's Fenerbahçe page and the Turkish-player statistics article. Diego and Davinson's Wikipedia pages were also consulted. Remaining secondary claims retain the researcher's provenance; they are not upgraded to official evidence. Uncertain links, reserve candidates and transfer-date claims are not imported.

The 76 added words comprise 50 new-player words, 20 existing-player suggestions and six deferred-player words. DIEGOREYES and BRUNOALVES disambiguate the submitted REYES/ALVES words; longer words use the hard duration. Existing word difficulties are unchanged. Ø is normalized to O in both client and server answers for SØRLOTH. Sources describe historical appearances; counts are not displayed as current statistics.

Official spot-check sources:
- https://www.uefa.com/uefachampionsleague/news/0257-0e9a10f58015-92c648e6303d-1000--who-has-played-100-champions-league-games-manuel-neuer-u/
- https://www.uefa.com/uefaeuropaleague/clubs/players/250113211--orkun-kokcu/
- https://www.uefa.com/uefachampionsleague/clubs/players/250078452--ugurcan-cakir/
- https://www.uefa.com/uefachampionsleague/clubs/players/250099374--davinson-sanchez/
- https://www.uefa.com/uefachampionsleague/clubs/players/250086090--nelson-semedo/
- https://www.uefa.com/uefachampionsleague/news/021f-0e8fa1bf34c8-19dac14734d8-1000--arda-guler-hakan-calhanoglu-burak-yilmaz-who-are-turkiye-s-t/

Preparation scripts are one-time, pre-import tools. `prepare-batch-two.ts` refuses to overwrite its migration; do not rerun it against the already merged catalog. Refresh research exports after future batches and update any dated prompt counts before sending them.

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
