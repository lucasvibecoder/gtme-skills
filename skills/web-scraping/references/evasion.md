# Evasion Techniques & Mobile App Scraping

## Block Diagnosis — What Does Each Symptom Mean?

| Symptom | Likely cause | First fix |
|---------|-------------|-----------|
| 403 Forbidden immediately | Missing/wrong headers OR TLS fingerprint blocked | Add full browser headers → if still blocked, use tls-client |
| 403 after a few requests | Rate limiting or behavioral detection | Add delays + rotate User-Agent |
| Cloudflare challenge page (5s wait) | Cloudflare JS challenge | Playwright + stealth plugin |
| CAPTCHA on first visit | Aggressive anti-bot (Turnstile, hCaptcha) | Managed browser service |
| Empty response body | JS rendering required OR silent block | Check with Playwright → if still empty, likely IP block |
| 429 Too Many Requests | Rate limit exceeded | Slow down, add jitter, rotate proxies |
| Redirect to login/different page | Session/cookie required | Use Playwright to get cookies first |
| Connection reset / timeout | IP-level block | Switch IP / proxy |

## Level 1: Header Rotation

The cheapest fix — costs nothing, solves ~40% of blocks.

```python
import httpx
import random

# Rotate through real browser User-Agent strings
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
]

headers = {
    "User-Agent": random.choice(USER_AGENTS),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.google.com/",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

response = httpx.get(url, headers=headers, follow_redirects=True)
```

**Key headers that matter:**
- `User-Agent` — most checked. Never use default library UAs.
- `Accept` — sites check this matches what a browser sends.
- `Referer` — some sites block direct access (no referer). Set to Google or the site itself.
- `Accept-Language` — mismatches with IP geolocation can trigger blocks.

## Level 2: TLS Fingerprint Spoofing (tls-client)

When headers alone don't work — the site is checking your TLS handshake signature.

```python
import tls_client

# Create a session that mimics a real browser's TLS fingerprint
session = tls_client.Session(
    client_identifier="chrome_131",  # Mimics Chrome 131's TLS fingerprint
    random_tls_extension_order=True,
)

response = session.get(
    "https://protected-site.com/data",
    headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
)
```

**Why this works:** Anti-bot systems (Cloudflare, DataDome, Akamai) inspect TLS handshake details — cipher suites, extensions, and their order. Python's `requests` and `httpx` have distinct TLS fingerprints that don't match any browser. `tls-client` spoofs a real browser's fingerprint.

## Level 3: Playwright with Stealth

For JS challenges, behavioral detection, or anything that needs a real browser environment.

```python
from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        locale="en-US",
        timezone_id="America/New_York",
    )
    page = context.new_page()

    # Apply stealth patches — hides automation signals
    stealth_sync(page)

    page.goto("https://protected-site.com/data", wait_until="networkidle")

    # The page should load normally now — Cloudflare JS challenge auto-solved
    content = page.content()

    browser.close()
```

**What playwright-stealth patches:**
- `navigator.webdriver` → set to `false` (normally `true` in automation)
- Chrome DevTools protocol detection
- WebGL vendor/renderer fingerprint
- Missing plugin arrays that real browsers have
- Permissions API inconsistencies

## Level 4: Managed Browser Services (Last Resort)

When local stealth isn't enough — Cloudflare Enterprise, Turnstile, or aggressive behavioral analysis.

**Browserless** — run real browsers in the cloud:
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # Connect to Browserless instead of launching locally
    browser = p.chromium.connect_over_cdp(
        "wss://chrome.browserless.io?token={{YOUR_TOKEN}}"
    )
    page = browser.new_page()
    page.goto("https://heavily-protected-site.com")
    content = page.content()
    browser.close()
```

**When to use managed browsers:**
- Cloudflare Enterprise with Turnstile that stealth can't bypass
- Sites that detect cloud IPs (AWS, GCP) and you need residential IPs
- Need to scale to hundreds of concurrent browser sessions

**Alternative services:** Bright Data Scraping Browser, Oxylabs Web Unblocker, ScrapingBee

## Mobile App API Interception

Mobile apps often have cleaner APIs with less anti-bot protection than websites.

### SSL Pinning Bypass with Frida
Mobile apps use SSL pinning — they reject proxy certificates to prevent interception.

```
1. Set up:
   - Rooted Android device (or emulator with root)
   - mitmproxy running on your machine
   - Frida installed: pip install frida-tools

2. Start mitmproxy:
   mitmproxy --listen-port 8080

3. Configure device proxy to point to your machine IP:8080

4. Bypass SSL pinning with Frida:
   frida -U -f com.target.app -l ssl_pinning_bypass.js --no-pause

5. Use the app normally — all API calls appear in mitmproxy

6. Find the API endpoints, copy as Python requests, replicate
```

**Common Frida scripts for SSL bypass:**
- `frida-multiple-unpinning` — handles most pinning implementations
- `objection` — automated mobile app exploration (wraps Frida)

### When to Try Mobile APIs
- Website is heavily protected but app works fine (common)
- App has features/data not available on web
- App API often returns cleaner JSON than web API
- Mobile APIs frequently have weaker rate limiting
