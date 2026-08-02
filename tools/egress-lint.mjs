#!/usr/bin/env node
// egress-lint: the mechanical half of the Manager Test.
// Usage: node egress-lint.mjs <file> [...more files]
// Exit 1 on any hit. Every hit is a leak or a tell to strip BEFORE a human reads the text.
// Customize INTERNAL_ID and the vocab lists for your org; the categories are the point.
import { readFileSync } from "node:fs";

const RULES = [
  // 1. Ops-layer leakage: internal tracker ids, workspace paths, code refs, queries
  { name: "internal-ticket-id", re: /\bPW-\d+\b/g, hint: "private tracker id; use the public ticket or drop it" },
  { name: "workspace-path", re: /(~\/dev\/|knowledge\/|receipts\/|\.claude\/)[\w\-./]*/g, hint: "internal path" },
  { name: "file-line-ref", re: /\b[\w-]+\.(ts|js|py|php|mjs)\s*:\s*\d+/g, hint: "code ref belongs in the engineering doc, not this one" },
  { name: "query-text", re: /\b(SELECT\s+.+\s+FROM|jql\s*=|statusCategory\s*!?=)/gi, hint: "query text is workshop, not surface" },
  { name: "ai-ops-vocab", re: /\b(sweep|receipt|cursor|liveness|orchestrator|subagent|cache stamp|decision card)\b/gi, hint: "internal vocabulary; a reader will ask 'what is that?'" },

  // 2. AI tells
  { name: "em-dash", re: /—/g, hint: "no em dashes, ever; comma, colon, period, or parentheses" },
  { name: "ai-filler", re: /\b(delve|leverage|robust|seamless|comprehensive|streamline|utilize|synergy)\b/gi, hint: "corporate/AI filler" },
  { name: "meta-narration", re: /\((?:per your (?:comment|note|feedback)|as (?:you|discussed) (?:noted|requested)|reflected here|incorporating your feedback)\)/gi, hint: "never narrate the edit to the person who asked for it" },

  // 3. The "which Monday?" trap
  { name: "vague-date", re: /\b(next week|early next week|soon|EOD(?!\s+\d)|by Monday|by Friday|in a few days)\b/gi, hint: "absolute dates only: '13 Aug', not 'Monday'" },
];

let hits = 0;
for (const file of process.argv.slice(2)) {
  const text = readFileSync(file, "utf8");
  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) {
      const line = text.slice(0, m.index).split("\n").length;
      console.log(`${file}:${line}  [${rule.name}]  "${m[0].slice(0, 40)}"  -> ${rule.hint}`);
      hits++;
    }
  }
}
if (hits) { console.error(`\n${hits} hit(s). Every one is a leak or a tell; fix and re-run until clean.`); process.exit(1); }
console.log("clean");
