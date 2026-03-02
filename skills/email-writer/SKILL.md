---
name: email-writer
description: "Write effective emails for B2B sales and deal management. Use when asked to write, draft, reply to, or follow up on any business email — cold outreach, deal follow-ups, warm intros, referral follow-ups, inbound responses, re-engagement, post-call follow-ups, or any scenario where a rep needs to send an email. Also use when asked to find an email thread and draft a response, or when given a call transcript and asked to write a follow-up."
metadata:
  version: "1.0.0"
---

# Email Writer

Write emails that sound like they came from your best rep — calibrated to the situation, grounded in context, and consistent with your team's voice and playbook.

## When to Use This Skill

ALWAYS read this skill and its references when the user asks to:

- "Write a follow-up email"
- "Draft an email to [person/company]"
- "Follow up with [prospect/opportunity]"
- "Write a cold email"
- "Reach out to [contact]"
- "Send an email about [deal]"
- "Find my thread with [person] and draft a reply"
- "Write email for [opportunity name]"
- "Draft a breakup email"
- "Re-engage [prospect]"
- "Email [person] about [topic]"
- "Write outreach to [company]"
- "Create email for [deal/opportunity]"
- "Help me email [prospect]"
- "What should I say to [contact]?"
- "How do I follow up with [prospect]?"
- "Check in with [contact]" (but don't say "checking in" in the email)
- "I just got off a call with [person], write a follow-up"
- "Here's a transcript, draft the follow-up"
- "They haven't responded, what do I say?"
- "They just [opened my email / accepted my connection / viewed the proposal], what do I send?"
- "We promised them [resource], draft the email"

## Before Writing ANY Email

### Step 0: Load GTM Context

If `.agents/gtm-context.md` exists, read it before writing any email. It contains company, ICP, GTM motion, and messaging context that informs every email.

If it doesn't exist, ask the user:
1. What's your product/company?
2. Who's your ICP?
3. What tools do you use?

Then suggest: "Run the gtm-context skill to save this for all future skills."

### Step 1: Understand the Trigger

Ask yourself: **what happened that means this email needs to be sent right now?**

Common triggers (non-exhaustive):

| Category | Examples |
|----------|----------|
| **Cold outreach** | New prospect identified, building a campaign, first touch |
| **Data signal** | Funding round, new hire, tech adoption, competitor move, leadership change |
| **Deal event** | Opened email, clicked link, viewed proposal, accepted connection request, signed NDA |
| **Post-conversation** | Just had a call, met at event, LinkedIn DM exchange, demo completed |
| **Deal management** | Ghosted, stalled, needs follow-up, promised resources, pricing follow-up |
| **Warm intro** | Referral, mutual connection, inbound lead, re-engagement after silence |
| **Process** | Sequence step, cadence timer, manager request, pipeline review prep |
| **Rep intuition** | "Feels like the right time," learned something new about their business, saw their content |

The trigger determines the tone, urgency, framework, and structure. Don't write until you know why this email exists.

### Step 2: Gather Context

Collect everything available before writing. More context = better output. But never block on missing context — work with what you have.

**Context escalation (use whatever is available):**

| Level | What You Have | Email Quality |
|-------|---------------|---------------|
| **Minimum** | Prospect name + company + trigger | Functional but generic |
| **Good** | + Last email thread or conversation history | Contextually aware |
| **Better** | + CRM record (deal stage, notes, stakeholders, history) | Strategically aligned |
| **Best** | + Call transcript or meeting notes + any docs referenced | Fully informed, nothing missed |

**What to fetch (tool-agnostic — use whatever systems are available):**

- **Email history:** Find the most recent thread with this contact. Read it fully. Note: what was the last thing said, who owes whom a response, were any resources or next steps promised?
- **CRM record:** Deal stage, last contact date, key stakeholders, pipeline notes, any quoted pricing or terms, open action items.
- **Call transcript / meeting notes:** If provided or accessible, scan for: specific commitments made, objections raised, questions asked, pricing discussed, next steps agreed on, resources promised.
- **Company/prospect research:** Role, company size, industry, recent news, tech stack, competitive landscape — whatever is accessible.

**If a document or resource was promised but you can't access it**, insert a clear placeholder:
```
[ATTACH: {{document name or description}}]
```
And note to the user what needs to be manually attached.

### Step 3: Read the Right References

Based on the trigger and context, read the appropriate reference files.

Before writing any email, also check `.agents/voice-profiles/` for the sender's voice profile. If one exists, load it and apply the voice, tone, and anti-patterns defined there.

| Situation | Read These |
|-----------|------------|
| Cold outreach (first touch, no relationship) | `references/cold-outreach.md` + `references/buyer-psychology.md` |
| Deal follow-up (active deal, ongoing conversation) | `references/deal-followup.md` |
| Post-call follow-up (transcript provided) | `references/deal-followup.md` (post-call section) |
| Warm intro / referral / inbound | `references/warm-intros.md` |
| Signal-triggered outreach | `references/trigger-routing.md` + relevant email type reference |

### Step 4: Apply the Right Framework

**For cold outreach**, select the campaign angle based on what data you have and how aware the prospect is. See `references/cold-outreach.md` for the full framework selection guide (Schwartz awareness levels, Nowoslawski angles, Poke the Bear).

**For deal follow-ups**, match the email to the deal stage and what happened. See `references/deal-followup.md` for conditional logic (post-disco, post-demo, stalled, ghosted, pricing, resource delivery).

**For warm intros**, the framework is lighter — the relationship does most of the work. See `references/warm-intros.md` for structure.

**For signal-triggered outreach**, the signal determines the hook. See `references/trigger-routing.md` for signal → strategy mapping.

## Email Rules

**These apply to EVERY email regardless of type.**

### Structure
| Rule | Why |
|------|-----|
| Under 5 sentences for cold outreach | Respects time, gets read |
| Under 8 sentences for deal follow-ups | More context needed but still concise |
| One problem or topic per email | Don't make all chess moves at once |
| Flip I/we to you/your | Focus on them, not you |
| No generic openers | "Hope you're well" = delete |
| Each cold email stands alone | Don't reference previous emails in sequence |
| Lead with why this email exists | First sentence should answer "why am I reading this right now?" |

### Formatting
Never include in emails:
- Emdashes (-) — use commas, periods, or hyphens instead
- Emojis of any kind
- Exclamation marks — unless part of a URL or code snippet
- Signature blocks or sign-offs (no "Best," "Regards," "[Name]" etc.) — user has their own in their email client
- The pattern "It's not X, it's Y" or "It's not about X, it's about Y" — cliche
- Bold, italic, or any rich formatting in the email body — plain text only
- Bullet points or numbered lists — write in sentences

### Subject Lines (Cold Outreach)
- 3 words max
- All lowercase
- Could have been sent by a colleague or customer — not obviously sales
- Don't give away the message — spark enough curiosity to open
- Examples: "quick question", "saw your post", "next steps", "[company] + [your company]", "pricing follow-up"

### Subject Lines (Deal Follow-ups)
- Contextual to the conversation
- Can be slightly longer (up to 5 words)
- Reply in thread when continuing a conversation (don't create a new subject)
- New subject only for: new topic, re-engagement after long silence, breakup

### Tone Principles
- **Understand, don't convince.** Buyers are persuaded by reasons they discover themselves. Focus on illuminating problems, not pitching solutions.
- **Equal status.** You're a peer exploring fit, not a supplicant begging for time. Avoid: talking too fast, unbridled enthusiasm, being too quick to agree, "I know you're busy," "I don't want to waste your time."
- **Detachment.** Neediness repels. Lower resistance through neutral questions and genuine curiosity. If the email sounds like you need this deal more than they do, rewrite it.

### Phrases That Lower Resistance
Use these naturally — don't force them:
- "I'm not sure about you, but..."
- "Would it make sense to..."
- "You've probably looked into X"
- "If you'd like, I can show you"
- "Seems like you have a reason for saying that"
- "Many companies we work with say... How does that compare to your experience?"

### Phrases to NEVER Use
- "Hope all is well" / "Hope you're doing well"
- "Just checking in" / "Following up"
- "Bumping this to top of inbox"
- "I know you're busy"
- "I don't want to waste your time"
- Generic personalization stating obvious facts
- Talking too much about "I/we/our/us" instead of "you/your"
- "Per my last email" / "As I mentioned"
- "Friendly reminder"
- "Circling back"
- "Touching base"

## Email Output

When writing emails, confirm details with the user before finalizing.

**Workflow:**
1. Gather context (trigger, contact, previous correspondence, deal info)
2. Check if there's an existing email thread with this contact
3. If existing thread found, ask user: "I found an existing thread with [contact]. Would you like to reply to that thread or start a new email?"
4. Read the relevant reference files based on situation
5. Compose the email using the appropriate framework and voice
6. Present the draft to the user
7. Ask: "Would you like to adjust anything, or should I save this as a draft?"
8. If replying to thread, reply in that thread. If new email, create a new draft.
9. If email client integration is available, save as draft for user to review and send.

**When to reply to a thread vs start new:**
- **Reply to thread:** Follow-ups on the same topic, continuing a conversation, responding to their last message, sending promised resources
- **Start new email:** New topic, breakup/re-engagement after long silence, cold outreach, significantly different subject

## Conditional Logic for Post-Call Follow-ups

When a call transcript or meeting notes are provided, scan for these conditions and adjust the email accordingly:

| Condition Found | Action |
|-----------------|--------|
| Specific pricing discussed | Include exact numbers quoted — do NOT paraphrase or round. Consistency builds trust. |
| Next step agreed (demo, data test, pilot, etc.) | Include the specific next step with any relevant links, instructions, or prep needed |
| Resources promised (case study, report, deck, etc.) | Attach or insert placeholder: `[ATTACH: {{resource name}}]` |
| Objection raised but not resolved | Don't address it directly in follow-up — note it for user as a flag |
| Multiple stakeholders mentioned | Ask user if anyone should be CC'd |
| No clear next step agreed | Suggest one in the email with a specific date/time |
| Pricing NOT discussed | Do not mention pricing — don't introduce it prematurely |
| Calendar/meeting as next step | Include a scheduling link if available, or propose 2-3 specific times |

**Important:** These conditions are guidelines, not rigid rules. Read the full context of the conversation. If the transcript suggests a different approach, follow the context.

## Voice Configuration

Voice profiles control how emails sound. They define the sender's tone, word choice, rhythm, and anti-patterns.

**How it works:**
1. Voice profiles live at `.agents/voice-profiles/{name}.md` (one file per person)
2. When writing an email, check for profiles in that directory and load the right one
3. If multiple profiles exist, ask who's sending
4. If no profiles exist, fall back to the tone principles and defaults in this file

**To create a voice profile**, use the text-trainer skill: say "train a voice profile for [name]" and provide writing samples.

## Retry Loop (Paste-Back Learning)

When a user pastes back what they actually sent after we wrote them a draft, diff the original against the final and propose rules for style changes.

**No commands needed.** The user just pastes and talks naturally.

### Trigger Detection

Activate this loop when the user says something like:
- "here's what I actually sent"
- "I changed it to this" / "I ended up sending this"
- "here's my version" / "sent this version"
- "I tweaked it" / "made a few changes"

**Ambiguity safety net:** If it's unclear whether the pasted text is the final version of a draft we wrote or something entirely new, ask: "Is this the final version of the email we drafted, or something new?"

### Step 1: Diff

Compare the original draft against the pasted final version. Semantic comparison, not character-level — identify:
- **Deletions** — what they removed
- **Additions** — what they added
- **Substitutions** — what they swapped (word, phrase, or sentence level)
- **Reordering** — what they moved
- **Subject line changes** — treated separately

### Step 2: Classify Each Change

Every change gets exactly ONE label:

| Label | What it means | Action |
|-------|--------------|--------|
| `voice` | Tone, word choice, rhythm | Propose rule → voice profile |
| `structure` | Paragraph order, length, format | Propose rule → SKILL.md or reference file |
| `phrase_ban` | Deleted a specific phrase we used | Propose rule → voice profile Anti-Patterns |
| `phrase_add` | Added a recurring phrase of their own | Propose rule → voice profile Learned from Edits |
| `factual` | Fixed a name, date, number, company detail | Skip — acknowledge, no rule |
| `context_add` | Added info we didn't have | Skip — offer to add to pre-draft checklist |
| `context_remove` | Removed contextually wrong info | Skip |
| `no_change` | Sent as-is | Positive signal — no rules needed |

### Step 3: Confidence Gating

Not every edit becomes a rule. Gate by confidence:

| Confidence | Criteria | Action |
|------------|----------|--------|
| **HIGH** | Clear pattern, OR same edit seen across 2+ emails | Propose as permanent rule |
| **MEDIUM** | Likely preference, single occurrence | Propose with "watching for pattern" note |
| **LOW** | One-word change, first time seeing it | Note it internally, don't propose a rule yet |

### Step 4: Present Rule Proposals

Show the user what you found and what you want to write:

```
**What you changed:**
- [Voice] Replaced "Would it make sense" with "Want to"
- [Factual] Fixed company name (skipping — not style)

**Proposed rules:**
1. → Voice Profile (Anti-Patterns): Never use "Would it make sense to" — use direct phrasing. [HIGH]
2. → SKILL.md (Structure): Cold outreach openers should be 1 sentence max. [MEDIUM]

Apply these? (yes / edit / skip)
```

Wait for the user to respond before writing anything.

### Step 5: Route Approved Rules

Write approved rules to the correct file and section:

| Rule type | Destination file | Section |
|-----------|-----------------|---------|
| `voice`, `phrase_ban` | `.agents/voice-profiles/{name}.md` | Anti-Patterns |
| `phrase_add` | `.agents/voice-profiles/{name}.md` | Learned from Edits |
| `structure` (universal) | This file (SKILL.md) | Email Rules > Structure |
| `structure` (email-type-specific) | Relevant reference file (e.g. `cold-outreach.md`) | Appropriate section |

**Before writing any rule:** Read the target file first. Check for contradictions with existing rules. If a conflict exists, present both the existing rule and the proposed rule to the user and let them decide.

### Edge Cases

- **No changes (sent as-is):** "Draft was on target. No rules to update."
- **Full rewrite (>70% different):** Don't line-diff. Instead ask: "What was off — the tone, the approach, or the content?" Propose a high-level rule from their answer.
- **Tiny edit:** If factual → skip. If voice → LOW confidence, just note it.
- **Multiple emails in one paste-back:** Process each separately, batch rule proposals at the end. Same edit across 2+ emails → auto-promote to HIGH confidence.
- **Cross-session (no draft in memory):** Ask the user to paste both versions. If they can only paste the final, do a voice-profile audit pass instead of a true diff — compare the email against the existing voice profile and flag mismatches.
- **Rule bloat:** After writing rules, count entries in the target section. If Anti-Patterns exceeds 15 items, suggest consolidating similar rules.
- **Rule conflicts:** Handled in Step 5 — always read the target file before writing, flag contradictions.

## Working With Sequences

When asked to write a multi-email sequence (not just a single email):

1. Read `templates/sequence-structure.md` for sequence architecture
2. Apply different frameworks/angles across emails — don't repeat the same approach
3. Vary the value proposition: if Email 1 is about saving time, Email 3 is about saving money
4. Threading rules: Email 2 threads to Email 1, Email 3 starts fresh, Email 4 threads to Email 3
5. Each subsequent email should be shorter, not longer
6. Breakup email goes last — signal you won't follow up again

## Reference Documents

Read these as directed by the routing table above:

- **[cold-outreach.md](references/cold-outreach.md)** — Cold email frameworks: Nowoslawski angles, Poke the Bear, Schwartz awareness, 5T structure, subject lines.
- **[deal-followup.md](references/deal-followup.md)** — Deal stage follow-ups: post-call, post-demo, stalled, ghosted, pricing, resource delivery. Conditional logic for transcripts.
- **[trigger-routing.md](references/trigger-routing.md)** — Maps triggers/signals/events to email strategy. Funding, hiring, tech signals, deal events, rep intuition — all routed here.
- **[warm-intros.md](references/warm-intros.md)** — Referral follow-ups, mutual connections, inbound response, re-engagement.
- **[buyer-psychology.md](references/buyer-psychology.md)** — Schwartz awareness levels, market sophistication, loss aversion, cognitive dissonance, status quo disruption.

## Optional Enhancements

- **[templates/](templates/)** — Sequence structures, single email templates. Used when building multi-email campaigns.

## Related Skills

- **[gtm-context](../gtm-context/)** — Foundation context that informs email targeting and messaging
- **[text-trainer](../text-trainer/)** — Train voice profiles that this skill uses for tone matching
- **[prospect-finder](../prospect-finder/)** — Find contacts to email
- **[web-scraping](../web-scraping/)** — Research prospects and companies before writing
