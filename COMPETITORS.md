# Competitor Analysis & Feature Roadmap

## Our Current Tools (13)
JSON Editor, JWT, Base64, URL, Timestamp, UUID, YAML↔JSON, JSON Schema, Hash, Regex, Color, JSON Diff, Mock Data

## Competitor Feature Matrix

| Tool | Us | dev-tool.dev (22) | toolslab.dev (50+) | utilso.com (21) |
|------|----|--------------------|---------------------|-----------------|
| JSON Editor/Formatter | ✅ | ✅ | ✅ | ✅ |
| JWT Decoder | ✅ | ✅ | ✅ | ✅ |
| Base64 | ✅ | ✅ | ✅ | ✅ |
| URL Encode/Decode | ✅ | ✅ | ✅ | ✅ |
| Timestamp | ✅ | ✅ | - | ✅ |
| UUID Generator | ✅ | ✅ | ✅ | ✅ |
| YAML ↔ JSON | ✅ | - | ✅ | ✅ |
| JSON Schema Generator | ✅ | - | - | - |
| Hash Generator | ✅ | ✅ | ✅ | - |
| Regex Tester | ✅ | ✅ | ✅ | ✅ |
| Color Converter | ✅ | ✅ | ✅ | - |
| JSON Diff | ✅ | - | - | - |
| Mock Data Generator | ✅ | - | - | - |
| **Cron Parser** | ❌ | ✅ | - | - |
| **CSV ↔ JSON** | ❌ | ✅ | ✅ | - |
| **Password Generator** | ❌ | - | ✅ | - |
| **QR Code Generator** | ❌ | ✅ | ✅ | - |
| **Number Base Converter** | ❌ | ✅ | - | ✅ |
| **Lorem Ipsum Generator** | ❌ | ✅ | - | - |
| **JSON to TypeScript** | ❌ | ✅ | ✅ | - |
| **Case Converter** | ❌ | ✅ | - | - |
| **Text Diff** | ❌ | ✅ | ✅ | ✅ |
| **SQL Formatter** | ❌ | ✅ | ✅ | - |
| **Markdown Preview** | ❌ | ✅ | - | - |
| **Token Counter** | ❌ | ✅ | ✅ | - |
| **HTML Entity Enc/Dec** | ❌ | - | ✅ | ✅ |
| **String Escape/Unescape** | ❌ | - | - | ✅ |
| **HTML/CSS/JS Minify** | ❌ | - | ✅ | ✅ |
| **Query String ↔ JSON** | ❌ | - | - | ✅ |
| **HTML Preview** | ❌ | - | - | ✅ |
| **Image Converter** | ❌ | ✅ | - | ✅ |
| **cURL to Code** | ❌ | - | ✅ | - |

## Our Unique Advantages (no competitor has these)
- **JSON Schema Generator** — none of them have it
- **Mock Data Generator** — none of them have it
- **JSON Diff** — none of them have it (some have Text Diff but not structured JSON Diff)

## Priority Features to Add

### Tier 1 — High Impact, Easy to Implement (no dependencies)
1. **Cron Parser** — parse `*/5 * * * *` → "Every 5 minutes". High SEO value, only 1 competitor has it
2. **Password Generator** — length, uppercase, numbers, symbols. Always needed
3. **Lorem Ipsum Generator** — generate placeholder text by words/sentences/paragraphs
4. **Number Base Converter** — HEX ↔ DEC ↔ OCT ↔ BIN
5. **Case Converter** — camelCase, snake_case, kebab-case, UPPER, lower, Title Case, PascalCase
6. **HTML Entity Encode/Decode** — `&amp;` ↔ `&`, `&lt;` ↔ `<`
7. **String Escape/Unescape** — escape/unescape special characters in strings
8. **Query String ↔ JSON** — `?foo=1&bar=2` ↔ `{"foo":"1","bar":"2"}`

### Tier 2 — High Impact, Medium Effort
9. **CSV ↔ JSON** — very common need, needs basic CSV parser
10. **JSON to TypeScript** — generate TS interfaces from JSON. Killer feature for frontend devs
11. **QR Code Generator** — needs a small library (qrcode) or canvas API
12. **Token Counter** — count tokens for GPT/Claude prompts (tiktoken-like)
13. **Text Diff** — compare any two texts, not just JSON

### Tier 3 — Nice to Have
14. **SQL Formatter** — needs SQL parser library
15. **Markdown Preview** — needs markdown parser
16. **HTML/CSS/JS Minify/Beautify** — needs prettier or similar
17. **cURL to Code** — parse cURL commands to fetch/axios code

## Implementation Plan

After adding Tier 1 (8 tools) we'll have **21 tools** — matching dev-tool.dev.
After adding Tier 2 (5 tools) we'll have **26 tools** — beating all except toolslab.
Tier 1 tools need NO external dependencies and can be implemented purely in TypeScript.

## SEO Keywords to Target with New Tools
- "cron expression parser online"
- "password generator online"
- "lorem ipsum generator"
- "hex to decimal converter"
- "camelcase to snake_case converter"
- "html entity decoder online"
- "query string to json"
- "csv to json converter online"
- "json to typescript converter"
- "qr code generator free"
- "ai token counter"
