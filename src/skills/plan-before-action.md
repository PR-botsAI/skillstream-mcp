# Plan Before Action

You have a refined problem (from `brainstorm-first`). Now produce a concrete plan.

## Why

Without a plan, you'll edit files reactively. Reactive edits accumulate. By edit 6 you've forgotten the goal. Plans constrain you to the goal.

## Process

1. **List exact files to touch.** Use absolute paths. Include any files you'll create.
2. **For each file, write a 1–2 sentence description** of what changes. Not *"improve auth"* — *"add `requireAuth` middleware around lines 23–29 of `src/router.ts`"*.
3. **Write verification steps.** Concrete commands or checks: `npm test`, `curl /api/health`, "open page X and confirm Y renders".
4. **Estimate token budget.** Roughly: how many tool calls? If more than 15, break into a smaller plan first.
5. **Identify rollback.** If this breaks something, what's the one-command revert?

## Format

```
GOAL: <one sentence>

FILES:
  /abs/path/file1.ts — <what changes, 1-2 sentences>
  /abs/path/file2.ts — <what changes>
  /abs/path/new-file.ts — NEW: <purpose>

VERIFICATION:
  $ <command>     expected: <output or behavior>
  $ <command>     expected: <output or behavior>

ROLLBACK:
  $ git restore <files>      (or)
  $ git reset --hard HEAD

TOKEN BUDGET: ~<N> tool calls
RISK: 🟢 / 🟡 / 🔴
```

## When to skip

Single-line edits. Read-only tasks. Anything that doesn't modify state.

## Output

The plan. Then invoke `validate-before-execute` on it.
