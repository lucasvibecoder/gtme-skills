# Contributing to GTME Skills

## Adding a New Skill

1. **Fork** the repo and create a branch: `add-skill-{name}`
2. **Create the skill directory:**
   ```
   skills/{skill-name}/
     SKILL.md
     references/    (optional)
     templates/     (optional)
   ```
3. **Write `SKILL.md`** with the required frontmatter:
   ```yaml
   ---
   name: skill-name
   description: One sentence, under 200 characters
   version: 1.0.0
   triggers:
     - "phrase that activates this skill"
   ---
   ```
4. **Add references** — Supporting knowledge files the skill reads from (frameworks, API docs, lookup tables).
5. **Add templates** — Reusable output patterns the skill applies (email structures, report formats).
6. **Submit a PR** against `main`.

## Skill Structure Requirements

- **Frontmatter** — `name`, `description`, `version`, and `triggers` are required.
- **Trigger phrases** — At least 2 natural language phrases that tell agents when to activate.
- **References** — Put deep knowledge in `references/`, not inline in `SKILL.md`.
- **Templates** — Put reusable output patterns in `templates/`, not inline in `SKILL.md`.

## Quality Checklist

Before submitting, verify:

- [ ] Name is lowercase kebab-case (`my-skill`, not `MySkill` or `my_skill`)
- [ ] Description is one sentence, under 200 characters
- [ ] Trigger phrases section is present with at least 2 phrases
- [ ] `SKILL.md` is under 500 lines (move depth to `references/`)
- [ ] No personal data (API keys, company names, email addresses)
- [ ] No hardcoded file paths — use relative paths within the skill
- [ ] Tested with a clean install (no prior context assumed)

## Updating an Existing Skill

1. **Branch** from `main`: `update-{skill}-{change}`
2. **Make your changes** in the skill's directory.
3. **Bump the version** in the skill's `SKILL.md` frontmatter.
4. **Add an entry** to [VERSIONS.md](VERSIONS.md) with the new version, date, and changelog.
5. **Submit a PR.**

## PR Process

- Validation CI runs automatically on every PR.
- PRs require at least one review before merge.
- Keep PRs focused — one skill add or update per PR when possible.
- Write a clear PR description: what the skill does, who it's for, and how to test it.

## Code of Conduct

- **Be helpful.** Skills should solve real problems for GTM engineers.
- **Keep skills generic and reusable.** Avoid company-specific logic — that belongs in the user's local config.
- **No personal data.** Never commit API keys, credentials, email addresses, or company-specific details.
- **Document clearly.** A GTM engineer who isn't a developer should understand what the skill does from the description and trigger phrases alone.
