
# Competitor Research Brief

A good competitor brief answers three questions: **what are they betting on, what gap can we own, what should we copy.** Anything longer is procrastination.

## Required tools

Load via `tool_search` with `"firecrawl scrape extract"`:

- **FireCrawl**: `firecrawl_search`, `firecrawl_scrape`, `firecrawl_extract`, `firecrawl_map`, `firecrawl_crawl`, `firecrawl_agent`
- **PMGPT_TOOL**: `create_google_doc`, `append_to_google_doc` (for deliverable)

## Inputs you need

1. **Your offer** — what you're selling, briefly
2. **The competitors** — exact list (URLs ideally). If user says "the top players", clarify. 3–5 competitors is the sweet spot.
3. **Decision being made** — research without a decision is intellectual entertainment. Are you deciding: pricing, positioning, new feature, ad angle, content strategy?
4. **Time bound** — when do they need this? Drives depth.

## Workflow

### Step 1 — Map each competitor's site (find what to scrape)

For each competitor:
```
firecrawl_map(url: "https://<competitor>.com")
```

Identify the high-value URLs:
- Homepage (positioning)
- /pricing (or equivalent)
- /features or /product
- /customers or /case-studies
- /blog (recent 5–10 posts — content angle)
- /careers (hiring signals = where they're investing)
- /about (founder story, fundraising signals)

### Step 2 — Scrape each high-value page

```
firecrawl_scrape(
  url: <high-value URL>,
  formats: ["markdown"],
  only_main_content: true
)
```

Save each as a markdown block tagged with competitor + page.

### Step 3 — Extract structured data with extract

For each competitor, run a single `firecrawl_extract` across their main pages with a schema:

```
firecrawl_extract(
  urls: [<homepage, pricing, features>],
  schema: {
    positioning_statement: "How they describe what they do, in their words",
    target_audience: "Who they say they're for",
    primary_value_props: ["list of 3-5 main claims"],
    pricing_tiers: [{name, price, included_features}],
    proof_elements: ["testimonials, logo bars, case studies, awards"],
    primary_cta: "What action they push visitors toward",
    differentiation_claims: ["how they say they're better"]
  }
)
```

### Step 4 — Audit content + recent moves

For each competitor:
```
firecrawl_search("<competitor name> launch OR funding OR pricing", limit: 5)
firecrawl_search("site:<competitor>.com/blog", limit: 5)
```

What are they publishing this month? Recurring themes = the bet they're making.

Optional deeper move — recent ads:
```
firecrawl_search("<competitor name> facebook ad library", limit: 3)
```
If ads are publicly visible, scrape the ad creative themes.

### Step 5 — Build the comparison matrix

In a Google Sheet or doc, build:

| Dimension | You | Comp A | Comp B | Comp C |
|---|---|---|---|---|
| Audience | | | | |
| Headline promise | | | | |
| Price entry point | | | | |
| Pricing model | | | | |
| Primary proof | | | | |
| Content focus (last 90d) | | | | |
| Free / trial offer | | | | |
| Strongest claim | | | | |
| Weakest visible spot | | | | |

This matrix surfaces the gaps. A column of "yes/yes/yes/—" in any row = a positioning opportunity.

### Step 6 — Write the brief (NOT a report)

**One page maximum.** Structure:

```
COMPETITOR BRIEF — <topic, date>
Decision being supported: <from input>

WHAT THEY'RE ALL BETTING ON
<2-3 sentences naming the consensus position they're crowding into>

WHERE WE'RE THE SAME
<list of 3-5 things every competitor (including us) does>

WHERE THEY DIFFER FROM EACH OTHER
<the axis the market actually competes on>

THE GAP
<what no one is doing — the positioning opportunity>
<or: what everyone is doing badly — the execution opportunity>

WHAT TO COPY (with attribution)
1. <competitor> does <X> well — we should adapt
2. ...

WHAT TO AVOID
1. <competitor> bet on <X> and the engagement signal looks weak
2. ...

RECOMMENDED MOVES (3 max)
1. <specific action — change pricing page to X / launch Y campaign / hire Z>
2. ...
3. ...

CONFIDENCE: <how confident are you in this brief? what's missing?>
```

Save to a Google Doc:
```
create_google_doc(title: "<topic> competitor brief — <date>", body: <brief>)
```

### Step 7 — Optional: deep dive on one competitor

If one competitor is clearly the threat, run `firecrawl_agent` for a deeper autonomous research pass:
```
firecrawl_agent(
  task: "Research <competitor> deeply. Find: founding team, recent hires, funding history, customer reviews on G2/Trustpilot, recent press, technical stack signals. Return a 1-page summary."
)
```

## Output

- The Google Doc brief (one page)
- The comparison matrix (Sheet or in-doc table)
- A separate "raw data" doc with the scraped/extracted content per competitor (so the user can audit your claims)
- 3 recommended moves with first-step actions defined

## Verification

- Every claim in the brief should map to a row in the raw data — no "vibes" claims
- The recommended moves should be specific enough to start tomorrow ("Update homepage H1 to X" not "Improve messaging")
- If the user can't act on the brief, it's not a brief, it's an essay — rewrite

## Common failure modes

- **40-page report.** No one reads them. Force the one-page constraint.
- **Scraping without a decision.** If you don't know what decision the brief supports, you'll collect interesting trivia. Always ask: "what are you about to decide?"
- **Copying the leader's playbook.** Leaders win on different mechanics than challengers. Don't copy what works for them; find what they can't do that you can.
- **Outdated data.** Pricing pages, hires, and product changes go stale fast. Date every scrape; treat data older than 60 days as a hint, not a fact.
- **Mistaking polish for traction.** A nicer landing page ≠ winning. Look at backlinks, hiring volume, customer logo additions, social engagement velocity — real signals.
- **No "what to avoid" section.** Competitor failures are the cheapest market research available. Use them.
