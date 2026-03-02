---
name: gtm-scorecard
description: "Diagnose any company's GTM infrastructure health in 60 seconds — scores 7 dimensions from public data using web search only."
metadata:
  version: "2.0.0"
---

# GTM Health Scorecard v2

Diagnose any company's GTM infrastructure health from public data. Zero dependencies.

**Input:** A company domain (e.g., `ramp.com`)
**Output:** 3 red flags → 7-dimension score → diagnosis → priority fixes
**With :prospect:** All of the above + best contact + outreach DM draft

No `pip install`. No API keys. No `gather.py`. Just web search.

### Step 0: Load GTM Context

If `.agents/gtm-context.md` exists, read it for context about your own company, ICP, and GTM motion. This helps tailor the diagnosis — you'll spot gaps that matter to YOUR sales motion, and the outreach brief will reference your specific capabilities.

If it doesn't exist, the scorecard still works — it just produces a generic diagnosis instead of one calibrated to your offering.

---

## Command: /gtm-scorecard

### Step 1: Get the Domain

If user didn't provide one, ask. Clean input: strip `https://`, `http://`, trailing slashes.

### Step 2: Research (Web Search — 6 searches, strict order)

Run these searches sequentially. Extract specific data points, not summaries.

**Search 1 — What the company does + stage:**
```
[company name] about company funding crunchbase
```
Extract: one-line description, funding stage, approximate headcount, HQ location.

**Search 2 — SDR/AE hiring activity:**
```
[company name] careers SDR OR BDR OR "sales development" OR "account executive"
```
Extract: exact role titles, count of open sales roles. If results are thin, also try:
```
[domain] site:greenhouse.io OR site:lever.co OR site:ashbyhq.com
```

**Search 3 — Ops/infrastructure hiring:**
```
[company name] careers "revenue operations" OR "sales operations" OR RevOps OR "GTM operations" OR "sales enablement"
```
Extract: exact role titles, count of open ops roles. **The absence of results IS data.**

**Search 4 — JD deep dive (CRITICAL):**
Pick the 1-2 most interesting SDR/AE roles from Search 2. Search for the full JD text:
```
[company name] [exact job title from Search 2] job description responsibilities
```
Read the JD carefully for strain signals (see framework below). This is where the insight lives.

**Search 4b — VERIFY JDs are live (CRITICAL):**
Before using any JD as evidence, verify it's currently posted:
site:[domain] [job title] careers

Or check the company's careers page directly:
[domain]/careers OR [domain]/jobs

If the role appears filled, removed, or the posting says "no longer available":
- Do NOT reference that JD in red flags, evidence, or outreach
- Note it as "(role previously posted, now filled)" in evidence section
- Score based on currently live roles only
- If no live sales roles exist, the company may have completed a hiring cycle —
  adjust diagnosis accordingly

**This matters because:** Referencing a filled role in outreach destroys credibility
instantly. The recipient knows that JD is gone. You look like you're working from
cached data, not live intelligence.

**Search 5 — Tech stack signals:**
```
[company name] sales tools salesforce hubspot outreach gong
```
Also check: tool mentions in any JDs found. Companies reveal their stack in "requirements" sections.

**Search 6 — Team structure:**
```
[company name] "head of revenue operations" OR "VP sales operations" OR "director RevOps" LinkedIn
```
Extract: does a dedicated ops leader exist? How large is the sales org vs ops org?

### Step 3: Score Using the 7-Dimension Framework

Score each dimension 1-10. Cite specific evidence. Higher = healthier.

**SCORING RULES:**
- If data is missing, say so. Flag low-confidence scores with `(inferred)`.
- "Not detected" ≠ "confirmed absent." Be explicit about what you couldn't verify.
- Combine gathered data with your training knowledge of the company.
- **Be opinionated.** A confident wrong score that sparks conversation is more valuable
  than a hedged score that says nothing.

---

## THE 7 DIMENSIONS

### 1. Sales/Ops Ratio

**What it measures:** Balance between revenue roles (SDR, BDR, AE, Sales Leadership) and
infrastructure roles (RevOps, Sales Ops, GTM Engineer, Enablement).

