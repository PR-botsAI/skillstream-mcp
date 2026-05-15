
# Pipeline Hygiene Review

Sales pipelines rot. Reps move deals forward to look good; deals sit in stages they shouldn't; managers forecast from a fantasy. This skill diagnoses the rot and surfaces the *specific* next action per deal.

## Required tools

Load via `tool_search` with `"zoho crm deals pipeline"` and `"pmgpt pipelines contacts"`:

- **Zoho CRM**: `executeCOQLQuery`, `getRecords`, `getRecord`, `searchRecords`, `updateRecord`, `updateRecords`, `getModules`, `getFields`
- **PMGPT_TOOL**: `list_pipelines`, `get_pipeline`, `list_pipeline_contacts`, `move_contact_in_pipeline`, `get_contact_details`
- Optional: `ZohoMail_sendEmail` (for re-engagement sends)

## Inputs you need

1. **Which pipeline** — sales? customer success? specific product line?
2. **Stage definitions** — what does each stage *actually* mean? ("Qualified" should mean a specific thing, not "we like them")
3. **Healthy time-in-stage** — what's normal vs. stuck for each stage? (defaults below)
4. **The deciding question** — what's the criteria to move a deal forward? to disqualify?

Default stage SLAs if user doesn't have them:

| Stage | Healthy max time-in-stage |
|---|---|
| New Lead | 3 days |
| Contacted | 7 days |
| Qualified | 14 days |
| Proposal Sent | 14 days |
| Negotiation | 21 days |
| Verbal Yes | 7 days |

## Workflow

### Step 1 — Pull the full pipeline

```
executeCOQLQuery("
  SELECT Id, Deal_Name, Stage, Amount, Owner, Closing_Date,
         Modified_Time, Created_Time, Contact_Name, Account_Name
  FROM Deals
  WHERE Stage NOT IN ('Closed Won', 'Closed Lost')
  ORDER BY Modified_Time ASC
")
```

If Zoho isn't the source of truth, use `list_pipelines` + `list_pipeline_contacts` per pipeline.

### Step 2 — Compute time-in-stage per deal

For each deal:
- `time_in_stage = NOW() - Stage_Updated_At`
- Compare to the SLA for that stage
- Classify: **HEALTHY** (within SLA) / **WARNING** (1× to 2× SLA) / **STUCK** (>2× SLA) / **ZOMBIE** (>4× SLA, no activity)

### Step 3 — Diagnose by category

**HEALTHY** — do nothing, leave alone.

**WARNING** — the deal is drifting. Action: rep needs to take the explicit next step defined for that stage (book the demo, send the proposal, etc.). Generate a one-line action per deal.

**STUCK** — the deal is hiding something. Action: send a re-engagement message that surfaces the blocker. Template per stage below.

**ZOMBIE** — the deal is dead but no one closed it. Action: send a "breakup" email; if no reply in 5 days, mark Closed Lost with a reason code.

### Step 4 — Generate per-stage re-engagement templates

For **Qualified → stuck** deals:
```
Subject: <First name>, where did we lose you?

Hey <name>,

When we last spoke, you were exploring <their stated reason>.
Three things usually happen at this point:

  1. Internal priorities shifted — totally fair, when should I check back?
  2. You're solving it another way — would love to know who you went with.
  3. The timing's right but I haven't given you what you need to move it forward.

Which is closest? One-word reply works.
```

For **Proposal Sent → stuck** deals: ask about a specific objection ("Was the pricing the sticking point, or was it scope?") — never "checking in".

For **Negotiation → stuck**: surface the missing decision-maker ("Who else needs to bless this on your end?")

### Step 5 — Bulk execute

For each ZOMBIE: `updateRecord(deal_id, {Stage: "Closed Lost", Lost_Reason: "Unresponsive — auto-closed after Xd"})`

For each STUCK: send the templated re-engagement, log the activity, set a 5-day follow-up task.

For each WARNING: create a task assigned to the deal owner with the specific next action.

Use `updateRecords` (plural) to batch — cheaper than per-deal updates.

### Step 6 — Manager-level summary

Output a one-page audit:

```
Total open deals: <N>          Pipeline value: $<X>
Health distribution:
  HEALTHY:   <n> ($<x>)   — leave alone
  WARNING:   <n> ($<x>)   — actions assigned to <reps>
  STUCK:     <n> ($<x>)   — re-engagement sent
  ZOMBIE:    <n> ($<x>)   — auto-closed
Forecast cleanup: pipeline dropped $<delta>, real coverage is now <X×> of quota

By stage (avg days-in-stage):
  Qualified:      <d>  (SLA: 14)
  Proposal Sent:  <d>  (SLA: 14)
  Negotiation:    <d>  (SLA: 21)

Top stuck deals:
  1. <Deal> — $<amt> — stuck <Nd> in <Stage> — recommendation: <action>
  2. ...
```

## Output

- The audit report (above)
- Per-deal action list with owner assignments
- Re-engagement emails sent (count + log)
- Closed Lost updates applied (count + log)
- The "fix list" — 3 things to change about how the pipeline gets used so next quarter's audit is shorter

## Verification

- `executeCOQLQuery` re-run after updates → confirm Zombie count dropped to 0
- Spot-check 3 STUCK deals: was the re-engagement sent? Is the activity logged in Zoho?
- Pipeline value before vs. after should drop — that's a *good* sign, the forecast is now real
- A week later: rerun this skill; if STUCK count is climbing, the issue is process, not deals

## Common failure modes

- **Rep theater.** Reps move deals forward to dodge audits, not because they progressed. Audit by Stage_Updated_At AND last meaningful activity.
- **Treating Zombies as "still warm".** If no one replied in 60+ days, it's dead. Move on; the spot is more valuable to a fresh lead.
- **Generic re-engagement.** "Just checking in" gets 1% reply. Specific objection prompts get 15%+.
- **No SLA defined.** Without a benchmark, every deal looks fine. Force the user to commit to stage SLAs even if rough.
- **Closing lost without a reason code.** Without reasons you can't fix the funnel — you just refill it.
