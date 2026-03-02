---
name: prospect-finder
description: "Find people at companies and get their verified email addresses using Prospeo. Use when asked to find contacts, look up people, prospect, get emails for someone at a company, or find decision-makers. Examples: 'find the VP of Sales at Acme Corp', 'get me the email for John Smith at Stripe', 'who runs marketing at Notion?'"
metadata:
  version: "1.0.0"
---

# Prospect Finder

Find people at companies and get their verified email addresses using the Prospeo API.

## When to Use This Skill

When the user says anything like:
- "Find the [title] at [company]"
- "Get me the email for [person] at [company]"
- "Who runs [department] at [company]?"
- "Look up [person]"
- "Find contacts at [company]"
- "Prospect [company]"
- "I need to reach [person/title] at [company]"
- "Get me their email"
- "Find decision-makers at [company]"

### Step 0: Load GTM Context

If `.agents/gtm-context.md` exists, read it first. It contains ICP definitions, target titles, company size ranges, and industry filters that directly inform prospect searches.

If it doesn't exist, ask the user:
1. What's your product/company?
2. Who's your ICP?
3. What tools do you use?

Then suggest: "Run the gtm-context skill to save this for all future skills."

## How It Works

Two Prospeo API endpoints, called via curl:

### Step 1: Search (if needed)

Use when the user gives you a company + role/title but not a specific person's name.

```bash
curl -s -X POST "https://api.prospeo.io/search-person" \
  -H "X-KEY: $PROSPEO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "filters": {
      "company": {
        "names": {
          "include": ["COMPANY_NAME"]
        }
      },
      "person_job_title": {
        "include": ["JOB_TITLE"]
      },
      "person_seniority": {
        "include": ["SENIORITY_LEVEL"]
      }
    }
  }'
```

**Seniority values:** Owner, Founder/Owner, C-Suite, Partner, VP, Director, Manager, Head, Senior, Entry

**Filter notes:**
- `company` is a nested object. Use `company.names` or `company.websites` inside it:
  - `"company": { "names": { "include": ["Acme Corp"] } }`
  - `"company": { "websites": { "include": ["acme.com"] } }`
- Prefer `company.websites` if you know the domain — more precise matching.
- `person_job_title` — filter by title keywords
- `person_seniority` — filter by level
- `person_departments` — filter by department
- `person_location` — filter by geography
- `company_industry` — filter by industry
- `company_headcount_range` — filter by company size
- Each filter supports `include` and `exclude` arrays
- Costs 1 credit per search (returns up to 25 results)
- Does NOT return emails — you must enrich after searching

**Response:** Returns `results[]` array with `person` and `company` objects. Each person has `person_id`, `first_name`, `last_name`, `current_job_title`, `linkedin_url`, etc.

### Step 2: Enrich (to get email)

Use to get the actual email address. Call this for each person you want to contact.

```bash
curl -s -X POST "https://api.prospeo.io/enrich-person" \
  -H "X-KEY: $PROSPEO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "only_verified_email": true,
    "data": {
      "person_id": "PERSON_ID_FROM_SEARCH"
    }
  }'
```

**Input options (use ONE of these combos):**
- `person_id` — from search results (best, most reliable)
- `linkedin_url` — their LinkedIn profile URL
- `first_name` + `last_name` + `company_website` (or `company_name` or `company_linkedin_url`)
- `full_name` + company identifier
- `email` — if you already have it and want to enrich

**Options:**
- `only_verified_email`: true — only return if email is verified (recommended)
- `enrich_mobile`: true — also get phone number (costs 10 credits instead of 1)

**Response fields that matter:**
- `person.email.email` — the verified email address
- `person.email.status` — VERIFIED, CATCH_ALL, or UNVERIFIED
- `person.full_name` — confirmed name
- `person.current_job_title` — confirmed title
- `person.linkedin_url` — LinkedIn profile
- `person.location` — city, state, country
- `company.name` — confirmed company name
- `company.website` — company domain

Costs 1 credit per enrichment. Free if no match found.

## Workflow

1. **Parse the user's request** — figure out: company name, title/role, person name (if given), LinkedIn URL (if given)
2. **If you have a LinkedIn URL or full name + company** — skip search, go straight to enrich
3. **If you only have company + role** — search first, then enrich the top matches
4. **Present results clearly** — name, title, verified email, LinkedIn URL, company
5. **If multiple matches** — show all and let the user pick, or enrich the top 2-3

## Output Format

Present results like this:

**[Full Name]** — [Title] at [Company]
- Email: [verified email]
- LinkedIn: [url]
- Location: [city, state]

If no match found, say so clearly and suggest alternative search terms.

## Important Notes

- The API key is stored in the `PROSPEO_API_KEY` environment variable
- Search costs 1 credit, enrichment costs 1 credit per person (10 if mobile requested)
- Don't enrich more people than the user asked for — credits cost money
- Default to `only_verified_email: true` unless the user says otherwise
- If the user gives you a LinkedIn URL, skip search entirely and just enrich

## Related Skills

- **[gtm-context](../gtm-context/)** — Foundation context with ICP definitions that inform prospecting
- **[email-writer](../email-writer/)** — Write emails to prospects found by this skill
