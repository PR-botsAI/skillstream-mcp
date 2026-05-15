
# Lead Magnet Funnel

End-to-end funnel: a landing page that trades a high-value asset for an email, captures the lead, delivers the asset, nurtures with follow-up, and routes hot leads to sales.

## Required tools

These are deferred — call `tool_search` first with query `"PMGPT landing page form flow"` to load them. You'll need:

- **PMGPT_TOOL**: `create_landing_page`, `deploy_landing_page_to_github`, `update_landing_page`, `create_form`, `get_form_submissions`, `create_flow`, `trigger_flow`, `create_automation`, `create_contact`, `update_contact`, `create_pipeline`, `move_contact_in_pipeline`
- Optional: `generate_image` (hero art), `generate_speech` / `generate_heygen_video` (welcome video)

## Inputs you need before starting

Ask the user upfront — don't guess:

1. **The offer** — what's the lead magnet? (PDF guide, checklist, video training, template, free audit, mini-course)
2. **Target audience** — who is this for, in one sentence ("Solo bookkeepers with 5–20 SMB clients")
3. **The core promise** — what changes for them after consuming it ("Close the books 4× faster")
4. **Send-from identity** — sender name + email/domain for delivery
5. **Sales objective** — what's the *next* offer after they opt in? (Discovery call, paid course, product trial)
6. **Asset location** — URL to the PDF/video, or do they need it created?

## Workflow

### Step 1 — Frame the offer

Write a one-line **promise** ("Get [outcome] in [timeframe] without [pain]") and 3 bullet **proof points**. Confirm with user before building pages. A weak promise kills conversion; a strong promise carries a mediocre page.

### Step 2 — Build the form

```
create_form(
  name: "<magnet> opt-in",
  fields: [email (required), first_name (required), <one qualifier if sales is high-ticket>]
)
```

Keep it to **2 fields** unless the back-end offer is >$1k — every field cuts conversion ~10%.

### Step 3 — Build the landing page

```
create_landing_page(
  name: "<magnet> LP",
  headline: <the promise>,
  subhead: <who it's for + what they'll learn>,
  bullets: <3 proof points>,
  form_id: <from step 2>,
  cta_text: "Send Me The <Asset>"
)
```

Then `deploy_landing_page_to_github` for a real URL. Use `update_landing_page` for revisions.

### Step 4 — Build the delivery + nurture flow

Create a 5-touch flow with `create_flow`:

| # | Timing | Purpose |
|---|---|---|
| 1 | Immediate | Deliver the asset + welcome |
| 2 | Day 1 | Origin story + the "why this matters" |
| 3 | Day 3 | Case study / proof |
| 4 | Day 5 | Soft CTA toward next offer |
| 5 | Day 7 | Hard CTA + scarcity element |

Each touch: subject line, one specific idea, one CTA. No buffet emails.

### Step 5 — Wire automation

```
create_automation(
  trigger: "form_submission:<form_id>",
  actions: [
    create_contact(...),
    trigger_flow(<flow_id>),
    move_contact_in_pipeline(<lead-pipeline>, stage: "New Lead")
  ]
)
```

### Step 6 — Hot-lead routing

In touches 4 and 5, when the contact clicks the CTA, fire a second automation that moves them to "Sales Qualified" and pings the sales channel (Discord / Slack / email to owner).

## Output

A package containing:
- Landing page URL (live)
- Form ID
- Flow ID + the 5 email drafts
- Automation IDs
- Pipeline name + stage map
- A one-page operator doc explaining how to A/B test the headline and where to look for stuck leads

## Verification

- `get_form_submissions(<form_id>)` — submit a test → confirm contact appears
- Check the test contact received email 1 within 5 min
- `list_pipeline_contacts(<pipeline>)` — confirm the test contact landed in "New Lead"
- Click the CTA in email 4 from the test inbox → confirm pipeline move + sales notification

## Common failure modes

- **Headline too clever.** "Unlock the synergy of growth" → kill it. Promise an outcome.
- **Asset never delivered** because the form-action automation wasn't wired. Always test end-to-end before traffic.
- **Nurture too generic.** If touches 2–4 could apply to any business, they'll convert like any business: poorly. Specific stories beat polished copy.
- **No exit pipeline.** Leads pile up in "New Lead" forever. Define what "qualified" means before you build the funnel.
