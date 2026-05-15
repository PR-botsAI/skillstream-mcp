/**
 * Skill registry. Each skill's body lives in src/skills/<name>.md and is
 * imported as a string via the wrangler Text rule. Metadata (name,
 * description, tags) lives here.
 *
 * To add a skill:
 *   1. Drop a new markdown file in src/skills/
 *   2. Add an import + entry to the SKILLS array below
 *   3. Redeploy.
 */

import usingSkillstream from "./skills/using-skillstream.md";
import brainstormFirst from "./skills/brainstorm-first.md";
import planBeforeAction from "./skills/plan-before-action.md";
import validateBeforeExecute from "./skills/validate-before-execute.md";
import executeWithDiscipline from "./skills/execute-with-discipline.md";
import verifyAfterComplete from "./skills/verify-after-complete.md";
import selfHealingRecovery from "./skills/self-healing-recovery.md";
import tokenConsciousIteration from "./skills/token-conscious-iteration.md";
import findTheRightSkill from "./skills/find-the-right-skill.md";

export interface Skill {
  /** Kebab-case unique identifier. Used in URIs (`skill://<name>`) and tool calls. */
  name: string;
  /** One-paragraph description. Indexed by `search_skills`; shown to agents during discovery. */
  description: string;
  /** Full markdown body. Returned when the skill is activated. */
  body: string;
  /** Free-form keywords to improve search recall. */
  tags: string[];
}

export const SKILLS: Skill[] = [
  {
    name: "using-skillstream",
    description:
      "ALWAYS load this first when connecting to SkillStream. Explains the library's purpose, the plan→validate→execute→verify loop, and when to invoke each downstream skill. Saves tokens and prevents wasted work.",
    body: usingSkillstream,
    tags: ["meta", "onboarding", "methodology", "entry-point"],
  },
  {
    name: "brainstorm-first",
    description:
      "Use BEFORE writing any code or making changes. Refines a vague request through targeted questions into 1-3 concrete acceptance criteria. Prevents solving the wrong problem.",
    body: brainstormFirst,
    tags: ["methodology", "planning", "clarification", "spec"],
  },
  {
    name: "plan-before-action",
    description:
      "Use AFTER brainstorming, BEFORE making any file changes. Produces a concrete plan: exact files to touch, exact changes, verification commands, rollback. Prevents reactive editing.",
    body: planBeforeAction,
    tags: ["methodology", "planning", "implementation-plan"],
  },
  {
    name: "validate-before-execute",
    description:
      "Use AFTER a plan, BEFORE executing it. Dry-runs the plan mentally, surfaces broken assumptions, validates file existence and naming. Catches mistakes before they cost tokens.",
    body: validateBeforeExecute,
    tags: ["methodology", "validation", "safety", "dry-run"],
  },
  {
    name: "execute-with-discipline",
    description:
      "Use DURING execution of a plan. Rules to stay on plan: edit in order, complete-then-next, no off-plan reads, surface deviations. Prevents mid-task drift and yak-shaving.",
    body: executeWithDiscipline,
    tags: ["methodology", "execution", "discipline"],
  },
  {
    name: "verify-after-complete",
    description:
      "Use AFTER executing a plan. Runs the verification commands defined in plan-before-action, captures real output, checks side effects. Prevents 'I think it works' false positives.",
    body: verifyAfterComplete,
    tags: ["methodology", "verification", "testing", "completion"],
  },
  {
    name: "self-healing-recovery",
    description:
      "Use when a tool call fails, a test fails, or output is unexpected. Performs root-cause diagnosis (transient vs bad input vs wrong tool vs wrong assumption vs env) before retrying. Prevents the 'retry the same broken command 5 times' pattern.",
    body: selfHealingRecovery,
    tags: ["methodology", "debugging", "error-handling", "recovery", "self-healing"],
  },
  {
    name: "token-conscious-iteration",
    description:
      "Apply continuously to minimize wasted tool calls and context bloat. Rules for efficient reading, batched writes, avoiding exploration, and stopping at 'good enough'.",
    body: tokenConsciousIteration,
    tags: ["methodology", "efficiency", "tokens", "cost"],
  },
  {
    name: "find-the-right-skill",
    description:
      "Use when you don't know which skill applies to the current task. Explains how to use search_skills, heuristics for picking among candidates, and when no skill applies.",
    body: findTheRightSkill,
    tags: ["meta", "discovery", "routing"],
  },
];

/** Find a skill by its exact name. */
export function getSkillByName(name: string): Skill | undefined {
  return SKILLS.find((s) => s.name === name);
}

/**
 * Simple text-match ranker. Sufficient for V0 (handful of skills).
 * For V1, replace with Vectorize embedding search.
 *
 * Score weights: name match 10, description 5, tag 3, body 1.
 */
export function searchSkills(query: string, limit = 5): Skill[] {
  const q = query.toLowerCase().trim();
  if (!q) return SKILLS.slice(0, limit);

  // Split query into tokens so "review pull request" matches "pull-request review"
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);

  const scored = SKILLS.map((s) => {
    let score = 0;
    const name = s.name.toLowerCase();
    const desc = s.description.toLowerCase();
    const tags = s.tags.map((t) => t.toLowerCase());
    const body = s.body.toLowerCase();

    for (const tok of tokens) {
      if (name.includes(tok)) score += 10;
      if (desc.includes(tok)) score += 5;
      if (tags.some((t) => t.includes(tok))) score += 3;
      if (body.includes(tok)) score += 1;
    }

    return { skill: s, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.skill);
}

/** Convert a skill name to a valid MCP prompt name (kebab → snake). */
export function promptNameFor(skill: Skill): string {
  return `skill_${skill.name.replace(/-/g, "_")}`;
}
