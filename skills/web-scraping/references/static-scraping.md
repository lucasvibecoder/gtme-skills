# Static HTML Scraping — BeautifulSoup, HTTPX, Scrapy

Use when `view-source:` shows the data you need directly in the HTML. No JavaScript rendering required.

## BeautifulSoup + HTTPX (Small Scale, <100 Pages)

### Basic Pattern
```python
import httpx
from bs4 import BeautifulSoup

url = "https://example.com/products"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
}

response = httpx.get(url, headers=headers, follow_redirects=True)
soup = BeautifulSoup(response.text, "html.parser")

# Extract data
items = []
for card in soup.select(".product-card"):
    items.append({
        "name": card.select_one(".title").get_text(strip=True),
        "price": card.select_one(".price").get_text(strip=True),
        "url": card.select_one("a")["href"],
    })
```

### With Pagination
```python
import httpx
from bs4 import BeautifulSoup
import time

all_items = []
page = 1

while True:
    response = httpx.get(
        f"https://example.com/products?page={page}",
        headers=headers,
        follow_redirects=True,
    )
    soup = BeautifulSoup(response.text, "html.parser")
    cards = soup.select(".product-card")

    if not cards:
        break

    for card in cards:
        all_items.append({
            "name": card.select_one(".title").get_text(strip=True),
            "price": card.select_one(".price").get_text(strip=True),
        })

    # Check for next page link
    next_link = soup.select_one("a.next-page")
    if not next_link:
        break

    page += 1
    time.sleep(1)  # Rate limit — always add a delay
```

## CSS Selector Quick Reference

| Selector | Matches | Example |
|----------|---------|---------|
| `tag` | Element by tag name | `soup.select("h2")` |
| `.class` | Element by CSS class | `soup.select(".product-card")` |
| `#id` | Element by ID | `soup.select("#main-content")` |
| `tag.class` | Tag with specific class | `soup.select("div.price")` |
| `parent > child` | Direct child | `soup.select("ul > li")` |
| `ancestor descendant` | Any nested descendant | `soup.select("div .title")` |
| `[attr=value]` | Attribute selector | `soup.select('[data-type="product"]')` |
| `tag:nth-child(n)` | Nth child | `soup.select("tr:nth-child(2)")` |

**Tip:** Right-click any element in Chrome DevTools → "Copy selector" gives you the exact CSS selector.

## Data Extraction Patterns

### Tables
```python
# Extract an HTML table into a list of dicts
table = soup.select_one("table")
headers_row = [th.get_text(strip=True) for th in table.select("thead th")]
rows = []
for tr in table.select("tbody tr"):
    cells = [td.get_text(strip=True) for td in tr.select("td")]
    rows.append(dict(zip(headers_row, cells)))
```

### Repeated Cards/Items
```python
# Common pattern: div with class repeated for each item
items = []
for card in soup.select(".item-card"):
    items.append({
        "title": card.select_one("h3").get_text(strip=True),
        "description": card.select_one("p.desc").get_text(strip=True),
        "link": card.select_one("a")["href"],
        "image": card.select_one("img")["src"],
    })
```

### Handling Missing Elements
```python
# Use a helper to safely extract text — avoids AttributeError on None
def safe_text(element, selector, default=""):
    el = element.select_one(selector)
    return el.get_text(strip=True) if el else default

def safe_attr(element, selector, attr, default=""):
    el = element.select_one(selector)
    return el[attr] if el and el.has_attr(attr) else default
```

## Scrapy (Large Scale, >100 Pages)

### Spider Template
```python
import scrapy

class ProductSpider(scrapy.Spider):
    name = "products"
    start_urls = ["https://example.com/products"]

    custom_settings = {
        "DOWNLOAD_DELAY": 1,           # 1 second between requests
        "CONCURRENT_REQUESTS": 4,       # Max parallel requests
        "FEEDS": {
            "output.jsonl": {"format": "jsonlines"},  # Auto-export
        },
        "USER_AGENT": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    }

    def parse(self, response):
        # Extract items from current page
        for card in response.css(".product-card"):
            yield {
                "name": card.css(".title::text").get("").strip(),
                "price": card.css(".price::text").get("").strip(),
                "url": response.urljoin(card.css("a::attr(href)").get("")),
            }

        # Follow pagination
        next_page = response.css("a.next-page::attr(href)").get()
        if next_page:
            yield response.follow(next_page, self.parse)
```

### Running a Scrapy Spider
```bash
# From the directory containing your spider file
scrapy runspider spider.py -o output.jsonl
# Or with more control
scrapy runspider spider.py -o output.csv -s DOWNLOAD_DELAY=2
```

### When to Use Scrapy Over BeautifulSoup
- **>100 pages** to scrape — Scrapy handles concurrency, retries, rate limiting automatically
- **Multiple link levels** — need to follow links from listing pages to detail pages
- **Export built in** — JSON, CSV, XML output without extra code
- **Middleware** — easily add proxy rotation, custom headers, etc.
