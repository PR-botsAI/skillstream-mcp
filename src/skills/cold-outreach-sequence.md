
# Cold Outreach Sequence

The thing that separates a 1% reply rate from a 15% reply rate is **research depth + specificity per prospect**, not subject-line tricks. This skill enforces that.

## Required tools

Load via `tool_search` with `"firecrawl scrape extract"` and `"zoho crm contacts"` and `"zoho mail send"`:

- **FireCrawl**: `firecrawl_scrape`, `firecrawl_extract`, `firecrawl_search`, `firecrawl_map`
- **Zoho CRM**: `searchRecords`, `getRecord`, `getRecords`, `updateRecord`, `executeCOQLQuery`
- **ZohoMail**: `ZohoMail_sendEmail`, `ZohoMail_sendReplyEmail`, `ZohoMail_searchEmails`
- **PMGPT_TOOL**: `create_automation`, `update_contact`, `create_pipeline`, `move_contact_in_pipeline`

## Inputs you need

1. **ICP** — exact title, company size, industry, geo (e.g. "Heads of Ops at 50–200 person logistics co's in TX/FL")
2. **The hook** — *why now* matters for this prospect (regulation change, hiring spree, funding, new product)
3. **The offer** — concrete value + the ask (15-min call, free audit, intro to X)
4. **Sender identity** — who's it from, what's their credibility line
5. **List** — CSV/Zoho view of prospects with at minimum: name, email, company, role, domain

## Workflow

### Step 1 — Verify the list (don't skip)

```
executeCOQLQuery("SELECT Id, Email, Company, Title FROM Leads WHERE <criteria> AND Email_Validity != 'invalid'")
```

Remove anything without a domain that resolves. Bad list = burned domain reputation.

### Step 2 — Enrich + research per prospect

For each prospect, run a research pass. Pick **one** of three depths based on volume:

**Light (>200 leads):** scrape company homepage + `/about` only.
```
firecrawl_scrape(url: <prospect.domain>, formats: ["markdown"])
```
Extract: tagline, recent product launches, hiring signals.

**Medium (50–200):** add LinkedIn-style company page if available + their blog's last 2 posts.

**Heavy (<50, high-ticket):** add `firecrawl_search("<company name> news last 90 days")` + their LinkedIn employee count change + any podcast appearances by the prospect.

Store one **personalization line** per prospect in a Google Sheet column or in Zoho's notes field. This line must reference something **only this prospect would recognize**.

### Step 3 — Draft the sequence

A 4-touch cadence beats a 7-touch cadence when each touch is genuinely different. Template:

| Touch | Day | Angle | Length |
|---|---|---|---|
| 1 | 0 | Trigger + insight + CTA | 4 sentences |
| 2 | 2 | Resource/proof (no ask) | 3 sentences |
| 3 | 6 | New angle, different pain | 4 sentences |
| 4 | 12 | Breakup ("closing the loop") | 2 sentences |

**Touch 1 structure (the only one that matters):**
```
Subject: <prospect first name>, <specific observation>

Hi <first name>,

<Personalization line — the thing you researched>.

<One sentence connecting it to a pain you solve>.

<The ask — concrete, single, low-friction>.

<Sender first name>
```

No "I hope this email finds you well". No 4-paragraph value props. Mobile-readable in under 8 seconds.

### Step 4 — Send + track

Two paths depending on volume:

- **<50/day:** Send via `ZohoMail_sendEmail` directly, one at a time, with `delay` jittered 30–120s.
- **Higher volume:** Create a PMGPT automation that ingests the sheet and sends per row, capped at sender's domain limit (typically 50/day/sender for new domains, 150/day for warm ones).

Set up reply detection: any `ZohoMail_searchEmails` hit where the prospect replies → `move_contact_in_pipeline(<outbound-pipeline>, stage: "Replied")` and pause the sequence.

### Step 5 — Reply triage

When replies come in, classify into 4 buckets and have a templated response per bucket — but **personalize the first line** of each response:

- **Interested** → book the call (Calendly link, 2 time options)
- **Not now** → ask "what would need to be true for this to be relevant?"
- **Wrong person** → "who handles X over there?"
- **Hard no** → mark unsubscribed, move on

## Output

- The 4 touch drafts (mergeable per prospect via the personalization column)
- The sheet/Zoho view with research column populated
- The automation ID + a kill switch the user can hit
- A daily report: sent, opened, replied, booked

## Verification

- Send the first 5 manually as a smoke test before scaling
- After 50 sends: `ZohoMail_searchEmails(searchKey: "from:<your-domain>", folder: "spam")` — if >5% landed in spam, **pause and warm up before continuing**
- Reply rate <5% after 100 sends → research was too thin OR offer is wrong; do not "send more"
- Bounce rate >3% → list quality bad; re-verify before sending more

## Common failure modes

- **Personalization that isn't personal.** "I see you're in [industry]" is not personalization, it's a merge tag.
- **Sending from a brand-new domain at volume.** Warm for 3+ weeks at 20/day before scaling.
- **No reply path defined.** Replies pile up, prospects ghost, you blame the sequence. Triage on the same day or don't send.
- **Sequence too long.** Touch 5+ has diminishing returns and rising spam-report risk. 4 is the ceiling for cold.
