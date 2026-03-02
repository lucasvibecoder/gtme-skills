# Trigger Routing

This reference maps the reason an email needs to be sent to the right strategy, framework, and tone. The "trigger" is whatever happened that means this email needs to go out right now.

**How to use this:** Identify the trigger → find the matching category below → follow the routing to the right approach and reference file.

---

## Data Signals

External events detected through data, news, or monitoring.

### Funding Round
**Hook:** Congrats are cheap. Connect the funding to what changes operationally.
**Angle:** The next 90 days after funding determine if the capital turns into growth. They're about to scale the team, increase targets, and need infrastructure that didn't exist before.
**Tone:** Peer-to-peer. Not congratulatory spam.
**Framework:** Problem Sniffing or Stars Aligning (see `cold-outreach.md`)
**Example hook:** "{{company_name}} just closed [round]. That usually means [specific operational change]. How are you thinking about [relevant challenge]?"

### New Hire / Team Scaling
**Hook:** New hires signal new priorities and gaps.
**Angle:** If they're hiring [role], they're investing in [function]. That function needs [thing you provide].
**Tone:** Observational, not assumptive.
**Framework:** Stars Aligning
**Example hook:** "Noticed {{company_name}} is hiring [X roles]. Companies at this stage usually find [specific bottleneck]. Curious how you're approaching it."

### Tech Adoption / Migration
**Hook:** New tool adoption creates new problems and integration needs.
**Angle:** Teams that adopt [tool] hit [common ceiling] within [timeframe]. You help them avoid or solve that.
**Tone:** Knowledgeable peer who's seen this pattern before.
**Framework:** Flash Roll or Problem Sniffing
**Example hook:** "Saw {{company_name}} is using [tool]. Most teams hit [specific limitation] within the first [timeframe]. Curious if that's on your radar."

### Competitive Move
**Hook:** Their competitor did something that changes their market position.
**Angle:** Don't make it fearful. Make it strategic — "here's what this means for you."
**Tone:** Advisor, not alarmist.
**Example hook:** "[Competitor] just [specific action]. Depending on how [your company] is positioned, that might [implication]. Worth discussing?"

### Leadership Change
**Hook:** New leaders rewrite playbooks. First 90 days are high-leverage.
**Angle:** New [role] means new priorities. Offer to help them win early.
**Tone:** Respectful of the transition.
**Example hook:** "Congrats on the [role] at {{company_name}}. The first few months usually involve auditing [relevant area]. If it'd be useful, happy to share what we're seeing work for companies in [industry]."

---

## Deal Events

Things that happen inside an active sales process.

### Prospect Opened Your Email
**Don't:** Immediately send another email because they opened it. That's creepy.
**Do:** Note it. If they opened but didn't reply, wait for the next natural touchpoint (sequence step, stalled deal timer, or a genuine reason to follow up).
**Exception:** If they opened it 3+ times or clicked a link, that's active interest. Follow up with something lightweight: "Figured I'd share [relevant resource] in case it's helpful."

### Prospect Accepted Connection Request
**Tone:** Warm but not overenthusiastic. They accepted a connection, not a proposal.
**Approach:** Send a brief, no-ask message that provides context on why you connected. Save the pitch for later.
**Example:** "Thanks for connecting, {{first_name}}. I work with [type of companies] on [what you do]. Not reaching out to pitch anything — just noticed [observation about them/their company] and thought it'd be good to be in each other's network."

### Prospect Viewed Proposal / Pricing Page
**Signal strength:** High. They're actively evaluating.
**Approach:** Don't say "I saw you viewed the proposal." Follow up with something useful — address the most likely question or hesitation they'd have after reviewing.
**Redirect to:** `deal-followup.md` — Post-Demo / Post-Proposal section.

### Prospect Downloaded Resource / Content
**Approach:** Reference the topic, not the download action. "Since [topic] seems to be on your radar..." not "I noticed you downloaded our guide."
**Framework:** Being Genuinely Useful (see `cold-outreach.md`)

