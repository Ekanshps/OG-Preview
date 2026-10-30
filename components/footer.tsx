import Link from "next/link";
import { Brand } from "@/components/header";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p className="footer-brand-copy">A practical Open Graph checker, social preview simulator and meta tag generator for people who want to ship share-ready pages with confidence.</p>
          </div>
          <div className="footer-col"><h4>Product</h4><div className="footer-links"><Link href="/#tool">Open Graph Checker</Link><Link href="/#tool">OG Image Preview</Link><Link href="/blog/">How-to Guides</Link></div></div>
          <div className="footer-col"><h4>Resources</h4><div className="footer-links"><Link href="/blog/">Blog</Link><Link href="/developer/">Developer</Link><Link href="/about/">About</Link></div></div>
          <div className="footer-col"><h4>Information</h4><div className="footer-links"><Link href="/contact/">Contact</Link><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link></div></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} OpenGraph Preview. Built for the web.</span><span>Developed by <a href="https://epsingh.in" target="_blank" rel="noopener noreferrer">Ekansh Singh</a> · <a href="https://devareayt.in" target="_blank" rel="noopener noreferrer">DevArea</a></span></div>
      </div>
    </footer>
  );
}
