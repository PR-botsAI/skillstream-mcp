
# Landing Page Launch

A landing page exists to convert one specific audience on one specific offer with one specific CTA. Everything else is a website. This skill enforces that.

## Required tools

Load via `tool_search` with `"landing page deploy github"` and `"create form"`:

- **PMGPT_TOOL**: `create_landing_page`, `update_landing_page`, `get_landing_page`, `list_landing_pages`, `deploy_landing_page_to_github`, `sync_landing_page_to_github`, `create_form`, `get_form_submissions`, `create_flow`, `create_automation`, `generate_image`

## Inputs you need

The 5 mandatory inputs (do not start without these):

1. **The audience** — one sentence, specific. "Solo bookkeepers serving 5–20 SMB clients", not "small business owners".
2. **The promise** — outcome + timeframe + objection removed. "Close the books 4× faster, even if you've never used automation."
3. **The proof** — testimonials, case study numbers, credentials, screenshots — at least one piece.
4. **The CTA** — exactly one action. Book a call? Get the PDF? Start free trial?
5. **The traffic source** — where will visitors come from? (Ads, email, organic, podcast) Because the page must match the message that brought them.

## Workflow

### Step 1 — Pre-flight audit

Before generating anything, audit the offer:

- Could a stranger explain what's being offered after 5 seconds on the page? If no, fix the promise.
- Is the CTA matched to traffic temperature? Cold traffic → free/low commitment. Warm traffic → trial/demo. Hot traffic → buy now.
- Is there a *reason to act now*? If not, add one (limited cohort, expiring bonus, real deadline).

### Step 2 — Outline the page

Standard high-converting structure (vary only when there's a reason):

| Section | Job |
|---|---|
| Hero | Promise + subhead + CTA — fold visible without scrolling |
| Pain agitation | 3 lines of "you currently struggle with X, Y, Z" |
| Solution intro | What you're offering, in one paragraph |
| What you get | Bullet list of components (5–9 items) |
| Proof | 2–3 testimonials OR case study with specific numbers |
| About / credibility | Who's behind this, why trust them |
| FAQ | Top 5 objections, answered |
| Closing CTA | Restate offer + CTA button — same as hero |

For waitlist / coming-soon pages, collapse to: Hero + Why-this-matters + Form. That's it.

### Step 3 — Generate hero asset

```
generate_image(
  prompt: "<visual that matches the promise>, professional, <brand color palette>, clean composition",
  aspect_ratio: "16:9"
)
```

Or, if a real photo exists (founder photo, product shot, screenshot), use it — real beats AI for credibility.

### Step 4 — Build the form

```
create_form(
  name: "<page name> opt-in",
  fields: <minimum viable — email always, name if friendly, qualifier only if high-ticket>,
  success_action: "show_thank_you" | "redirect:<url>"
)
```

Field count rule: free download = 1 field (email). Demo request = 3 fields (name, email, company). Quote request = 4 fields max.

### Step 5 — Create the page

```
create_landing_page(
  name: "<offer name> LP",
  sections: <the outlined structure>,
  hero_image_url: <from step 3>,
  form_id: <from step 4>,
  cta_text: "<action verb + outcome>",     # "Send me the playbook", not "Submit"
  meta_title: "<benefit-driven, ≤60 chars>",
  meta_description: "<who it's for + main promise, ≤155 chars>",
  favicon_url: <brand favicon>
)
```

### Step 6 — Deploy

```
deploy_landing_page_to_github(
  page_id: <id>,
  repo_name: <slug>,
  custom_domain: <optional>
)
```

Returns a live URL. Open it. Audit on mobile (60–70% of traffic). Check:
- Page loads in <3s
- Hero promise readable on a phone without zooming
- Form actually submits (test it)
- CTA button is the highest-contrast element on the page

For revisions: `update_landing_page(...)` then `sync_landing_page_to_github(page_id)` to push.

### Step 7 — Wire the follow-up

A landing page without a follow-up sequence is a leak. Build the bare-minimum flow:

```
create_flow(
  name: "<offer> delivery + nurture",
  triggers_on: "form_submission:<form_id>",
  emails: [
    {delay: 0, subject: "Here's <the thing>", body: <delivery + 1 question>},
    {delay: "2d", subject: <pattern interrupt>, body: <story + soft CTA>},
    {delay: "5d", subject: <next-offer pitch>, body: <case study + CTA>}
  ]
)

create_automation(
  trigger: "form_submission:<form_id>",
  actions: [trigger_flow(<flow_id>), create_contact(...)]
)
```

### Step 8 — Add tracking

Insert the user's analytics (GA4, Meta Pixel, etc.) via `update_landing_page` if PMGPT supports custom script injection — otherwise, ask the user to provide their tracking snippet and document where to paste it.

Track these events at minimum:
- Page view
- Form submit (the conversion)
- CTA button click (in case form is below fold)

## Output

- Live URL of the page
- Form ID + form admin link
- Flow ID with the 3-email nurture sequence
- Automation wiring it all together
- Mobile screenshot of the live page
- A 1-page "what to test next" memo (3 specific A/B test ideas)

## Verification

- Open the URL on a phone in incognito. Submit the form with a test email. Within 5 min: email 1 arrives, the contact exists in PMGPT, the automation log shows the flow triggered.
- Lighthouse mobile score >80 on performance
- Form field tab order is correct (don't laugh — broken tab order kills mobile conversion)
- Test on both light and dark mode email clients — your delivery email shouldn't break

## Common failure modes

- **Hero promise that's vague.** "Transform your business" converts at 1%. "Save 6 hours a week on bookkeeping in 14 days" converts at 8%.
- **Too many CTAs.** Even two CTAs cuts conversion. One offer, one button, repeated.
- **No mobile test.** Most traffic is mobile and most builders preview on desktop. Always check on a phone before going live.
- **Form delivery never tested.** Page goes live, traffic comes in, no one gets the asset, brand burned. **Test before traffic, every time.**
- **No follow-up sequence.** The opt-in is the start, not the finish. Without a flow, the lead cools in 48 hours.
- **Page that doesn't match the ad.** Ad says "Free template", page says "Book a strategy call". Bounce rate skyrockets. Match the promise.
