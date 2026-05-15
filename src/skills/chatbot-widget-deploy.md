
# Chatbot Widget Deploy

A bad widget is "How can I help you today?" → visitor asks a question → bot says "Please leave your email and we'll get back to you" → conversion ~0%. A good widget is a sales rep that never sleeps. This skill builds the second kind.

## Required tools

Load via `tool_search` with `"widget chatbot send_message"`:

- **PMGPT_TOOL**: `create_widget`, `update_widget`, `get_widget`, `list_widgets`, `send_message`, `list_widget_contacts`, `list_widget_messages`, `create_flow`, `create_automation`, `list_voices`

## Inputs you need

1. **The single goal** — book meetings? collect emails? qualify support tickets? answer pricing? Pick ONE.
2. **The offer** — what's being sold, who it's for, the price band (even if not displayed)
3. **Brand voice** — formal vs. conversational, 3 adjectives
4. **Qualification criteria** — what makes a lead "good" vs. "browse"
5. **Handoff path** — when qualified, what happens? (calendar link, sales DM, CRM tag, email to owner)
6. **Off-topic guardrails** — what the bot must REFUSE to discuss (competitor comparisons, legal advice, pricing for custom deals, etc.)

## Workflow

### Step 1 — Write the system prompt (the most important step)

Generic prompt: "You are a helpful assistant for [Company]."
Conversion-killing.

Real prompt template:

```
You are <name>, the assistant on <Company>'s website. Your ONE job is
to <single goal — e.g. "qualify visitors and book discovery calls">.

WHO WE ARE:
<2 sentences about the company + what makes it different>

WHO WE HELP:
<ICP in one sentence>

WHAT WE OFFER:
<concise offer description, 3-5 lines>
Price band: <range, OR "starts at $X" if shown publicly, OR "custom — qualify first">

YOUR PERSONALITY:
<3 adjectives>. You sound like a knowledgeable human, not a corporate FAQ.
Short messages (under 3 sentences usually). Use "we" not "the company".

YOUR PROCESS:
1. Greet warmly, ask what brought them here
2. Listen, then ask <qualifier question 1>
3. If they match ICP, ask <qualifier question 2>
4. If still good fit, propose <CTA — booking link, demo, etc.>
5. If poor fit, point them to <resource — blog, free tier> graciously

QUALIFICATION SIGNALS (ask gently, don't interrogate):
- <signal 1: e.g. team size>
- <signal 2: e.g. current solution>
- <signal 3: e.g. timeline>

YOU DO NOT:
- Compare us to specific competitors by name
- Promise outcomes ("you'll definitely 10×...")
- Quote custom pricing — say "depends on scope, let's talk"
- Discuss <off-topic guardrails>
- Pretend to be human if asked directly — but you also don't volunteer it

WHEN TO HAND OFF:
If the visitor asks anything you're unsure about, OR if they're clearly
qualified and ready to talk, say: "Let me grab the right person —
what's the best email to reach you at?" Then capture and trigger handoff.
```

### Step 2 — Create the widget

```
create_widget(
  name: "<site> — <goal>",
  system_prompt: <from step 1>,
  greeting_message: <opener, see below>,
  appearance: {
    primary_color: <brand hex>,
    position: "bottom-right",
    bubble_style: "rounded",
    avatar_url: <human-feeling avatar — not a robot icon>
  },
  capture_email: true,
  capture_name: true,
  voice_id: <optional, from list_voices if voice-enabled>,
  seo_title: <only if widget has a public chat page>
)
```

**Greeting message** — three patterns that beat "How can I help you?":
- Specific: "Curious about <offer>? I can answer questions or book a 15-min chat with the team."
- Diagnostic: "What brings you to <site> today?" (open) — works for B2B
- Provocative: "Wondering if <product> is right for you? Tell me what you're trying to solve."

### Step 3 — Build the lead-capture flow

After visitor provides email, the bot should NOT just thank them. Wire a follow-up flow:

```
create_flow(
  name: "<widget> post-chat",
  triggers_on: "widget_lead_captured:<widget_id>",
  actions: [
    create_contact_in_crm,
    send_immediate_email("Great meeting you in chat — here's <relevant resource>"),
    if_qualified: send_sales_alert,
    schedule_followup: 2_days,
  ]
)
```

### Step 4 — Test with real conversations

This is where most widget deploys go wrong. Do not skip.

Run at least 5 test conversations through `send_message(<widget_id>, message)`:

1. **High-intent visitor**: "I want to buy. How much?"
   → Bot should NOT just give a price. Should qualify, then route.
2. **Low-intent visitor**: "Just looking, what do you do?"
   → Bot should explain in 2 sentences, then ask one question.
3. **Off-topic**: "Can you write me a poem?"
   → Bot should redirect politely back to its job.
4. **Competitor mention**: "How are you different from <competitor>?"
   → Bot should NOT name them; should focus on what makes us strong.
5. **Frustrated visitor**: "This is the third time I've tried to get pricing!"
   → Bot should de-escalate, offer human handoff immediately.

After each test, audit the response. Update the system prompt with `update_widget` and re-test.

### Step 5 — Embed

PMGPT gives an embed snippet (usually a `<script>` tag). User pastes it before `</body>` on their site. Verify:
- Widget appears in bottom-right on every page
- Greeting fires after 5–10 seconds (not instantly — feels desperate)
- Works on mobile (widget collapses correctly, doesn't cover content)

### Step 6 — Set up monitoring

```
list_widget_contacts(widget_id, days: 7)
list_widget_messages(widget_id, days: 7)
```

Schedule a weekly review (in calendar) to:
- Read the last 10 conversations
- Identify recurring questions the bot fumbled
- Update the system prompt
- Note any visitor pain points to feed into landing page / sales copy

The widget is also a research goldmine — actual customer language, FAQ patterns, objection signals.

## Output

- Live widget on the site with embed snippet provided
- Tested conversation log (5 test scenarios documented)
- The system prompt (saved so user can revise)
- Lead-capture flow + automation wired
- Weekly review process documented

## Verification

- Open site in incognito on both desktop and mobile → widget appears
- Send a test message → bot responds appropriately within 5s
- Provide a test email → confirm contact appears in PMGPT contacts via `list_widget_contacts`
- Confirm sales alert fires for a high-intent test
- After 48 hours of live traffic: review the first 20 real conversations, identify 3 prompt improvements

## Common failure modes

- **System prompt too short.** A 3-line prompt produces a 3-line bot. Detail = quality.
- **No handoff trigger.** Bot keeps chatting with a qualified lead instead of capturing email. Always have an explicit escalation rule in the prompt.
- **Greeting fires instantly.** Visitor hasn't even read the headline. Set a 5–10s delay.
- **Bot promising things it shouldn't.** ("Yes, we can absolutely deliver by Friday.") Add explicit "YOU DO NOT" rules in the prompt.
- **Treating the widget as set-and-forget.** Without monthly prompt updates, the bot's quality decays as the product/audience evolve. Weekly conversation reviews are non-negotiable.
- **Robot avatar.** Visitors are more honest with what feels like a person. Use a human or branded illustration, not a circuit-board icon.
