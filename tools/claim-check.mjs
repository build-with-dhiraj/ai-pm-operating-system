#!/usr/bin/env node
// claim-check: does any document still assert something you have since settled otherwise?
//
// Why this exists, and why no freshness mechanism could have caught the case that prompted it.
// A stakeholder-facing FAQ was found asserting a value that had been superseded weeks earlier
// and verified superseded in code. The FAQ was never edited again after the decision changed.
//
// That is the whole point. Every other freshness mechanism you own is delta-shaped: per-surface
// cursors, fingerprints, modification times, "pull only the window after each cursor". All of
// them ask "what moved?". Here nothing moved. The DECISION moved underneath a document that sat
// still, and a stale document that never changes is invisible to all of them, permanently.
//
// It was found by luck, because it happened to outrank the truth on a question someone thought
// to ask. Luck is not a mechanism. This is the mechanism.
//
// Reads a claims file: the settled facts, plus the words a document would use to contradict one.
//   { "claims": [ {
//       "id":          "C-001",
//       "claim":       "the retention window is <SETTLED_VALUE>",
//       "settled":     "<WHEN AND WHERE IT WAS DECIDED>",
//       "scope":       ["docs/", "handbook/"],   // dirs to walk, relative to WORKSPACE
//       "contradicts": ["<RETIRED_VALUE>"],      // substrings that mean the old answer
//       "context":     ["retention"],            // optional; line + heading must also match one
//       "allow":       ["transcripts/"],         // paths that may legitimately quote the old value
//       "skip_dated":  true                      // default true; see the dated-filename note below
//   } ] }
//
// Customize CLAIMS for your layout; WORKSPACE matches the liveness manifest's $WORKSPACE.
// Exit 0 clean, 1 contradictions found, 2 could not run. Read-only.
//   node claim-check.mjs
//   node claim-check.mjs --claim C-001
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const WORKSPACE = process.env.WORKSPACE ?? process.cwd();
const CLAIMS = join(WORKSPACE, "state/claims.json");
const only = (() => { const i = process.argv.indexOf("--claim"); return i > -1 ? process.argv[i + 1] : null; })();

if (!existsSync(CLAIMS)) { console.error(`claims file missing: ${CLAIMS}`); process.exit(2); }
const { claims } = JSON.parse(readFileSync(CLAIMS, "utf8"));

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (e.endsWith(".md")) out.push(p);
  }
  return out;
}

let violations = 0;
const report = [];

for (const c of claims) {
  if (only && c.id !== only) continue;
  const files = c.scope.flatMap(s => walk(join(WORKSPACE, s)));
  for (const f of files) {
    const rel = relative(WORKSPACE, f);
    if ((c.allow || []).some(a => rel.includes(a))) continue;
    // A dated filename declares itself point-in-time. Those may quote a retired
    // value; a deliverable with no date in its name is claiming to be current.
    if (c.skip_dated !== false && /20\d\d-\d\d-\d\d/.test(rel)) continue;
    const lines = readFileSync(f, "utf8").split("\n");
    let head = "";
    // A "non-goals" or "out of scope" section states the opposite of an assertion.
    // A roadmap listing a retired feature under Known cuts is RECORDING the decision,
    // and the first version of this tool flagged that as contradicting it.
    const NEGATED = /out of scope|non-goal|not doing|known cuts|excluded|will not|deliberately cut/i;
    lines.forEach((ln, i) => {
      if (/^#{1,6}\s/.test(ln)) head = ln;
      if (NEGATED.test(head)) return;
      const low = ln.toLowerCase();
      const hit = c.contradicts.find(t => low.includes(t.toLowerCase()));
      if (!hit) return;
      // Context is the line PLUS its enclosing heading. Line-local matching alone misses
      // continuation lines: a sentence opening "After <RETIRED_VALUE>, an account that lapses"
      // sits under a heading naming the topic and names the topic nowhere itself.
      const ctx = (head + " " + ln).toLowerCase();
      if (c.context && !c.context.some(k => ctx.includes(k.toLowerCase()))) return;
      violations++;
      report.push({ claim: c.id, file: rel, line: i + 1, term: hit, text: ln.trim().slice(0, 150) });
    });
  }
}

const checked = claims.filter(c => !only || c.id === only);
console.log(`claim check: settled facts vs what your documents still assert`);
console.log(`  claims checked   ${checked.length}`);
console.log(`  contradictions   ${violations}`);

if (violations) {
  let last = "";
  for (const v of report) {
    if (v.claim !== last) {
      const c = claims.find(x => x.id === v.claim);
      console.log(`\n  ${c.id}: ${c.claim}`);
      console.log(`  settled: ${c.settled}`);
      last = v.claim;
    }
    console.log(`    ${v.file}:${v.line}  ("${v.term}")`);
    console.log(`      ${v.text}`);
  }
  console.log(`\nCONTRADICTIONS. ${violations} line(s) assert something you have settled otherwise.`);
  console.log("Each is either a document to correct or a claim/allow-list entry to widen.");
  console.log("Do not silence one by adding it to `allow` unless quoting the old value there");
  console.log("is genuinely legitimate, which is what `allow` is for: transcripts, retractions,");
  console.log("and the ledger. A stakeholder-facing doc is not one of those.");
  process.exit(1);
}
console.log("\nCLEAN. No document asserts a value you have since settled otherwise.");
process.exit(0);
