# OpenGraph Preview

A deployable Next.js application for inspecting Open Graph metadata, simulating social share cards, validating OG image URLs, parsing pasted HTML locally and generating copy-ready meta tags.

**Production origin:** `https://ogpreview.epsingh.in`  
**Product name:** OpenGraph Preview  
**Developer:** Ekansh Singh · [epsingh.in](https://epsingh.in)  
**Product engineering:** [DevArea](https://devareayt.in)

## Features included

- Public URL inspector with status code, redirects, response type and metadata extraction.
- Open Graph properties, standard SEO metadata and Twitter Card extraction.
- Image URL validation and same-origin image preview proxy: HTTP status, MIME type, decoded image dimensions, format and byte size. Preview images are fetched through the SSRF-guarded server route rather than loaded directly from arbitrary origins in the visitor browser.
- Separate errors, warnings and informational diagnostics (no invented optimization score).
- Simulated card layouts for Facebook, X, LinkedIn, WhatsApp, Discord and Slack.
- Local HTML parsing mode for localhost, pre-launch HTML and authorized staging source. The pasted HTML is parsed in the browser and is not sent to the inspection API.
- Editable title, description, image, canonical URL, image alt text and object type.
- Copyable HTML for standard description, canonical URL, Open Graph and Twitter Card tags.
- Responsive UI, keyboard-friendly controls, PWA manifest, offline fallback and service worker.
- Static blog pages grouped into tool guides, SEO/problem-solving guides and educational explainers.
- Developer/about/contact/legal pages, canonical metadata, sitemap, robots rules, WebApplication, Article and FAQ structured data.
- SSRF-focused URL checks: HTTP/HTTPS only, standard ports, private/reserved IP blocking, DNS pinning, bounded redirects, timeouts and response-size limits.
- Distributed rate limiting through Upstash Redis is required in production; local in-memory fallback is enabled only during development.

## Local development

Requirements: Node.js 20.9+ (Node 22 LTS recommended) and npm.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run typecheck
npm test
npm run build
npm run start
```

## Deploy to Vercel

1. Push this directory to a GitHub repository.
2. Import the repository into Vercel as a Next.js project.
3. Add `NEXT_PUBLIC_SITE_URL=https://ogpreview.epsingh.in`.
4. Configure Upstash Redis and add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` before opening URL inspection or image preview to the public. Production API routes fail closed without distributed rate limiting; the in-memory fallback is development-only.
5. Deploy and test `/`, `/api/inspect`, `/api/image-check`, `/api/image-preview?url=...`, `/sitemap.xml`, `/robots.txt` and `/manifest.webmanifest`.
6. In Hostinger DNS, add a CNAME record for `ogpreview` pointing to the Vercel target shown in your Vercel project. Add the domain in Vercel and wait for SSL provisioning.
7. Verify the canonical host and sitemap in Google Search Console. Submit `https://ogpreview.epsingh.in/sitemap.xml` after the site is crawlable.

## Required production hardening

This source is deployable, but public URL-fetching services need operational controls beyond application code:

- Configure a distributed rate limiter (Upstash is supported) and Vercel Firewall/Cloudflare edge rate limits.
- Set sensible platform spending limits and monitor API errors/latency.
- Test SSRF controls against private IPv4, IPv6, DNS rebinding, redirect chains, unusual encodings and oversized responses before launch.
- Add uptime monitoring and an abuse contact procedure.
- Review the privacy and terms pages for the actual hosting, logging, analytics and cookie configuration before launch.
- If adding Google Analytics, AdSense or another third-party tracker, update the privacy/cookie disclosure and consent flow as legally appropriate.

## Technical boundaries

- URL inspection fetches the publicly served HTML response; it does not run the target site's JavaScript. Client-side-only metadata may not be visible.
- HTML paste parsing happens locally in the visitor's browser. It does not establish that a crawler sees the same HTML in production.
- Previews are visual simulations, not official platform renderings. Card layouts, image crops, cache rules and parser behaviour vary by platform and device.
- The tool does not clear Facebook, LinkedIn, X, WhatsApp or other third-party caches.
- Open Graph metadata is for sharing previews and does not guarantee Google rankings, indexing, AI Overview citations, traffic or revenue.
- The optional image checker only confirms what this server could fetch and decode at inspection time. Access can differ for other crawler networks.

## Content architecture

| Type | Purpose | Current examples |
|---|---|---|
| Tool guides | Help visitors complete a task or recover from an error | How to use the checker; inspect pasted HTML |
| SEO/problem guides | Target specific problems and connect them to the tool | OG image not showing; OG image size; Next.js metadata; online checker checklist |
| Educational guides | Explain the protocol and crawler behaviour | What is Open Graph; OG vs Twitter Cards; how crawlers fetch and cache previews |

Each article has a distinct search intent, descriptive metadata, internal links to the tool, FAQ content and citations to primary documentation. Review the publication date and test all code against the current framework versions before refreshing an article.

## SEO launch checklist

- [ ] Verify domain, HTTPS and canonical URLs.
- [ ] Confirm each page returns the correct title, description and canonical URL.
- [ ] Test sitemap and robots endpoints.
- [ ] Validate structured data with Google's Rich Results Test / Schema Markup Validator (not all schema types create rich results).
- [ ] Test mobile layout, keyboard navigation and image loading.
- [ ] Run Lighthouse and real-device checks; fix any regressions before public launch.
- [ ] Add the property to Google Search Console and submit the sitemap.
- [ ] Verify the site in Bing Webmaster Tools.
- [ ] Publish original screenshots and first-hand examples in tutorials.
- [ ] Share the tool with relevant developer communities without spam or fake reviews.
- [ ] Track impressions, clicks and queries in Search Console; update pages based on actual data.

## Ranking and traffic expectations

A Top-5 ranking within 30 days and 10,000 visitors are goals, not outcomes this code can guarantee. They depend on query demand, competition, site/domain signals, crawl/index timing, backlinks/mentions, product quality and promotion. Do not use purchased links, mass-produced pages or misleading claims to chase a deadline.
