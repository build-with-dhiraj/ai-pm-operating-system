# Scheduled over on-demand

**The problem:** a scheduled routine that fails is loud, because something expected an artifact and no artifact arrived. A tool you run by hand fails by not being run, and nothing expected anything. There is no missing file, no overdue line, no gap in a log. It stops, and the day it stops looks exactly like the day before.

## The incident that priced it

The belt ran alongside two on-demand tools: catch-up utilities invoked when you wanted a fuller picture than the scheduled routines gave. They were good tools. They were also the only things on the roster with no liveness entry, because liveness is defined against a due time and they had none.

One day they were run for the last time. Nobody ran them again. Nobody noticed for two weeks.

The cost was not the missed catch-ups. One of the two was the SOLE owner of a daily capability, turning meeting recordings into durable notes, so that capability stopped the same day and about two dozen recordings piled up unprocessed. Meanwhile every scheduled routine ran, every receipt landed, and liveness was clean. By its own instruments the system was healthy for two weeks while one of its jobs was dead.

## Why the scheduled routines could not have failed this way

Every scheduled routine declares an expected artifact in the liveness manifest, so a missed run leaves a missing file at a path something actively checks, and the next session start prints it. To fail this quietly a scheduled routine would have to write its receipt and then do nothing, which is a different and much rarer bug.

An on-demand tool has no manifest entry, because there is no due time to be late against. It cannot fail loudly. It can only stop.

**If a capability must happen, it belongs on a schedule with a liveness entry. On-demand is for work whose absence you would notice the same day.** The test is one question: if this stopped today, what would tell me? "I would eventually notice" means it is already dormant and you have not found out yet. Convenience is not a reason to leave a capability on-demand; it is the reason the capability dies quietly.

Two corollaries, both violated at once above:

- **No capability may have an on-demand tool as its sole owner.** Sole ownership plus no liveness is a single point of failure with no alarm on it. Either a scheduled routine owns the capability, or the on-demand tool is a convenience layer over something scheduled.
- **The roster is a registry too.** Everything that runs belongs in one list with its cadence, its owner, and either its liveness entry or an explicit note that it has none and why that is acceptable. A tool nobody listed is a tool nobody misses.

## Retiring a routine

Deleting the two tools was the easy part. Three ownership assignments elsewhere in the doctrine still named them as the owner of jobs that had to keep happening. One was worse than a dangling name: a fallback rule reading "if the primary does not exist, the fallback owner inherits", so deleting the primary would have silently promoted a fallback that was never meant to own that job, and nothing would have reported the promotion.

A deleted owner leaves a contract with no owner, which is worse than the routine still existing, because an existing routine at least shows up in liveness. Before deleting a routine:

1. **Grep for every place that names it.** Prompts, doctrine, registries, the manifest, other routines' handoff steps. The name is the search; never work from memory of what referenced it.
2. **Reassign every job explicitly, by name, to something that still exists.** "The other routines will cover it" is not a reassignment. If a job should end, write that it was retired and why.
3. **Read every conditional ownership rule as if the deletion already happened.** Anything phrased "if X does not exist" changes behavior the moment X stops existing, which is exactly the moment nobody is looking.
4. **Delete the liveness entry last**, after the reassignment lands, so the gap stays visible during the window when it exists.

The deletion and the reassignment are one commit. A tree where the owner is gone and the contract is not yet reassigned is a tree where the capability is already silently dead.
