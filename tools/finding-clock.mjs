#!/usr/bin/env node
// finding-clock: does anything in the ledger need a human today, and does it have one?
//
// Why this exists. Every gate reported green: mirror clean, contradictions zero, ledger
// complete, recall full. At the same moment a finding confirmed on two independent surfaces
// across four consecutive checks sat OPEN, UNOWNED, days old, with the launch date days away.
// Every gate measured whether the SYSTEM was honest. None measured whether the PRODUCT was in
// trouble. A system that records truth but not consequence is a library, not an owner.
//
// The escalation rule that already existed did not apply: it escalates a SURFACE that fails
// three times, not a FINDING that stays open while the date approaches. So a broken connector
// got a ticket and "nobody is testing the pilot" got nothing.
//
// Reads three files: the ledger for what is true, the meta file for what it costs and who is on
// the hook, the roadmap for the phase. Fails when a finding is older than its severity allows,
// or is launch-blocking with no owner, or has no metadata at all.
//   ledger    markdown; one heading per finding, "## F-001 · <title> · <status>"
//   meta      { "findings": { "F-001": { "severity": "launch-blocking|high|normal|watch",
//                                        "owner": "<NAME OR NULL>", "first_seen": "2026-01-15",
//                                        "status": "OPEN", "blocks": "<WHAT IT BLOCKS>",
//                                        "plain": "<ONE SENTENCE A HUMAN CAN DECIDE ON>" } } }
//   roadmap   frontmatter with `phase:` and `launch_date:`
//   actions   { "actions": [ { "state": "open", "tag": "agent-ok|needs-human",
//                              "plain": "<ONE SENTENCE>" } ] }   // optional; the tool's own backlog
//
// Customize the paths below; WORKSPACE matches the liveness manifest's $WORKSPACE.
// Exit 0 nothing due, 1 something needs a human, 2 could not run. Read-only.
//   node finding-clock.mjs
//   node finding-clock.mjs --all
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const WORKSPACE = process.env.WORKSPACE ?? process.cwd();
const LEDGER = join(WORKSPACE, "state/findings.md");
const META = join(WORKSPACE, "state/findings-meta.json");
const ROADMAP = join(WORKSPACE, "roadmap.md");
const ACTIONS = join(WORKSPACE, "state/actions.json");
const ALL = process.argv.includes("--all");

for (const f of [LEDGER, META]) if (!existsSync(f)) { console.error(`missing ${f}`); process.exit(2); }

const MAX_DAYS = { "launch-blocking": 3, high: 7, normal: 30, watch: Infinity };
const meta = JSON.parse(readFileSync(META, "utf8")).findings;
const ledger = readFileSync(LEDGER, "utf8");

// Phase changes what matters. Pre-launch, a launch-blocker is the whole story; post-launch
// the same finding may be routine. Read it rather than assuming.
let phase = "unknown", launch = null, daysToLaunch = null;
if (existsSync(ROADMAP)) {
  const fm = readFileSync(ROADMAP, "utf8");
  phase = (fm.match(/^phase:\s*(\S+)/m) || [, "unknown"])[1];
  launch = (fm.match(/^launch_date:\s*(\S+)/m) || [, null])[1];
  if (launch) daysToLaunch = Math.ceil((Date.parse(launch) - Date.now()) / 86400000);
}

