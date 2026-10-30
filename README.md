# OpenGraph Preview

**A free Open Graph preview, checker and metadata toolkit.**

OpenGraph Preview helps website owners, developers, creators and marketers inspect the metadata a page actually serves, preview how a link may look when shared, diagnose image and tag issues, and generate corrected HTML metadata.

- **Product:** OpenGraph Preview
- **Live URL:** [https://ogpreview.epsingh.in](https://ogpreview.epsingh.in)
- **Main search intent:** Open Graph Preview · OG Preview · Open Graph Checker
- **Developer:** Ekansh Singh (EPSingh) · [epsingh.in](https://epsingh.in)
- **Product engineering:** [DevArea](https://devareayt.in)
- **Developer page:** [ogpreview.epsingh.in/developer](https://ogpreview.epsingh.in/developer/)

> The product is designed to be useful without an account. The current MVP does not include user accounts, saved scan history, paid plans or advertising.

---

## What the tool does

OpenGraph Preview combines four workflows in one workspace:

1. **Inspect a public URL** – fetch the public HTML response and extract Open Graph, standard SEO and Twitter Card metadata.
2. **Paste HTML** – parse source locally in the browser. This is useful for localhost, private staging pages, authenticated pages and pre-launch drafts that the public inspection server cannot access.
3. **Create or edit a preview** – enter metadata manually or change extracted values and see the social-card simulation update.
4. **Validate and generate** – check the referenced image and copy an HTML block containing standard description, canonical, Open Graph and Twitter Card tags.

### Main features

- Public HTTP/HTTPS URL inspection, including response status, content type, response size, final URL and redirect information.
- Extraction of `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`, `og:image`, image alt text and related image properties.
- Standard SEO metadata extraction, including the page title, meta description and canonical URL.
- Twitter Card metadata extraction and fallback checks.
- OG image validation for reachability, response type, image format, dimensions, aspect ratio and file size.
- Same-origin image proxy for displaying social-card images without asking the visitor's browser to load arbitrary third-party image URLs directly.
- Separate diagnostic groups for **errors**, **warnings** and **informational findings**. The product deliberately avoids inventing an unexplained optimization score.
- Simulated social-card layouts for Facebook, X, LinkedIn, WhatsApp, Discord and Slack.
- Editable title, description, image URL, `og:url`, canonical URL, image alt text and OG type.
- Copy-ready HTML metadata generation.
- Responsive interface, installable PWA manifest, app icons, service-worker registration and an offline fallback page.
- Tool guides, SEO/problem-solving articles and educational developer explainers.
- About, developer, contact, privacy and terms pages.

## What makes it different

The goal is not to show a card mockup and leave the user to guess what went wrong. The workflow is built around **inspect → understand → fix → verify**.

- It shows the values extracted from the page instead of hiding them behind a score.
- It distinguishes a missing tag from an inaccessible image or a non-ideal image dimension.
- It explains errors and warnings in practical terms.
- It supports pasted HTML for pages that cannot be reached by a public URL checker.
- It lets users edit metadata and generate implementation-ready tags without leaving the result screen.
- It clearly labels social cards as simulations instead of claiming to reproduce the exact output or cache of each platform.

## Technology stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React and Tailwind CSS |
| HTML parsing | Cheerio |
| Image inspection | Sharp |
| Validation | Zod |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` |
| Hosting target | Vercel |
| PWA | Web app manifest + service worker |
| Tests | Vitest |

There is **no separate Flask, FastAPI, Express or VPS backend**. The application is a single Next.js project. Its Route Handlers provide the server-side functionality and are deployed by Vercel as serverless functions. Upstash Redis is an external supporting service used for distributed rate limiting; it is not the main application backend or a user database.

## Run locally

### Requirements

- Node.js **20.9 or newer** (Node.js 22 LTS is recommended).
- npm.
- An Upstash Redis database for production-like API testing. Local development can use the in-memory rate-limit fallback when Upstash credentials are absent.

### Install

```bash
npm install
```

Create a local environment file:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux**

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Next.js development server. |
| `npm run typecheck` | Run TypeScript checks without emitting files. |
| `npm test` | Run the Vitest test suite. |
| `npm run build` | Create the production build. |
| `npm run start` | Start the compiled production application locally. |

Before deployment, run:

```bash
npm run typecheck
npm test
npm run build
```

## Environment variables

The example file is `.env.example`.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes for production | Canonical site origin. Set to `https://ogpreview.epsingh.in`. |
| `UPSTASH_REDIS_REST_URL` | Yes for production | Upstash Redis REST endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | Yes for production | Secret Upstash Redis REST token. Keep it private. |

Example `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://ogpreview.epsingh.in
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_secret_token
```

Do not add real credentials to Git, screenshots, public issues or client-side variables. In particular, **never** prefix the Redis token with `NEXT_PUBLIC_`.

### Upstash rate limiting

The current configuration in `lib/rate-limit.ts` uses a sliding-window policy of **20 requests per 10 minutes per client key and action namespace**. URL inspection, image checking and image preview use separate keys.

- Upstash is used so all Vercel function instances can share the same counters.
- The `@upstash/ratelimit` sliding-window implementation manages the counter expiry (TTL) in Redis. No manual TTL setting is required in the Upstash dashboard.
- The local in-memory fallback is for development only.
- Production API routes fail closed when the Upstash credentials are missing or the rate-limit service is unavailable.
- Adjust the request limit and window in `lib/rate-limit.ts` only after reviewing real usage and abuse patterns.

For deployment near the configured Vercel region, choose an Upstash region close to Mumbai when available. Read replicas are not required for this MVP. Keep eviction disabled; expired rate-limit keys are handled by their TTL.

## API routes

These are application Route Handlers used by the UI, not a promise of a stable public API contract.

| Route | Method | Purpose |
|---|---|---|
| `/api/inspect` | `POST` | Inspect a public page URL and return extracted metadata, image findings and diagnostics. |
| `/api/image-check` | `POST` | Validate a public image URL and return image inspection details. |
| `/api/image-preview?url=...` | `GET` | Fetch and serve an allowed image through the same-origin preview route. |

The URL inspection endpoint reads the HTML response sent by the remote server. It does not run the target website's browser-side JavaScript.

## Deploy to Vercel

1. Push the contents of this project directory to a Git repository.
2. In Vercel, import that repository as a **Next.js** project. Ensure the project root is the directory containing `package.json`.
3. Add these environment variables in **Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL=https://ogpreview.epsingh.in`
   - `UPSTASH_REDIS_REST_URL=...`
   - `UPSTASH_REDIS_REST_TOKEN=...`
4. Add the variables to the Production environment (and Preview if you want preview deployments to run the protected API routes).
5. Deploy and review the build and function logs.
6. Add `ogpreview.epsingh.in` under **Project → Settings → Domains** in Vercel.
7. In Hostinger DNS, create the record Vercel requests for the `ogpreview` subdomain. Use the exact target displayed by Vercel rather than assuming a destination.
8. Wait for DNS verification and Vercel SSL provisioning, then test the custom domain over HTTPS.

The repository's `vercel.json` targets the Mumbai (`bom1`) function region. If you change regions, review the latency to your Upstash Redis region as well.

### Post-deployment smoke test

- [ ] Homepage loads over HTTPS at `https://ogpreview.epsingh.in/`.
- [ ] Public URL inspection succeeds for a normal public HTML page.
- [ ] Invalid URLs and private-network targets are rejected.
- [ ] Pasted HTML mode works without calling the URL inspection endpoint.
- [ ] The image checker reports the actual status and image properties.
- [ ] Social preview images load through `/api/image-preview`.
- [ ] Metadata editing and generated HTML work.
- [ ] `/sitemap.xml` and `/robots.txt` load.
- [ ] `/manifest.webmanifest` loads and the PWA can be installed in a supported browser.
- [ ] About, Developer, Contact, Privacy, Terms and blog pages load.
- [ ] Google Search Console verifies the domain and accepts the sitemap.

## SEO, AEO and GEO strategy

The product name is **OpenGraph Preview**. The canonical domain is `ogpreview.epsingh.in`. The main page targets the broad product intent, while guides answer more specific questions and link readers back to the tool.

### Keyword targeting

The keyword themes below are based on the real Google autocomplete and “People also search for” phrases supplied for this project. They indicate search intent, **not verified monthly search volumes or ranking difficulty**.

**Primary homepage terms**

- Open Graph Preview
- OG Preview
- Open Graph Checker

**Secondary tool-intent terms**

- OG Preview Online
- Open Graph Checker Online
- Open Graph Checker Online Free
- OG Image Checker
- Open Graph Tester
- Open Graph Viewer
- Open Graph Debugger
- Open Graph Generator
- OG Tag Generator
- OG Image Preview

**Problem and developer queries**

- OG image not showing
- Open Graph image size
- Open Graph tags in Next.js
- OG Preview HTML
- OG Preview Python
- Localhost Open Graph Checker
- How to check Open Graph tags
- How to fix a broken social link preview

Use these terms naturally in page titles, meta descriptions, H1/H2 headings, explanatory paragraphs, FAQs, article titles, internal links and relevant image alt text. Do not repeat every keyword in every paragraph or create near-duplicate landing pages just to target slight variations.

The search phrase **“Open Graph Checker extension”** is an observed query, but this product is currently a web app, not a browser extension. Do not describe it as an extension or promise extension functionality unless a real extension is built.

### Content strategy: three blog types

The blog has three distinct content purposes. Each article has its own slug, metadata, main keyword, related terms, FAQs and internal link to the tool where useful.

#### 1. Tool guides — help users complete a task

These articles explain how to use a feature and solve problems while a visitor is using the product.

- [How to Use OpenGraph Preview to Check Any Website](/blog/how-to-use-open-graph-preview/)
- [How to Check Open Graph Tags from HTML Without Publishing a Page](/blog/inspect-open-graph-tags-from-html/)

#### 2. SEO/problem-solving guides — reach users searching for a solution

These articles target specific Open Graph questions, explain the cause and guide readers to inspect or fix their own page with the tool.

- [OG Image Not Showing on WhatsApp, Facebook or LinkedIn? How to Fix It](/blog/fix-og-image-not-showing/)
- [Open Graph Image Size: Dimensions, Aspect Ratio and File Checks](/blog/open-graph-image-size-guide/)
- [How to Add Open Graph Tags in Next.js App Router](/blog/open-graph-tags-nextjs/)
- [Open Graph Checker Online: 12 Checks a Useful Validator Should Run](/blog/open-graph-checker-online-what-to-test/)

#### 3. Educational guides — build understanding and topical coverage

These articles serve developers and non-developers who want to understand Open Graph, social crawlers and implementation choices.

- [Open Graph Preview with Python: Extract OG Tags Using BeautifulSoup](/blog/open-graph-preview-python/)
- [What Is Open Graph? A Practical Guide to OG Meta Tags](/blog/what-is-open-graph-protocol/)
- [Open Graph vs Twitter Cards: Which Meta Tags Should You Add?](/blog/open-graph-vs-twitter-cards/)
- [How Social Media Crawlers Read Open Graph Metadata and Cache Link Previews](/blog/how-social-crawlers-read-metadata/)

### AEO/GEO publishing principles

- Answer the core question near the beginning of each page in clear, direct language.
- Use descriptive headings, short definitions, practical steps, examples and relevant FAQs.
- Identify the author/developer and link to the developer profile.
- Cite primary technical documentation when explaining platform or framework behaviour.
- Use structured data only when it accurately describes visible page content. The project includes WebApplication, Article, FAQ and ProfilePage data where appropriate; structured data does not guarantee a rich result or AI citation.
- Keep canonical URLs, sitemap entries, internal links and article metadata consistent.
- Update guides when platform behaviour or framework APIs change.
- Avoid mass-produced near-duplicate pages, fake reviews, keyword stuffing and unsupported performance claims.

The site is structured to be understandable to search engines and answer engines, but **no markup or content format can guarantee Google rankings, AI Overview inclusion, citations or traffic**.

## Sitemap and important pages

The sitemap is generated by `app/sitemap.ts` and includes the homepage, product information pages and all blog articles.

- `/` – main Open Graph preview tool.
- `/about/` – product purpose and limitations.
- `/developer/` – Ekansh Singh (EPSingh) and DevArea attribution.
- `/contact/` – contact page.
- `/privacy/` – privacy information.
- `/terms/` – terms of use.
- `/blog/` – all articles.
- `/blog/[slug]/` – individual articles.
- `/sitemap.xml` – generated XML sitemap.
- `/robots.txt` – crawler instructions and sitemap reference.

`/tools/open-graph-preview/` is an alias that permanently redirects to the homepage; it is not intended to be indexed as a duplicate tool page.

## Security and responsible use

Because a URL checker fetches URLs on behalf of visitors, the fetch layer is a security-critical part of the product.

The current implementation includes controls such as:

- Only HTTP and HTTPS URLs on standard ports are accepted.
- Embedded URL credentials, localhost, `.localhost` and `.local` hosts are rejected.
- DNS results are checked against private and reserved address ranges before connecting.
- Requests are pinned to validated DNS answers to reduce DNS-rebinding risk.
- Redirect destinations are revalidated and redirect counts are bounded.
- Requests have timeouts and response-size limits.
- Image previews are fetched through the server-side same-origin route and restricted to supported raster image formats.
- API request bodies are size-limited and validated.
- Distributed rate limiting is required in production.

These controls reduce risk but do not replace security review, monitoring, abuse handling and platform-level protection. Before a public launch, test private IPv4/IPv6 targets, DNS rebinding, redirect chains, oversized responses, unusual content encodings and malformed image files. Keep dependencies updated and monitor Vercel function logs and usage.

## Known limitations

- URL inspection checks the HTML response fetched by this application. It does not execute the target website's JavaScript, so metadata inserted only after client-side rendering may not be detected.
- Paste HTML mode parses only the markup provided by the user in their browser. It cannot prove that the production server or a social crawler receives the same HTML.
- A social preview is a **visual simulation**, not an official rendering from Facebook, X, LinkedIn, WhatsApp, Discord or Slack. Actual cards can differ by platform, app version, device, image crop and cached metadata.
- The application cannot clear third-party social platform caches. Use the official platform inspection/debugging tools when a platform-side re-scrape is required.
- A successful image check only describes what this server could fetch and decode at the time of checking. A platform crawler may have different network access or cache state.
- Open Graph metadata primarily controls link-sharing previews. It does not by itself guarantee Google rankings, indexing, AI Overview citations, traffic or revenue.
- The current MVP does not provide accounts, saved scan history, bulk monitoring, scheduled alerts, payments or a public developer API.

## Project structure

```text
opengraph-preview/
├── app/
│   ├── api/
│   │   ├── inspect/              # Public page inspection API
│   │   ├── image-check/          # OG image validation API
│   │   └── image-preview/        # Same-origin image proxy
│   ├── blog/                     # Blog index and article routes
│   ├── developer/                # Developer attribution page
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── privacy/                  # Privacy page
│   ├── terms/                    # Terms page
│   ├── sitemap.ts                # Generated sitemap
│   ├── robots.ts                 # Robots policy
│   └── page.tsx                  # Main tool and landing page
├── components/                   # UI, tool and service worker components
├── lib/
│   ├── blogs.ts                  # Blog content and metadata
│   ├── og.ts                     # Open Graph parsing and diagnostics
│   ├── rate-limit.ts             # Upstash rate limiting
│   ├── safe-fetch.ts             # SSRF-aware HTTP fetch layer
│   ├── request-body.ts            # Request body size handling
│   └── site.ts                   # Brand and canonical site settings
├── public/                       # PWA assets, icons and offline page
├── tests/                        # Automated tests
├── .env.example                  # Environment variable template
├── package.json
├── vercel.json
└── README.md
```

## Developer and attribution

OpenGraph Preview is created by **Ekansh Singh (EPSingh)**.

- Personal/developer website: [https://epsingh.in](https://epsingh.in)
- Product engineering and web development: [https://devareayt.in](https://devareayt.in)
- Product developer page: [https://ogpreview.epsingh.in/developer/](https://ogpreview.epsingh.in/developer/)

For product feedback or corrections, use the contact page on the live website.

## Launch and growth expectations

The initial growth goal is to earn visibility for the supplied Open Graph search queries, attract relevant developers and website owners, and turn the tool into a useful destination supported by practical guides.

A Top-5 ranking within 30 days and 10,000 visitors are **aspirational targets, not guaranteed outcomes**. Ranking and traffic depend on query demand, competition, crawl and indexing timing, product quality, external mentions, links, distribution and user behaviour. Measure progress in Google Search Console and analytics only after configuring them, and make privacy disclosures match the services actually enabled.

---

**Built to help people inspect, understand and fix Open Graph metadata — not just preview a card.**
