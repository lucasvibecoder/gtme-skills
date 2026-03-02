# Voice Profile Template

Use this template when assembling a voice profile after completing the 8-pass analysis. Fill in every section with findings from the analysis. Delete placeholder instructions before saving.

Save the completed profile to: `.agents/voice-profiles/{name}.md`

---

```markdown
# Voice Profile: {Full Name}

**Trained:** {date}
**Samples analyzed:** {count} samples across {types list}
**Last updated:** {date}

---

## Identity

- **Name:** {Full Name}
- **Role/Context:** {What they do — job title, function, or relationship to the writing}
- **Writing contexts trained on:** {comma-separated list of sample types: tweets, emails, memos, etc.}

---

## Core Voice

{1-2 sentence persona description from Pass 1. This is the anchor — the most concise summary of how this person sounds.}

**They are:** {3-5 adjectives}
**They are NOT:** {3-5 anti-adjectives}

**Golden rule:** {The single most important instruction for writing like this person, from Pass 8}

---

## Tone by Context

{Only include subsections for writing types that had samples. Delete the rest.}

### Tweets / Short-Form
- **Typical length:** {range}
- **Tone:** {how it shifts from core voice}
- **Structural patterns:** {any tweet-specific habits}
- **Notable:** {anything unique to this context}

### Emails
- **Typical length:** {range}
- **Tone:** {how it shifts from core voice}
- **Opening patterns:** {how they start emails}
- **Closing patterns:** {how they end emails}
- **Notable:** {anything unique to this context}

### Memos / Long-Form
- **Typical length:** {range}
- **Tone:** {how it shifts from core voice}
- **Structural patterns:** {how they organize longer writing}
- **Notable:** {anything unique to this context}

### Slack / Chat
- **Typical length:** {range}
- **Tone:** {how it shifts from core voice}
- **Notable:** {anything unique to this context}

### {Other Type}
- **Typical length:** {range}
- **Tone:** {how it shifts from core voice}
- **Notable:** {anything unique to this context}

---

## Sentence Patterns

- **Average length:** {X-Y words per sentence}
- **Range:** {shortest typical to longest typical}
- **Fragment usage:** {frequency and purpose}
- **Rhythm:** {how they vary sentence length — e.g., "builds from short to long," "alternates punchy and flowing"}
- **Common starters:** {how they typically begin sentences}
- **Parallel structure:** {do they use it? how?}

---

## Structural Patterns

- **Paragraph length:** {typical paragraph size}
- **Format preference:** {stacked lines vs flowing paragraphs vs mixed}
- **Opening patterns:** {how they start a piece of writing}
- **Closing patterns:** {how they end a piece of writing}
- **Transitions:** {how they move between ideas}
- **Lists vs prose:** {preference and when each is used}

---

## Vocabulary

### Signature Words
{Words they use often — list with approximate frequency if possible}

### Words They Never Use
{Words conspicuously absent — especially common words/phrases others in their field use but they avoid}

### Verbal Tics
{Filler phrases or constructions they lean on}

### Domain Language
{Industry terms, jargon, or specialized vocabulary they're comfortable with}

---

## Punctuation and Formatting

- **Em dashes (—):** {usage pattern}
- **Ellipsis (...):** {usage pattern}
- **Exclamation marks (!):** {usage pattern}
- **Question marks:** {frequency and purpose}
- **Commas:** {heavy or light, style}
- **Capitalization:** {any non-standard patterns}
- **Line breaks:** {strategic use?}
- **Parentheses:** {usage pattern}

---

## Anti-Patterns

**Things this person NEVER does:**

{Bulleted list of anti-patterns from Pass 7. These are critical — they prevent the most common voice-breaking mistakes.}

---

## Voice Samples

{3-5 real samples from their writing, selected in Pass 8 as the most representative. Each annotated with what makes it a good example.}

### Sample 1
> {quoted sample}

**Why this is representative:** {brief annotation}

### Sample 2
> {quoted sample}

**Why this is representative:** {brief annotation}

### Sample 3
> {quoted sample}

**Why this is representative:** {brief annotation}

---

## Usage Notes

Instructions for any skill consuming this profile:

- Match the tone, vocabulary, and rhythm described above
- Pay special attention to the Anti-Patterns section — violations are more noticeable than matches
- When in doubt, re-read the Voice Samples and write something that could sit alongside them
- The Golden Rule is your tiebreaker for any judgment call
- If writing a type not covered in Tone by Context, default to the Core Voice and adapt naturally
```
