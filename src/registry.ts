/**
 * Skill registry. Each skill's body lives in src/skills/<name>.md and is
 * imported as a string via the wrangler Text rule. Metadata (name,
 * description, tags) lives here.
 *
 * To add a skill:
 *   1. Drop a new markdown file in src/skills/
 *   2. Add an import + entry to the SKILLS array below
 *   3. Redeploy.
 */

import usingSkillstream from "./skills/using-skillstream.md";
import brainstormFirst from "./skills/brainstorm-first.md";
import planBeforeAction from "./skills/plan-before-action.md";
import validateBeforeExecute from "./skills/validate-before-execute.md";
import executeWithDiscipline from "./skills/execute-with-discipline.md";
import verifyAfterComplete from "./skills/verify-after-complete.md";
import selfHealingRecovery from "./skills/self-healing-recovery.md";
import tokenConsciousIteration from "./skills/token-conscious-iteration.md";
import findTheRightSkill from "./skills/find-the-right-skill.md";

// Marketing & Sales skill pack — v1
import leadMagnetFunnel from "./skills/lead-magnet-funnel.md";
import coldOutreachSequence from "./skills/cold-outreach-sequence.md";
import broadcastCampaign from "./skills/broadcast-campaign.md";
import socialContentBatch from "./skills/social-content-batch.md";
import pipelineHygieneReview from "./skills/pipeline-hygiene-review.md";
import commentReplyAutomation from "./skills/comment-reply-automation.md";
import landingPageLaunch from "./skills/landing-page-launch.md";
import chatbotWidgetDeploy from "./skills/chatbot-widget-deploy.md";
import competitorResearchBrief from "./skills/competitor-research-brief.md";
import contentRepurposing from "./skills/content-repurposing.md";

export interface Skill {
  /** Kebab-case unique identifier. Used in URIs (`skill://<name>`) and tool calls. */
  name: string;
  /** One-paragraph description. Indexed by `search_skills`; shown to agents during discovery. */
  description: string;
  /** Full markdown body. Returned when the skill is activated. */
  body: string;
  /** Free-form keywords to improve search recall. */
  tags: string[];
}

