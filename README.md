# The AI PM Operating System

> Six scheduled AI routines ran the operating layer of a real product manager's job for a month: the manager-facing status ledger matured daily, open work stayed reconciled, QA bugs could not rot unnoticed, sprint prep drafted itself, and the system caught and fixed its own defects on a weekly cadence. This repo is that architecture, sanitized and genericized, ready to adapt to any org.

**What this is:** doctrine + routine templates + verification patterns for running the repetitive layer of a PM job on scheduled AI agents (built on Claude Code scheduled tasks, portable to any agent harness with cron and file access).

**What this is not:** a prompt pack. The prompts are the least interesting part. The value is the *system around them*: receipts, liveness, cursors, egress gates, and a retro loop that applies its own lessons. Every pattern here exists because a failure demanded it, and the failure is documented next to the rule.

**What it contains zero of:** employer data. No tickets, no metrics, no names, no internal URLs. The architecture is mine; the data stayed where it belonged.

## The conveyor belt

```
morning GATHER                          evening SYNTHESIZE
08:00 open-work-sync ──┐
  tracker + inbox +    ├──► 18:30 tracker-hygiene ──► 19:00 eod-ledger (the SINK)
  QA-bug watch +       │      auto-close w/ evidence      status ledger write
  chat sweep (cursors) │      decisions-for-you list      tomorrow's prep, pushed
10:00 docs-drift-watch ┘                                  to your phone
                                                              │
WEEKLY LAYER                                                  ▼
Mon   weekly-retro: harvest lessons → APPLY across routines   next morning
Thu   sprint-candidates: ranked draft ← unattended QA bugs    (loop closes)
```

Each routine reads the previous one's receipt instead of re-pulling. Each declares its artifact in a liveness manifest, so a routine that silently fails is impossible to miss. Each commits its own output. The sink accounts for every routine that ran and preps tomorrow before you wake up.

## The eight load-bearing patterns

| Pattern | One line | File |
|---|---|---|
| Receipts + liveness | Every run leaves a dated artifact; no artifact = visible STALE, never a silent no-op | [patterns/receipts-and-liveness.md](patterns/receipts-and-liveness.md) |
| Read-once cursors | Two daily sweeps share one cursor file, so no message is ever processed twice | [patterns/read-once-cursors.md](patterns/read-once-cursors.md) |
| Lessons that propagate | Defects get stamped where found; the Monday retro applies the fix to every routine sharing the failure mode | [patterns/lessons-that-propagate.md](patterns/lessons-that-propagate.md) |
| The Manager Test | An egress firewall between the AI ops layer and anything a human reads in your name | [doctrine/manager-test.md](doctrine/manager-test.md) |
| Cite or abstain | No fact asserted without a source on disk; "I don't know" beats a confident guess | [doctrine/operating-rules.md](doctrine/operating-rules.md) |
| Artifacts first | The first durable write happens before the work, so a dead session loses at most one action | [doctrine/operating-rules.md](doctrine/operating-rules.md) |
| Zero-or-prioritised | Open QA bugs are either zero or each is deliberately in a sprint, queued, or attended; "unattended" is the only alarm | [routines/01-open-work-sync.md](routines/01-open-work-sync.md) |
| The automation charter | Internal machinery executes without approval, verified per change; everything outward-facing stays gated | [doctrine/operating-rules.md](doctrine/operating-rules.md) |

## The tools

| Tool | One line | File |
|---|---|---|
| egress-lint | The mechanical half of the Manager Test: greps a draft for internal ids, workspace paths, ops vocabulary, and AI tells before a human reads it | [tools/egress-lint.mjs](tools/egress-lint.mjs) |
| Liveness manifest | Declares each routine's expected artifact and grace window, so the watchdog can name a silent no-op instead of missing it | [tools/task-liveness-manifest.template.json](tools/task-liveness-manifest.template.json) |
| claim-check | The non-delta check: catches a document that never changed while the truth underneath it did, which every cursor and fingerprint is blind to | [tools/claim-check.mjs](tools/claim-check.mjs) |
| finding-clock | Puts a severity, an owner, and a deadline on every open finding, so a ledger reporting all-green cannot hide an unowned blocker | [tools/finding-clock.mjs](tools/finding-clock.mjs) |

## Adapting it to your org

1. Read [doctrine/daily-pipeline.md](doctrine/daily-pipeline.md) first: it explains why the belt is a pipeline, not six silos.
2. Fill the `<PLACEHOLDERS>` in each routine template: your tracker, your status doc, your channels, your manager's reading taste.
3. Start with two routines, not six: `open-work-sync` and `eod-ledger` deliver most of the value. Add the rest when the receipts prove themselves.
4. Wire the liveness manifest before adding routine three. The belt's first real enemy is the silent no-op.
5. Nothing outbound without a human. The templates ship with every send gated; loosen deliberately, never by default.

## Provenance

Distilled from a production deployment that ran (and runs) a real PM job at a real company. Rules carry the dates of the incidents that created them; where an incident is instructive it is described generically. Sibling repo: [ai-workflow-framework-portability-kit](https://github.com/build-with-dhiraj/ai-workflow-framework-portability-kit), the agent/skill stack these routines run on.

MIT licensed. Use it, fork it, tell me what broke.