| Score | What it looks like |
|-------|--------------------|
| 9-10 | Ops proportional to sales headcount. Dedicated RevOps + enablement. |
| 7-8 | Ops present but slightly understaffed. Ratio ≤5:1 sales:ops. |
| 5-6 | One ops person supporting a growing team. Ratio ~8:1. |
| 3-4 | Many sales roles, minimal or zero ops visible. Ratio >10:1. |
| 1-2 | Actively scaling SDRs/AEs with ZERO ops anywhere — hiring or filled. |

**What most people miss:** A company posting 5 SDR roles and 0 ops roles isn't just "growing
sales." Their SDRs are about to drown in manual work because nobody is building the systems
that make outbound scale. Every SDR hire without ops is a burnout timer.

---

### 2. Enrichment Maturity

**What it measures:** Whether the company has data enrichment tooling (Apollo, Clay, ZoomInfo,
Clearbit, 6sense) or SDRs are manually researching prospects.

| Score | What it looks like |
|-------|--------------------|
| 9-10 | Multiple enrichment tools (ZoomInfo + Clearbit + 6sense). Intent data present. |
| 7-8 | At least one enrichment tool detected or mentioned in JDs. |
| 5-6 | No enrichment detected but company likely uses it. Mark `(inferred)`. |
| 3-4 | No enrichment detected AND JDs mention manual prospecting as core duty. |
| 1-2 | JDs describe SDRs building lists manually, researching via LinkedIn. Confirmed absent. |

**What most people miss:** Enrichment isn't "nice to have." Without it, every SDR spends 30-40%
of their time researching instead of selling. That's not a productivity problem — it's a unit
economics problem. The company is paying $70K/yr for someone to do what Apollo does for $99/mo.

---

### 3. Outbound Infrastructure

**What it measures:** Whether the company has sequencing/outbound tools (Outreach, Salesloft,
Instantly) for structured multi-touch campaigns.

| Score | What it looks like |
|-------|--------------------|
| 9-10 | Sequencing tool + conversation intelligence (Gong/Chorus). Full stack. |
| 7-8 | Dedicated sequencing tool (Outreach, Salesloft). |
| 5-6 | Marketing automation (HubSpot, Marketo) but no dedicated sequencing. |
| 3-4 | CRM only. SDRs likely emailing from Gmail or basic CRM features. |
| 1-2 | No sequencing, no marketing automation. Outreach is fully manual. |

**What most people miss:** A company using HubSpot for outbound sequences is burning their
marketing domain's reputation. Dedicated sequencing tools exist because outbound and marketing
email have different deliverability needs. HubSpot but no Outreach = outbound is either
underperforming or about to get their domain blacklisted.

---

### 4. Data Hygiene

**What it measures:** Whether CRM data quality is maintained by ops or dumped on sellers.

| Score | What it looks like |
|-------|--------------------|
| 9-10 | Ops roles mention CRM management. Analytics tools suggest data-driven culture. |
| 7-8 | CRM + ops roles exist. Likely maintained. |
| 5-6 | CRM detected but no clear ops ownership. |
| 3-4 | Sales JDs mention "maintaining CRM" or "data entry" as responsibilities. |
| 1-2 | SDR/AE JDs explicitly include CRM administration or database management. |

**What most people miss:** When "maintain Salesforce data" appears in an SDR job description,
that company doesn't have a data problem — they have a structural problem. They're paying their
most expensive-per-hour-of-selling employees to do work that should be automated or owned by ops.

---

### 5. Automation Maturity

**What it measures:** Whether GTM tools are connected (Zapier, Make, Workato, Segment) or
siloed with humans as the integration layer.

| Score | What it looks like |
|-------|--------------------|
| 9-10 | Automation platform + data layer (Segment). Systems talk to each other. |
| 7-8 | Automation platform detected (Zapier, Make). |
| 5-6 | Multiple tools but no automation visible. Mark `(inferred)`. |
| 3-4 | Multiple tools + no automation. Someone is exporting CSVs between systems. |
| 1-2 | Minimal tools + no automation + strain signals about manual processes. |

**What most people miss:** A company with Salesforce + Outreach + Apollo but no Zapier/Make
probably has someone manually exporting CSVs between tools. That person is either an ops hire
(good) or an SDR doing it at midnight (terrible).

---

### 6. Role Scope Creep

**What it measures:** Whether sales roles are expected to do ops/infrastructure work.

