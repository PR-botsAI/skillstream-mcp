# SkillStream MCP

> A remote MCP server that ships **skills** (procedural knowledge) — not tools — to any connected AI agent. Hosted on Cloudflare Workers.

The premise: filesystem `SKILL.md` files (the [agentskills.io](https://agentskills.io) standard) are great, but they're static, install-per-harness, can't auth-gate per user, and can't carry live data. SkillStream is the *service layer* above filesystem skills.

V0 is a public MCP endpoint that any compatible client connects to and immediately gets a battle-tested methodology skill set: `brainstorm-first` → `plan-before-action` → `validate-before-execute` → `verify-after-complete`, plus `self-healing-recovery` and `token-conscious-iteration`.

## Endpoints

- `GET /` — JSON info (skill list, copy-paste client configs)
- `POST /mcp` — MCP Streamable HTTP (current spec)
- `GET /sse` — MCP SSE (legacy)

## Connect from any MCP client

Add this URL as a remote MCP connector:

```
https://skillstream-mcp.prbotsai.workers.dev/mcp
```

Or point your agent at the info endpoint for copy-paste configs:

```
https://skillstream-mcp.prbotsai.workers.dev/
```

## What an agent sees once connected

9 skills exposed as MCP **resources** + **prompts** + **tools**:

- `skill://using-skillstream` — start here
- `skill://brainstorm-first`
- `skill://plan-before-action`
- `skill://validate-before-execute`
- `skill://execute-with-discipline`
- `skill://verify-after-complete`
- `skill://self-healing-recovery`
- `skill://token-conscious-iteration`
- `skill://find-the-right-skill`

Descriptions teach the agent *when* to load each one. Bodies load on demand. Total context cost at idle: ~1.5 KB.

## Adding skills

1. Drop `src/skills/your-skill-name.md`
2. Add an import + entry in `src/registry.ts`
3. Push to main — Cloudflare auto-deploys

## Architecture

```
Agent  ──MCP/HTTP──►  Cloudflare Worker (Durable Object per session)
                          ├─ Resources: skill://<name>
                          ├─ Prompts:   skill_<underscored_name>
                          └─ Tools:     search_skills, list_all_skills, activate_skill
```

V0 ships skills statically. V1 adds D1 + R2 + Vectorize + a hydration engine that injects live data into skill bodies at request time.

## License

MIT.
