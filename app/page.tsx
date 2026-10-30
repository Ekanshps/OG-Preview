import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Code2, FileCode2, Image as ImageIcon, Monitor, ScanSearch, ShieldCheck, Sparkles, WandSparkles, Zap } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OgTool } from "@/components/og-tool";
import { blogs } from "@/lib/blogs";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "OpenGraph Preview – Free OG Preview & Open Graph Checker",
  description: "Use this free Open Graph preview online to check OG tags, validate OG image URLs, test social cards and generate meta tags for Facebook, X, LinkedIn, WhatsApp, Discord and Slack.",
  alternates: { canonical: "/" },
  keywords: ["Open Graph Preview", "OG Preview", "Open Graph Checker", "OG Preview Online", "OG Image Checker", "Open Graph Tester", "OG Tag Generator", "social media preview"],
};

const appSchema = {
  "@context": "https://schema.org", "@type": "WebApplication", name: "OpenGraph Preview", url: SITE_URL,
  applicationCategory: "DeveloperApplication", operatingSystem: "Any", browserRequirements: "Requires a modern browser and internet access for URL inspection.",
  description: "Free Open Graph preview, metadata checker, image validator and social card generator.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  creator: { "@type": "Person", name: "Ekansh Singh", url: "https://epsingh.in" }, provider: { "@type": "Organization", name: "DevArea", url: "https://devareayt.in" },
  featureList: ["Open Graph URL inspection", "HTML source metadata extraction", "Facebook and X social preview simulation", "OG image URL validation", "Open Graph HTML tag generation"],
};
const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What is an Open Graph preview?", acceptedAnswer: { "@type": "Answer", text: "An Open Graph preview shows how a page's title, description and image may appear when a link is shared on a social network or messaging app." } },
    { "@type": "Question", name: "How do I check Open Graph tags?", acceptedAnswer: { "@type": "Answer", text: "Enter a public page URL into OpenGraph Preview to inspect the HTML metadata, image URL, canonical URL and Twitter Card properties." } },
    { "@type": "Question", name: "What is the recommended OG image size?", acceptedAnswer: { "@type": "Answer", text: "1200 by 630 pixels, approximately a 1.91 to 1 aspect ratio, is a common starting point for large social preview cards. Platform requirements can vary." } },
    { "@type": "Question", name: "Can I check a localhost website?", acceptedAnswer: { "@type": "Answer", text: "A remote URL checker cannot reach your local machine. Paste the page HTML into the local HTML inspection mode to extract its metadata in your browser." } },
    { "@type": "Question", name: "Does Open Graph metadata improve Google rankings?", acceptedAnswer: { "@type": "Answer", text: "Open Graph metadata is primarily used for social sharing previews and should not be treated as a direct Google ranking factor." } },
    { "@type": "Question", name: "Do I need an Open Graph checker extension?", acceptedAnswer: { "@type": "Answer", text: "No installation is required. OpenGraph Preview is an online OG checker that works in a modern browser. For localhost or private draft pages, use Paste HTML instead of remote URL inspection." } },
  ],
};

