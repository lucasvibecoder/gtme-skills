# Starter Scripts — Copy-Paste Templates

Each script is working code. Replace `{{PLACEHOLDER}}` values with your specifics.

---

## 1. Quick Static Scrape (HTTPX + BeautifulSoup)

```python
import httpx
from bs4 import BeautifulSoup

url = "{{TARGET_URL}}"
headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}

response = httpx.get(url, headers=headers, follow_redirects=True)
soup = BeautifulSoup(response.text, "html.parser")

items = []
for el in soup.select("{{CSS_SELECTOR}}"):
    items.append({
        "text": el.get_text(strip=True),
        "link": el.select_one("a")["href"] if el.select_one("a") else None,
    })

for item in items[:5]:
    print(item)
```

---

## 2. API Endpoint Scrape (HTTPX + JSON)

```python
import httpx
import json

url = "{{API_ENDPOINT}}"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
    "Referer": "{{SITE_URL}}",
}

all_items = []
page = 1

while True:
    response = httpx.get(url, headers=headers, params={"page": page, "per_page": 50})
    data = response.json()
    items = data.get("{{RESULTS_KEY}}", [])
    if not items:
        break
    all_items.extend(items)
    page += 1

print(f"Collected {len(all_items)} items")
print(json.dumps(all_items[:5], indent=2))
```

---

## 3. Playwright SPA Scrape

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_extra_http_headers({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    })

    page.goto("{{TARGET_URL}}", wait_until="networkidle")
    page.wait_for_selector("{{CSS_SELECTOR}}", timeout=10000)

    items = page.eval_on_selector_all("{{CSS_SELECTOR}}", """
        elements => elements.map(el => ({
            text: el.textContent?.trim(),
            href: el.querySelector('a')?.href,
        }))
    """)

    browser.close()

for item in items[:5]:
    print(item)
```

---

## 4. Playwright Infinite Scroll

```python
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("{{TARGET_URL}}", wait_until="networkidle")

    prev_height = 0
    for _ in range({{MAX_SCROLLS}}):
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)
        curr_height = page.evaluate("document.body.scrollHeight")
        if curr_height == prev_height:
            break
        prev_height = curr_height

    items = page.eval_on_selector_all("{{ITEM_SELECTOR}}", """
        elements => elements.map(el => ({
            text: el.querySelector('{{TEXT_SELECTOR}}')?.textContent?.trim(),
            link: el.querySelector('a')?.href,
        }))
    """)

    browser.close()

print(f"Collected {len(items)} items after scrolling")
for item in items[:5]:
    print(item)
```

---

## 5. LLM Extraction (markdownify + Claude)

```python
import httpx
from markdownify import markdownify
import anthropic
import json

# Fetch and convert to markdown
response = httpx.get("{{TARGET_URL}}", headers={
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
})
markdown = markdownify(response.text, strip=["script", "style", "nav", "footer"])

# Extract structured data with Claude
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": f"""Extract the following fields from this page. Return valid JSON only, no explanation.

Fields: {{FIELD_LIST}}

Page content:
{markdown[:8000]}"""
    }]
)

data = json.loads(message.content[0].text)
print(json.dumps(data, indent=2))
```

---

## 6. Scrapy Spider

```python
import scrapy

class {{SPIDER_NAME}}Spider(scrapy.Spider):
    name = "{{SPIDER_NAME}}"
    start_urls = ["{{START_URL}}"]

    custom_settings = {
        "DOWNLOAD_DELAY": 1.5,
        "CONCURRENT_REQUESTS": 4,
        "FEEDS": {"output.jsonl": {"format": "jsonlines"}},
        "USER_AGENT": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "LOG_LEVEL": "INFO",
    }

    def parse(self, response):
        for item in response.css("{{ITEM_SELECTOR}}"):
            yield {
                "title": item.css("{{TITLE_SELECTOR}}::text").get("").strip(),
                "url": response.urljoin(item.css("a::attr(href)").get("")),
                "detail": item.css("{{DETAIL_SELECTOR}}::text").get("").strip(),
            }

        next_page = response.css("{{NEXT_PAGE_SELECTOR}}::attr(href)").get()
        if next_page:
            yield response.follow(next_page, self.parse)

# Run: scrapy runspider this_file.py
```
