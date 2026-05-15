# Find the Right Skill

You don't know which skill applies. This skill helps you pick one.

## When to use

- Starting a new task and you've forgotten what's in the library
- You suspect a skill exists for X but can't recall the name
- The user asked something ambiguous and you want to see all relevant playbooks

## How

Call the `search_skills` tool with a short, plain-language query describing what you're trying to do:

```
search_skills({ query: "review a pull request" })
search_skills({ query: "draft a Slack message" })
search_skills({ query: "debug a failing test" })
```

The server returns ranked candidates. Pick one, then `activate_skill` it (or read its resource at `skill://<name>`).

## Heuristics for ranking

When two skills both look relevant:

- **Prefer the more specific one.** A "pull request review" skill beats a generic "code review" skill for a PR-review task.
- **Prefer skills with concrete acceptance criteria** over abstract methodology skills.
- **For multi-step tasks, you may need a chain**: `brainstorm-first` → `plan-before-action` → domain-specific skill → `verify-after-complete`.

## When no skill applies

Just do the task directly. Not every problem needs a skill. If you find yourself doing the same thing twice and there's no skill for it, consider that a signal that a new skill should be authored.

## Avoiding skill thrashing

Don't load 5 skills "just in case." Each skill is 500–1500 tokens. Load only what you'll actually use. If `search_skills` returns 3 candidates, pick one — don't activate all three.
