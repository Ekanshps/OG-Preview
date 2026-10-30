import Link from "next/link";
import { ArrowUpRight, Code2, ScanSearch } from "lucide-react";

export function Brand() {
  return <Link href="/" className="brand" aria-label="OpenGraph Preview home"><span className="brand-mark"><ScanSearch size={19} strokeWidth={2.4} /></span><span>OpenGraph <span style={{ color: "#6558e8" }}>Preview</span></span></Link>;
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="nav-links" aria-label="Main navigation">
          <a href="/#tool">Tool</a>
          <a href="/#features">Features</a>
          <Link href="/blog/">Guides & Blog</Link>
          <Link href="/developer/">Developer</Link>
        </nav>
        <a className="header-cta" href="/#tool">Check a URL <ArrowUpRight size={14} /></a>
      </div>
    </header>
  );
}
