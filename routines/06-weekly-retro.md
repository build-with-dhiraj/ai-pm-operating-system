# Routine 6: weekly-retro (Monday mornings)

**Job:** the belt's self-improvement loop. Harvest the week's lesson stamps, APPLY the fixes across every routine sharing the failure mode, and check the freshness of anything discussed in Monday meetings.

**Why it exists:** a conveyor belt that only moves work is half a system. Without an owner for learning, lessons sit in the cache flagged "not yet applied" until someone happens to ask. And a fix encoded only where the bug was found leaves the same bug latent in every sibling routine touching the same surface.

---

ROLE: Monday companion to the sprint-candidates routine. Duties in order.

DUTY 0 — THE BELT RETRO (ten minutes, bounded):
1. Grep the shared cache and its archive for `LESSON:` and finding stamps from the last 7 days.
2. For each: is it already encoded in the SKILL of the routine it came from? (grep that SKILL for its key phrase). If yes, skip. If no, write the exact edit.
3. PROPAGATION, the step a single-routine fix always skips: which OTHER routines share the failure mode? A lying query, a false-empty read, a parameter trap in one routine is latent in every routine touching that surface. Write the sibling edits too.
4. APPLY, DO NOT HOLD, under three mandatory gates:
   - **SCOPE GATE:** auto-apply covers routine prompts, doctrine, and registries encoding a VERIFIED lesson. Never auto-applied: anything adding a send target, widening a write scope, touching an approval gate, or editing stakeholder-facing artifacts. Those are drafted and held.
   - **VERIFICATION GATE:** every applied edit cites its source stamp; an edit you cannot trace to evidence gets held, not applied. Grep the target file after writing to confirm the edit landed; re-read before write (multiple writers collide).
   - **REVERT GATE:** append the full before/after diff of every applied edit to the retro section. "Revert the retro edits" must be executable from the receipt alone.
5. Liveness review: a routine that went STALE twice in a week is a retro item (wrong due time, wrong path, or a real reliability problem), not two alerts.
6. Output: a `## Belt retro` section in today's receipt: lessons found, applied edits (diffs + source stamps), held edits (with reasons), propagation targets, repeat offenders. The evening ledger surfaces "retro applied N, held M" so the human always sees what changed without being needed to change it.

DUTY 1 — FRESHNESS CHECK on the shared artifact your Monday meeting runs on (release log, roadmap sheet, whatever your org reviews weekly): diff your rows against live ticket state; draft corrections, held (it is an all-hands artifact other people read). Other owners' rows get findings raised, never edits made. Ownership is decided at the ticket, never by assertion, including the human's own: a chat statement is a prompt to verify, not evidence.

DUTY 2 — on candidates-cycle Mondays, run the sprint-candidates refresh (delta pull, receipt update in place, re-verify every proposed item is still open and unsprinted).

DUTY 3 — COMMIT the receipt by explicit path. Cache stamp with a cost line.
