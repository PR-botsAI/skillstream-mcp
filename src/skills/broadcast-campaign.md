
# Broadcast Campaign

A broadcast is not a cold email — it goes to people who said yes. The job is to **earn the next yes** without becoming the sender they regret subscribing to.

## Required tools

Load via `tool_search` with `"broadcast send campaign"`:

- **PMGPT_TOOL**: `create_broadcast`, `update_broadcast`, `send_broadcast`, `list_broadcasts`, `list_social_accounts`
- **Zoho CRM**: `executeCOQLQuery`, `searchRecords` (for segmentation pulls)
- Optional: `generate_image` (hero), `ZohoMail_searchEmails` (post-send response audit)

## Inputs you need

1. **Goal** — pick one: revenue (drive purchase), engagement (drive replies/clicks), retention (re-activate dormant), brand (announce). One broadcast = one goal.
2. **Audience segment** — all subscribers? buyers only? non-buyers? past 90 days active? Define before drafting.
3. **The hook** — what's *new* or *urgent*? If nothing is, **don't send a broadcast**; write a long-form post instead.
4. **The ask** — single CTA. If you can't reduce it to one button, the broadcast isn't ready.
5. **Channel** — email, SMS, or both. SMS is for time-sensitive only (drops, restocks, expiring offers).

## Workflow

### Step 1 — Segment (don't blast everyone)

Whole-list sends are deliverability suicide. Pull a real segment:

```
executeCOQLQuery("
  SELECT Id, Email, First_Name
  FROM Contacts
  WHERE Last_Engaged_Date > '<90 days ago>'
    AND Email_Opt_In = true
    AND <goal-specific filter>
")
```

Goal-specific filter examples:
- Revenue → bought in last 12 months OR clicked in last 30 days
- Re-activation → no opens in 60 days but opened previously
- New launch → all subscribers tagged with the relevant interest

If your segment is <500 people, A/B test is statistically noise — pick one subject and ship.

### Step 2 — Draft

Structure:
- **Subject (≤50 chars)** — curiosity + benefit, no all-caps, no emojis if you're not already a brand that uses them.
- **Preheader (≤90 chars)** — second hook, NOT a repeat of subject.
- **Opening line** — one sentence, conversational, no "Hi everyone".
- **Body** — one idea, 3–6 short paragraphs. Bullet points only if comparing.
- **CTA** — button, action verb ("Get my discount", "Save my seat"), repeated once at bottom.
- **PS** — re-state the offer + deadline. The PS often outperforms the body.

For SMS: 1 sentence, 1 link, 1 emoji max. Always include "STOP to unsubscribe" or the carrier kills you.

### Step 3 — Create draft broadcast

```
create_broadcast(
  name: "<campaign name> — <segment>",
  channel: "email" | "sms",
  segment_query: <from step 1>,
  subject: <A variant>,
  body: <draft>,
  status: "draft"
)
```

### Step 4 — A/B subject test (only if segment ≥1000)

Send subject A to 10%, subject B to 10%, wait 4 hours, send winner to remaining 80%.

```
update_broadcast(<id>, subject: <B variant>)  # for variant
```

Winner = higher *click* rate, not higher open rate. Opens lie now (Apple MPP); clicks don't.

### Step 5 — Send timing

| Audience | Best send window (their local time) |
|---|---|
| B2B office workers | Tue/Wed/Thu 9:30–10:30 AM |
| B2C consumers | Thu 10 AM or Sun 6 PM |
| SMS promos | 11 AM–1 PM weekdays |
| Re-engagement | Saturday morning (less competition) |

Avoid: Monday before 10 AM, Friday after 2 PM, any holiday.

### Step 6 — Send + monitor

```
send_broadcast(<id>, schedule_at: <ISO timestamp>)
```

For the first hour after send, watch for: bounce spike (>3% = pause), spam complaints (>0.1% = pause and apologize on social), unsubscribe wave (>2% = list was wrong).

### Step 7 — Post-send debrief

24 hours later:
- `list_broadcasts(filter: "sent_last_48h")` → pull metrics
- Compute: delivered, open rate (note MPP), click rate, click-to-open, conversion to goal, unsubscribe rate
- Write a 3-line memo: what worked, what to change next time, what to test next

## Output

- A draft broadcast with subject + preheader + body + CTA approved by user
- The segment query + audience count
- Send schedule (date/time)
- A post-send report 24h later

## Verification

- Send a test to the user's own email first. Confirm: subject renders, no broken links, unsubscribe works, images load on mobile, dark mode doesn't kill the design.
- After main send: `list_broadcasts` → confirm delivered count matches expected segment size ±2%.
- If open rate <15% or click rate <1%: the issue is subject + offer, not "the algorithm".

## Common failure modes

- **Sending too often.** >2/week to the same segment burns it. Watch unsubscribe trend, not just the latest one.
- **"Synergy" copy.** If the body could come from any brand in your category, no one cares. Inject a specific story or specific number.
- **No clear CTA.** Two CTAs = zero conversions. Pick one.
- **Sending the SMS at 8 AM Saturday.** Treat SMS as a higher-trust channel and you keep it; spam it and they bail forever.
- **Skipping the test send.** Always send one to yourself + one teammate before the main blast.
