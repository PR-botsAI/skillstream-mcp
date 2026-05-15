# Self-Healing Recovery

Something failed. Don't retry blindly.

## Why

Most failures aren't transient. They have causes. Retrying the same call with no changes wastes tokens and usually fails the same way. The agentic equivalent of *"have you tried turning it off and on again"* — except you have far better tools than that.

## Process

1. **Read the error completely.** Not just the first line — the whole stack trace, the whole stderr.
2. **Classify the failure**:
   - **Transient** (rate limit, network blip, 5xx) — wait + retry *once*.
   - **Bad input** (404, 400, type error) — fix the input.
   - **Wrong tool** (used grep when you needed view, or vice versa) — pick the right one.
   - **Wrong assumption** (file doesn't exist, function renamed, API changed) — re-verify the world.
   - **Environment** (missing env var, wrong directory, no permissions) — fix the environment.
3. **Form ONE hypothesis** about the cause. Just one.
4. **Run ONE diagnostic** that would confirm or refute the hypothesis.
5. **Based on the diagnostic, fix the cause and retry once.**
6. **If retry fails: STOP and ask the user.** Don't keep guessing.

## Anti-patterns (do not do these)

- Retrying with no changes
- Retrying with the same approach but a slightly different argument
- Switching to a different tool that does the same thing
- Wrapping in `try/catch` to hide the error instead of fixing it
- Spawning a sub-agent to *"figure it out"* when you haven't read the error

## When the user must be involved

- Authentication / credentials issues
- Missing data the agent can't generate
- Architectural decisions (which library, which pattern)
- Any failure that has already been retried once with a fix attempt

## Output

```
ROOT CAUSE: <one line>
FIX: <what I changed>
RESULT: ✅ recovered / ❌ needs user input

If ❌:
  WHAT I TRIED:
    - <attempt 1>
    - <attempt 2>
  WHAT I THINK THE CAUSE IS: <best guess>
  WHAT I NEED FROM YOU: <specific question or decision>
```
