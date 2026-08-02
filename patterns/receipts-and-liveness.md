# Receipts and liveness

**The problem:** a scheduled routine that fails, half-runs, or never fires looks identical to one that ran clean, unless you force it to leave evidence. The most dangerous state in an automated system is the silent no-op: work you believe is happening, isn't.

## The receipt pattern

Every run writes a dated artifact at a deterministic path (`<RECEIPTS_DIR>/<routine>/<YYYY-MM-DD>.md`) containing: what it pulled, what it changed (with reasons), what it could NOT do (with reasons), and its query/cursor state. Rules:

- **Local date in the filename, never UTC.** Liveness checks and downstream reads resolve "today" locally; a UTC-named receipt from an odd-hour run false-alarms.
- **Sections are written even when empty.** "No new signal" is information; an absent section is indistinguishable from a skipped step.
- **Artifact before action.** Where a routine both plans and executes (e.g. auto-closing tracker items), it writes the plan first, then marks each line "(applied)" as it executes. An entry without "(applied)" means the run died mid-apply, and the next routine flags exactly that.
- **A partial run that names its gaps is a run.** A missing receipt is the only real failure.

## The liveness manifest

One JSON file lists every routine: expected artifact path (with `%DATE%`-style placeholders), scheduled days, due time, grace minutes. A watchdog script runs at every interactive session start and prints STALE/MISSED lines for anything overdue. See [tools/task-liveness-manifest.template.json](../tools/task-liveness-manifest.template.json).

Two subtleties that bit in production:

- **Catch-up runs must name receipts for the MISSED date**, not the run date, or the watchdog reports a permanently open gap for work that actually happened.
- **The manifest is doctrine too.** When a new routine ships without a manifest entry (it happened: two routines shipped a day after the commit rule and without commit steps), the gap class is "rules that live in prompts don't bind new prompts." Periodically audit new routines against ALL standing rules, not just the ones their author remembered.

## Receipts are git history

Every routine commits its own receipt: explicit paths only, never `git add -A` (other surfaces keep work in flight in the same repo), never push without a deliberate remote decision, and a commit failure never fails the run (the file on disk is what liveness reads). Before this rule existed, a month of pipeline output sat untracked in a working tree, one `git clean` from gone.