export const SKILLS: Skill[] = [
  {
    name: "using-skillstream",
    description:
      "ALWAYS load this first when connecting to SkillStream. Explains the library's purpose, the plan→validate→execute→verify loop, and when to invoke each downstream skill. Saves tokens and prevents wasted work.",
    body: usingSkillstream,
    tags: ["meta", "onboarding", "methodology", "entry-point"],
  },
  {
    name: "brainstorm-first",
    description:
      "Use BEFORE writing any code or making changes. Refines a vague request through targeted questions into 1-3 concrete acceptance criteria. Prevents solving the wrong problem.",
    body: brainstormFirst,
    tags: ["methodology", "planning", "clarification", "spec"],
  },
  {
    name: "plan-before-action",
    description:
      "Use AFTER brainstorming, BEFORE making any file changes. Produces a concrete plan: exact files to touch, exact changes, verification commands, rollback. Prevents reactive editing.",
    body: planBeforeAction,
    tags: ["methodology", "planning", "implementation-plan"],
  },
  {
    name: "validate-before-execute",
    description:
      "Use AFTER a plan, BEFORE executing it. Dry-runs the plan mentally, surfaces broken assumptions, validates file existence and naming. Catches mistakes before they cost tokens.",
    body: validateBeforeExecute,
    tags: ["methodology", "validation", "safety", "dry-run"],
  },
  {
    name: "execute-with-discipline",
    description:
      "Use DURING execution of a plan. Rules to stay on plan: edit in order, complete-then-next, no off-plan reads, surface deviations. Prevents mid-task drift and yak-shaving.",
    body: executeWithDiscipline,
    tags: ["methodology", "execution", "discipline"],
  },
  {
    name: "verify-after-complete",
    description:
      "Use AFTER executing a plan. Runs the verification commands defined in plan-before-action, captures real output, checks side effects. Prevents 'I think it works' false positives.",
    body: verifyAfterComplete,
    tags: ["methodology", "verification", "testing", "completion"],
  },
  {
    name: "self-healing-recovery",
    description:
      "Use when a tool call fails, a test fails, or output is unexpected. Performs root-cause diagnosis (transient vs bad input vs wrong tool vs wrong assumption vs env) before retrying. Prevents the 'retry the same broken command 5 times' pattern.",
    body: selfHealingRecovery,
    tags: ["methodology", "debugging", "error-handling", "recovery", "self-healing"],
  },
  {
    name: "token-conscious-iteration",
    description:
      "Apply continuously to minimize wasted tool calls and context bloat. Rules for efficient reading, batched writes, avoiding exploration, and stopping at 'good enough'.",
    body: tokenConsciousIteration,
    tags: ["methodology", "efficiency", "tokens", "cost"],
  },
  {
    name: "find-the-right-skill",
    description:
      "Use when you don't know which skill applies to the current task. Explains how to use search_skills, heuristics for picking among candidates, and when no skill applies.",
    body: findTheRightSkill,
    tags: ["meta", "discovery", "routing"],
  },

  // ─── Marketing & Sales pack ────────────────────────────────────────

  {
    name: "lead-magnet-funnel",
    description:
      "Build an end-to-end lead magnet funnel — landing page + opt-in form + capture + auto follow-up flow + CRM handoff. ALWAYS use this skill whenever the user mentions a 'lead magnet', 'freebie', 'opt-in', 'ebook funnel', 'checklist download', 'free guide', 'newsletter signup', 'free training', or any 'give X to get email' workflow. Triggers even when the user only describes the pieces ('I want a page that captures emails and sends them a PDF') without saying 'funnel'. Covers offer framing, page copy, form design, delivery email, follow-up sequence, and pipeline routing.",
    body: leadMagnetFunnel,
    tags: ["marketing", "funnel", "lead-gen", "opt-in", "landing-page", "email-capture", "nurture"],
  },
  {
    name: "cold-outreach-sequence",
    description:
      "Plan and ship researched, multi-touch cold outreach sequences (email + LinkedIn-ready + SMS) that earn replies instead of getting filtered. ALWAYS use this skill whenever the user mentions 'cold email', 'cold outreach', 'prospecting', 'lead gen sequence', 'drip campaign for cold leads', 'outbound', 'BDR sequence', 'follow-up cadence', or wants to 'email a list of leads'. Triggers even if the user only describes the symptom ('we sent 500 emails and got 2 replies'). Covers list segmentation, deep research, personalization at scale, sequence cadence, and deliverability hygiene.",
    body: coldOutreachSequence,
    tags: ["sales", "outbound", "cold-email", "prospecting", "outreach", "sequence", "deliverability"],
  },
  {
    name: "broadcast-campaign",
    description:
      "Plan, draft, segment, A/B test, and send broadcast campaigns (email or SMS) to existing lists in a way that maximizes open/click without burning the list. ALWAYS use this skill whenever the user mentions a 'broadcast', 'newsletter', 'campaign', 'blast', 'send to my list', 'email my customers', 'promo email', 'announcement email', 'Black Friday email', or any 'one-to-many message to my audience'. Triggers even if they only describe the action ('I want to tell my customers about X'). Covers segmentation, subject A/B, send timing, and post-send analysis.",
    body: broadcastCampaign,
    tags: ["marketing", "email", "broadcast", "newsletter", "campaign", "sms", "segmentation"],
  },
  {
    name: "social-content-batch",
    description:
      "Produce and schedule a full week (or month) of cross-platform social content — Facebook, Instagram, X/Twitter — with on-brand copy, generated images/video, and platform-appropriate formatting in one batch. ALWAYS use this skill whenever the user mentions 'social media calendar', 'content calendar', 'weekly posts', 'batch content', 'social media plan', 'schedule posts', 'Instagram posts', 'Facebook posts', 'X posts', 'Twitter posts', or wants to 'stop posting in real time'. Triggers even if the user just says 'I need to be more consistent on social'. Covers pillar-based planning, platform adaptation, asset generation, and bulk scheduling.",
    body: socialContentBatch,
    tags: ["marketing", "social-media", "content", "instagram", "facebook", "twitter", "batch", "scheduling"],
  },
  {
    name: "pipeline-hygiene-review",
    description:
      "Audit a CRM sales pipeline, flag stale and stuck deals, identify which need re-engagement vs. removal, and draft the specific next-action message per deal. ALWAYS use this skill whenever the user mentions 'pipeline review', 'deal review', 'stuck deals', 'sales pipeline audit', 'clean up the CRM', 'stale leads', 'dead deals', 'forecast review', or asks 'what's in my pipeline'. Triggers even when the user only complains about pipeline volume vs. closed revenue. Covers stage-by-stage aging analysis, recovery playbook by stage, and bulk update execution.",
    body: pipelineHygieneReview,
    tags: ["sales", "crm", "pipeline", "deals", "hygiene", "audit", "zoho"],
  },
  {
    name: "comment-reply-automation",
    description:
      "Set up AI auto-replies to Facebook and Instagram comments that capture interest, route hot leads into DMs or funnels, and protect the brand voice from off-topic replies. ALWAYS use this skill whenever the user mentions 'auto-reply to comments', 'comment automation', 'DM funnel from comments', 'Facebook comment bot', 'Instagram comment automation', 'auto-DM', 'ManyChat replacement', 'respond to every comment', or describes the pattern ('when someone comments X, send them Y'). Triggers even on adjacent phrases like 'auto follow-up on a viral post'. Covers trigger configuration, public reply scripting, DM handoff, and abuse protection.",
    body: commentReplyAutomation,
    tags: ["marketing", "social-media", "automation", "comments", "dm", "facebook", "instagram", "lead-capture"],
  },
  {
    name: "landing-page-launch",
    description:
      "Take a landing page from blank to live URL — copy, layout, form, deployment to GitHub Pages, tracking, and wiring into a follow-up flow — without the usual half-built drafts that never ship. ALWAYS use this skill whenever the user mentions a 'landing page', 'sales page', 'opt-in page', 'waitlist page', 'coming soon page', 'launch page', 'squeeze page', 'build me a page for X', 'one-pager site', or wants to 'test an offer with a page'. Triggers even on phrases like 'I need a URL to send ads to'. Covers offer-clarity audit, conversion-first layout, deploy, and tracking.",
    body: landingPageLaunch,
    tags: ["marketing", "landing-page", "conversion", "deploy", "web", "github-pages"],
  },
  {
    name: "chatbot-widget-deploy",
    description:
      "Spin up an AI chatbot widget for a website that captures leads, qualifies them, books meetings, and hands off to sales — tuned to the specific offer and brand voice, not a generic 'How can I help you today?' bot. ALWAYS use this skill whenever the user mentions 'chat widget', 'AI chatbot', 'website chatbot', 'Intercom replacement', 'Drift replacement', 'lead capture chat', 'site chat', 'embed chat on my site', or wants to 'talk to visitors automatically'. Triggers even if they describe it functionally ('a thing that pops up and gets visitor info'). Covers prompt design, qualification logic, lead routing, and embed instructions.",
    body: chatbotWidgetDeploy,
    tags: ["marketing", "sales", "chatbot", "widget", "ai", "lead-capture", "qualification"],
  },
  {
    name: "competitor-research-brief",
    description:
      "Run deep competitor research (positioning, pricing, offers, content strategy, ad angles, weaknesses) and deliver an actionable brief — not a 40-page report no one reads. ALWAYS use this skill whenever the user mentions 'competitor research', 'competitive analysis', 'competitor audit', 'swot', 'market research', 'what are competitors doing', 'spy on competitors', 'how does X position', 'category landscape', or asks 'should we change our pricing/messaging because of Y'. Triggers even on phrases like 'I want to know what they're up to'. Covers source discovery, structured scraping, gap analysis, and a one-page brief format.",
    body: competitorResearchBrief,
    tags: ["marketing", "research", "competitive-analysis", "positioning", "strategy", "firecrawl"],
  },
  {
    name: "content-repurposing",
    description:
      "Turn ONE piece of pillar content (long video, podcast, blog post, webinar, keynote) into 8–12 derivative posts, captions, ad creatives, and email modules across platforms — multiplying reach without multiplying creation effort. ALWAYS use this skill whenever the user mentions 'repurpose content', 'atomize content', 'content multiplier', 'turn my podcast into posts', 'clip a video for shorts', 'blog to social', 'webinar replay leverage', or describes the underlying problem ('I made this thing and don't know how to share it'). Triggers even on adjacent phrases like 'make this go further'. Covers source analysis, derivative planning, asset generation, and scheduling.",
    body: contentRepurposing,
    tags: ["marketing", "content", "social-media", "repurpose", "video", "podcast", "atomization"],
  },
];

