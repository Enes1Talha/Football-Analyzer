# Hangisi Daha Fazla — batch 1 review

Reviewed 2026-11-18. Original research is preserved unchanged in
`football_more_less_batch1.json`. It is not automatically trusted or imported.

Run `node scripts/prepare-more-less.mjs` to validate references, comparison
answers, duplicates, pair/player frequency, source coverage and category balance.
This produces `more-less-review.json` and `more-less-approved.json`.
The script performs offline structural validation; it does not re-fetch sources.

## Findings

- 100 questions, 136 referenced players; 43 A, 42 B, 15 equal.
- 98 questions cite UEFA and 2 cite TFF, not 99 plus 2.
- Metric families: 52 goals, 41 appearances, 5 saves, 1 shots on target,
  1 tackles. Both goals and appearances exceed the requested 30% ceiling.
  Category-level balance passes but is not the same requirement.
- 20 fixed-season/tournament comparisons (IDs 081–100) have independently
  checked values. Official UEFA player tables for EURO 2008, 2016, 2020,
  2024 and UCL 2025/26, plus the TFF top-scorer archive, match those values.
  Each approved record retains its source link and review date.
- UEFA `Saves` is retained as the provider's metric. Shoot-out treatment was
  not independently established; do not invent a broader definition.
- The other 80 career comparisons remain pending, not rejected as false.
  Individual values, competition coverage and a common cutoff require review.
  Retirement assumptions do not establish the statistical cutoff.
- The Spanish UEFA career article explicitly states `Last updated: 22:00 CET
  on 30/05/2026`. Therefore source dates must be checked per article rather than
  assumed unavailable. Do not use the page's publication/retrieval date as the
  data cutoff without evidence.

The approved subset remains goal-heavy; a diverse production pool needs
more non-goal/non-appearance questions. Reserves and `needsReview` are excluded.

Next research priority: completed-tournament saves, shots on target, tackles and
other explicitly defined metrics; provide exact table sections and cutoffs for
the 80 career questions. Keep A/B/equal balanced and avoid repeating pairs.

## Fourth game implementation (2026-11-19)

`generate-more-less.mjs` prepares the solo snapshot and migration
`202611180007_more_less.sql` from the 20 approved questions. The migration was
applied to the live project and its 20-row seed verified in SQL Editor.
Do not rerun that migration on an already upgraded database; future changes
must use a new migration. `more-less-room.sql` is its generation template.

Solo: one choice per question, unlimited time, pass reveals the answer. Correct,
played, streak and best streak persist locally under `football-solo-more-less-v1`.
No ranked points are awarded. Questions do not repeat within the current pool
cycle and the cycle boundary avoids an immediate repeat.

Friends: standard room code and accounts, both ready, 3-second countdown,
20-second answer window, one immutable A/B/equal choice per player. The server
reveals values after both answers or timeout. Only one correct player wins
(one win / three ranking points); otherwise it is a draw. A missing answer is
incorrect. Forfeit after countdown awards the opponent a win. Draws appear in
history but do not affect win/loss or weekly ranking points. Rematch uses the
same opponent and excludes the immediately previous question.

New kind `more_less` has separate profile/rival/weekly group statistics. Existing
daily challenges and other games retain their rules. Private-table access,
early/late answers, answer locks, membership, timeout, draw, forfeit, rematch,
history and score separation are covered by `test-game-db.mjs`. Production
build and local browser solo answer/reveal were checked. Real two-device testing
has not been performed.

Solo practice intentionally ships a public question snapshot, consistent with
the existing practice games. Server response redaction prevents early disclosure
through ranked room state, but this is not an anti-cheat guarantee against
inspecting the practice bundle or learning the small pool.