export default function HomePage() {
  const featured = blogs.slice(0, 6);
  return <>
    <Header />
    <main>
      <section className="hero">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center" }}><span className="eyebrow"><Sparkles size={12} /> Free Open Graph toolkit</span></div>
          <h1>Open Graph Preview<br /><span>&amp; Checker</span></h1>
          <p className="hero-copy">Use this free OG preview online to inspect Open Graph tags, check OG images, preview social cards and fix broken link previews before you publish. One clean workspace for website owners, developers and creators.</p>
          <div className="hero-proof"><span className="proof-item"><span className="proof-dot" /> No sign-up required</span><span className="proof-item"><ShieldCheck size={12} /> Safer URL inspection</span><span className="proof-item"><Zap size={12} /> Fast, browser-first workflow</span></div>
          <OgTool />
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <div className="section-heading center"><span className="section-kicker">More than a card mockup</span><h2>Free Open Graph checker online that tells you what to fix</h2><p>See the values your page actually serves, understand why a preview may fail and generate a cleaner set of social metadata.</p></div>
          <div className="feature-grid">
            <div className="feature-card"><div className="feature-icon"><ScanSearch size={19} /></div><h3>Live URL inspection</h3><p>Fetch a public page, follow safe redirects and extract Open Graph, standard SEO and Twitter Card metadata from its HTML response.</p></div>
            <div className="feature-card"><div className="feature-icon"><ImageIcon size={19} /></div><h3>OG image validation</h3><p>Check whether the image URL is reachable, returns an image and has usable dimensions, aspect ratio and file size.</p></div>
            <div className="feature-card"><div className="feature-icon"><Monitor size={19} /></div><h3>Six social card previews</h3><p>Compare simulated layouts for Facebook, X, LinkedIn, WhatsApp, Discord and Slack using the metadata you extracted or edited.</p></div>
            <div className="feature-card"><div className="feature-icon"><FileCode2 size={19} /></div><h3>Paste HTML locally</h3><p>Inspect a page source snippet without publishing it. Useful for localhost, protected staging pages and pre-launch drafts.</p></div>
            <div className="feature-card"><div className="feature-icon"><WandSparkles size={19} /></div><h3>Edit and generate tags</h3><p>Try new titles, descriptions and images in the live preview, then copy a structured Open Graph and Twitter Card HTML block.</p></div>
            <div className="feature-card"><div className="feature-icon"><ShieldCheck size={19} /></div><h3>Transparent diagnostics</h3><p>Errors, warnings and informational notes stay separate. No unexplained ranking score or claim that social previews are guaranteed.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#f0f1f8" }}>
        <div className="container">
          <div className="section-heading center"><span className="section-kicker">Simple workflow</span><h2>Inspect. Understand. Improve.</h2><p>Use the Open Graph preview tool from first check to final HTML implementation.</p></div>
          <div className="steps-grid">
            <div className="step-card"><div className="step-number">01</div><h3>Enter a URL or paste HTML</h3><p>Inspect the public HTML returned by a live page or parse source locally for development and staging work.</p></div>
            <div className="step-card"><div className="step-number">02</div><h3>Review cards and findings</h3><p>Compare social preview simulations, see metadata values and identify missing tags or image delivery problems.</p></div>
            <div className="step-card"><div className="step-number">03</div><h3>Fix and copy your tags</h3><p>Edit the metadata, check the new card and copy the generated HTML into your website's document head.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="guides">
        <div className="container">
          <div className="section-heading"><span className="section-kicker">Learn and troubleshoot</span><h2>Open Graph guides for real problems</h2><p>Step-by-step tool tutorials, search-focused troubleshooting and clear explanations for developers and non-developers.</p></div>
          <div className="content-grid">
            {featured.map((post) => <Link href={`/blog/${post.slug}/`} className="content-card" key={post.slug}><span className="content-type">{post.category}</span><h3>{post.title}</h3><p>{post.description}</p><span className="read-link">Read guide <ArrowRight size={13} /></span></Link>)}
          </div>
          <div style={{ marginTop: 19 }}><Link href="/blog/" className="secondary-btn">Explore all guides <ArrowUpRight size={13} /></Link></div>
        </div>
      </section>

      <section className="section" id="faq" style={{ paddingTop: 15 }}>
        <div className="container">
          <div className="section-heading center"><span className="section-kicker">Frequently asked questions</span><h2>Open Graph preview questions, answered</h2><p>Quick answers about OG meta tags, social previews and debugging.</p></div>
          <div className="faq-list">
            <div className="faq-item"><h3>What is an Open Graph preview?</h3><p>It is a preview of how a link may appear when shared, using metadata such as og:title, og:description and og:image.</p></div>
            <div className="faq-item"><h3>How do I check Open Graph tags?</h3><p>Enter a public URL in the inspector. The tool extracts values from the page HTML and reports missing or potentially problematic metadata.</p></div>
            <div className="faq-item"><h3>What is the recommended OG image size?</h3><p>1200 × 630 pixels (around 1.91:1) is a common starting point for large preview cards. Always check current platform-specific limits.</p></div>
            <div className="faq-item"><h3>Can I inspect localhost or staging pages?</h3><p>Paste the source HTML into the local parser. Remote URL inspection cannot reach a private development machine or a page behind authentication.</p></div>
            <div className="faq-item"><h3>Does an OG checker improve Google rankings?</h3><p>It helps you troubleshoot share metadata. Open Graph tags are not a substitute for useful page content, technical SEO or search indexing requirements.</p></div>
            <div className="faq-item"><h3>Are platform previews exact?</h3><p>No. They are simulated layouts. Social networks control their crawlers, caches and final rendering behaviour.</p></div>
            <div className="faq-item"><h3>Do I need an Open Graph checker extension?</h3><p>No installation is required. Use this online checker in your browser, or paste HTML when you need to inspect localhost or a private draft.</p></div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="cta-band"><div><h2>Ready to check your next link?</h2><p>Run a free Open Graph test and fix your social preview before sharing.</p></div><a className="primary-btn" href="#tool">Start free inspection <ArrowRight size={14} /></a></div>
      </section>
    </main>
    <Footer />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
  </>;
}
