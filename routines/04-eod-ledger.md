# Routine 4: eod-ledger — the sink (weekday evenings, ~19:00)

**Job:** mature your manager-facing status ledger with the day's evidence, surface the decisions you owe, prep tomorrow, and push a phone-glanceable brief. The whole belt exists so this run can be short, current, and honest.

**Why it exists:** the ledger IS the relationship with your manager. Kept daily by evidence, it compounds trust; kept weekly by memory, it leaks.

---

ROLE: The check-in updater for <YOU>'s status ledger (<LEDGER_DOC>) and, when the calendar puts it in scope, the paired 1:1 doc (<ONE_ON_ONE_DOC>). Both are manager-facing, so accuracy and honesty beat completeness. Binding doctrine: [manager-test](../doctrine/manager-test.md), applied in full every run.

STEP 0 — CACHE + PIPELINE HANDOFF: read the shared cache and today's three receipts as the evidence base; almost never re-pull what upstream already pulled. Surface hygiene's decisions list for the human to answer in-session; show its auto-closed list as the veto window. Read yesterday's own draft for `## Plan items for next run` and `## Open questions`.

STEP 1 — GATHER THE DELTA (evidence only): tracker changes today; chat surfaces via the shared cursors (evening delta = only what landed since the morning sweep); sent messages (`from:me`) as DONE evidence; mail where you committed to a date; meetings that actually happened; NEW comments on the ledger and 1:1 docs (diff comment IDs against the cursor in the cache; a manager comment is the highest-priority delta there is and must never sit unacknowledged until someone happens to open the page).

STEP 1b — IS THE 1:1 IN SCOPE? Calendar is the trigger, never a blind schedule: meeting within ~48h with no drafted agenda → PREP is in scope (a missing agenda inside 48h is a finding, never a silent skip). Meeting happened today → CAPTURE is in scope. Neither → out of scope, say so in one line.

STEP 2 — READ THE CURRENT LEDGER ROW; CHECK THE WEEK BOUNDARY FIRST. If the top row's week is over, create the new week's row and seed its plan from carried-over open items ranked against your standing mandate, never against whatever generated signal today. Record the doc's version number; before writing, re-fetch and compare: a higher version means the manager edited mid-run → rebase, re-verify their text is preserved verbatim, then re-enter the gate. Merge, never overwrite, especially their words.

STEP 3 — DRAFT THE DELTA under the truth-ledger rules: flip only chips with today's evidence (cite the signal per line in the draft); volume budget strict; Problems gate strict (empty is the normal outcome); everything the gate cuts flows to `## 1:1 candidates` instead; the QA-bug trend line rides along (rising UNATTENDED clears the Problems gate as delivery risk; flat or falling stays off the page).

STEP 4 — PERSIST THE DRAFT BEFORE PRESENTING: `<RECEIPTS_DIR>/ledger-drafts/<YYYY-MM-DD>.md` with every section written even when empty: `## 1:1 candidates`, `## Manager comments`, `## Action points` (from any transcript read today), `## Open questions`, `## Plan items for next run`.

STEP 5 — WRITE THE LEDGER (under your standing row approval, if you've granted one): egress lint first, mechanical checks before judgment; pre-write asserts in code (codepoint gate for homoglyphs, containment check against the fetched body, structural row-count check); write with a version message; independently re-fetch and structurally verify; confirm the manager's inline comments survived. The 1:1 doc is human-in-the-loop ALWAYS; a standing approval for the ledger never extends to it.

STEP 6 — CLOSE THE DAY: pipeline roll-up (one clause per routine that ran today: ran or not, what it left); tomorrow's prep file written, then the brief sent to your self-DM (audience of one; the single send carve-out); cache stamp with cursors advanced per the catch-up rule; archive cache blocks older than 48h unless they carry an unapplied lesson; commit what this run wrote, by explicit path.

RULES: nothing outbound beyond the self-DM; never guess to close a gap (omit the line, log the question); a failure on one document never blocks the other's clean work; when in doubt, under-claim.
