# Operational Basics — Rate Limiting, Proxies, Retries, User-Agents

Apply these to **every** scraping script. Skipping operational basics is the #1 reason scrapes get blocked.

## Rate Limiting

### Fixed Delay (Simplest)
```python
import time

for url in urls:
    response = httpx.get(url, headers=headers)
    # ... process response ...
    time.sleep(1)  # 1 second between requests
```

### Random Jitter (Better — Looks Less Like a Bot)
```python
import time
import random

for url in urls:
    response = httpx.get(url, headers=headers)
    # ... process response ...
    time.sleep(random.uniform(1.0, 3.0))  # Random 1-3 seconds
```

### Adaptive Backoff (Best — Adjusts to Site Behavior)
```python
import time

delay = 1.0  # Start at 1 second

for url in urls:
    response = httpx.get(url, headers=headers)

    if response.status_code == 429:
        delay = min(delay * 2, 60)  # Double delay, max 60s
        time.sleep(delay)
        continue  # Retry this URL

    if response.status_code == 200:
        delay = max(delay * 0.9, 1.0)  # Slowly reduce delay on success

    # ... process response ...
    time.sleep(delay)
```

## Retry Logic with Exponential Backoff

```python
import httpx
import time

def fetch_with_retry(url, headers, max_retries=3):
    """Fetch a URL with exponential backoff on failure."""
    for attempt in range(max_retries):
        try:
            response = httpx.get(url, headers=headers, timeout=30, follow_redirects=True)

            if response.status_code == 200:
                return response
            if response.status_code == 429:
                wait = (2 ** attempt) + random.uniform(0, 1)
                print(f"Rate limited. Waiting {wait:.1f}s...")
                time.sleep(wait)
                continue
            if response.status_code in (403, 503):
                print(f"Blocked ({response.status_code}). Attempt {attempt + 1}/{max_retries}")
                time.sleep(2 ** attempt)
                continue

            response.raise_for_status()

        except httpx.TimeoutException:
            print(f"Timeout. Attempt {attempt + 1}/{max_retries}")
            time.sleep(2 ** attempt)

    print(f"Failed after {max_retries} retries: {url}")
    return None
```

## User-Agent Rotation

```python
import random

USER_AGENTS = [
    # Chrome on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    # Chrome on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    # Safari on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    # Firefox on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    # Chrome on Linux
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
]

def get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
    }
```

## Proxy Rotation

### When Each Type Matters
| Proxy type | Speed | Cost | Use when |
|-----------|-------|------|----------|
| Datacenter | Fast | Cheap ($1-5/GB) | Target doesn't check IP reputation |
| Residential | Medium | Expensive ($5-15/GB) | Target blocks datacenter IPs |
| Mobile | Slow | Very expensive | Target blocks residential + datacenter |
| Free (public lists) | Unreliable | Free | Testing only — never for production |

### Basic Proxy Rotation
```python
import httpx
import random

PROXIES = [
    "http://user:pass@proxy1.example.com:8080",
    "http://user:pass@proxy2.example.com:8080",
    "http://user:pass@proxy3.example.com:8080",
]

def fetch_with_proxy(url, headers):
    proxy = random.choice(PROXIES)
    response = httpx.get(url, headers=headers, proxy=proxy, timeout=30)
    return response
```

## Respecting robots.txt

```python
from urllib.robotparser import RobotFileParser

def check_robots(url, user_agent="*"):
    """Check if a URL is allowed by robots.txt."""
    from urllib.parse import urlparse
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"

    rp = RobotFileParser()
    rp.set_url(robots_url)
    rp.read()

    allowed = rp.can_fetch(user_agent, url)
    crawl_delay = rp.crawl_delay(user_agent)

    return {"allowed": allowed, "crawl_delay": crawl_delay}
```

## Session Management

Keep cookies and headers consistent across requests — many sites track sessions.

```python
import httpx

# Use a Client (session) instead of standalone requests
with httpx.Client(
    headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    },
    follow_redirects=True,
    timeout=30,
) as client:
    # First request sets cookies
    client.get("https://example.com")

    # Subsequent requests send cookies automatically
    response = client.get("https://example.com/products?page=1")
    # ... cookies persist across requests in this session
```

## Progress Tracking for Long Scrapes

```python
import json
import time

total = len(urls)
results = []
failed = []

for i, url in enumerate(urls, 1):
    response = fetch_with_retry(url, headers=get_headers())

    if response:
        results.append(parse_response(response))
    else:
        failed.append(url)

    # Progress update every 10 items
    if i % 10 == 0:
        print(f"Progress: {i}/{total} ({i/total*100:.0f}%) | Failed: {len(failed)}")

    # Incremental save every 100 items (don't lose data on crash)
    if i % 100 == 0:
        with open("partial_results.jsonl", "a") as f:
            for item in results[-100:]:
                f.write(json.dumps(item) + "\n")

    time.sleep(random.uniform(1.0, 2.5))

print(f"Done. {len(results)} succeeded, {len(failed)} failed.")
```
