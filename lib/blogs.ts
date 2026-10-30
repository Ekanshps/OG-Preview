export type Block =
  | { type: "p"; text: string }
  | { type: "h2" | "h3"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "code"; text: string; language?: string }
  | { type: "callout"; text: string }
  | { type: "tool"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: "Tool guide" | "SEO guide" | "Education";
  date: string;
  readTime: string;
  primaryKeyword: string;
  keywords: string[];
  intro: string;
  blocks: Block[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
};

export const blogs: BlogPost[] = [
  {
    slug: "how-to-use-open-graph-preview",
    title: "How to Use OpenGraph Preview to Check Any Website",
    description: "Learn how to inspect a live URL, preview social cards, read OG tags and understand the diagnostic results with OpenGraph Preview.",
    category: "Tool guide", date: "2026-10-30", readTime: "5 min read",
    primaryKeyword: "how to use Open Graph preview",
    keywords: ["Open Graph preview tool", "check OG tags", "social media preview checker"],
    intro: "A practical walkthrough for checking a published page before you share it. This guide explains each step in OpenGraph Preview and what to do when a check finds a problem.",
    blocks: [
      { type: "p", text: "OpenGraph Preview checks the HTML that a public website returns to a crawler. It extracts the page title, description, canonical URL, Open Graph properties and Twitter Card values, then turns those values into editable social-card simulations. You do not need an account, browser extension or code editor to run a basic check." },
      { type: "h2", text: "1. Enter the full page URL" },
      { type: "p", text: "Open the tool and paste the exact page address, including https://. Check the page you intend to share—not only the homepage. Blog posts, product pages and campaign landing pages can each have different metadata." },
      { type: "callout", text: "Use a publicly accessible URL. A remote checker cannot see a development machine's localhost, private staging environment or page hidden behind a login. Use the Paste HTML mode for source you can access locally." },
      { type: "h2", text: "2. Run the inspection" },
      { type: "p", text: "Choose Inspect URL. The server makes a bounded request, follows a small number of safe redirects and parses the returned HTML. The report includes the final response URL and HTTP status so you can spot redirects or unavailable pages." },
      { type: "h2", text: "3. Read the social preview" },
      { type: "p", text: "Choose Facebook, X, LinkedIn, WhatsApp, Discord or Slack to see a layout simulation. The preview uses the extracted title, description and image. It is a design approximation, not a screenshot from the social network: each platform may crop, truncate, cache or render cards differently." },
      { type: "h2", text: "4. Review diagnostics" },
      { type: "ul", items: ["Errors identify missing required Open Graph properties or a page/image fetch failure.", "Warnings highlight issues such as missing image alt text, non-ideal image dimensions or mismatched canonical URLs.", "Information notes explain optional tags and implementation details that may be useful but are not necessarily errors."] },
      { type: "h2", text: "5. Edit and generate corrected tags" },
      { type: "p", text: "Use the editor to test a better title, description or image URL. The social preview updates as you type. When the result looks right, copy the generated HTML block into the page's document head, deploy the change, and inspect the live URL again." },
      { type: "h2", text: "What if the tool cannot fetch my URL?" },
      { type: "ol", items: ["Confirm the page is public and returns a successful HTTP response in a normal browser.", "Check that the server does not block automated crawlers or require cookies to return the page HTML.", "Check redirects, TLS certificates and firewall rules.", "For a local or authenticated page, use Paste HTML mode and inspect the source available to you."] },
      { type: "tool", text: "Ready to check a page? Run a free Open Graph inspection, compare the platform previews and copy corrected tags." },
    ],
    faqs: [
      { question: "Does OpenGraph Preview publish or change my website?", answer: "No. The checker reads a public page and the editor creates suggested metadata. You decide whether to copy and deploy those changes." },
      { question: "Are social previews exact copies of Facebook or WhatsApp?", answer: "No. They are visual simulations based on the metadata we extract. Actual cards can vary by platform, app version, cache and device." },
      { question: "Can I check localhost?", answer: "A remote URL scan cannot access your computer's localhost. Paste the HTML source into the local HTML inspection mode instead." },
    ],
    sources: [{ label: "Open Graph protocol", url: "https://ogp.me/" }],
  },
  {
    slug: "inspect-open-graph-tags-from-html",
    title: "How to Check Open Graph Tags from HTML Without Publishing a Page",
    description: "Use the HTML inspection mode to test Open Graph tags for localhost, staging pages, private drafts and pages that are not public yet.",
    category: "Tool guide", date: "2026-10-30", readTime: "4 min read",
    primaryKeyword: "Open Graph checker HTML",
    keywords: ["OG preview HTML", "localhost Open Graph checker", "inspect meta tags from HTML"],
    intro: "A remote crawler cannot access your localhost or private development server. Pasting the HTML source is a safer way to validate metadata before launch.",
    blocks: [
      { type: "p", text: "A URL-based Open Graph checker fetches your website from its own server. If the page is only available on your laptop, requires authentication or sits behind a staging firewall, that server cannot inspect it. HTML mode solves a different problem: it parses markup that you provide directly in your browser." },
      { type: "h2", text: "Where to get the HTML" },
      { type: "ul", items: ["For a local page, open it in your browser and use View Page Source, then copy the document HTML.", "For Next.js, inspect the rendered page source after the route has generated metadata. Do not rely only on metadata you expect the client to add later.", "For a staging environment, use the response HTML from your own authorized browser or development workflow."] },
      { type: "h2", text: "Paste and inspect" },
      { type: "p", text: "Open OpenGraph Preview, choose Paste HTML and insert the source. The parser reads meta elements by their property or name attributes, including og:title, og:description, og:image, og:url, twitter:card and the standard description tag. The HTML stays in the browser and is not sent to the inspection API." },
      { type: "h2", text: "Understand what HTML mode can and cannot prove" },
      { type: "p", text: "HTML inspection can confirm that tags exist in the snippet you pasted. It cannot prove that your server returns the same source to Facebook, LinkedIn or another crawler. It also cannot confirm that a remote image is reachable unless you run a separate image check from a public URL." },
      { type: "callout", text: "For a final pre-launch check, inspect the deployed public URL as well. That validates the response your site actually serves, rather than only the source you expected it to serve." },
      { type: "h2", text: "Common HTML inspection issues" },
      { type: "ul", items: ["The tags are placed in the body instead of the document head.", "The page has multiple og:title or og:image tags with conflicting values.", "The image URL is relative and has no reliable base URL.", "The framework only adds tags after client-side JavaScript runs.", "The pasted source is incomplete and does not include the head section."] },
      { type: "tool", text: "Have source HTML ready? Paste it into the HTML inspection mode to extract tags and preview the share card." },
    ],
    faqs: [
      { question: "Does HTML mode upload my source?", answer: "No. HTML extraction runs locally in the browser. The URL inspection feature is separate and sends a public URL to the server-side checker." },
      { question: "Can I inspect a private localhost URL directly?", answer: "Not through the public URL scanner. Paste the page source or use a local browser extension in a future workflow." },
      { question: "Does pasted HTML confirm that a crawler sees the same tags?", answer: "No. Only a live inspection of the deployed response can verify what the remote server returns." },
    ],
    sources: [{ label: "Open Graph protocol", url: "https://ogp.me/" }, { label: "Next.js metadata API", url: "https://nextjs.org/docs/app/getting-started/metadata-and-og-images" }],
  },
  {
    slug: "fix-og-image-not-showing",
    title: "OG Image Not Showing on WhatsApp, Facebook or LinkedIn? How to Fix It",
    description: "Troubleshoot a missing Open Graph image with checks for URL accessibility, image format, dimensions, redirects, metadata and social cache.",
    category: "SEO guide", date: "2026-10-30", readTime: "8 min read",
    primaryKeyword: "OG image not showing",
    keywords: ["Open Graph image not showing", "WhatsApp link preview image missing", "Facebook OG image not working", "og:image not loading"],
    intro: "When a shared link shows the wrong thumbnail—or no image at all—the cause is often a fetch, metadata or cache issue. Work through these checks in order instead of randomly changing tags.",
    blocks: [
      { type: "p", text: "An og:image tag is only a pointer. A social crawler still needs to fetch the page, read the tag, request the image URL and decide whether that image is suitable for its card. A tag can exist and still fail if the image is private, broken, blocked, too large or returned with an unexpected content type." },
      { type: "h2", text: "1. Confirm the og:image URL is absolute" },
      { type: "p", text: "Use a fully qualified HTTPS URL, such as https://example.com/images/share-card.jpg. A relative path like /images/share-card.jpg may not be interpreted consistently by external crawlers." },
      { type: "h2", text: "2. Open the image URL directly" },
      { type: "p", text: "Paste the image URL into a private browser window. It should return the image without requiring a login, cookies, a temporary signature or a referrer header. Check that the response is successful and has an image content type." },
      { type: "h2", text: "3. Check dimensions and aspect ratio" },
      { type: "p", text: "A 1200 × 630 image (about 1.91:1) is a widely used starting point for large social preview images. It is a practical recommendation, not a universal guarantee: platform layouts, file limits and supported formats can change. Keep important text away from the outer edges because some card layouts crop differently." },
      { type: "h2", text: "4. Check robots, firewall and server behaviour" },
      { type: "ul", items: ["Make sure your CDN or firewall does not block social crawlers.", "Avoid hotlink protection that rejects requests without a browser-like referrer.", "Check that image requests do not redirect to a login page or HTML error document.", "Ensure the origin responds quickly and does not intermittently return 5xx errors."] },
      { type: "h2", text: "5. Put the main image metadata early" },
      { type: "p", text: "Place the Open Graph properties in the document head in the server-rendered HTML. Add og:image:alt to describe the image. Include og:image:width and og:image:height when you know the real dimensions; do not invent dimensions." },
      { type: "code", language: "html", text: "<meta property=\"og:title\" content=\"A useful page title\" />\n<meta property=\"og:description\" content=\"A concise page summary.\" />\n<meta property=\"og:type\" content=\"website\" />\n<meta property=\"og:url\" content=\"https://example.com/page\" />\n<meta property=\"og:image\" content=\"https://example.com/images/share-card.jpg\" />\n<meta property=\"og:image:alt\" content=\"Description of the share card\" />\n<meta name=\"twitter:card\" content=\"summary_large_image\" />" },
      { type: "h2", text: "6. Refresh the platform cache" },
      { type: "p", text: "Social networks and messaging apps may cache metadata. After deploying a fix, use the relevant platform's official debugger or inspector where available to request a fresh scrape. A correct page response does not guarantee every existing message updates immediately." },
      { type: "h2", text: "A quick troubleshooting order" },
      { type: "ol", items: ["Run an Open Graph URL inspection.", "Confirm the page returns the expected og:image value.", "Check the image URL's HTTP status, content type and dimensions.", "Check CDN/firewall access for crawlers.", "Deploy the correction and refresh the platform cache."] },
      { type: "tool", text: "Use the OG image checker to test the page and identify metadata or image-fetch problems." },
    ],
    faqs: [
      { question: "Why does WhatsApp show an old OG image?", answer: "The app or its preview service may have cached the previous card. Correct the metadata and image first, then allow the platform's cache to refresh; behaviour can vary." },
      { question: "Is 1200 × 630 mandatory?", answer: "No. It is a commonly recommended 1.91:1 share-image size, but platform-specific limits and rendering behaviour vary." },
      { question: "Can og:image exist but still not display?", answer: "Yes. The URL can return an error, be blocked, require cookies, return HTML instead of an image, or be incompatible with a platform's constraints." },
    ],
    sources: [{ label: "Open Graph protocol image properties", url: "https://ogp.me/" }, { label: "Meta Sharing Debugger", url: "https://developers.facebook.com/tools/debug/" }],
  },
  {
    slug: "open-graph-image-size-guide",
    title: "Open Graph Image Size: Dimensions, Aspect Ratio and File Checks",
    description: "A practical Open Graph image size guide covering 1200×630 dimensions, 1.91:1 aspect ratio, image accessibility and validation.",
    category: "SEO guide", date: "2026-10-30", readTime: "7 min read",
    primaryKeyword: "Open Graph image size",
    keywords: ["OG image dimensions", "og:image size", "Open Graph image ratio", "1200x630 social preview"],
    intro: "Choose a share image that stays legible across large link cards. Understand why 1200 × 630 is a useful baseline and which technical details to verify before publishing.",
    blocks: [
      { type: "p", text: "A social share image should communicate the page at a glance. A very small image can look soft, a square image may be cropped in a wide card and a huge file can take too long for a crawler to retrieve. The right choice balances aspect ratio, visual composition, accessibility and delivery performance." },
      { type: "h2", text: "A practical starting point: 1200 × 630 pixels" },
      { type: "p", text: "1200 × 630 has an aspect ratio of approximately 1.91:1. It is a widely used baseline for Open Graph images and works well as a source canvas for many large link-card layouts. It is not a guarantee that every app will show the entire image or use identical dimensions." },
      { type: "h2", text: "Design for cropping" },
      { type: "ul", items: ["Keep the headline and logo near the visual centre.", "Leave breathing room around text and important faces or objects.", "Do not place critical details at the extreme edges.", "Check the card at desktop and narrow mobile widths.", "Use a high-contrast title and avoid tiny text that becomes unreadable in a thumbnail."] },
      { type: "h2", text: "Choose a sensible format and file weight" },
      { type: "p", text: "JPEG and PNG are broadly understood formats for social images. WebP and other formats may work in some environments, but support and transformation behaviour vary. When compatibility is critical, use a well-compressed JPEG or PNG and verify the exact response returned by your server." },
      { type: "h2", text: "Metadata that describes the image" },
      { type: "p", text: "The Open Graph protocol supports og:image:width, og:image:height, og:image:type and og:image:alt as structured image properties. Set width and height to the real pixel dimensions. Write alt text that describes the image rather than repeating the page title." },
      { type: "code", language: "html", text: "<meta property=\"og:image\" content=\"https://example.com/share.jpg\" />\n<meta property=\"og:image:width\" content=\"1200\" />\n<meta property=\"og:image:height\" content=\"630\" />\n<meta property=\"og:image:type\" content=\"image/jpeg\" />\n<meta property=\"og:image:alt\" content=\"Product dashboard showing campaign analytics\" />" },
      { type: "h2", text: "Checklist before publishing" },
      { type: "ol", items: ["The image URL is absolute and uses HTTPS.", "The image is publicly accessible without cookies.", "The response is an actual image, not an HTML error page.", "The aspect ratio is appropriate for a landscape card.", "The image is compressed without visible quality loss.", "The metadata reports the actual width, height and alt description."] },
      { type: "tool", text: "Check your current og:image URL and inspect the real image dimensions with OpenGraph Preview." },
    ],
    faqs: [
      { question: "What is the recommended Open Graph image size?", answer: "1200 × 630 pixels (about 1.91:1) is a widely used starting point for large social share cards. Always verify current platform requirements." },
      { question: "Should I use JPG or PNG for og:image?", answer: "Both are broadly supported. Choose based on the visual content and file size, then test the publicly served image URL." },
      { question: "Does og:image:width create or resize the image?", answer: "No. It describes the image's real dimensions; it does not transform the underlying file." },
    ],
    sources: [{ label: "Open Graph protocol", url: "https://ogp.me/" }],
  },
  {
    slug: "open-graph-tags-nextjs",
    title: "How to Add Open Graph Tags in Next.js App Router",
    description: "Implement page-specific Open Graph metadata in Next.js using the Metadata API, metadataBase, canonical URLs and generated OG images.",
    category: "SEO guide", date: "2026-10-30", readTime: "9 min read",
    primaryKeyword: "Open Graph Next.js",
    keywords: ["Next.js OG tags", "Next.js metadata API", "Next.js Open Graph image", "twitter card Next.js"],
    intro: "Use Next.js metadata support to output server-rendered Open Graph and Twitter Card tags for each route. This guide covers static metadata, dynamic pages and verification.",
    blocks: [
      { type: "p", text: "In the Next.js App Router, the Metadata API provides a structured way to define title, description, canonical URLs, Open Graph data and Twitter card metadata. Prefer this over manually appending tags in client-side effects: social crawlers generally need metadata in the HTML response they fetch." },
      { type: "h2", text: "1. Set a metadata base URL" },
      { type: "p", text: "Define metadataBase in the root layout so relative metadata image paths can be resolved consistently. Use the production origin, not localhost, and ensure each route has an appropriate canonical URL." },
      { type: "code", language: "tsx", text: "import type { Metadata } from 'next';\n\nexport const metadata: Metadata = {\n  metadataBase: new URL('https://example.com'),\n  title: { default: 'My Site', template: '%s | My Site' },\n  description: 'A concise description of the website.',\n  openGraph: {\n    siteName: 'My Site',\n    type: 'website',\n    images: [{\n      url: '/og/default.jpg',\n      width: 1200,\n      height: 630,\n      alt: 'My Site — default share image',\n    }],\n  },\n  twitter: { card: 'summary_large_image' },\n};" },
      { type: "h2", text: "2. Define metadata for each page" },
      { type: "p", text: "A global default is useful, but the metadata should reflect the individual page. For a blog article, set its title, description, canonical path, Open Graph type and article image in the route's metadata export or generateMetadata function." },
      { type: "code", language: "tsx", text: "import type { Metadata } from 'next';\n\nexport async function generateMetadata({\n  params,\n}: { params: Promise<{ slug: string }> }): Promise<Metadata> {\n  const { slug } = await params;\n  const post = await getPost(slug);\n\n  return {\n    title: post.title,\n    description: post.excerpt,\n    alternates: { canonical: `/blog/${slug}/` },\n    openGraph: {\n      title: post.title,\n      description: post.excerpt,\n      url: `/blog/${slug}/`,\n      type: 'article',\n      images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.imageAlt }],\n    },\n    twitter: { card: 'summary_large_image' },\n  };\n}" },
      { type: "h2", text: "3. Generate dynamic Open Graph images when useful" },
      { type: "p", text: "Next.js supports file-based metadata routes such as opengraph-image.tsx. This can generate a consistent image for each route using the page title and brand system. Keep rendering fast, avoid embedding sensitive information and test the final image URL from a public network." },
      { type: "h2", text: "4. Verify the HTML that production serves" },
      { type: "p", text: "After deployment, open View Page Source and check that the expected tags are present. Then run a URL inspection and compare title, description, canonical URL, og:image and twitter:card. A successful TypeScript build alone does not prove the crawler-facing HTML is correct." },
      { type: "callout", text: "Metadata is page-specific. Avoid reusing the same title, description and OG image across every route unless the pages genuinely represent the same content." },
      { type: "tool", text: "After deploying your Next.js route, inspect the live HTML and preview its social cards." },
    ],
    faqs: [
      { question: "Does Next.js render Open Graph tags on the server?", answer: "The App Router Metadata API generates metadata as part of the route response. Verify the deployed HTML source to confirm the output for your configuration." },
      { question: "Do I need Twitter tags if I already have OG tags?", answer: "X can use Open Graph fallback values in some cases, but explicitly setting twitter:card and relevant Twitter metadata provides clearer control." },
      { question: "Can every page have a different OG image?", answer: "Yes. Use route metadata or a dynamic opengraph-image route to create page-specific share images." },
    ],
    sources: [{ label: "Next.js Metadata API", url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata" }, { label: "Next.js Open Graph images", url: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image" }],
  },
  {
    slug: "open-graph-checker-online-what-to-test",
    title: "Open Graph Checker Online: 12 Checks a Useful Validator Should Run",
    description: "Learn what a proper Open Graph checker validates: required tags, duplicate metadata, canonical URLs, image accessibility, redirects and Twitter Cards.",
    category: "SEO guide", date: "2026-10-30", readTime: "8 min read",
    primaryKeyword: "Open Graph checker online",
    keywords: ["Open Graph validator", "OG checker online", "Open Graph test", "Open Graph debugger"],
    intro: "A useful OG checker should do more than find four tags. It should test the page response, image URL and metadata consistency, then explain which findings are actionable.",
    blocks: [
      { type: "p", text: "An Open Graph checker online fetches a page and extracts metadata that social platforms may use when creating link previews. Different tools vary: some only display tags, while others also validate image dimensions, detect duplicates, simulate card layouts or provide implementation advice." },
      { type: "h2", text: "The four core Open Graph properties" },
      { type: "p", text: "The protocol defines og:title, og:type, og:image and og:url as its basic required properties. A practical validator should report whether each appears and show the value it found. Other useful properties include og:description, og:site_name, og:locale and image sub-properties." },
      { type: "h2", text: "Twelve checks worth running" },
      { type: "ol", items: ["HTTP response status and final redirected URL.", "Page title and og:title presence.", "og:description and standard meta description.", "og:type value.", "og:url and canonical URL consistency.", "og:image presence and absolute URL.", "Image HTTP accessibility and response content type.", "Image width, height and aspect ratio.", "og:image:alt presence.", "Duplicate or conflicting OG properties.", "Twitter Card type and fallback metadata.", "Robots or access restrictions that may affect crawlers."] },
      { type: "h2", text: "Errors, warnings and information are not the same" },
      { type: "p", text: "A missing core property is different from an optional alt-text recommendation. An image fetch that returns 404 is different from an image with a non-ideal aspect ratio. A transparent report keeps these findings separate instead of collapsing everything into an unexplained score." },
      { type: "h2", text: "A preview is not a platform debugger" },
      { type: "p", text: "A simulated card helps you inspect layout and content, but it cannot guarantee how a platform will display the link. Platforms maintain their own crawlers, cache layers, parsing rules and client layouts. Use official platform inspectors when you need to refresh or verify a platform's own cache." },
      { type: "h2", text: "What to look for in a checker" },
      { type: "ul", items: ["It shows the raw tag values, not just a score.", "It tests whether the image URL can actually be fetched.", "It explains the consequences and gives a fix.", "It distinguishes a local preview from a real platform scrape.", "It makes no ranking or indexing guarantees based on OG tags."] },
      { type: "tool", text: "Run these checks on your page with OpenGraph Preview and use the generated HTML to correct missing tags." },
    ],
    faqs: [
      { question: "Does an Open Graph checker improve Google rankings?", answer: "A checker does not directly improve rankings. OG metadata is primarily for social/link previews; standard search titles, page content, performance and helpfulness need their own attention." },
      { question: "What are required Open Graph tags?", answer: "The protocol's four basic required properties are og:title, og:type, og:image and og:url." },
      { question: "Can an online tool reproduce Facebook's exact output?", answer: "No. It can simulate a card from extracted metadata, but only the platform controls its own crawler and final rendering." },
    ],
    sources: [{ label: "Open Graph protocol", url: "https://ogp.me/" }, { label: "Google Search Central: AI features and websites", url: "https://developers.google.com/search/docs/appearance/ai-features" }],
  },
  {
    slug: "open-graph-preview-python",
    title: "Open Graph Preview with Python: Extract OG Tags Using BeautifulSoup",
    description: "Learn how to build a small Open Graph preview in Python, extract og:title and og:image with BeautifulSoup, and inspect the result safely.",
    category: "Education", date: "2026-10-30", readTime: "8 min read",
    primaryKeyword: "OG preview Python",
    keywords: ["Open Graph preview Python", "Python Open Graph checker", "extract OG tags Python", "BeautifulSoup Open Graph"],
    intro: "A practical developer walkthrough for fetching a public HTML page, extracting Open Graph properties with Python and understanding why the returned source may differ from a social platform's final preview.",
    blocks: [
      { type: "p", text: "An OG preview Python script can help developers inspect the Open Graph properties returned by a webpage. The basic workflow is to request the public HTML, parse its head and read values such as og:title, og:description, og:image and og:url. This is useful for debugging, batch QA and learning how social metadata works." },
      { type: "h2", text: "Install the Python packages" },
      { type: "code", language: "bash", text: "python -m pip install requests beautifulsoup4" },
      { type: "h2", text: "Fetch a public page and extract its OG tags" },
      { type: "code", language: "python", text: String.raw`import requests
from bs4 import BeautifulSoup

OG_PROPERTIES = [
    "og:title",
    "og:description",
    "og:type",
    "og:url",
    "og:image",
]

def inspect_open_graph(url: str) -> dict[str, str]:
    response = requests.get(
        url,
        timeout=10,
        headers={"User-Agent": "Mozilla/5.0 (compatible; MetadataInspector/1.0)"},
    )
    response.raise_for_status()

    content_type = response.headers.get("Content-Type", "").lower()
    if "text/html" not in content_type and "application/xhtml+xml" not in content_type:
        raise ValueError(f"Expected HTML, received {content_type or 'unknown content type'}")

    soup = BeautifulSoup(response.text, "html.parser")
    result = {}
    for prop in OG_PROPERTIES:
        tag = soup.find("meta", attrs={"property": prop})
        result[prop] = tag.get("content", "").strip() if tag else ""
    return result

if __name__ == "__main__":
    page = "https://example.com/article"
    for key, value in inspect_open_graph(page).items():
        print(f"{key}: {value or 'Not found'}")` },
      { type: "h2", text: "What this script does not prove" },
      { type: "p", text: "The script reads the HTML response returned to the Python client. It does not execute JavaScript, reproduce a social platform's crawler, validate image dimensions or clear any social cache. A platform may send a different user agent, receive different HTML or apply its own image and card rules. For JavaScript-rendered pages, use an authorised browser automation workflow and compare its result with the server source." },
      { type: "h2", text: "Add basic checks before trusting the output" },
      { type: "ul", items: ["Confirm the HTTP status and response content type before parsing.", "Use a request timeout and impose a maximum response size for larger tools.", "Resolve relative image URLs against the page's final URL, then validate the image response separately.", "Check for duplicate OG properties instead of silently trusting the first value.", "If this script becomes a public service, block localhost, private/reserved IP addresses and unsafe redirects to prevent SSRF."] },
      { type: "h2", text: "Use an online OG preview when you need a visual check" },
      { type: "p", text: "A short Python script is useful for extraction, but it does not show a social card. OpenGraph Preview combines public URL inspection, local HTML parsing, image validation, six simulated card layouts and copy-ready tag generation in one browser workflow." },
      { type: "tool", text: "Run a free Open Graph check online, or paste HTML into OpenGraph Preview when you are testing a page that is not public yet." },
    ],
    faqs: [
      { question: "Can Python generate an Open Graph preview image?", answer: "Yes. Python image libraries can generate an OG image, while Requests and BeautifulSoup can inspect metadata. Image generation and metadata extraction are separate tasks." },
      { question: "Does BeautifulSoup run JavaScript?", answer: "No. It parses the HTML you provide. Use an authorised browser automation tool when you need to inspect the DOM after JavaScript execution." },
      { question: "Is it safe to expose a Python OG checker as a public API?", answer: "Not without controls. Validate URLs, block private and reserved IP ranges, re-check every redirect, pin safe DNS results, set request and response limits, and apply distributed rate limiting." },
    ],
    sources: [{ label: "Open Graph protocol", url: "https://ogp.me/" }, { label: "Beautiful Soup documentation", url: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/" }, { label: "Requests documentation", url: "https://requests.readthedocs.io/" }],
  },
  {
    slug: "what-is-open-graph-protocol",
    title: "What Is Open Graph? A Practical Guide to OG Meta Tags",
    description: "Understand the Open Graph protocol, how og:title and og:image work, and why metadata matters for social sharing previews.",
    category: "Education", date: "2026-10-30", readTime: "7 min read",
    primaryKeyword: "What is Open Graph",
    keywords: ["Open Graph protocol", "OG meta tags", "Open Graph metadata", "social sharing metadata"],
    intro: "Open Graph is a metadata protocol that helps a page describe itself when another service turns its URL into a rich preview.",
    blocks: [
      { type: "p", text: "When someone shares a webpage in a chat or social feed, the receiving app may fetch that URL and create a preview containing a title, description, image and site identity. Open Graph provides a common set of properties that publishers can place in the page's HTML head to describe that content." },
      { type: "h2", text: "The four basic properties" },
      { type: "ul", items: ["og:title: the title that should represent the shared object.", "og:type: the kind of object, such as website or article.", "og:image: the image URL that represents the content.", "og:url: the canonical URL used as the object's permanent identifier."] },
      { type: "h2", text: "Useful additional properties" },
      { type: "p", text: "Publishers commonly add og:description and og:site_name. Image metadata can include width, height, MIME type and alt text. The protocol also supports locale and media properties for richer content types." },
      { type: "code", language: "html", text: "<meta property=\"og:title\" content=\"A clear page title\" />\n<meta property=\"og:type\" content=\"website\" />\n<meta property=\"og:url\" content=\"https://example.com/page\" />\n<meta property=\"og:image\" content=\"https://example.com/share.jpg\" />\n<meta property=\"og:description\" content=\"A concise summary of the page.\" />\n<meta property=\"og:site_name\" content=\"Example\" />" },
      { type: "h2", text: "Open Graph and search SEO are related, but not interchangeable" },
      { type: "p", text: "Open Graph primarily describes content for sharing and rich link previews. Search engines use many other signals and page elements to understand and present a result. Adding OG tags does not guarantee indexing, rich results or higher rankings. A useful page still needs accessible content, relevant titles, internal links and a good user experience." },
      { type: "h2", text: "Open Graph and Twitter Cards" },
      { type: "p", text: "X supports its own twitter: metadata, including twitter:card. Some values can fall back to equivalent Open Graph fields, but explicit Twitter Card metadata makes the intended card type clear. Other services can interpret Open Graph values differently." },
      { type: "h2", text: "When should you test your tags?" },
      { type: "ul", items: ["After launching a new page or route.", "After changing the social image or page title.", "When links show missing or outdated previews.", "When moving a site, changing canonical URLs or changing a CDN."] },
      { type: "tool", text: "Inspect your page to see the OG properties returned in its live HTML and preview the resulting share card." },
    ],
    faqs: [
      { question: "What does OG stand for?", answer: "OG is short for Open Graph, a protocol for representing webpage content as objects in a social graph." },
      { question: "Where do Open Graph tags go?", answer: "They are HTML meta elements placed in the document head." },
      { question: "Are Open Graph tags a Google ranking factor?", answer: "They are primarily social sharing metadata and should not be treated as a direct Google ranking factor." },
    ],
    sources: [{ label: "The Open Graph protocol", url: "https://ogp.me/" }],
  },
  {
    slug: "open-graph-vs-twitter-cards",
    title: "Open Graph vs Twitter Cards: Which Meta Tags Should You Add?",
    description: "Compare Open Graph properties with Twitter Card metadata, learn about fallback behaviour and create consistent social previews.",
    category: "Education", date: "2026-10-30", readTime: "6 min read",
    primaryKeyword: "Open Graph vs Twitter Cards",
    keywords: ["Twitter Card tags", "twitter:card", "OG tags vs Twitter tags", "X social preview"],
    intro: "Open Graph and Twitter Cards solve related problems. They overlap, but using both carefully gives publishers more control over social sharing metadata.",
    blocks: [
      { type: "p", text: "Open Graph defines common properties such as og:title, og:description, og:image and og:url. Twitter Cards add metadata under the twitter: namespace, including twitter:card, twitter:title, twitter:description and twitter:image. X can use Open Graph values as fallbacks for some fields, but the card type remains important." },
      { type: "h2", text: "What each format controls" },
      { type: "ul", items: ["Open Graph: broadly used by many social networks, chat apps and link unfurlers.", "Twitter Card metadata: gives X-specific instructions, especially the card layout type.", "Standard SEO metadata: title and description tags remain separate from both social formats."] },
      { type: "h2", text: "A practical combined example" },
      { type: "code", language: "html", text: "<meta property=\"og:title\" content=\"A clear page title\" />\n<meta property=\"og:description\" content=\"A concise summary.\" />\n<meta property=\"og:image\" content=\"https://example.com/share.jpg\" />\n<meta property=\"og:url\" content=\"https://example.com/page\" />\n<meta name=\"twitter:card\" content=\"summary_large_image\" />\n<meta name=\"twitter:title\" content=\"A clear page title\" />\n<meta name=\"twitter:description\" content=\"A concise summary.\" />\n<meta name=\"twitter:image\" content=\"https://example.com/share.jpg\" />" },
      { type: "h2", text: "Avoid conflicting values" },
      { type: "p", text: "If the OG title says one thing and the Twitter title says something else, the result can differ by platform. That may be intentional, but it should be a deliberate editorial choice. Most sites should keep title, description and image consistent across both sets of tags." },
      { type: "h2", text: "How to test the result" },
      { type: "p", text: "Inspect the live HTML, confirm the correct twitter:card value, then review a simulated X card. For real platform behaviour, use available official inspection and cache-refresh tools. Do not rely on an unofficial or retired validator." },
      { type: "tool", text: "Check your Open Graph and Twitter metadata together, then preview the card layouts before publishing." },
    ],
    faqs: [
      { question: "Do I need Twitter Card tags if I have Open Graph?", answer: "The platform may use Open Graph fallbacks, but explicitly setting twitter:card and related metadata provides clearer control." },
      { question: "What does summary_large_image do?", answer: "It requests the large-image card type for X. Final display still depends on the platform's rules and available metadata." },
      { question: "Can the OG image and Twitter image be different?", answer: "Yes. You can provide platform-specific images, although using one consistent image is simpler for most sites." },
    ],
    sources: [{ label: "X Cards documentation", url: "https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards" }, { label: "Open Graph protocol", url: "https://ogp.me/" }],
  },
  {
    slug: "how-social-crawlers-read-metadata",
    title: "How Social Media Crawlers Read Open Graph Metadata and Cache Link Previews",
    description: "Understand how link unfurlers fetch HTML, discover OG meta tags, request preview images and cache cards across social platforms.",
    category: "Education", date: "2026-10-30", readTime: "8 min read",
    primaryKeyword: "how social media crawlers read Open Graph tags",
    keywords: ["Open Graph crawler", "social link preview cache", "link unfurling", "OG metadata crawler"],
    intro: "A share preview is the result of a server-to-server fetch and a platform rendering pipeline. Knowing the stages makes broken previews easier to diagnose.",
    blocks: [
      { type: "p", text: "When a user shares a URL, the receiving service may request that page from its own crawler. The crawler downloads HTML, parses metadata and may fetch the image referenced by og:image. The platform then stores or transforms the data and renders a card in its app. The exact sequence and rules differ between services." },
      { type: "h2", text: "Stage 1: The crawler requests the page" },
      { type: "p", text: "The crawler needs to reach the URL over the public internet. DNS, TLS, redirects, firewall rules, access control and server response times all affect whether it can retrieve the page. A human browser succeeding does not always mean every automated crawler can access it." },
      { type: "h2", text: "Stage 2: Metadata is extracted" },
      { type: "p", text: "The service parses the HTML for properties such as og:title, og:description, og:image and og:url. Some services use fallback values, their own parsers or additional metadata. Server-rendered tags are generally more dependable than metadata that only appears after client-side scripts execute." },
      { type: "h2", text: "Stage 3: The image is fetched" },
      { type: "p", text: "The crawler may make a separate request for the image. That request can fail independently if the image is private, blocked, expired, too large or served with an unexpected response. This is why an existing og:image tag is not proof that the preview image is healthy." },
      { type: "h2", text: "Stage 4: The platform caches and renders the card" },
      { type: "p", text: "Platforms can store metadata or image data to avoid fetching the same URL repeatedly. After changing a page, the old preview may continue to appear until the cache expires or a platform-specific debugger requests a new scrape. Cache policies are not uniform." },
      { type: "h2", text: "How to debug by stage" },
      { type: "ol", items: ["Page request: check status code, redirect chain, TLS and crawler access.", "Metadata parsing: inspect the actual HTML response and check duplicate/conflicting properties.", "Image request: test the direct image URL, response headers, format and dimensions.", "Cache/rendering: use the platform's official debugger where available and retest a fresh share."] },
      { type: "callout", text: "OpenGraph Preview simulates layouts from the metadata it extracts. It does not impersonate every platform crawler or purge those platforms' caches." },
      { type: "tool", text: "Inspect a live URL and separate page-fetch problems from metadata and image problems." },
    ],
    faqs: [
      { question: "Why do social previews stay old after I update tags?", answer: "The platform may have cached earlier metadata or image content. Use its official inspection tool, where available, to request a new scrape." },
      { question: "Do crawlers execute JavaScript?", answer: "Crawler behaviour varies. Do not assume every social crawler runs client-side JavaScript; make essential share metadata available in the HTML response." },
      { question: "Does an OG preview tool clear social caches?", answer: "No. A third-party preview can inspect and simulate metadata, but cache refresh is controlled by each platform." },
    ],
    sources: [{ label: "Open Graph protocol", url: "https://ogp.me/" }, { label: "Meta Sharing Debugger", url: "https://developers.facebook.com/tools/debug/" }],
  },
];

export function getBlog(slug: string) { return blogs.find((post) => post.slug === slug); }
