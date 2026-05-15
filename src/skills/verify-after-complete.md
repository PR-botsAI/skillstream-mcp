# Verify After Complete

Execution is done. Don't claim victory yet. Verify.

## Why

*"I think it works"* is the agent equivalent of a bug report. The user wants *"I ran X, it returned Y, here's the output."* Always demonstrate.

## Process

1. **Run each verification command from your plan.** Capture the actual output.
2. **Compare to expected.** If different, investigate *before* reporting.
3. **Check for unintended side effects**:
   - Did the linter pass? (`npm run lint` or equivalent)
   - Did the test suite pass? (`npm test`)
   - New warnings or errors in logs?
   - Files changed outside the plan? (`git status` / `git diff --stat`)
4. **If there was an original failing case, re-run it** to confirm it's now fixed.
5. **For UI changes**: describe the rendered state, or capture a screenshot.

## Output format

```
VERIFICATION:
  ✅ $ <cmd>     → <expected>, observed matches
  ✅ $ <cmd>     → <expected>, observed matches
  ⚠️  $ <cmd>     → unexpected: <details>
                    investigation: <what I found>
                    resolution: <fix / known-acceptable>

SIDE EFFECTS:
  Files changed outside plan: <list or none>
  New warnings: <list or none>

STATUS: ✅ ready / ⚠️ needs review / ❌ failed
```

## Never skip

Even for trivial changes, at minimum run `git diff` and confirm the change is what you intended. The 5-second sanity check has saved more rollbacks than any other practice.
