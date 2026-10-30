import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Developer & Product Engineering – OpenGraph Preview",
  description: "Meet the developer behind OpenGraph Preview. Product engineering by Ekansh Singh and DevArea.",
  alternates: { canonical: "/developer/" },
};

export default function DeveloperPage() {
  const schema = { "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: { "@type": "Person", name: "Ekansh Singh", url: "https://epsingh.in", worksFor: { "@type": "Organization", name: "DevArea", url: "https://devareayt.in" }, jobTitle: "Developer and Product Engineer" } };
  return <><Header /><main className="simple-page"><div className="container">
    <div className="breadcrumb"><Link href="/">Home</Link> / Developer</div>
    <span className="section-kicker">People behind the product</span>
    <h1>Built with a developer-first mindset.</h1>
    <p className="simple-lead">OpenGraph Preview is an independent utility built to make social metadata easier to inspect, understand and improve—without hiding the important details behind a score.</p>
    <div className="developer-card"><div className="developer-avatar">ES</div><div><span className="section-kicker">Developer</span><h2 style={{ margin: "5px 0 4px", fontSize: 23, letterSpacing: "-.04em" }}>Ekansh Singh</h2><p style={{ margin: 0, color: "#758091", fontSize: 12, lineHeight: 1.6 }}>Software developer · AI engineer · Product builder</p><a href="https://epsingh.in" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, fontSize: 12, color: "#5b51d5", fontWeight: 800 }}>epsingh.in <ArrowUpRight size={13} /></a></div></div>
    <div className="developer-card"><div className="developer-avatar" style={{ background: "linear-gradient(145deg,#232b3e,#606b80)" }}><Code2 size={25} /></div><div><span className="section-kicker">Product & engineering</span><h2 style={{ margin: "5px 0 4px", fontSize: 23, letterSpacing: "-.04em" }}>DevArea</h2><p style={{ margin: 0, color: "#758091", fontSize: 12, lineHeight: 1.6 }}>Web development, product engineering and digital solutions.</p><a href="https://devareayt.in" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, fontSize: 12, color: "#5b51d5", fontWeight: 800 }}>devareayt.in <ArrowUpRight size={13} /></a></div></div>
    <section style={{ marginTop: 45, maxWidth: 720 }}><h2 style={{ fontSize: 23, letterSpacing: "-.04em" }}>Why this tool exists</h2><div className="prose"><p>Social preview tools should show the metadata they found, explain which checks failed and help users create better tags. OpenGraph Preview is designed around that workflow: inspect a live URL, paste local HTML, simulate common card layouts, validate an image URL and copy the implementation.</p><p>The product aims to be transparent about its limits. A simulated preview is not the same as an official platform scrape, and Open Graph metadata alone does not guarantee Google rankings or indexing.</p><p>Feedback and corrections are welcome. Use the <Link href="/contact/" style={{ color: "#5c51d7", fontWeight: 700 }}>contact page</Link> to get in touch.</p></div></section>
    </div></main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></>;
}
