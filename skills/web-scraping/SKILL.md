---
name: executing-web-scraping
description: Extracts structured data from websites, single-page applications, and mobile APIs. Use when the user requests web scraping, automated data extraction, competitor monitoring, or parsing web content.
---

# Web Scraping Skill

## 1. Trigger Phrases

Activate this skill when the user says any of:
- "scrape", "extract data from", "crawl", "pull data from [website]"
- "monitor [site] for changes", "parse this page"
- "get all the [items] from [url]", "automated data extraction"
- "reverse engineer this API", "intercept mobile app traffic"

---

## 2. Pre-Scrape Analysis Gate

**Mandatory before writing ANY scraping code.** Do not skip steps.

### Step 1: Check for a Public API
```
Google "[site name] API" or "[site name] developer docs"
IF public API exists with the data you need → use it. Done. No scraping needed.
Common examples with APIs: Twitter/X, Reddit, GitHub, Yelp, Google Maps, LinkedIn (unofficial)
```

### Step 2: Inspect Network Traffic
```
Open target URL in browser → DevTools (F12) → Network tab → filter XHR/Fetch
Navigate the page, click buttons, scroll — watch for JSON responses
IF clean JSON endpoint found:
  → Copy the request as cURL (right-click → Copy as cURL)
  → Reverse-engineer it with HTTPX (see reference/api_discovery.md)
  → This is almost always faster and more reliable than HTML scraping
```

### Step 2.5: Check for Embedded JSON State
```
Before classifying as SPA, fetch the raw HTML with HTTPX (plain GET with browser headers).
Search the HTML source for embedded data:
  - <script type="application/ld+json">     → JSON-LD structured data (products, org info, store details)
  - <script id="__NEXT_DATA__">              → Next.js hydration payload (entire page data)
  - window.__INITIAL_STATE__                 → Redux/Vuex pre-loaded state
  - window.__PRELOADED_STATE__               → Same pattern, different variable name
  - Any <script> tag containing a large JSON blob (>1KB)

IF found:
  → Verify the JSON contains the specific fields you need (not just minimal SEO metadata)
  → Extract with regex + json.loads — no browser needed
  → See reference/api_discovery.md (Embedded JSON State section)
```

### Step 3: Check robots.txt
```
Fetch https://[domain]/robots.txt
Note:
  - Disallowed paths (don't scrape these unless user explicitly overrides)
  - Crawl-delay directive (respect it — sets minimum seconds between requests)
  - Sitemap URL (useful for discovering all pages)
```

### Step 4: Classify the Target
Determine which category fits. The answer feeds directly into the Tool Selection Router.

| Signal | Classification |
|--------|---------------|
| `view-source:` shows the data in raw HTML | Static HTML |
| `view-source:` is mostly empty `<div id="root">` | JS-rendered SPA |
| Page requires login before showing data | Behind auth |
| Cloudflare challenge page, CAPTCHA, or instant 403 | Protected / anti-bot |
| Data only available in mobile app | Mobile API |
| Content is unstructured text, not in tables/lists | Unstructured |

---

## 3. Target Classification → Tool Selection Router

Read top to bottom. Use the **first** match.

```
IF public API exists
  → requests/HTTPX + API key
  → DONE — no scraping needed

IF hidden JSON endpoint found (Step 2)
  → HTTPX + direct endpoint
  → See reference/api_discovery.md

IF embedded JSON state found in HTML source (Step 2.5)
  → HTTPX + regex + json.loads
  → See reference/api_discovery.md (Embedded JSON State section)

IF static HTML + small scale (<100 pages)
  → BeautifulSoup + HTTPX
  → See reference/static_scraping.md

IF static HTML + large scale (>100 pages)
  → Scrapy
  → See reference/static_scraping.md

IF JS-rendered SPA
  → Playwright
  → See reference/dynamic_scraping.md

IF behind auth (login required)
  → Playwright with session cookies
  → See reference/dynamic_scraping.md

IF unstructured OR layout changes frequently
  → LLM extraction (markdownify + Claude/OpenAI)
  → See reference/llm_extraction.md

IF behind Cloudflare / DataDome / CAPTCHA
  → Evasion techniques first, then appropriate tool
  → See reference/evasion_mobile.md

IF mobile app only (no web version)
  → Mobile API interception
  → See reference/evasion_mobile.md
```

