# Token-Conscious Iteration

Every tool call costs tokens. Every file you read costs tokens. Be deliberate.

## Reading

- **Read the smallest useful slice.** Don't `view` a 5,000-line file to find one function — use a line range or grep first.
- **Read once, cache mentally.** Don't re-view the same file unless it changed.
- **Prefer summaries before content**: directory listing before file read, README before source, type definitions before implementations.
- **Trust the index, not the full file.** A function's signature plus its docstring is usually enough.

## Writing

- **Batch edits.** One `str_replace` with a clean target beats three exploratory ones.
- **Plan complete edits before starting.** Don't write half a function then realize you need a new import.
- **Use `create_file` for new files**, not `str_replace` to grow an empty stub.

## Iterating

- **First attempt should be 80% right.** If you're below that, you're not understanding the problem — return to `brainstorm-first`.
- **Stop at "good enough."** Polishing past the requirement is a token leak.
- **Resist exploration.** If you're tempted to "look around the codebase," justify it: what *specific* question am I answering? If the answer is "I'm not sure" — don't make the call.

## Tool choices

- **Search tools (web / code) are cheap** — use them for facts you don't know rather than guessing.
- **Sub-agents are expensive** — only delegate clearly bounded sub-tasks.
- **Image / video generation is very expensive** — generate once, never iterate without explicit user request.

## Self-check before each tool call

> *"What specific new information will this give me, and will I act on it?"*

If you can't answer — don't make the call.
