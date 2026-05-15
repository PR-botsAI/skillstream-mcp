/**
 * Local smoke test — runs in Node, not Workers.
 * Bypasses the .md import (which needs wrangler's Text rule) by reading
 * the files directly. Confirms the registry logic is sound.
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(__dirname, "src", "skills");

const skillFiles = readdirSync(SKILLS_DIR).filter((f) => f.endsWith(".md"));
const skills = skillFiles.map((f) => ({
  name: f.replace(/\.md$/, ""),
  body: readFileSync(join(SKILLS_DIR, f), "utf-8"),
}));

console.log(`\nLoaded ${skills.length} skill files:\n`);
for (const s of skills) {
  const chars = s.body.length;
  const estTokens = Math.ceil(chars / 4);
  console.log(`  ${s.name.padEnd(32)} ${chars} chars · ~${estTokens} tokens`);
}