---

## 4. Extraction Workflow

Follow these steps in order. Each step has a checkpoint.

```
1. RUN PRE-SCRAPE ANALYSIS (Section 2)
   checkpoint: You know the target classification and selected tool

2. WRITE EXTRACTION SCRIPT
   → Use the reference doc for your selected tool
   → Apply operational basics to every script (reference/operational_basics.md):
     - Rate limiting (minimum 1s between requests unless API allows more)
     - Retry logic with backoff
     - User-Agent header (never use default python-requests UA)
   → Use starter script from templates/starter_scripts.md as base

3. TEST ON 5 ITEMS FIRST
   → Run against 5 URLs/items only
   → Print results to console for user review
   checkpoint: Output shape matches expectations, no blocks

4. IF BLOCKED → diagnose and escalate (Section 6)
   → Do NOT retry the same request blindly
   → Identify block type, apply fix, re-test on 5 items

5. SCALE TO FULL DATASET
   → Add progress logging (items scraped / total, elapsed time)
   → Save incrementally (don't lose data on crash)

6. VALIDATE OUTPUT (Section 5)

7. EXPORT to target format (JSON lines, CSV, or user-specified)
```

---

## 5. Output Validation Checklist

Run after extraction, before delivering to user.

```
[ ] SCHEMA CHECK
    Every row has expected fields? Correct types (string, int, URL)?
    → If field missing in >5% of rows, flag it

[ ] NULL/EMPTY CHECK
    Any field with >20% null rate?
    → Flag to user: "field X is null in 25% of rows — site may not have this data for all items"

[ ] DEDUP
    Duplicate rows by URL or unique identifier?
    → Remove dupes, report count: "Removed 12 duplicate entries"

[ ] ENCODING CHECK
    UTF-8 throughout? No mojibake (Ã©, â€™, etc.)?
    → If found, re-decode with correct charset

[ ] SAMPLE INSPECTION
    Print first 5 rows formatted for user review before delivering full dataset
```

---

## 6. Feedback Loop — Blocked Request Escalation

When a request returns 403, CAPTCHA, empty response, or redirect loop:

```
DIAGNOSE THE BLOCK:

├── 403 Forbidden
│   ├── Missing headers? → Add User-Agent, Accept, Accept-Language, Referer
│   ├── Still 403? → TLS fingerprint blocked
│   │   → Switch to tls-client (reference/evasion_mobile.md)
│   └── Still 403? → IP blocked → Add proxy rotation (reference/operational_basics.md)
│
├── CAPTCHA / Cloudflare challenge page
│   ├── Simple JS challenge? → Playwright with stealth plugin (reference/dynamic_scraping.md)
│   ├── Turnstile / hCaptcha? → Managed browser service (reference/evasion_mobile.md)
│   └── reCAPTCHA v3? → Likely need scraping API service (ScrapingBee, Bright Data)
│
├── Empty response / blank page
│   ├── JS-rendered? → Switch to Playwright (reference/dynamic_scraping.md)
│   ├── Geo-blocked? → Try proxy in target country
│   └── Rate limited silently? → Add delays, reduce concurrency
│
├── 429 Too Many Requests
│   ├── Increase delay between requests
│   ├── Add jitter (random 1-3s extra)
│   └── Rotate proxies if available (reference/operational_basics.md)
│
└── Redirect loop / soft block
    ├── Check if cookies are required → Use session with cookie persistence
    └── Check if JavaScript sets a cookie → Switch to Playwright
```

**When to give up on DIY scraping:**
- Cloudflare Enterprise with Turnstile + behavioral analysis → use a scraping API service
- Site actively patches evasion techniques weekly → use a scraping API service
- CAPTCHA on every request with no bypass → use a CAPTCHA-solving service or scraping API

Scraping API services (last resort): ScrapingBee, Bright Data, Oxylabs, ScraperAPI