| Score | What it looks like |
|-------|--------------------|
| 9-10 | Clean separation. SDR JDs = prospecting + selling. No ops work. |
| 7-8 | Minor overlap — "maintain own pipeline hygiene." Normal. |
| 5-6 | Some creep — JDs mention tool management, reporting, process docs. |
| 3-4 | Clear creep — sales JDs include CRM admin, tool evaluation, "many hats." |
| 1-2 | Multiple strain signals. SDR JDs describe an ops role disguised as sales. |

**What most people miss:** "Wearing many hats" in a sales JD isn't startup charm — it's a
confession that the company hasn't built infrastructure. The SDR expected to prospect, sell,
manage CRM data, build lists, evaluate tools, AND hit quota burns out in 6 months. Then the
company posts the same role again wondering why they can't retain SDRs.

---

### 7. Ops Hire Timing

**What it measures:** Whether the company is actively investing in ops infrastructure or
running without it.

| Score | What it looks like |
|-------|--------------------|
| 9-10 | Ops roles posted AND existing ops team visible. Actively investing. |
| 7-8 | At least one ops role open. Building. |
| 5-6 | No ops roles but company small enough that founder handles it. Not yet critical. |
| 3-4 | No ops roles, many sales roles, company past the stage where someone should own this. |
| 1-2 | "Build from scratch" or "establish processes" language. Zero ops for too long. |

**What most people miss:** A "first ops hire" posting at a 50+ person company means they've
been running sales on duct tape for at least a year. That first ops person walks into a mess —
dirty CRM, no documented processes, tools nobody configured, and a sales team with workarounds
nobody can explain. This is the highest-signal indicator that a company needs external GTM help
RIGHT NOW.

---

## Step 4: Identify the 3 Biggest Red Flags

From the 7 dimension scores, pick the 3 lowest-scoring dimensions. These are the RED FLAGS.
For each, write one punchy sentence explaining why it matters — using the "What most people
miss" insight, not just restating the score.

If a company scores 7+ across all dimensions, the red flags section becomes WATCH AREAS —
things that could slip as they scale.

---

## Step 5: Format the Output

```
═══════════════════════════════════════════
  GTM HEALTH SCORECARD: [Company Name]
  [domain] | [what they do in <10 words]
  [Funding stage] · ~[headcount] employees
═══════════════════════════════════════════

  ⚡ 3 RED FLAGS

  1. [Dimension name]: [Score]/10
     [1-2 sentence "what most people miss" insight applied to THIS company]

  2. [Dimension name]: [Score]/10
     [1-2 sentence insight]

  3. [Dimension name]: [Score]/10
     [1-2 sentence insight]

  ─── FULL DIAGNOSTIC ───

  Overall: [X]/10 [🟢 ≥7 | 🟡 4-6 | 🔴 ≤3]

  1. Sales/Ops Ratio       [emoji] [X]/10  [1-line evidence]
  2. Enrichment Maturity   [emoji] [X]/10  [1-line evidence]
  3. Outbound Infra        [emoji] [X]/10  [1-line evidence]
  4. Data Hygiene          [emoji] [X]/10  [1-line evidence]
  5. Automation Maturity   [emoji] [X]/10  [1-line evidence]
  6. Role Scope Creep      [emoji] [X]/10  [1-line evidence]
  7. Ops Hire Timing       [emoji] [X]/10  [1-line evidence]

  ─── DIAGNOSIS ───
  [2-3 sentences. Confident. No hedging. What's happening,
  why it's happening, and what breaks first.]

  ─── PRIORITY FIXES ───
  1) [Most urgent + why]
  2) [Second fix]
  3) [Third fix]

  ─── EVIDENCE ───
  • [Specific data point — role counts, JD quotes, tools detected]
  • [Specific data point]
  • [Low-confidence flags if any]
═══════════════════════════════════════════
```

**Emoji key:** 🟢 7-10 | 🟡 4-6 | 🔴 1-3

**Overall score:** Weighted average. Dimensions 1, 2, and 6 get 1.5x weight (strongest
predictors of GTM strain). Round to nearest integer.

---

## Step 6: Offer Next Steps

```
Want me to:
  → Deep-dive on any red flag?
  → Run :prospect to find the right contact + draft outreach?
  → Score another company?
```

---

## Command: /gtm-scorecard:prospect

Runs the FULL /gtm-scorecard workflow, then adds:

### Additional Search — Best Contact

```
[company name] "VP of sales" OR "head of sales" OR "sales leader" OR "CRO" LinkedIn
```

