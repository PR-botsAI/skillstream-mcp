
# Social Content Batch

Daily ad-hoc posting is the most expensive way to do social. Batching one week takes the same effort as posting 2 days reactively, and the quality is consistently better.

## Required tools

Load via `tool_search` with `"post social facebook instagram"` and `"generate image video"`:

- **PMGPT_TOOL**: `list_social_accounts`, `post_to_social_media`, `list_scheduled_posts`, `manage_scheduled_post`, `delete_social_post`, `get_social_insights`, `generate_image`, `generate_video`, `analyze_media`

## Inputs you need

1. **Brand voice** — 3 adjectives + 1 anti-adjective ("Direct, warm, irreverent — NOT corporate")
2. **Audience** — who they are, what they scroll for
3. **Content pillars** — 3–5 themes you legitimately have expertise in (e.g. Educate, Behind-the-Scenes, Customer Wins, Hot Take, Offer)
4. **Cadence** — how many posts/week per platform
5. **Platforms** — which of FB, IG, X are active (confirm with `list_social_accounts`)
6. **No-go list** — topics you won't touch (politics, competitors by name, etc.)

## Workflow

### Step 1 — Pull what's already scheduled + what performed

```
list_scheduled_posts(platform: "all", days_ahead: 14)
get_social_insights(platform: "instagram", date_range: "last_30d")
get_social_insights(platform: "facebook", date_range: "last_30d")
```

Identify the top 3 performing posts of the last 30 days. Their *format* (carousel? reel? text-only?) is the template for this batch.

### Step 2 — Plan the week (or month) on a grid

Build a calendar:

| Day | Platform(s) | Pillar | Hook | Asset type |
|---|---|---|---|---|
| Mon | IG + FB | Educate | "3 mistakes I see weekly in X" | Carousel |
| Tue | X | Hot Take | "Unpopular opinion: <claim>" | Text |
| Wed | IG | BTS | "How we actually do X" | Reel |
| Thu | FB + IG | Customer Win | Case study quote | Quote graphic |
| Fri | All | Offer | This week's CTA | Static + link |

Rules:
- No pillar twice in a row
- Offer pillar ≤ 1/week or audience tunes out
- One "polarizing" post per week (Hot Take pillar) — it doubles engagement

### Step 3 — Write the copy per platform

**Critical: the *same* post performs differently per platform — don't cross-post identical text.**

| Platform | Optimal length | First line job | Hashtags | Links |
|---|---|---|---|---|
| Instagram | 125–220 words | Hook + visual promise | 5–10, in caption | "Link in bio" |
| Facebook | 40–80 words | Conversation starter | 0–2 | Direct in post |
| X/Twitter | 240–270 chars (or thread) | Pattern interrupt | 0–1 | Direct |

For each post: draft platform-native copy, save in a Sheet column per platform.

### Step 4 — Generate the assets

For visuals:

```
generate_image(
  prompt: "<scene description in brand style>, <aspect ratio>, <color palette>",
  aspect_ratio: "1:1" | "4:5" | "9:16" | "16:9"
)
```

Aspect ratios:
- IG feed: 4:5 (gets more screen real estate than 1:1)
- IG reels / Stories / TikTok: 9:16
- FB feed: 1:1 or 4:5
- X: 16:9

For motion (reels, ads):
```
generate_video(prompt: <scene>, duration: 6-15s)
```
or use `analyze_media` on a user-uploaded clip to write a caption + auto-pull a still for the cover.

### Step 5 — Schedule everything in one pass

For each row of the calendar:
```
post_to_social_media(
  platform: "instagram" | "facebook" | "twitter",
  account_id: <from list_social_accounts>,
  text: <platform-specific copy>,
  media_url: <asset url>,
  schedule_at: <ISO timestamp in local timezone>
)
```

Best general slots (their local time):
- IG: Tue/Wed/Thu 11 AM or 7 PM
- FB: Wed/Thu 1 PM, Sat 9 AM
- X: weekday 9 AM, 12 PM, 5 PM

### Step 6 — Verify the queue

```
list_scheduled_posts(platform: "all", days_ahead: 14)
```

Confirm count matches plan. Spot-check 3 random posts: media renders, link works, no typos.

## Output

- A filled calendar grid (Mon–Sun × platforms × pillars)
- Per-platform copy variants in a Sheet
- Generated/curated assets per post
- All posts scheduled in PMGPT
- A "what to watch" memo: which post is the experiment this week, and the success metric

## Verification

- `list_scheduled_posts` count = planned count
- Mobile-preview the IG and FB queue from the app — text doesn't get cut, image isn't cropped weirdly
- After the week runs: pull `get_social_insights`, compare to last week's baseline, identify the winner format for next batch

## Common failure modes

- **Cross-posting identical copy.** IG copy on X reads like a confused influencer. Customize.
- **No hook in the first line.** On every platform the first 5 words decide whether the rest gets read. Lead with the strongest line.
- **All Offer pillar.** "Buy buy buy" gets unfollowed within 2 weeks. Maintain the 80/20 split (80% value, 20% offer).
- **Pretty but unclear assets.** A clear photo with crap lighting outperforms a beautiful generated image that doesn't communicate the message. Test asset → does it pass the 1-second comprehension check?
- **Posting and ghosting.** Respond to comments within 60 min of posting — the algorithm rewards conversation.