### Signed NDA / Partial Agreement but Stalling on Final
**Tone:** Patient but clear. They've committed partially. Something is blocking the final step.
**Approach:** Ask directly what's needed: "I want to make sure we're not missing anything on our end. Is there something you need to move forward, or has the timeline shifted?"
**Redirect to:** `deal-followup.md` — Stalled Deal section.

### No Response After Multiple Touches
**Redirect to:** `deal-followup.md` — Ghosted Prospect section (Breakup, Dropped the Ball, or Value-Add).

---

## Post-Conversation Triggers

You just interacted with this person and need to follow up.

### Just Had a Call
**Redirect to:** `deal-followup.md` — Post-Call Follow-ups section.
**Key:** If transcript is available, use it. If not, write from memory/notes.

### Met at an Event / Conference
**Tone:** Casual, reference something specific from the interaction.
**Approach:** Don't pitch. Continue the conversation that was started in person.
**Example:** "Good meeting you at [event]. Your point about [specific thing they said] stuck with me. [1 sentence connecting it to something relevant]. Would be good to continue the conversation — open to grabbing coffee / hopping on a call?"
**Timing:** Send within 24 hours while the event is fresh.

### LinkedIn DM → Email Bridge
**Approach:** Reference the LinkedIn conversation naturally. Don't re-pitch what was already discussed.
**Example:** "Moving this to email since it's easier to share [resource/details]. [Continue from where the DM conversation left off]."

### Content They Posted
**Tone:** Genuine engagement with their ideas, not "great post!"
**Approach:** Reference a specific point they made. Add your own perspective. Connect it to something relevant without making it a pitch.
**Example:** "Your [post/article] about [topic] was sharp — especially the point about [specific detail]. We're seeing the same thing with [related observation]. If this is top of mind for you, I've got some data that might be useful. Want me to send it over?"

---

## Rep Intuition Triggers

No data signal. No deal event. Just a sense that now is the right time.

### "Haven't Talked to Them in a While"
**Approach:** Don't say "It's been a while" or "Wanted to reconnect." Lead with something new — an insight, a question, a relevant change.
**Example:** "{{first_name}} – [something new: industry development, relevant insight, their company news]. Thought of your [situation/project]. If [topic] is still on your radar, happy to share what's changed on our end."

### "I Learned Something New About Their Business"
**Approach:** Share the insight directly. Don't be coy about how you found it.
**Example:** "{{first_name}} – saw that {{company_name}} [specific thing you learned]. That usually means [implication]. Curious how you're thinking about [related challenge]."

### "Gut Feeling — Right Time to Reach Out"
**Approach:** Trust the instinct but give it a hook. Find something — anything — specific to anchor the email. A recent hire, a post, a product launch, an industry trend. If you truly can't find anything, use the "check in with value" format: share something useful and make a soft ask.

---

## Process Triggers

System-driven or cadence-driven follow-ups.

### Sequence Step (Automated Cadence)
**Key decision:** Is this email part of a cold outreach sequence or a deal nurture sequence?
- Cold sequence → `cold-outreach.md` for framework. Vary the angle and value prop from previous emails.
- Deal nurture → `deal-followup.md`. Add new value, don't just bump.

### Manager Asked for Update / Pipeline Review
**This isn't an email to the prospect.** This is a trigger to check in on stalled deals. Review your pipeline, identify where things are stuck, and draft follow-ups for the ones that need attention. Redirect each to the appropriate section above.

---

## Routing Summary

Quick reference when you're not sure which path to take:

| Trigger Type | Primary Reference | Tone |
|-------------|-------------------|------|
| Cold — first touch, no relationship | `cold-outreach.md` | Peer, curious, detached |
| Data signal — external event | This file + `cold-outreach.md` | Informed, observational |
| Deal event — prospect action | `deal-followup.md` | Responsive, momentum-focused |
| Post-call — conversation happened | `deal-followup.md` (post-call section) | Specific, action-oriented |
| Warm intro — referral, connection | `warm-intros.md` | Warm, low-pressure |
| Ghosted — no response | `deal-followup.md` (ghosted section) | Detached, graceful |
| Intuition — no specific trigger | Find a hook, then route to closest match | Genuine, value-leading |
