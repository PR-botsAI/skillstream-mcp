/**
 * SkillStream MCP — V0
 *
 * A remote MCP server (Streamable HTTP transport) that ships SKILLS, not tools.
 * Connected agents receive procedural knowledge — the planning, validation,
 * execution, and recovery patterns that prevent wasted tokens and broken code.
 *
 * Endpoints:
 *   GET  /              — server info as JSON
 *   GET  /health        — same
 *   POST /mcp           — MCP Streamable HTTP transport
 *   GET  /sse           — MCP SSE (legacy) transport
 *
 * To deploy:
 *   npm install
 *   npx wrangler deploy
 */

import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  SKILLS,
  getSkillByName,
  searchSkills,
  promptNameFor,
  type Skill,
} from "./registry";

export class SkillStreamMCP extends McpAgent {
  server = new McpServer({
    name: "skillstream",
    version: "0.1.0",
  });

  async init() {
    // ───────────────────────────────────────────────────────────────
    // RESOURCES — one per skill, addressable at skill://<name>
    // This is the cleanest MCP primitive for shipping content.
    // ───────────────────────────────────────────────────────────────
    for (const skill of SKILLS) {
      this.server.registerResource(
        skill.name,
        `skill://${skill.name}`,
        {
          title: skill.name,
          description: skill.description,
          mimeType: "text/markdown",
        },
        async (uri: URL) => ({
          contents: [
            {
              uri: uri.href,
              mimeType: "text/markdown",
              text: skill.body,
            },
          ],
        }),
      );
    }

    // ───────────────────────────────────────────────────────────────
    // PROMPTS — same content, exposed as named prompts.
    // For clients that prefer prompts over resources.
    // ───────────────────────────────────────────────────────────────
    for (const skill of SKILLS) {
      this.server.registerPrompt(
        promptNameFor(skill),
        {
          title: skill.name,
          description: skill.description,
        },
        async () => ({
          messages: [
            {
              role: "user",
              content: { type: "text", text: skill.body },
            },
          ],
        }),
      );
    }

    // ───────────────────────────────────────────────────────────────
    // TOOLS — discovery + activation surface for clients that drive
    // exclusively through tools (Claude Desktop in default config, etc.)
    // ───────────────────────────────────────────────────────────────

    this.server.registerTool(
      "search_skills",
      {
        title: "Search skills",
        description:
          "Find skills relevant to a task. Pass a plain-language query like 'review a pull request' or 'plan before coding'. Returns ranked skill names with descriptions; you can then call activate_skill or read the skill://<name> resource.",
        inputSchema: {
          query: z
            .string()
            .min(1)
            .describe("What you're trying to do, in plain language."),
          limit: z
            .number()
            .int()
            .min(1)
            .max(20)
            .default(5)
            .optional()
            .describe("Max number of results (default 5)."),
        },
      },
      async ({ query, limit = 5 }) => {
        const results = searchSkills(query, limit);
        if (results.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No skills matched "${query}". Try a different query, or call list_all_skills to see the inventory.`,
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: formatSkillList(results),
            },
          ],
        };
      },
    );

    this.server.registerTool(
      "list_all_skills",
      {
        title: "List all skills",
        description:
          "Return the full skill inventory (name + one-line description). Use once per session to learn what's available. For larger libraries, prefer search_skills.",
        inputSchema: {},
      },
      async () => ({
        content: [
          {
            type: "text",
            text: formatSkillList(SKILLS),
          },
        ],
      }),
    );

    this.server.registerTool(
      "activate_skill",
      {
        title: "Activate a skill",
        description:
          "Load the full body of a skill by name. Equivalent to reading the skill://<name> resource. Use after search_skills or list_all_skills tells you which one you want.",
        inputSchema: {
          name: z
            .string()
            .min(1)
            .describe("Exact kebab-case skill name (e.g. 'brainstorm-first')."),
        },
      },
      async ({ name }) => {
        const skill = getSkillByName(name);
        if (!skill) {
          return {
            content: [
              {
                type: "text",
                text: `No skill named "${name}". Use search_skills or list_all_skills to find available skills.`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text",
              text: skill.body,
            },
          ],
        };
      },
    );
  }
}

// ───────────────────────────────────────────────────────────────────
// Worker fetch handler
// ───────────────────────────────────────────────────────────────────

// Worker env. V0 has no user-configured bindings; the McpAgent Durable Object
// binding is wired by wrangler. `npx wrangler types` would generate a richer
// type; for now this is enough to satisfy strict TS.
interface Env {
  MCP_OBJECT: DurableObjectNamespace;
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> | Response {
    const url = new URL(request.url);

    // MCP Streamable HTTP (the current spec) — primary endpoint
    if (url.pathname === "/mcp") {
      return SkillStreamMCP.serve("/mcp").fetch(request, env, ctx);
    }

    // MCP SSE (legacy) — kept for older clients
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return SkillStreamMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    // Info endpoint — useful for sanity checks before pointing a client at /mcp
    if (url.pathname === "/" || url.pathname === "/health") {
      const origin = url.origin;
      return new Response(
        JSON.stringify(
          {
            name: "SkillStream MCP",
            version: "0.1.0",
            description:
              "Remote MCP server that ships skills (procedural knowledge) — not tools — to any connected agent.",
            endpoints: {
              streamable_http: `${origin}/mcp`,
              sse_legacy: `${origin}/sse`,
            },
            skills_count: SKILLS.length,
            skills: SKILLS.map((s) => ({
              name: s.name,
              description: s.description,
              uri: `skill://${s.name}`,
            })),
            getting_started: {
              for_claude_desktop: `Add this to claude_desktop_config.json: { "mcpServers": { "skillstream": { "command": "npx", "args": ["mcp-remote", "${origin}/mcp"] } } }`,
              for_cursor: `Add to ~/.cursor/mcp.json: { "mcpServers": { "skillstream": { "url": "${origin}/mcp" } } }`,
              first_call: `Once connected, instruct your agent: "read the skill://using-skillstream resource".`,
            },
          },
          null,
          2,
        ),
        {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "access-control-allow-origin": "*",
          },
        },
      );
    }

    return new Response("Not Found", { status: 404 });
  },
};

// ───────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────

function formatSkillList(skills: Skill[]): string {
  if (skills.length === 0) return "(no skills)";
  return skills
    .map(
      (s) =>
        `**${s.name}** — ${s.description}\n  uri: skill://${s.name}  |  activate: activate_skill({ name: "${s.name}" })`,
    )
    .join("\n\n");
}
