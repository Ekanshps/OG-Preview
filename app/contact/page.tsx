import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = { title: "Contact OpenGraph Preview", description: "Contact the developer of OpenGraph Preview with feedback, bug reports and product suggestions.", alternates: { canonical: "/contact/" } };
export default function ContactPage() { return <><Header /><main className="simple-page"><div className="container"><div className="breadcrumb"><Link href="/">Home</Link> / Contact</div><span className="section-kicker">Feedback and support</span><h1>Help make the tool better.</h1><p className="simple-lead">Found an incorrect diagnostic, a broken workflow or an accessibility issue? Send feedback through the developer website.</p><div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}><a className="primary-btn" href="https://epsingh.in/contact/" target="_blank" rel="noopener noreferrer">Contact Ekansh Singh <ArrowUpRight size={14} /></a><a className="secondary-btn" href="https://devareayt.in/" target="_blank" rel="noopener noreferrer">Visit DevArea <ArrowUpRight size={13} /></a></div><p className="field-help" style={{ marginTop: 16 }}>Please do not send passwords, private access tokens or confidential page source in a public support request.</p></div></main><Footer /></>; }
