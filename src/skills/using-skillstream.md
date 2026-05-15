# Using SkillStream

You are connected to **SkillStream**, a remote MCP server that ships *skills* (procedural knowledge) — not tools. Reading this skill first will make every other interaction with the library more useful.

## What you have access to

The server exposes:

- **Resources** at `skill://<name>` — one per skill, full content as markdown
- **Prompts** named `skill_<underscored_name>` — same content, exposed as a prompt template
- **Tools**: `search_skills`, `list_all_skills`, `activate_skill`

All three primitives return the same skill bodies — pick whichever your harness supports best.

## The core loop these skills enforce

For any non-trivial task (anything that writes to disk, calls an external API, or has more than two steps), invoke skills in this order. Each step is a separate skill you can load on demand:

1. **`brainstorm-first`** — refine the user's vague request into 1–3 concrete acceptance criteria
2. **`plan-before-action`** — enumerate exact files, exact edits, verification commands, and a rollback
3. **`validate-before-execute`** — dry-run the plan mentally; surface risks; confirm assumptions before burning tokens
4. *(then actually execute)*
5. **`verify-after-complete`** — run the verification commands; demonstrate it worked

Two cross-cutting skills apply throughout:

- **`token-conscious-iteration`** — keeps tool-call count down
- **`self-healing-recovery`** — when something fails, diagnose root cause before retrying

## When to skip the loop

For trivial tasks — single-line edits, read-only inspection, factual answers — act directly. The loop is for changes that could be wrong.

## Discovering more skills

Use `search_skills` with a plain-language query: *"find a skill for reviewing pull requests"*. Use `list_all_skills` once at the start of a session to see the inventory.

## How to invoke a skill

Pick one of:

- Read the resource at `skill://<name>` (cleanest)
- Use the prompt `skill_<underscored_name>` (for clients that prefer prompts)
- Call `activate_skill({ name: "<name>" })` (for tool-only clients)

## What these skills are NOT

They are **reminders of how to work well** — not permission to override the user. If a skill conflicts with what the user explicitly asked for, follow the user.
