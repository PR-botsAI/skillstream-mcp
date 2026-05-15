
# Content Repurposing

The hardest part of content is the *creation* of the source asset. The cheap part is everything downstream — but most creators never do the cheap part, then complain about reach. This skill fixes that.

## Required tools

Load via `tool_search` with `"analyze_media generate"` and `"post social"`:

- **PMGPT_TOOL**: `analyze_media`, `generate_image`, `generate_video`, `generate_speech`, `merge_media`, `list_generated_media`, `post_to_social_media`, `list_scheduled_posts`, `create_google_doc`, `append_to_google_doc`
- Optional: `firecrawl_scrape` (if source is a published URL)

## Inputs you need

1. **The source asset** — file path, URL, or transcript. What is it? (video, podcast ep, blog post, webinar, keynote)
2. **The audience + platforms** — where will derivatives live? (IG reels, FB posts, X, LinkedIn, email, blog)
3. **The goal of the source** — what was the original meant to do? (Awareness, lead gen, sales, retention)
4. **Brand voice** — match the source's voice or sharpen it
5. **Existing CTAs / offers** — what should derivatives drive to?

## Workflow

### Step 1 — Analyze the source

For video/audio:
```
analyze_media(file_url_or_path: <source>)
```
This returns a transcript + scene/timestamp breakdown. Save it.

For blog post:
```
firecrawl_scrape(url: <post URL>, formats: ["markdown"])
```

For a written transcript already in hand, just load it.

### Step 2 — Extract the gold

Read the source and identify:

- **5–10 quotable lines** — punchy, standalone, tweet-shaped
- **3–5 stories or examples** — case studies, anecdotes, named scenarios
- **2–4 frameworks or step-by-step processes** — checklists, mental models
- **1–3 surprising claims or counter-intuitive points** — the most shareable angle
- **1 strong opening hook** — usually buried 2–3 minutes in; that's your reel intro

Tag each in a working doc with source timestamp/paragraph reference.

### Step 3 — Plan the derivatives (the leverage matrix)

For one 30-minute podcast or 1500-word blog post, target ~10 derivatives. Map them:

| # | Platform | Format | Source element used | Goal |
|---|---|---|---|---|
| 1 | IG Reel | 30–60s short video | Hook + 1 quote | Reach |
| 2 | IG Reel | 30–60s short video | Story #1 | Engagement |
| 3 | IG carousel | 5–8 slide carousel | Framework #1 | Save / share |
| 4 | FB post | Long-form text | Story #2 + CTA | Click to source |
| 5 | X post | Single tweet | Quote #1 | Reach |
| 6 | X thread | 5–8 tweet thread | Framework #2 unrolled | Follows |
| 7 | LinkedIn post | 1200-char text | Surprising claim + take | Authority |
| 8 | Email | Newsletter section | Story #3 + 1 quote | Click to source |
| 9 | Ad creative | Static image + 2-line copy | Quote #2 | Cold traffic |
| 10 | Blog post | 500-word recap with quote callouts | Whole | SEO |

Adjust counts based on user's active platforms and bandwidth.

### Step 4 — Generate the assets

**For short video clips** (if source is video):
```
analyze_media(...) → identify timestamp ranges → use merge_media or external clipping
generate_video(prompt: "subtitle overlay for clip, brand colors")  # for captions/intro
```

**For static graphics** (quotes, carousels):
```
generate_image(
  prompt: "Quote graphic: '<the quote>'. Brand style: <description>. 
  Aspect: 1:1. Typography forward, minimal background.",
  aspect_ratio: "1:1"  # or "4:5" for IG carousel
)
```

**For audio snippets** (audiogram-style for podcast clips):
```
generate_speech(text: <quote>, voice_id: <brand voice>)
merge_media(audio: <snippet>, image: <static cover>)
```

**For text-only posts**: write directly in the working doc.

### Step 5 — Write platform-native copy per derivative

Each derivative gets its OWN copy — never copy-paste across platforms.

| Platform | Voice adjustment |
|---|---|
| Instagram | Warmer, line breaks, emoji-light, "save this if..." hooks |
| Facebook | Conversational, question-led, longer paragraphs |
| X / Twitter | Punchy, no fluff, periods as breaks |
| LinkedIn | Authority + story-led, "I" perspective, lessons format |
| Email | Direct, one idea, one CTA, signature |

### Step 6 — Schedule across 7–14 days

Don't dump all 10 derivatives on day 1. Spread them so the source asset gets a long tail:

| Day | Drop |
|---|---|
| 0 | Source asset published + announcement |
| 1 | Best reel (Story #1) + LinkedIn (Surprising claim) |
| 3 | Carousel (Framework #1) + X tweet (Quote #1) |
| 5 | Second reel (Story #2) + FB long-form |
| 7 | Email newsletter |
| 10 | X thread (Framework #2 unrolled) |
| 14 | Ad creative goes live for cold traffic |

```
post_to_social_media(...) for each, with schedule_at set per row
```

### Step 7 — Track which derivative wins → fold into next source

After 14 days, pull engagement per derivative. The winner reveals what the audience actually wanted from the source — feed that into the next pillar piece. This compounds: each pillar gets sharper because the previous round's audience told you what they cared about.

## Output

- A working doc with: extracted gold (quotes, stories, frameworks, hooks)
- The leverage matrix (10 derivatives planned)
- The generated assets (images, video clips, audiograms)
- Platform-native copy for each derivative
- 14-day schedule with everything queued in PMGPT
- A "winner-take-all" tracker for post-campaign analysis

## Verification

- 10 derivatives in `list_scheduled_posts` matching the schedule
- Each derivative is genuinely platform-native (paste-check: does the IG copy look weird on X?)
- Original source has a tracking link / UTM so you can see which derivative drove traffic back
- 14 days later: top-performing derivative identified + a one-line note on why for next round

## Common failure modes

- **Same copy on every platform.** The fastest way to look like a marketer-bot. Always rewrite for the platform.
- **Skipping the extraction step.** People dive into "make graphics" before they know what to put on them. The gold-extraction step is 60% of the value of this skill.
- **Dumping all 10 in one day.** Algorithm splits the audience across posts and none performs. Spread out.
- **No tracking back to source.** You'll never know if reels are doing the actual job (driving people to the pillar). Always include a destination + UTM.
- **Generated graphics that don't match brand.** AI loves muddy gradients. Force a strict palette + typography rule in the image prompts.
- **Quote graphics without attribution to the source asset.** The point is to lead people back. Always end with "Full episode: <link>" or equivalent.
