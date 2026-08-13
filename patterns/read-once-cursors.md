# Read-once cursors

**The problem:** multiple routines reading the same chat surfaces re-process the same messages every run. Beyond the token waste, re-processing invites re-deciding: the same thread triaged twice can land in two different states.

## The registry

Which surfaces exist is pinned in ONE registry file: channels and DM handles with resolved IDs, verified dates, and per-surface notes. The registry, not any routine's judgment, is the scope. A surface on the list that a routine skips is a finding; a surface not on it is out of scope until the human adds it. When a prompt's copy of a count disagrees with the registry, the registry wins.

Hard-won entries worth copying:

- **The write-only surface.** If a routine posts briefs to a self-DM, that surface must be marked WRITE-ONLY in the registry, or the morning sweep ingests the belt's own output as signal.
- **A registry is only complete against the enumeration that built it.** A hand-written list is a snapshot of what existed the day someone wrote it, and chat surfaces get created casually by people with no reason to announce them. A surface spun up during a critical testing window went unmonitored for three days for exactly this reason: it did not exist when the list was made, so nothing was wrong with the list and nothing reported the gap. The fix is a daily discovery step that enumerates what actually exists, diffs against the registry, and raises every unlisted surface as a finding. Discovery reports; scope still belongs to the human, so the finding makes their add a one-line confirmation instead of something they have to think of unprompted.
- **Name collisions.** Two people with the same first name is a data-integrity bug waiting to happen. The registry records which one is "yours," states it was confirmed by the human (not inferred), and instructs routines that content under the other ID is a finding to flag, never a reason to silently switch.

## The cursor contract

State file: one JSON, shared by every routine that reads chat. Per surface: `last_ts`, last-read time.

1. **Read the cursor first, pass it as the window start.** No entry = first read = last 24h, not all history.
2. **Advance only after the receipt is written.** A run that dies mid-read re-reads; it never skips. At-least-once beats at-most-once when the payload is your manager's message.
3. **Cursors are shared across routines.** The morning sweep and the evening sink use the same file, so the evening sees only what arrived after the morning consumed its window. The sharing IS the no-rework mechanism.
4. **Processed once, consequences live in artifacts.** A message that became a work item belongs in the receipt and the tracker, not in a re-read.
5. **Unreachable surface = named finding, cursor unadvanced.**
6. **Catch-up concurrency:** missed runs fire in no guaranteed order. A run advances cursors only if no later-slotted run already stamped today's cache; otherwise it reads cursors, writes its receipt, and leaves the file alone. Duplicate reads cost tokens; a clobbered cursor costs messages.

## Division of labor with search

Cursor reads and search queries are different systems and must not overlap. The cursor sweep owns registry-surface HISTORIES. Search-based sweeps own only what cursors cannot see: mentions of you in channels outside the registry, group DMs whose IDs aren't yet resolved, and `from:me` (which tells you what you already handled). Search routines read the day's sweep receipt as their prior for registry surfaces instead of re-pulling.
