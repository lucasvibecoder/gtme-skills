# Dynamic Scraping — Playwright for JS-Rendered Sites

Use when `view-source:` shows an empty `<div id="root">` or `<div id="app">` — the data is loaded by JavaScript after the page renders.

## Setup

```bash
pip install playwright
playwright install chromium
```

## Basic Navigation + Extraction

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Set a real user agent
    page.set_extra_http_headers({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    })

    page.goto("https://example.com/products", wait_until="networkidle")

    # Extract data after JS has rendered
    items = page.eval_on_selector_all(".product-card", """
        elements => elements.map(el => ({
            name: el.querySelector('.title')?.textContent?.trim(),
            price: el.querySelector('.price')?.textContent?.trim(),
            url: el.querySelector('a')?.href,
        }))
    """)

    browser.close()
```

## Waiting Strategies

Choosing the right wait is critical — too short and you get empty data, too long and the scrape is slow.

```python
# Wait for a specific element to appear (most reliable)
page.wait_for_selector(".product-card", timeout=10000)

# Wait for network to go idle (good for initial page load)
page.goto(url, wait_until="networkidle")

# Wait for a specific API response to complete
with page.expect_response("**/api/products**") as response_info:
    page.goto(url)
response = response_info.value

# Wait a fixed time (last resort — avoid if possible)
page.wait_for_timeout(2000)
```

**Priority order:** `wait_for_selector` > `expect_response` > `networkidle` > `wait_for_timeout`

## Infinite Scroll Pattern

```python
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://example.com/feed", wait_until="networkidle")

    all_items = []
    previous_height = 0
    max_scrolls = 50       # Safety limit
    scroll_count = 0

    while scroll_count < max_scrolls:
        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)  # Wait for new content to load

        # Check if page height changed (new content loaded)
        current_height = page.evaluate("document.body.scrollHeight")
        if current_height == previous_height:
            break  # No new content — we've reached the end
        previous_height = current_height
        scroll_count += 1

    # Extract all items after scrolling is complete
    items = page.eval_on_selector_all(".feed-item", """
        elements => elements.map(el => ({
            text: el.querySelector('.content')?.textContent?.trim(),
            author: el.querySelector('.author')?.textContent?.trim(),
            timestamp: el.querySelector('time')?.getAttribute('datetime'),
        }))
    """)

    browser.close()
```

## Handling Login Flows

### Fill Form + Save Cookies for Reuse
```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login
    page.goto("https://example.com/login")
    page.fill('input[name="email"]', "user@example.com")
    page.fill('input[name="password"]', "password123")
    page.click('button[type="submit"]')
    page.wait_for_url("**/dashboard**")  # Wait for redirect after login

    # Save cookies for future runs (skip login next time)
    cookies = context.cookies()
    with open("cookies.json", "w") as f:
        json.dump(cookies, f)

    # Now scrape authenticated pages
    page.goto("https://example.com/protected-data")
    # ... extract data ...

    browser.close()

# --- On subsequent runs, load saved cookies ---
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()

    with open("cookies.json") as f:
        cookies = json.load(f)
    context.add_cookies(cookies)

    page = context.new_page()
    page.goto("https://example.com/protected-data")  # Already logged in
    # ... extract data ...

    browser.close()
```

### MFA-Protected Sites — Storage State Pattern

For sites with multi-factor auth (Salesforce, LinkedIn, internal tools), do NOT try to script the login. MFA prompts (SMS codes, authenticator apps, push notifications) cannot be automated reliably — it's brittle and wastes time.

Instead, log in once manually and save the full browser state for reuse.

```python
from playwright.sync_api import sync_playwright

# --- FIRST RUN: Manual login + save state ---
with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # Headed — you can see and interact
    context = browser.new_context()
    page = context.new_page()

    page.goto("https://app.example.com/login")
    input("Log in manually in the browser (complete MFA), then press Enter here...")

    # Save full state: cookies + localStorage + sessionStorage
    context.storage_state(path="state.json")
    print("State saved to state.json")
    browser.close()

# --- SUBSEQUENT RUNS: Load state, skip login entirely ---
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # Headless is fine now
    context = browser.new_context(storage_state="state.json")
    page = context.new_page()

    page.goto("https://app.example.com/protected-data")  # Already authenticated
    # ... extract data ...

    browser.close()
```

**Why storage_state instead of cookies?** `storage_state` captures cookies AND localStorage AND sessionStorage. Many modern SPAs store auth tokens in localStorage, not cookies — plain cookie export misses those.

> **Session expiry:** Storage state files expire when the session does. If scraping fails with a 401 or 403, delete `state.json` and repeat the manual login step.

## Intercepting API Responses

Instead of parsing HTML, intercept the JSON API calls the SPA makes:

```python
from playwright.sync_api import sync_playwright

captured_data = []

def handle_response(response):
    """Capture JSON responses from the site's internal API."""
    if "/api/products" in response.url and response.status == 200:
        try:
            captured_data.append(response.json())
        except Exception:
            pass

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.on("response", handle_response)

    page.goto("https://example.com/products", wait_until="networkidle")
    # Click through pages to trigger more API calls
    while page.query_selector("button.load-more"):
        page.click("button.load-more")
        page.wait_for_timeout(1000)

    browser.close()

# captured_data now has clean JSON — no HTML parsing needed
```

## Shadow DOM Extraction

Some components (especially web components) use Shadow DOM — elements hidden from normal selectors.

```python
# Standard selectors can't reach inside Shadow DOM
# Use JavaScript to pierce through
data = page.evaluate("""
    () => {
        const host = document.querySelector('my-component');
        const shadow = host.shadowRoot;
        const items = shadow.querySelectorAll('.item');
        return Array.from(items).map(el => el.textContent.trim());
    }
""")
```

## Screenshot Debugging

When something isn't working, take a screenshot to see what the browser sees:

```python
# Full page screenshot
page.screenshot(path="debug.png", full_page=True)

# Screenshot of specific element
page.locator(".product-grid").screenshot(path="grid.png")

# Run headed (visible browser) for debugging
browser = p.chromium.launch(headless=False, slow_mo=500)
# slow_mo adds delay between actions so you can watch what happens
```
