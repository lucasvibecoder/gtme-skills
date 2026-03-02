# LLM-Powered Extraction — When Selectors Won't Cut It

Use LLM extraction when:
- **Layout changes frequently** — CSS selectors break every time the site redesigns
- **Unstructured content** — natural language text, not clean tables or lists
- **Complex extraction logic** — "find the CEO's name and email from this About page" is easier to describe in English than in selectors
- **One-off extractions** — not worth writing and maintaining a custom scraper

**Don't use LLM extraction when:**
- Data is in clean HTML tables or repeated card layouts → BeautifulSoup is faster and cheaper
- You need to scrape thousands of pages → token costs add up fast

## Approach 1: markdownify + Claude/OpenAI (Recommended)

Convert HTML to Markdown first (removes noise), then pass to an LLM for structured extraction.

```python
import httpx
from markdownify import markdownify
import anthropic
import json

# Step 1: Fetch the page
response = httpx.get("https://example.com/about", headers={
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
})

# Step 2: Convert HTML to clean Markdown (strips nav, scripts, styles)
markdown = markdownify(response.text, strip=["script", "style", "nav", "footer"])

# Step 3: Extract structured data with Claude
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": f"""Extract the following from this page content. Return valid JSON only.

Fields:
- company_name (string)
- description (string, one sentence)
- team_members (array of objects: name, title, email if available)
- location (string)

Page content:
{markdown[:8000]}"""  # Trim to avoid exceeding context
    }]
)

data = json.loads(message.content[0].text)
```

### Why markdownify First?
- Raw HTML has tons of noise (nav bars, footers, scripts, ads)
- Markdown is ~70-80% smaller than raw HTML → fewer tokens → cheaper + more accurate
- The LLM focuses on content, not tag structure

## Approach 2: Firecrawl (Hosted Service)

Firecrawl handles fetching, JS rendering, and Markdown conversion in one call.

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-{{YOUR_KEY}}")

# Scrape single page → clean Markdown
result = app.scrape_url("https://example.com/about", params={
    "formats": ["markdown"],
})
markdown = result["markdown"]

# Crawl entire site
crawl_result = app.crawl_url("https://example.com", params={
    "limit": 50,               # Max pages to crawl
    "scrapeOptions": {
        "formats": ["markdown"],
    },
})
```

**When to use Firecrawl over markdownify:**
- Target requires JS rendering (Firecrawl runs a browser)
- You want to crawl multiple pages with one call
- You don't want to manage browser infrastructure

## Approach 3: ScrapeGraphAI (Local, Multi-LLM)

ScrapeGraphAI sends a natural language prompt and returns structured data. Supports OpenAI, Anthropic, Ollama, and others.

```python
from scrapegraphai.graphs import SmartScraperGraph

graph = SmartScraperGraph(
    prompt="Extract all product names, prices, and availability status",
    source="https://example.com/products",
    config={
        "llm": {
            "model": "anthropic/claude-sonnet-4-20250514",
            "api_key": "{{YOUR_KEY}}",
        },
    },
)

result = graph.run()
# Returns structured data matching your prompt
```

## Schema-Driven Extraction with Pydantic

For repeatable extractions, define a Pydantic model so the LLM returns consistent shapes:

```python
from pydantic import BaseModel

class Product(BaseModel):
    name: str
    price: float
    currency: str
    in_stock: bool
    description: str | None = None

class ExtractionResult(BaseModel):
    products: list[Product]

# In your prompt to Claude/OpenAI:
# "Extract data matching this schema: {ExtractionResult.model_json_schema()}"
# Then validate: result = ExtractionResult.model_validate_json(llm_response)
```

## Cost Awareness

| Approach | Cost per page | Best for |
|----------|--------------|----------|
| markdownify + Claude Haiku | ~$0.001 | High volume, simple extraction |
| markdownify + Claude Sonnet | ~$0.005 | Complex extraction logic |
| Firecrawl + LLM | ~$0.01-0.02 | JS-rendered sites, crawling |
| ScrapeGraphAI | Varies by LLM | Quick prototyping |
| BeautifulSoup (no LLM) | $0 | Structured HTML — use this when possible |

**Rule of thumb:** If you're scraping >500 pages, check if BeautifulSoup/Scrapy can handle it first. LLM extraction at scale gets expensive fast.
