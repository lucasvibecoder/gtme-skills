---
name: gtm-context
description: "Captures company, ICP, GTM motion, tech stack, channels, and metrics into a reusable context file that other skills read automatically."
metadata:
  version: "1.0.0"
---

# GTM Context

Capture your GTM engineering context once. Every other skill reads it automatically.

## When to Use This Skill

When the user says anything like:
- "Set up my GTM context"
- "Configure my company info"
- "Save my ICP"
- "Initialize context"
- "Set up context for my company"
- Any other skill asks for GTM context and `.agents/gtm-context.md` doesn't exist

## What It Captures

### Company & Product
- Company name
- What you sell (one sentence)
- Product category (e.g., "sales automation platform", "data enrichment API")
- Key differentiators (what makes you different — 2-3 bullet points)

### ICP (Ideal Customer Profile)
- Target titles (e.g., VP Sales, Head of Growth, RevOps Manager)
- Company size range (e.g., 50-500 employees)
- Industries (e.g., B2B SaaS, fintech, healthcare)
- Pain points (what problems they have that you solve — 3-5 bullets)
- Disqualifiers (who is NOT a fit)

### GTM Motion
- Primary motion: PLG / Sales-led / Hybrid / Community-led / Partner-led
- Sales cycle length (approximate)
- Average deal size
- Key channels (outbound, inbound, content, partnerships, events, etc.)

### Tech Stack
- CRM (Salesforce, HubSpot, Notion, etc.)
- Outbound tools (Clay, Apollo, Outreach, Salesloft, etc.)
- Enrichment (Clearbit, ZoomInfo, Prospeo, etc.)
- Automation (Zapier, Make, n8n, custom, etc.)
- Email (Gmail, Outlook, etc.)

### Current Messaging
- One-liner (how you describe what you do in one sentence)
- Key value props (3-5 bullets)
- Proof points (metrics, case studies, logos)
- Words/phrases to always use
- Words/phrases to never use

### Metrics
- Pipeline targets (monthly/quarterly)
- Conversion rates (if known)
- Average deal size
- Sales cycle length
- Current bottlenecks

## How It Works

### Step 1: Check for Existing Context

If `.agents/gtm-context.md` already exists, read it and ask: "I found your existing GTM context. Want to update it or start fresh?"

### Step 2: Gather Information

**Auto-draft option:** If the project has a README.md, marketing site content, or docs, offer to auto-draft V1:
> "I found your README. Want me to draft a GTM context from it? You can edit after."

**Manual option:** Walk through each section above, asking 2-3 questions at a time. Don't dump all questions at once.

Example flow:
1. "What's your company name and what do you sell?"
2. "Who's your ideal customer? (title, company size, industry)"
3. "What's your GTM motion? (outbound, inbound, PLG, etc.)"
4. "What tools do you use? (CRM, outbound, enrichment)"
5. "Any key messaging — how do you describe what you do?"
6. "What are your pipeline targets and current metrics?"

### Step 3: Save

Save the completed context to `.agents/gtm-context.md` in YAML-like markdown format:

```
# GTM Context

## Company & Product
- **Company:** {name}
- **Product:** {one sentence}
- **Category:** {category}
- **Differentiators:**
  - {point 1}
  - {point 2}

## ICP
- **Target Titles:** {comma-separated}
- **Company Size:** {range}
- **Industries:** {comma-separated}
- **Pain Points:**
  - {pain 1}
  - {pain 2}
- **Disqualifiers:**
  - {disqualifier 1}

## GTM Motion
- **Primary:** {motion type}
- **Sales Cycle:** {length}
- **Avg Deal Size:** {amount}
- **Channels:** {comma-separated}

## Tech Stack
- **CRM:** {tool}
- **Outbound:** {tools}
- **Enrichment:** {tools}
- **Automation:** {tools}
- **Email:** {tool}

## Messaging
- **One-liner:** {sentence}
- **Value Props:**
  - {prop 1}
  - {prop 2}
- **Proof Points:**
  - {proof 1}
- **Always Use:** {words/phrases}
- **Never Use:** {words/phrases}

## Metrics
- **Pipeline Target:** {amount/period}
- **Conversion Rate:** {percentage}
- **Avg Deal Size:** {amount}
- **Sales Cycle:** {length}
- **Bottlenecks:** {description}
```

### Step 4: Confirm

After saving, tell the user:
> "GTM context saved to `.agents/gtm-context.md`. All skills (email-writer, prospect-finder, web-scraping, text-trainer) will now read this automatically when they run."

## Updating Context

When the user wants to update:
1. Read existing `.agents/gtm-context.md`
2. Ask what changed
3. Update the specific sections
4. Save (overwrite)

## Related Skills

All skills in this repo check for `.agents/gtm-context.md`:
- **[email-writer](../email-writer/)** — Uses company, ICP, and messaging for email writing
- **[prospect-finder](../prospect-finder/)** — Uses ICP definitions for prospecting
- **[web-scraping](../web-scraping/)** — Uses company context for data prioritization
- **[text-trainer](../text-trainer/)** — Uses company context to inform voice analysis
