# API Discovery — Find Hidden APIs Before Scraping HTML

The fastest, most reliable scrape is the one that doesn't scrape HTML at all. Most modern websites load data from internal JSON APIs — find those first.

## How to Find Hidden APIs

### Browser DevTools Method
```
1. Open target URL in Chrome/Firefox
2. Open DevTools → Network tab
3. Filter by "Fetch/XHR" (ignore images, CSS, JS bundles)
4. Navigate the page — click through pagination, filters, search
5. Watch for JSON responses (look for application/json content-type)
6. Click a promising request → Preview tab shows the data structure
7. Right-click the request → "Copy as cURL"
```

### Converting cURL to Python
Take the copied cURL command and convert it to HTTPX:

```python
import httpx

# From the cURL copy, extract these:
url = "https://example.com/api/v1/products"
headers = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Referer": "https://example.com/products",
    # Include any auth tokens or session cookies from the cURL
}
params = {
    "page": 1,
    "per_page": 50,
    "category": "electronics",
}

response = httpx.get(url, headers=headers, params=params)
data = response.json()
```

### What to Look For in DevTools
| Request pattern | What it means |
|----------------|--------------|
| `/api/v1/...` or `/api/v2/...` | Formal internal API — very stable |
| `/graphql` | GraphQL endpoint — can query for exact fields |
| `/_next/data/...` | Next.js data endpoint — mirrors page data |
| `/wp-json/...` | WordPress REST API — well-documented |
| `?format=json` or `&output=json` | JSON variant of HTML page |
| Response is JSON array of objects | Jackpot — structured data ready to use |

## The Reddit JSON Trick
Append `.json` to any Reddit URL to get structured JSON data:
```python
import httpx

# Any Reddit URL works — just add .json
url = "https://www.reddit.com/r/python/hot.json"
headers = {"User-Agent": "MyBot/1.0"}  # Reddit requires a User-Agent

response = httpx.get(url, headers=headers)
posts = response.json()["data"]["children"]

for post in posts:
    print(post["data"]["title"], post["data"]["url"])
```

## Pagination Patterns

Once you find the API, figure out how it paginates:

### Offset-based (most common)
```python
# Pattern: ?page=1&per_page=50 or ?offset=0&limit=50
all_items = []
page = 1

while True:
    response = httpx.get(url, params={"page": page, "per_page": 50}, headers=headers)
    data = response.json()
    items = data.get("results", [])
    if not items:
        break
    all_items.extend(items)
    page += 1
```

### Cursor-based (common in modern APIs)
```python
# Pattern: response includes a "next_cursor" or "after" token
all_items = []
cursor = None

while True:
    params = {"limit": 50}
    if cursor:
        params["cursor"] = cursor
    response = httpx.get(url, params=params, headers=headers)
    data = response.json()
    all_items.extend(data["items"])
    cursor = data.get("next_cursor")
    if not cursor:
        break
```

### Infinite scroll (scroll triggers API call)
```
Watch DevTools Network tab while scrolling
→ New XHR request fires at each scroll
→ Look for incrementing page/offset parameter
→ Replicate that parameter pattern in your script
```

## Common Gotchas
- **Auth tokens expire** — some APIs use short-lived tokens. Check if there's a `/token` or `/auth` endpoint that issues fresh ones.
- **CORS headers present** — the API is meant for browser-only use. You can still call it from Python (CORS is browser-enforced only).
- **Rate limits on API** — internal APIs often have stricter rate limits than you'd expect. Start slow.
- **GraphQL** — if the endpoint is `/graphql`, you'll need to reverse-engineer the query. Copy the request body from DevTools — it contains the exact query and variables.
