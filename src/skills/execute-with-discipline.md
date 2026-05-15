# Execute with Discipline

You have a validated plan. Now execute it. Don't drift.

## Rules during execution

1. **Stay on the plan.** If you find something interesting but off-plan, note it and move on. Yak-shaving kills tasks.
2. **Edit in plan order.** If migration must come before code, don't reverse it because the code is more interesting.
3. **One step at a time.** Complete each step (edit + verify the edit took) before starting the next.
4. **Don't read unplanned files.** If you reach for a file that isn't in the plan, stop. Either the plan is wrong (go back to `plan-before-action`) or the read is unnecessary.
5. **Commit at logical boundaries.** If git is involved, commit after each plan step succeeds. This means a failure rolls back cleanly.
6. **Surface deviations.** If you must deviate (a file moved, an API changed), pause, surface it to the user, and amend the plan.

## What "discipline" means here

Not perfectionism. Not stubbornness. Just: *the plan was made for a reason, and second-guessing it mid-execution costs more than completing it does*.

If the plan is fundamentally wrong, abort cleanly:

```
ABORTING: <reason>
What I completed: <list>
What's pending: <list>
Suggested next step: re-plan / ask user / rollback
```

## When discipline relaxes

- If verification at step N fails — that's `self-healing-recovery` time, not a free-form exploration.
- If the user interrupts with new info — stop and re-plan.

## Output

After all steps complete: brief summary of what was done. Then invoke `verify-after-complete`.