/** Find a skill by its exact name. */
export function getSkillByName(name: string): Skill | undefined {
  return SKILLS.find((s) => s.name === name);
}

/**
 * Simple text-match ranker. Sufficient for V0 (handful of skills).
 * For V1, replace with Vectorize embedding search.
 *
 * Score weights: name match 10, description 5, tag 3, body 1.
 */
export function searchSkills(query: string, limit = 5): Skill[] {
  const q = query.toLowerCase().trim();
  if (!q) return SKILLS.slice(0, limit);

  // Split query into tokens so "review pull request" matches "pull-request review"
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);

  const scored = SKILLS.map((s) => {
    let score = 0;
    const name = s.name.toLowerCase();
    const desc = s.description.toLowerCase();
    const tags = s.tags.map((t) => t.toLowerCase());
    const body = s.body.toLowerCase();

    for (const tok of tokens) {
      if (name.includes(tok)) score += 10;
      if (desc.includes(tok)) score += 5;
      if (tags.some((t) => t.includes(tok))) score += 3;
      if (body.includes(tok)) score += 1;
    }

    return { skill: s, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.skill);
}

/** Convert a skill name to a valid MCP prompt name (kebab → snake). */
export function promptNameFor(skill: Skill): string {
  return `skill_${skill.name.replace(/-/g, "_")}`;
}