// Every finding in the prose must have metadata. A finding with no severity is one nobody has
// decided the cost of, which is exactly how the unowned blocker above stayed invisible while
// being urgent.
const inLedger = [...ledger.matchAll(/^#{2,3}\s+((?:F|R)-\d{3})\s*·\s*(.+?)\s*·\s*(.+?)\s*$/gm)]
  .map(m => ({ id: m[1], title: m[2].trim(), status: m[3].trim() }));
const today = new Date();
const wrap = (t, w) => t.split(" ").reduce((a, word) => { const i = a.length - 1; if ((a[i] + " " + word).trim().length <= w) a[i] = (a[i] + " " + word).trim(); else a.push(word); return a; }, [""]);
const ageOf = d => d ? Math.floor((today - Date.parse(d)) / 86400000) : null;

const rows = inLedger.map(f => {
  const m = meta[f.id];
  const open = !/FIXED|RETRACTED|WRONG/i.test(f.status) && !/FIXED|RETRACTED/i.test(m?.status || "");
  const sev = m?.severity ?? null;
  const age = ageOf(m?.first_seen);
  const cap = MAX_DAYS[sev] ?? Infinity;
  const problems = [];
  if (!m) problems.push("no metadata: severity and owner undecided");
  else if (open) {
    if (!m.owner && sev !== "watch") problems.push(`UNOWNED at ${sev}`);
    if (age !== null && age > cap) problems.push(`${age}d open, cap ${cap}d for ${sev}`);
  }
  return { ...f, sev, owner: m?.owner ?? null, age, open, problems, note: m?.note, blocks: m?.blocks, plain: m?.plain };
});

const due = rows.filter(r => r.problems.length);
const openRows = rows.filter(r => r.open);
const blockers = openRows.filter(r => r.sev === "launch-blocking");

console.log(`finding clock: phase ${phase}${daysToLaunch !== null ? `, ${daysToLaunch} day(s) to ${launch}` : ""}`);
console.log(`  findings          ${rows.length} (${openRows.length} open)`);
console.log(`  launch-blocking   ${blockers.length}`);
console.log(`  unowned and open  ${openRows.filter(r => !r.owner && r.sev !== "watch").length}`);
console.log(`  past their clock  ${rows.filter(r => r.problems.some(p => /cap/.test(p))).length}`);

if (blockers.length || ALL) {
  console.log(`\n  LAUNCH-BLOCKING, open:`);
  for (const r of blockers.sort((a, b) => (b.age ?? 0) - (a.age ?? 0))) {
    console.log(`    ${r.id}  ${r.age}d  owner: ${r.owner ?? "** NOBODY **"}`);
    console.log(`          ${r.title}`);
    // Plain first, always. An id is a filing label; nobody can decide on a filing label.
    if (r.plain) for (const ln of wrap(r.plain, 88)) console.log(`          ${ln}`);
    if (r.blocks) console.log(`          blocks: ${r.blocks}`);
  }
}

// The tool's own backlog. Findings are about the product; these are about the machinery.
// Without this, every run rediscovered the same tooling debt and re-flagged it as new,
// which is why the "decided but not done" list never picked itself up.
let actionsDue = 0;
if (existsSync(ACTIONS)) {
  const { actions } = JSON.parse(readFileSync(ACTIONS, "utf8"));
  const open = actions.filter(a => a.state === "open");
  const mine = open.filter(a => a.tag === "agent-ok");
  const yours = open.filter(a => a.tag === "needs-human");
  console.log(`\n  MY OWN BACKLOG   ${mine.length} mine to do, ${yours.length} need you`);
  if (mine.length) {
    console.log("\n  I should just do these, no permission needed:");
    for (const a of mine) for (const ln of wrap(a.plain, 88)) console.log(`    ${ln === wrap(a.plain, 88)[0] ? "-" : " "} ${ln}`);
  }
  if (yours.length) {
    console.log("\n  These need a decision from you:");
    for (const a of yours) for (const ln of wrap(a.plain, 88)) console.log(`    ${ln === wrap(a.plain, 88)[0] ? "-" : " "} ${ln}`);
  }
  actionsDue = mine.length;
}

if (due.length) {
  console.log(`\n  NEEDS A HUMAN:`);
  for (const r of due) {
    console.log(`    ${r.id}  [${r.sev ?? "no severity"}]  ${r.problems.join("; ")}`);
    if (r.plain) for (const ln of wrap(r.plain, 88)) console.log(`          ${ln}`);
    else if (r.note) console.log(`          ${String(r.note).slice(0, 150)}`);
  }
  console.log(`\nDUE. ${due.length} finding(s) need a decision or an owner.`);
  console.log("An unowned launch-blocker is not a tracked risk, it is an untracked one.");
  console.log("Assign it in the meta file, or downgrade the severity and say why.");
  process.exit(1);
}
if (due.length === 0 && actionsDue === 0) {
  console.log("\nCLEAR. Every open finding has an owner, and nothing is waiting on me.");
  process.exit(0);
}
if (due.length === 0) {
  console.log(`\nFINDINGS CLEAR, but ${actionsDue} item(s) are mine to do and still open.`);
  console.log("An agent-ok item open across two runs is waste, not caution.");
  process.exit(1);
}
process.exit(1);
