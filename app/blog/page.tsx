import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, LifeBuoy } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { blogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Open Graph Guides, Tutorials & Troubleshooting",
  description: "Practical Open Graph tutorials, OG image troubleshooting, Next.js metadata examples and social preview guides for developers and website owners.",
  alternates: { canonical: "/blog/" },
};

const categories = [
  { name: "Tool guide", note: "Learn how to use the inspector, paste HTML and fix results.", icon: LifeBuoy },
  { name: "SEO guide", note: "Solve specific search and social sharing metadata problems.", icon: BookOpen },
  { name: "Education", note: "Understand Open Graph, Twitter Cards and crawler behaviour.", icon: Code2 },
];

export default function BlogIndex() {
  return <><Header /><main className="simple-page"><div className="container">
    <div className="breadcrumb"><Link href="/">Home</Link> / Guides & Blog</div>
    <span className="section-kicker">Open Graph knowledge base</span>
    <h1>Guides that help you<br />ship better link previews.</h1>
    <p className="simple-lead">Practical tool walkthroughs, in-depth troubleshooting and educational explainers about Open Graph tags, OG images, metadata and social sharing previews.</p>
    <div className="feature-grid" style={{ marginTop: 32, marginBottom: 40 }}>
      {categories.map(({ name, note, icon: Icon }) => <div className="feature-card" key={name}><div className="feature-icon"><Icon size={18} /></div><h3>{name}</h3><p>{note}</p></div>)}
    </div>
    <div className="section-heading"><span className="section-kicker">All articles</span><h2>Open Graph tutorials and articles</h2></div>
    <div className="content-grid">
      {blogs.map((post) => <Link href={`/blog/${post.slug}/`} className="content-card" key={post.slug}><span className="content-type">{post.category} · {post.readTime}</span><h3>{post.title}</h3><p>{post.description}</p><span className="read-link">Read article <ArrowRight size={13} /></span></Link>)}
    </div>
    <div style={{ marginTop: 40, padding: 23, border: "1px solid #e5e8ee", borderRadius: 14, background: "white" }}><h2 style={{ margin: "0 0 8px", fontSize: 20, letterSpacing: "-.04em" }}>Need to test a page while you read?</h2><p style={{ margin: "0 0 14px", color: "#748090", fontSize: 13 }}>Open the free checker in a new section and follow the guide alongside your results.</p><Link href="/#tool" className="primary-btn">Open OpenGraph Preview <ArrowRight size={14} /></Link></div>
  </div></main><Footer /></>;
}
