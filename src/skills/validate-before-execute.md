# Validate Before Execute

You have a plan. Don't execute yet. Validate it.

## Why

The cheapest tool call is the one you don't make. Reviewing your plan against reality takes one query's worth of tokens; running a broken plan takes ten to fifty.

## Mental dry-run checklist

For each step in the plan, confirm:

1. **The file exists where I think it does.** If you haven't actually `view`ed it this session, view it now. Don't trust your training data.
2. **The function / class / variable names I'm about to edit are spelled the way I think.** Grep or view to verify.
3. **My proposed edit doesn't conflict with code I haven't read.** Scan imports and surrounding lines.
4. **Side effects are accounted for.** If this file is imported by 50 others, will my change break their callers?
5. **There's a test that should fail before my change and pass after.** If TDD applies, write that test first.
6. **Environment is ready.** Migrations run? Env vars set? Right directory?
7. **The order is right.** Some changes must precede others (schema → code → tests).

## Risk classification

- 🟢 **Safe**: reversible, isolated, well-tested area — proceed.
- 🟡 **Risky**: touches widely-imported code, schema changes, env config — re-confirm with user before proceeding.
- 🔴 **Dangerous**: production data, auth, billing, security — require *explicit* user approval. Even if they already greenlit the task.

## Output

```
VALIDATION:
  ✅ <gap closed>
  ✅ <gap closed>
  ⚠️ <unresolved concern> → <how I'll handle it>

RISK: 🟢 / 🟡 / 🔴
DECISION: proceed / confirm-with-user / abort
```

If proceed: execute. Then invoke `verify-after-complete`.
