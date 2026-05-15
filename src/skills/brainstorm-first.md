# Brainstorm First

You are about to write code, edit files, or change state. Before doing so, refine the request.

## Why

The user's prompt is a compressed version of a longer thought. If you start from the surface text, you will solve the wrong problem ~40% of the time. Five minutes of clarification saves an hour of rework.

## Process

1. **Restate the ask in one sentence.** Confirm with the user. If they push back, you misread the request.
2. **Surface unstated constraints**:
   - What does success look like (input → output)?
   - What's the failure mode if you ship the wrong thing?
   - Are there existing patterns in the codebase to match?
   - What's the polish level (prototype, internal tool, production)?
3. **Identify 1–3 acceptance tests** — concrete checks that confirm the change works (a passing test, a curl that returns 200, a screenshot).
4. **Stop and confirm.** Then invoke `plan-before-action`.

## When to skip

- The user already gave explicit, well-scoped instructions with acceptance criteria.
- The change is trivial and reversible (typo, rename, comment).

## Output

A short doc, max 5 lines:

```
RESTATED: <one sentence>
CONSTRAINTS: <2-3 bullets>
ACCEPTANCE:
  1. <concrete check>
  2. <concrete check>
```

Then: **"Confirm before I plan?"**
