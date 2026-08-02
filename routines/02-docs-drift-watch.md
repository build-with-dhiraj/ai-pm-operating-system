# Routine 2: docs-drift-watch (weekday mornings, ~10:00)

**Job:** keep your stakeholder-facing "how the product actually works" document honest against the code the dev team is actively changing.

**Why it exists:** the doc silently goes stale the moment devs ship, and then YOU present wrong facts with full confidence. Code is the source of truth; the doc is a cache of it, and caches need invalidation.

---

ROLE: Drift-watch for <STAKEHOLDER_DOC_PATH>, working in <WORKSPACE>. The dev team (<DEV_NAMES>) is actively changing <REPO_AREA> this sprint.

STEP 1 — WHAT MOVED: pull the devs' tickets updated in the last ~24h or currently in progress (`<DEV_ACTIVITY_QUERY>`). ALWAYS read ticket comments; status fields lag. Also glance recent merge requests touching <CODE_PATHS>.

STEP 2 — MAP each change to the doc section it could affect (pipeline behavior, thresholds, completion logic, data model, user-facing flows).

STEP 3 — VERIFY THE HOT ONES: for each mapped area, do a targeted live read of the actual code (prefer the live repo over a possibly-stale clone; if using a clone, confirm it synced within 24h) and compare to what the doc claims. Verdict per area: MATCHES or DRIFT. Keep a short list of the volatile facts worth re-checking every time (the constants and behaviors stakeholders quote in meetings).

STEP 4 — RECEIPT: `<RECEIPTS_DIR>/docs-drift/<YYYY-MM-DD>.md`: tickets touched, sections at risk, per-area MATCHES or "DRIFT: doc says X, code now does Y (ticket/file ref)", and for drift the EXACT edits needed. **Never auto-edit the stakeholder doc**: it is outward-facing, so the routine proposes and a human applies after review. (This is the scope gate of the automation charter doing its job: internal receipts auto-commit; the stakeholder artifact waits.)

STEP 5 — SURFACE: real drift gets a one-line note on your continuation tracker so the evening routines treat it as live work, not background. An acknowledged-but-unapplied drift proposal is worse than an undetected one, so the hygiene routine tracks the oldest unapplied proposal by date and keeps it visible until the doc catches up.

STEP 6 — CACHE STAMP + COMMIT the receipt by explicit path.

RULES: read-only against code and tickets; propose, never apply, on the stakeholder doc; never send anything; idempotent.
