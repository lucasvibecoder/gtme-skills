# Web Scraping Skill — Test Log & Domain Learnings

Each entry records a domain tested, the router's decision path, what worked, and any patterns worth encoding into the skill.

---

## 2026-03-02 — Initial Skill Build + Validation Run

### Domains Tested

| # | Domain | Classification | Level | Tool Used | Result | Notes |
|---|--------|---------------|-------|-----------|--------|-------|
| 1 | jobs.ashbyhq.com | Public API | 0 | HTTPX | Pass | `api.ashbyhq.com/posting-api/job-board/{slug}` — all jobs + full descriptions in 1 call |
| 2 | job-boards.greenhouse.io | Public API | 0 | HTTPX | Pass | `boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true` — 1 call, full data |
| 3 | news.ycombinator.com | Public API | 0 | HTTPX (parallel) | Pass | Firebase API — `topstories.json` + `/item/{id}.json`. N+1 pattern, parallelized with ThreadPoolExecutor |
| 4 | rightmove.co.uk | Hidden JSON in HTML | 1 | HTTPX + regex | Pass | Next.js server-rendered JSON blob in `<script>` tag. 328KB payload. Pagination via `&index=` param. 35,500 listings available |
| 5 | amazon.com (search) | Static HTML | 1 | HTTPX + headers | Pass | 16 products extracted. `data-asin` + `data-component-type="s-search-result"` pattern. Required full browser headers |
| 6 | amazon.com (product) | TLS blocked | 2 | tls-client | Pass | CAPTCHA with plain HTTPX. tls-client with `chrome_131` identifier bypassed it. Full product data extracted |
| 7 | mybobs.com | SPA + TLS blocked | 3→2 | Playwright → tls-client | Pass | curl connection refused. tls-client got SPA shell (no data). Playwright intercepted XHR → found `api.mybobs.com/occ/v2/bobsspa/stores?query=ZIP&radius=METERS`. Replayed with tls-client: 180 stores |
| 8 | app.clay.com | Authenticated SPA | 3 | Playwright (cookie auth) | Pass | No public API. Cookie-based auth (`claysession`, HttpOnly). Playwright intercepted 22 API endpoints from single page load. Full table/field/enrichment structure exposed |

### Patterns Discovered

**ATS Job Boards — Known API patterns (no scraping needed):**
- Ashby: `api.ashbyhq.com/posting-api/job-board/{company-slug}`
- Greenhouse: `boards-api.greenhouse.io/v1/boards/{board-slug}/jobs?content=true`
- These should be checked FIRST before any HTML scraping for job board URLs

**Next.js Sites (Rightmove pattern):**
- Server-rendered data lives in a `<script>` tag starting with `{"props":{"pageProps":`
- Data path: `data.props.pageProps.searchResults.properties`
- Common on real estate, e-commerce, news sites built with Next.js
- Detection: check for `__NEXT_DATA__` script ID or `{"props":{"pageProps":` in page source

**Amazon-specific:**
- Search results: plain HTTPX with browser headers works
- Product detail pages: require tls-client minimum (TLS fingerprint check)
- Behavioral detection kicks in after product page requests — subsequent requests from same IP may get 503
- `data-asin` attribute on `div[data-component-type="s-search-result"]` is the anchor for extraction

**SPA API Discovery (Bob's / Clay pattern):**
- When tls-client gets HTML but no data → SPA that loads via XHR
- Playwright with response interception captures every API call
- Once endpoint is discovered, replay directly with tls-client (no browser needed for subsequent runs)
- This is the most powerful pattern: use Playwright ONCE for discovery, then tls-client for production

**Cookie-based Auth (Clay pattern):**
- HttpOnly session cookies don't appear in DevTools Application tab
- Get them via: Network tab → right-click request → Copy as cURL
- Session cookies can be injected into Playwright context or tls-client

### Escalation Level Distribution
- Level 0 (public API): 3/8 domains (37.5%)
- Level 1 (headers / HTML parsing): 2/8 domains (25%)
- Level 2 (tls-client): 1/8 domains (12.5%)
- Level 3 (Playwright): 2/8 domains (25%)

### Open Questions for Retro Loop
- How should the skill remember known API patterns (e.g., Ashby, Greenhouse) across sessions?
- Should discovered endpoints be cached somewhere the skill can reference?
- What's the trigger for "this domain pattern looks like X that we've seen before"?
- Should the skill maintain a domain → approach lookup table that grows over time?

---

## 2026-03-02 — Skill Upgrade: 4 Targeted Improvements

### Changes Made

1. **Cloudflare Error Diagnostics** (evasion_mobile.md) — Added `## Cloudflare-Specific Error Codes` table mapping error codes 1015, 1010, 1009, 1020, and 600010/Turnstile to exact fixes. Shortcuts the diagnosis tree for Cloudflare-protected targets.

2. **Embedded JSON State Extraction** (SKILL.md + api_discovery.md) — Added Step 2.5 to pre-scrape analysis: check raw HTML for JSON-LD, `__NEXT_DATA__`, `__INITIAL_STATE__`, `__PRELOADED_STATE__` before classifying as SPA. Added matching router entry and full extraction guide with code examples. Prevents unnecessary Playwright usage when data is already in the HTML.

3. **MFA Storage State Pattern** (dynamic_scraping.md) — Added `### MFA-Protected Sites — Storage State Pattern` for sites with multi-factor auth. Uses manual login + `context.storage_state()` to capture full browser state (cookies + localStorage + sessionStorage) and reload on headless runs.

4. **Pydantic Validation Feedback Loop** (llm_extraction.md) — Expanded Pydantic section with mandatory schema-before-prompt rule and `extract_with_validation()` function that validates LLM output and auto-retries with error context on validation failure (max 2 retries).

### Motivation
- Bob's Discount Furniture scrape (same day) used Playwright when JSON-LD was available in static HTML — Change 2 would have caught this
- Cloudflare blocks on other targets required trial-and-error diagnosis — Change 1 provides shortcuts
- Clay scrape used manual cookie export — Change 3 provides a cleaner pattern for MFA sites
- LLM extraction had no validation gate — Change 4 prevents hallucinated/malformed output
