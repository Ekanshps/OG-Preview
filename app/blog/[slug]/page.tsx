import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/article-content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { blogs, getBlog } from "@/lib/blogs";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() { return blogs.map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.description,
    keywords: [post.primaryKeyword, ...post.keywords],
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { type: "article", title: post.title, description: post.description, url: `${SITE_URL}/blog/${post.slug}/`, siteName: "OpenGraph Preview" },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) notFound();
  const related = blogs.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3);
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description,
    datePublished: `${post.date}T09:00:00+05:30`, dateModified: `${post.date}T09:00:00+05:30`, mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
    author: { "@type": "Person", name: "Ekansh Singh", url: "https://epsingh.in" }, publisher: { "@type": "Organization", name: "OpenGraph Preview", url: SITE_URL },
  };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: post.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <>
    <Header />
    <main>
      <header className="article-hero"><div className="container">
        <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/blog/">Blog</Link> / {post.category}</div>
        <span className="section-kicker">{post.category} · {post.readTime}</span>
        <h1>{post.title}</h1>
        <p className="article-lead">{post.intro}</p>
        <div className="article-meta"><span>By <a href="https://epsingh.in" target="_blank" rel="noopener noreferrer">Ekansh Singh</a></span><span>Updated {new Date(`${post.date}T12:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span><span>OpenGraph Preview</span></div>
      </div></header>
      <div className="container article-layout">
        <div><ArticleContent post={post} /></div>
        <aside className="article-sidebar"><h3>Explore this guide</h3><p className="sidebar-note">Read the step-by-step explanation and examples in the article.</p><a href="/#tool">Open Graph checker</a><a href="/blog/">All tutorials</a><div className="article-cta"><strong>Test your page</strong><p>Inspect metadata and compare social preview simulations.</p><Link href="/#tool">Use the free tool →</Link></div><div style={{ marginTop: 19 }}><h3>Related reading</h3>{related.map((item) => <Link href={`/blog/${item.slug}/`} key={item.slug}>{item.title}</Link>)}</div></aside>
      </div>
    </main>
    <Footer />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
  </>;
}
