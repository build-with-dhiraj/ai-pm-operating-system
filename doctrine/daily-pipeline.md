# The daily pipeline

Six routines form a forward pipeline: morning routines GATHER, evening routines SYNTHESIZE, and each reads the ones before it instead of re-pulling. This file is the doctrine that keeps them a pipeline instead of six silos.

## Inputs → outputs

| Time | Routine | Reads | Writes |
|---|---|---|---|
| ~08:00 | open-work-sync | tracker (assigned to you), support channel, QA-bug filter, chat surfaces (via cursors) | open-work receipt + refreshed manager-visible worklist |
| ~10:00 | docs-drift-watch | the dev team's recent changes vs your stakeholder-facing doc | drift receipt (proposed edits, never auto-applied) |
| ~18:30 | tracker-hygiene | both morning receipts + your private tracker | hygiene artifact: evidence-backed auto-closes, decisions-for-you list, tracker snapshot |
| ~19:00 | eod-ledger (SINK) | all three receipts + the day's chat/mail/calendar delta + new comments on your status doc | status-ledger write, tomorrow's prep file, phone brief, tracker write-back |
| Mon AM | weekly-retro | the week's lesson stamps + liveness log | applied SKILL edits (gated), freshness checks |
| biweekly | sprint-candidates | receipts + backlog + unattended QA bugs | ranked candidates draft, held for your attended send |

## The five rules that make it a pipeline

1. **Read forward, don't re-pull.** Each downstream routine reads the same-day upstream receipts (deterministic paths, `<dir>/<YYYY-MM-DD>.md`) and pulls only what upstream didn't cover. The sink should almost never re-run a full tracker pull.
2. **Degrade loudly.** If an upstream receipt is missing, the downstream routine says so explicitly and falls back to a live pull. A broken upstream must never silently corrupt downstream.
3. **One-line cache stamp each.** Every routine appends one line to a shared rolling cache file, so the whole day's pipeline is visible in one place and any surface (including your interactive sessions) inherits it.
4. **Liveness on every step.** Every routine declares its expected artifact in the liveness manifest. A step that leaves no artifact is a visible STALE at your next session start, never a silent no-op.
5. **Each routine commits its own receipt.** Explicit paths only, never `git add -A` (other writers keep work in flight in the same repo). A commit failure never fails the run: the file on disk is what liveness reads.

## The sink closes the loop

The evening sink does three things beyond writing the ledger:

- **Pipeline roll-up.** It accounts for EVERY routine that ran that day, not just the ones it consumes. One clause each: ran or not, what it found, what it left for you.
- **Tomorrow's prep, pushed not parked.** It writes a prep file (the day in order, staged drafts, expected morning outputs) and sends a phone-glanceable brief to a channel only you read. Friday's run preps Monday. The file is written before the send, so a failed send never loses the work.
- **Cache pruning, gated on lessons.** It archives cache stamps older than 48h, but may not archive a block carrying an unapplied lesson without first surfacing it. Pruning can never be the thing that loses a lesson.

## The belt learns

- Any run that discovers a routine-level defect (a lying query, a parameter trap, a false-empty read) marks it in its cache stamp with `LESSON:`. The stamp is the capture; capture is every routine's job.
- The Monday retro harvests the week's stamps and APPLIES the fixes (under the three gates in [lessons-that-propagate](../patterns/lessons-that-propagate.md)), propagating each to every routine that shares the failure mode. A bug found in one routine is latent in every routine touching the same surface.
- Cadence: capture daily, apply weekly, prune nightly.

## Catch-up inversion

Scheduled tasks on a laptop fire only while the machine is awake. Missed slots fire on next launch, in no guaranteed order. Three rules keep that from corrupting the belt:

- A catch-up run names its receipt for the MISSED date, not today, so liveness clears and gaps stay honest.
- The degrade-loudly rule covers out-of-order arrival: the sink says which upstream was missing and falls back.
- A catch-up run that is not the day's latest belt run never advances shared cursors (see [read-once-cursors](../patterns/read-once-cursors.md)); duplicate reads cost tokens, a clobbered cursor costs messages.
