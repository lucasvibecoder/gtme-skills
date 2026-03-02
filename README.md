# GTME Skills — GTM Engineering Skills for AI Agents

Bring GTM engineering playbooks — outbound, prospecting, data extraction, voice training — to AI coding agents as installable, composable skills.

## What is this?

A public repo of **agent skills** following the [Agent Skills spec](https://github.com/anthropics/claude-code/blob/main/SKILLS.md) for GTM engineers who use AI coding agents (Claude Code, Cursor, Windsurf, etc.).

Each skill is a self-contained playbook: trigger phrases tell the agent when to activate, a `SKILL.md` file contains the instructions, and `references/` and `templates/` folders hold supporting knowledge and reusable patterns.

Install them into your agent, and it gains GTM engineering capabilities — writing cold emails with buyer psychology, finding verified contacts, scraping competitor data, training on your writing voice.

## Architecture

`gtm-context` is the foundation. It captures your company, ICP, GTM motion, tech stack, channels, and metrics into a reusable context file that all other skills can optionally read from.

```
                    ┌─────────────┐
                    │ gtm-context │  (foundation)
                    └──────┬──────┘
        ┌──────────────┬───┴───┬──────────────┐
        │              │       │              │
 ┌──────▼──────┐ ┌────▼────┐ ┌▼─────────┐ ┌──▼───────────┐
 │email-writer │ │prospect-│ │web-      │ │gtm-scorecard │
 │             │ │finder   │ │scraping  │ │              │
 └──────┬──────┘ └─────────┘ └──────────┘ └──────────────┘
        │
 ┌──────▼──────┐
 │text-trainer │  (feeds voice profiles to email-writer)
 └─────────────┘
```

## Skills

<!-- SKILLS:START -->
| Skill | Category | Version | Description |
|-------|----------|---------|-------------|
| [gtm-context](skills/gtm-context/) | Foundation | 1.0.0 | Captures company, ICP, GTM motion, tech stack, channels, and metrics into a reusable context file |
| [email-writer](skills/email-writer/) | Outbound & Email | 1.0.0 | Write effective emails for B2B sales and deal management |
| [gtm-scorecard](skills/gtm-scorecard/) | Intelligence | 2.0.0 | Diagnose any company's GTM infrastructure health in 60 seconds |
| [prospect-finder](skills/prospect-finder/) | Prospecting | 1.0.0 | Find people at companies and get their verified email addresses |
| [text-trainer](skills/text-trainer/) | Voice & Writing | 1.0.0 | Analyze writing samples and generate reusable voice profiles |
| [web-scraping](skills/web-scraping/) | Data Extraction | 1.0.0 | Extract structured data from websites, SPAs, and mobile APIs |
<!-- SKILLS:END -->

## Install

### Option 1: npx (recommended)

```bash
npx @anthropic-ai/claude-code skills add lucasvibecoder/gtme-skills
```

### Option 2: Claude Code plugin

Add to your Claude Code settings:

```json
{
  "skills": ["lucasvibecoder/gtme-skills"]
}
```

### Option 3: Git clone

```bash
git clone https://github.com/lucasvibecoder/gtme-skills.git
```

Then point your agent's skill path to the cloned directory.

### Option 4: Git submodule

```bash
git submodule add https://github.com/lucasvibecoder/gtme-skills.git .skills/gtme
```

### Option 5: Fork

Fork the repo for full customization — swap in your own references, templates, and voice profiles.

## Quick Start

Once installed, use natural language with your agent:

```
"Write a cold email to the VP of Sales at Acme Corp about our data enrichment tool"
```

```
"Find the head of marketing at Stripe and get their email"
```

```
"Scrape pricing from competitor.com into a comparison table"
```

```
"Train a voice profile from these 5 emails I wrote"
```

```
"Set up GTM context for my company — we sell to mid-market SaaS"
```

```
"Score the GTM health of warmly.ai"
```

## Categories

| Category | What it covers |
|----------|---------------|
| Foundation | Company context, ICP definition, GTM motion mapping |
| Outbound & Email | Cold outreach, deal follow-ups, warm intros, sequences |
| Prospecting | Contact search, email enrichment, company research |
| Data Extraction | Web scraping, API discovery, structured data extraction |
| Voice & Writing | Writing analysis, voice profiles, style matching |
| Intelligence | GTM health diagnostics, infrastructure scoring, competitive analysis |

## How Skills Work

Each skill follows the [Agent Skills spec](https://github.com/anthropics/claude-code/blob/main/SKILLS.md):

- **`SKILL.md`** — The main instruction file. Contains frontmatter (name, description, version) and the full playbook the agent follows.
- **Trigger phrases** — Natural language patterns that tell the agent when to activate the skill (e.g., "write an email", "find contacts at").
- **`references/`** — Deep knowledge files the skill can pull from: frameworks, lookup tables, API docs.
- **`templates/`** — Reusable patterns and starter structures the skill applies to new situations.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or improve skills.

## License

[MIT](LICENSE) — Copyright 2026 Lucas Dahl
