
# Comment Reply Automation

A high-engagement post leaves money on the table if you can't follow up at scale. This skill builds the auto-reply → DM → lead-capture path without making the brand sound like a bot.

## Required tools

Load via `tool_search` with `"comment automation facebook instagram"`:

- **PMGPT_TOOL**: `create_comment_automation`, `list_comment_automations`, `list_social_accounts`, `create_flow`, `trigger_flow`, `list_scheduled_posts`, `get_social_insights`

## Inputs you need

1. **Target post(s)** — a specific post, all posts on a page, posts with a keyword in caption, or posts going forward
2. **Trigger condition** — what comment triggers a reply? Specific keyword? Any comment? Question marks only? Sentiment-positive only?
3. **Public reply** — the visible reply everyone sees (or set to "no public reply, DM only")
4. **DM body** — what the user actually receives (this is where the real conversion happens)
5. **Lead-capture goal** — get them on a list, into a flow, to a landing page, or to a sale
6. **Brand voice guardrails** — what the bot must NEVER say (off-color jokes, competitor names, anything legally constrained)

## Workflow

### Step 1 — Confirm account connections

```
list_social_accounts()
```

Pull the page IDs. If FB and IG are linked via the same Meta Business account, you can run one automation across both — confirm before assuming.

### Step 2 — Pick the trigger strategy

Three patterns, pick one:

**A) Single-post campaign (highest conversion, narrowest scope)**
- Specific post + specific keyword
- Best for: viral post follow-up, launch promo, contest
- Example: "Comment WAITLIST and I'll send the link"

**B) Page-wide keyword (medium scope)**
- Any post on the page + comment contains a keyword
- Best for: ongoing CTAs across content
- Example: any comment with "PRICE" triggers DM with pricing

**C) All comments (broadest, riskiest)**
- Every comment gets a reply — usually a thank-you + soft CTA
- Best for: high-trust brands with light moderation needs
- Risk: trolls, spam, off-topic comments get auto-replied to

### Step 3 — Write the public reply

The public reply does two jobs: (1) confirm "the bot heard you" to the commenter, (2) social proof for everyone scrolling who sees a thread of "I just DM'd you!" replies.

Rules:
- Sound human. Use a contraction. Reference what they said when possible.
- Don't say "DM sent!" — it tips off that it's automated and Meta down-ranks
- Keep under 12 words
- Vary the wording (provide 3–5 variants the automation rotates through)

Bad: "Thanks! Check your DMs!"
Good (variants):
- "just sent it your way 👇"
- "popping into your inbox now"
- "sent — let me know if it doesn't land"

### Step 4 — Write the DM

The DM is the conversion. Structure:

```
Hey <first name if available>!

You commented on <reference what — "the carbs post" / "the launch teaser">,
so here's <the thing>: <link or content>

<One follow-up question to start a conversation, OR a clear next step>

— <Sender name or brand>
```

The follow-up question is critical. Without it, the DM is one-way and the lead cools. Examples:
- "Curious — are you trying to solve this for yourself or your team?"
- "What kicked off your interest in this?"
- "Want me to send the bonus too?"

### Step 5 — Create the automation

```
create_comment_automation(
  account_id: <FB or IG page id>,
  scope: "post" | "page" | "keyword",
  post_ids: [<id>] OR keyword: "<word>",
  trigger_keywords: ["WAITLIST", "waitlist", "interested"],
  public_reply_variants: [<v1>, <v2>, <v3>],
  dm_body: <from step 4>,
  follow_up_flow_id: <flow id, optional>,
  exclude_keywords: ["scam", "spam", "<competitor>", "<profanity>"],
  rate_limit: "1 per user per 24h"
)
```

Critical settings:
- **exclude_keywords**: protects from troll-bait
- **rate_limit**: one auto-reply per user per day — Meta penalizes spammy replies
- **respect 24-hour messaging window**: if it's been >24h since the user last messaged your page, Meta requires a message tag or limits the DM type

### Step 6 — Build the follow-up flow (optional but recommended)

After the initial DM, what's next? Create a flow that:
1. Waits for their reply
2. If reply contains buying intent ("how much", "when can", "yes"), hands off to sales (Discord ping, CRM contact creation, email to owner)
3. If reply is generic, sends value (case study, article) and asks the qualifying question
4. If no reply in 48h, sends one nudge then stops

```
create_flow(name: "<campaign> DM follow-up", structure: <as above>)
```

Link via `follow_up_flow_id` in the automation.

### Step 7 — Audit live

```
list_comment_automations(status: "active")
```

After it's been live 4 hours on a real post: spot-check 5 actual replies. Did the bot:
- Reply to the right comments?
- Skip off-topic ones?
- Send the DM successfully?
- Sound human in the public reply?

If any answer is no, pause and fix before scaling.

## Output

- The active automation ID(s)
- The 3+ public reply variants (so it doesn't sound robotic)
- The DM template + follow-up flow
- Exclude-keyword list (anti-troll filter)
- A "kill switch" for the user — exact command to pause the automation

## Verification

- Comment on the target post yourself with the trigger keyword → confirm:
  - Public reply appears within 30s
  - DM arrives in your inbox within 60s
  - DM contains the right content and the follow-up question
- Comment with an exclude keyword → confirm bot ignores it
- 24h later: check `get_social_insights` — did engagement drop, hold, or rise? If a post auto-replies are tanking reach, Meta is punishing — tighten the rate limit.

## Common failure modes

- **DMs that get caught in "message requests"** because the user has never interacted with the page before. Mitigation: in the public reply, include "(check your message requests)" subtly.
- **Bot replying to spam-bait.** Trolls comment "BUY VIAGRA" and get a thoughtful DM. Your exclude_keywords list must be maintained weekly.
- **Same reply every time → ranks down.** Always rotate at least 3 variants.
- **No human handoff path.** Hot leads reply asking to buy and the bot answers with "Did you get my link?". Wire the flow to escalate on buying intent.
- **Auto-DMing on a 2-year-old post** because scope was set page-wide without a date filter. Limit scope to "posts from last 30 days" unless intentional.