If no VP Sales, try:
```
[company name] founder OR CEO LinkedIn
```

**Contact selection logic:**
- SDR/ops imbalance → VP/Head of Sales (they feel the pain daily)
- Tech stack gaps → RevOps lead if exists, else VP Sales
- Company <50 people → CEO/Founder
- Growth/scaling strain → VP Sales or Head of Growth

### Outreach DM Draft

Write a message that follows these rules:

1. **Open with a specific, verifiable observation.** Not "I noticed you're hiring."
   Instead: "Your SDR JDs include CRM management and process documentation as core
   responsibilities — that's ops work in a seller's job description."

2. **Connect to a consequence they can feel.** Reference your own experience building
   GTM infrastructure. "In my experience building [specific systems], that pattern
   means [specific consequence]." If `.agents/gtm-context.md` exists, pull your
   credentials from there.

3. **Offer the scorecard as value, not a pitch.** "I ran your company through a
   7-dimension GTM diagnostic I built — happy to share the full output if useful."

4. **Credential through specificity.** Reference your company, specific infrastructure
   types you've built (enrichment pipelines, routing automation, CRM cleanup), and
   concrete results. Generic "I help companies" = ignored. Specific "I built the
   enrichment pipeline that does X" = credible.

5. **Low-pressure close.** "Either way — cool product" or "figured the diagnostic
   might be useful." Not "let's hop on a call."

### Prospect Output Format

Append after the standard scorecard:

```
  ─── OUTREACH BRIEF ───

  Target: [Name], [Title]
  Why them: [1 sentence — why this person feels the pain]
  Angle: Lead with Red Flag #[X] — [dimension name]

  ─────────────────
  Hey [Name] — [DM draft, 4-6 sentences max]
  ─────────────────

  Adapt for:
  • LinkedIn DM (trim to 3 sentences)
  • Email (add subject line)
  • Warm intro (softer open, reference mutual connection)
```

### DM Quality Check

Before outputting, verify:
- Would the recipient think "this person has seen inside my company"?
- Is the observation specific enough it couldn't be sent to any random company?
- Does it feel like insight, not spam?

If NO to any → rewrite.

---

## Command: /gtm-scorecard:batch

Score multiple companies from a text file (one domain per line).

Output a ranked summary table first, then individual scorecards:

```
═══════════════════════════════════════════════════════════════
  GTM HEALTH SCORECARD — BATCH RESULTS
  Scored: [N] companies | Generated: [date]
═══════════════════════════════════════════════════════════════

  RANKED BY INFRASTRUCTURE HEALTH (lowest = most opportunity)

  #1  🔴 3/10  warmly.ai    — 6 revenue roles, 0 ops, SDRs doing CRM admin
  #2  🟡 5/10  attio.com    — AEs building playbook, no ops layer, Series B
  #3  🟢 8/10  ramp.com     — Mature stack, RevOps in place, healthy ratios

  🔴 CRITICAL (1-3): [N] — immediate consulting opportunities
  🟡 WATCH (4-6): [N] — 60-90 day strain window
  🟢 HEALTHY (7-10): [N] — not a fit right now
═══════════════════════════════════════════════════════════════
```

---

## Error Handling

- **No career page found:** Score from tech stack + training knowledge. Flag JD-dependent
  dimensions as `(no career data — inferred)`.
- **No tech stack detected:** Common with SPAs. Don't auto-score 1. Use `(not detected ≠ absent)`.
- **Tiny company (<20 people):** Note that dedicated ops may be premature. Adjust expectations.
- **Enterprise (1000+ people):** Expect mature infrastructure. Low scores here mean something
  is genuinely broken, not just "early stage."

---

## Framework Origin

Built from direct GTM Engineering experience — building enrichment workflows, AI
qualification systems, and multi-stage automation pipelines for enterprise clients. The
dimensions come from watching dozens of companies go through the exact moment when their
manual GTM workflows stop scaling. The "What most people miss" insights come from being
the SDR who suffered without infrastructure AND the engineer who built it after.

---

## Related Skills

- **[gtm-context](../gtm-context/)** — Your company context calibrates the diagnosis and outreach to your offering
- **[email-writer](../email-writer/)** — Turn scorecard insights into full email sequences
- **[prospect-finder](../prospect-finder/)** — Find and verify contacts identified by :prospect mode
- **[web-scraping](../web-scraping/)** — Deep-dive research on flagged companies
