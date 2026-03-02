# AGENTS.md

## Overview

GTME Skills is a public repo of GTM engineering skills for AI coding agents. Each skill is a self-contained playbook that gives an agent a specific GTM capability — writing outbound emails, finding contacts, scraping data, training voice profiles, or capturing company context.

The repo exists so GTM engineers can install proven playbooks into their agents instead of writing instructions from scratch every time.

## Agent Skills Spec

Every skill lives in `skills/{skill-name}/` and follows this structure:

```
skills/{skill-name}/
  SKILL.md          # Main instruction file (required)
  references/       # Deep knowledge files (optional)
  templates/        # Reusable patterns (optional)
```

### SKILL.md Frontmatter

```yaml
---
name: skill-name
description: One sentence, under 200 characters
version: 1.0.0
triggers:
  - "natural language phrase that activates this skill"
  - "another trigger phrase"
---
```

### Trigger Phrases

Each skill declares trigger phrases in its frontmatter. When a user's request matches a trigger, the agent loads that skill's `SKILL.md` and follows its instructions.

### References and Templates

- **`references/`** — Supporting knowledge: frameworks, API docs, lookup tables, scoring rubrics. The skill's `SKILL.md` tells the agent when and how to read these.
- **`templates/`** — Reusable output patterns: email structures, report formats, YAML schemas. The skill applies these to new inputs.

## Writing Guidelines

When authoring or editing skills:

1. **Keep `SKILL.md` under 500 lines.** Move deep knowledge to `references/` and reusable patterns to `templates/`.
2. **Use `references/` for depth, `templates/` for reuse.** If information helps the agent make decisions, it's a reference. If it shapes the agent's output format, it's a template.
3. **Always include a trigger phrases section.** Without triggers, agents won't know when to activate the skill.
4. **Description: one sentence, under 200 characters.** This appears in skill listings and search results.
5. **Name: lowercase kebab-case.** Examples: `email-writer`, `gtm-context`, `web-scraping`.
6. **Cross-skill references use `.agents/` paths.** When one skill reads from another (e.g., email-writer reading a voice profile), reference through the `.agents/` directory.
7. **No personal data in skills.** API keys, company-specific details, and personal info belong in the user's local config — not in published skills.
8. **Test with a clean install.** Before submitting, verify the skill works when installed fresh with no prior context.

## Git Workflow

1. **Fork** the repo.
2. **Branch** from `main` with a descriptive name: `add-skill-{name}` or `update-{skill}-{change}`.
3. **Write or edit** the skill following the guidelines above.
4. **Submit a PR.** Validation CI runs automatically. The PR needs review before merge.

## Version Checking

Skills use semantic versioning (`MAJOR.MINOR.PATCH`):

- **MAJOR** — Breaking changes to the skill's interface or behavior.
- **MINOR** — New capabilities added, backwards compatible.
- **PATCH** — Bug fixes, wording improvements, reference updates.

Track all version changes in [VERSIONS.md](VERSIONS.md). Bump the version in both the skill's frontmatter and `VERSIONS.md` in the same PR.
