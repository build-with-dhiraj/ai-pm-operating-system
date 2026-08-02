# The Manager Test — the egress firewall

There are two layers in this system and they must never cross: the WORKSHOP (how the work gets made: internal ticket IDs, vault paths, queries, verification scaffolding, AI vocabulary) and the SURFACE (what a human reads in your name). Everything below governs the surface. The mechanical half is enforced by [tools/egress-lint.mjs](../tools/egress-lint.mjs); the judgment half is enforced by reading every line as the recipient.

## The test itself

Before anything reaches a human, read every line as that human and ask the question managers keep writing in the margins: **"why are you telling me this?"** If a line doesn't drive a decision they must make or answer a question they're actually asking, cut it. Concretely:

- **Short, bulleted, decision-first.** Bullets by default. First line answers "why am I reading this?" One idea per line; a claim's reason nests under it instead of chaining in commas.
- **Absolute dates only.** "13 Aug", never "next week", "Monday", "soon", or "EOD". The margin comment that created this rule was literally "which Monday?"
- **No AI tells.** No em dashes. No rule-of-three flourishes, no "delve/leverage/robust/seamless", no restating the question, no exclamation enthusiasm. Run an actual de-AI pass on prose; applying it "from memory" is how tells survive.
- **Never narrate the making of the doc.** No "(per your comment)", "(reflected here)", "incorporating your feedback". State each decision as your own. Writing the seams of the edit to the very person who gave the note is the loudest AI tell there is.
- **Zero ops-layer leakage.** Internal tracker IDs, repo paths, `file:line` references, query text, model names, verification checklists: none of it ever appears in a stakeholder artifact. The test is SIMPLICITY: if any word could make the reader pause and ask "what is that?", the doc failed.
- **Altitude.** A director gets decisions, timeline, one north star. Engineering gets the `file:line` depth in a SEPARATE artifact, never a "technical appendix" bolted onto the director's summary.
- **Say each fact once.** An ask lives in the decisions section and nowhere else. Restating a fact in the intro and again in the ask list doubles the page for nothing.

## The truth-ledger rules (for your recurring status doc)

Your status ledger is not a report you dress up; it is the durable record of what was planned, what moved, and what got in the way. Its credibility is the relationship with your manager.

- **A status is asserted only with evidence** (a ticket transition, a shipped commit, a sent message, a published doc). Not started is "To start"; unsure between two statuses takes the lower one plus one honest line. Done carries its date.
- **A slip never fakes a DONE, and never confesses on the page either.** The status stays where it truthfully is; the reason lives in your private notes and, when it matters, the 1:1 conversation.
- **The Problems gate.** The problems column carries ONLY genuine major blockers at your manager's altitude: delivery risk to a committed date, resourcing gaps, hard external blocks needing their awareness. Blank is normal. NEVER on the page: personal misses, sick days, your own slips, individuals' logistics, peer friction, colleague blame, anything already resolved. Candor about the work, never confession about the person.
- **The volume budget.** ~3-4 progress lines per day, hard ceiling 5. One line = one outcome, under ~15 words after the status chip. Rank: delivery commitments and risks first, initiative outcomes second, routine motion last and cut first. The full evidence-rich version always survives in your private draft file; trimming the page loses nothing.
- **The material the Problems gate cuts is not waste.** Concerns, friction, sentiment: that is your 1:1 agenda's raw input. Two documents, two purposes: the ledger tracks work; the 1:1 doc carries growth, concerns, and asks. A status line in the 1:1 doc is as wrong as a confession on the ledger.

## Send policy

Nothing outbound without the human's explicit go: no messages, no emails, no comments in their name, no calendar invites. One standing carve-out pattern that works well: a self-DM channel (audience of one, the owner) for the nightly brief. Approval for one message never generalizes to the next.
