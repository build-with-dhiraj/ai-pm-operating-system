# Lessons that propagate

**The problem:** agent systems re-break in the same places because fixes live in one prompt, in one person's memory, or nowhere. A lying query pattern discovered in routine A will bite routine B next month unless something carries it across.

## Capture: stamp lessons where they happen

Any run that discovers a routine-level defect marks it in its cache stamp with `LESSON:` plus one line. Examples of the class: an API that reports the sprint someone clicked start on rather than the one the team is working; a text search that misses @mentions because the platform stores them as account IDs; a field that lives in a different custom field than documented; a moved ticket whose old key silently redirects. The stamp is the capture; capture is every routine's job, not a special one's.

## Apply: the weekly retro, with teeth

The Monday retro greps the week's stamps, writes the exact prompt edits, and APPLIES them, under three gates that make unattended self-modification safe:

- **Scope gate:** auto-apply covers routine prompts, doctrine, and registries encoding a VERIFIED lesson. Never auto-applied: new send targets, wider write scopes, approval-gate changes, stakeholder-artifact edits. Held for the human, always.
- **Verification gate:** every applied edit cites the stamp that proved it; unattributable edits get held. Grep the target after writing; re-read before writing (concurrent writers are real).
- **Revert gate:** full before/after diff in the retro receipt. Undo must be executable from the receipt alone.

## Propagate: the step a single-routine fix always skips

For each lesson, ask which OTHER routines share the failure mode. All routines read the same connectors, so a defect found in one is latent in every routine touching that surface. Write the sibling edits in the same retro. (The founding incident: a board-lag workaround got encoded only in the routine that found it, while a new routine built three days later inherited the raw bug, ready to put false findings in front of the human on sprint-planning day. An audit caught it; the propagation step exists so an audit doesn't have to.)

## Age: unanswered decisions must not look fresh

The companion pattern for decisions the human owes: every "needs you" item carries `first asked <date> · asked ×N`. At ×3, low-stakes items get the written recommendation applied (decide-like-the-owner); everything else is promoted as DECISION DEBT to the top of the list. A question that looks identical on day 1 and day 9 is how decision queues rot.
