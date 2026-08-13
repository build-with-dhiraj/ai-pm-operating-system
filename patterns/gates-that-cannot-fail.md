# Gates that cannot fail

**The problem:** a verification step that cannot report a problem still runs, still prints, still exits zero, and still makes you feel checked. That is worse than having no gate, because no gate leaves you appropriately nervous. There are two ways a gate stops being a gate, and they are opposites.

## The gate that always fires

A sweep returning one expected hit on every clean run teaches you to read past its output instead of reading it. Within a week the ritual is "one hit, that's the known one, fine", and on the day there are two hits you see one hit and a known one. The expected hit ate the signal.

Instance from this repo: the leak sweep's own source carried an illustrative tracker-style key in a comment, so the sweep matched itself every run (fixed in `ba0abad`). The fix was not an exception for the known hit, because an exception list is the same bug with extra steps and it also suppresses the real hit that later matches the exception. The fix was deleting the thing that tripped it, so a clean tree returns nothing at all.

**Clean means zero.** A gate with a permanent expected hit is either reporting something real that belongs fixed, or matching something it should not, and the pattern belongs narrowed. Both are cheaper than the habit of skimming.

## The gate that never fires

Worse, because it certifies clean forever and nothing about its output ever looks wrong.

Instance, found the day this file was written: a pre-publish sweep for tracker-style keys used a word-boundary escape against an engine that does not support one. `git grep -E` is POSIX ERE, where `\b` is not a word boundary, so the pattern matched nothing on any input and reported a clean tree permanently, on any content. The same expression under `git grep -P` finds the keys immediately. One flag was the difference between a gate and a decoration.

The class is wider than one flag: a pattern the engine silently reinterprets, a filter with a misspelled field name, a query scoped to a path that no longer exists, a check on a variable that is always undefined. All of them return clean, and clean is what you were hoping to see.

## The test that catches both

**Every gate needs a known-bad input it must fail on.** Before trusting a check, feed it something it must catch and watch it catch it; feed it a clean input and watch it say nothing. A gate nobody has seen fail has not been verified, it has only been run.

Keep the known-bad case next to the gate: one line saying how to trip it deliberately. It costs a sentence, and it is the only thing standing between you and a check that has been green since the day it broke.
