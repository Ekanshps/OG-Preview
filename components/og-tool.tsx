"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Clipboard, Code2, FileCode2, Image as ImageIcon, Info, LoaderCircle, Monitor, ScanSearch, ShieldCheck, Smartphone, Sparkles, WandSparkles } from "lucide-react";

type Mode = "url" | "html" | "create";
type Platform = "Facebook" | "X" | "LinkedIn" | "WhatsApp" | "Discord" | "Slack";
type Level = "error" | "warning" | "info";
type Meta = { title: string; description: string; url: string; image: string; type: string; siteName: string; imageAlt: string; twitterCard: string; twitterTitle: string; twitterDescription: string; twitterImage: string; canonical: string; hasOgTitle?: boolean; hasOgDescription?: boolean; hasOgImage?: boolean; hasOgUrl?: boolean; hasOgType?: boolean; hasTwitterCard?: boolean; ogImageIsAbsolute?: boolean; ogUrlIsAbsolute?: boolean; duplicateTags?: string[] };
type Diagnostic = { level: Level; title: string; detail: string };
type InspectResponse = { ok: boolean; metadata: Meta; diagnostics: Diagnostic[]; summary: { errors: number; warnings: number; passed: number }; image: { ok: boolean; status: number; contentType: string; width: number; height: number; format: string; bytes: number; error: string } | null; response: { status: number; contentType: string; finalUrl: string; redirects: string[]; bytes: number } };

const blankMeta: Meta = { title: "", description: "", url: "", image: "", type: "website", siteName: "", imageAlt: "", twitterCard: "summary_large_image", twitterTitle: "", twitterDescription: "", twitterImage: "", canonical: "" };
const platforms: Platform[] = ["Facebook", "X", "LinkedIn", "WhatsApp", "Discord", "Slack"];

function domainFrom(value: string) { try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return "yourwebsite.com"; } }
function escapeAttribute(value: string) { return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function generateTags(meta: Meta) {
  return [
    `<title>${escapeAttribute(meta.title || "Page title")}</title>`,
    meta.description ? `<meta name="description" content="${escapeAttribute(meta.description)}" />` : "",
    meta.canonical || meta.url ? `<link rel="canonical" href="${escapeAttribute(meta.canonical || meta.url)}" />` : "",
    "", "<!-- Open Graph -->",
    `<meta property="og:title" content="${escapeAttribute(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`,
    `<meta property="og:type" content="${escapeAttribute(meta.type || "website")}" />`,
    `<meta property="og:url" content="${escapeAttribute(meta.url || meta.canonical)}" />`,
    meta.siteName ? `<meta property="og:site_name" content="${escapeAttribute(meta.siteName)}" />` : "",
    meta.image ? `<meta property="og:image" content="${escapeAttribute(meta.image)}" />` : "",
    meta.imageAlt ? `<meta property="og:image:alt" content="${escapeAttribute(meta.imageAlt)}" />` : "",
    "", "<!-- X / Twitter Card -->",
    `<meta name="twitter:card" content="${escapeAttribute(meta.twitterCard || "summary_large_image")}" />`,
    `<meta name="twitter:title" content="${escapeAttribute(meta.twitterTitle || meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(meta.twitterDescription || meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(meta.twitterImage || meta.image)}" />`,
  ].filter((line) => line !== "").join("\n");
}
function parseHtmlInBrowser(html: string, fallbackUrl: string): Meta {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const get = (selector: string) => doc.querySelector<HTMLMetaElement>(selector)?.content?.trim() || "";
  const resolve = (value: string) => { if (!value) return ""; try { return new URL(value, fallbackUrl || undefined).toString(); } catch { return value; } };
  const rawImage = get('meta[property="og:image"]');
  const rawUrl = get('meta[property="og:url"]');
  const keys = ["og:title", "og:description", "og:image", "og:url", "og:type", "twitter:card"];
  const duplicateTags = keys.filter((key) => doc.querySelectorAll(key.startsWith("og:") ? `meta[property="${key}"]` : `meta[name="${key}"]`).length > 1);
  return {
    title: get('meta[property="og:title"]') || doc.querySelector("title")?.textContent?.trim() || "",
    description: get('meta[property="og:description"]') || get('meta[name="description"]'),
    image: resolve(rawImage),
    url: resolve(rawUrl),
    type: get('meta[property="og:type"]'),
    siteName: get('meta[property="og:site_name"]'),
    imageAlt: get('meta[property="og:image:alt"]'),
    twitterCard: get('meta[name="twitter:card"]') || "summary_large_image",
    twitterTitle: get('meta[name="twitter:title"]'), twitterDescription: get('meta[name="twitter:description"]'),
    twitterImage: resolve(get('meta[name="twitter:image"]')),
    canonical: resolve(doc.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.getAttribute("href") || ""),
    hasOgTitle: Boolean(get('meta[property="og:title"]')),
    hasOgDescription: Boolean(get('meta[property="og:description"]')),
    hasOgImage: Boolean(get('meta[property="og:image"]')),
    hasOgUrl: Boolean(get('meta[property="og:url"]')),
    hasOgType: Boolean(get('meta[property="og:type"]')),
    hasTwitterCard: Boolean(get('meta[name="twitter:card"]')),
    ogImageIsAbsolute: /^https?:\/\//i.test(rawImage),
    ogUrlIsAbsolute: /^https?:\/\//i.test(rawUrl),
    duplicateTags,
  };
}
function localDiagnostics(meta: Meta): Diagnostic[] {
  const list: Diagnostic[] = [];
  if (!(meta.hasOgTitle ?? Boolean(meta.title))) list.push({ level: "error", title: "Missing og:title", detail: "Add a page-specific title to the Open Graph metadata." });
  if (!(meta.hasOgType ?? Boolean(meta.type))) list.push({ level: "error", title: "Missing og:type", detail: "Choose a content type, usually website or article." });
  if (!(meta.hasOgUrl ?? Boolean(meta.url))) list.push({ level: "error", title: "Missing og:url", detail: "Add the canonical URL for this page." });
  if (!(meta.hasOgImage ?? Boolean(meta.image))) list.push({ level: "error", title: "Missing og:image", detail: "Add an absolute, publicly accessible image URL." });
  if (!(meta.hasOgDescription ?? Boolean(meta.description))) list.push({ level: "warning", title: "Missing og:description", detail: "Add a concise description for the social card." });
  if (meta.image && !(meta.ogImageIsAbsolute ?? /^https?:\/\//i.test(meta.image))) list.push({ level: "warning", title: "OG image URL is not absolute", detail: "Use a fully qualified image URL, including https:// and the hostname." });
  if (meta.image && !/^https:\/\//i.test(meta.image)) list.push({ level: "warning", title: "Image URL should use HTTPS", detail: "Use a full HTTPS image URL for safer crawler access." });
  if (meta.url && !(meta.ogUrlIsAbsolute ?? /^https?:\/\//i.test(meta.url))) list.push({ level: "warning", title: "og:url is not absolute", detail: "Use the full canonical URL, including the scheme and hostname." });
  if (meta.image && !meta.imageAlt) list.push({ level: "warning", title: "Missing image alt text", detail: "Describe the image using og:image:alt." });
  if (meta.duplicateTags?.length) list.push({ level: "warning", title: "Duplicate metadata properties found", detail: `Multiple values were found for: ${meta.duplicateTags.join(", ")}. Remove conflicting duplicates.` });
  if (!(meta.hasTwitterCard ?? Boolean(meta.twitterCard))) list.push({ level: "warning", title: "Twitter Card type not set", detail: "Set twitter:card to define the intended X card layout." });
  if (list.length === 0) list.push({ level: "info", title: "Core fields are present", detail: "The editor has the essential fields. Validate the live image URL and published response before launch." });
  return list;
}
function PreviewImage({ src, alt, className = "social-image" }: { src: string; alt: string; className?: string }) {
  const [previewSrc, setPreviewSrc] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!/^https?:\/\//i.test(src)) {
      setPreviewSrc("");
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;
    let objectUrl = "";
    setPreviewSrc("");
    setError("");
    setLoading(true);

    const proxyUrl = `/api/image-preview?url=${encodeURIComponent(src)}`;
    void fetch(proxyUrl, { method: "GET", credentials: "same-origin", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null) as { error?: string } | null;
          throw new Error(payload?.error || `Image preview request failed (HTTP ${response.status}).`);
        }
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.toLowerCase().startsWith("image/")) {
          throw new Error(`The preview endpoint returned ${contentType || "an unknown content type"}, not an image.`);
        }
        const blob = await response.blob();
        if (!blob.size) throw new Error("The preview endpoint returned an empty image.");
        objectUrl = URL.createObjectURL(blob);
        if (!active) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = "";
          return;
        }
        setPreviewSrc(objectUrl);
      })
      .catch((cause: unknown) => {
        if (!active || (cause instanceof Error && cause.name === "AbortError")) return;
        setError(cause instanceof Error ? cause.message : "The image preview request failed.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!/^https?:\/\//i.test(src)) {
    return <div className="social-image-empty"><ImageIcon size={27} /><span style={{ fontSize: 10, marginLeft: 8 }}>Add a public image URL</span></div>;
  }
  if (error) {
    return <div className="social-image-empty" role="status" style={{ display: "flex", flexDirection: "column", gap: 7, padding: 14, textAlign: "center", boxSizing: "border-box" }}>
      <ImageIcon size={24} />
      <span style={{ fontSize: 10, lineHeight: 1.45, overflowWrap: "anywhere" }}>Preview unavailable: {error}</span>
      <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: "#5147c9", fontSize: 10, fontWeight: 750 }}>Open original image ↗</a>
    </div>;
  }
  if (loading || !previewSrc) {
    return <div className="social-image-empty" role="status"><ImageIcon size={24} /><span style={{ fontSize: 10, marginLeft: 8 }}>Loading preview image…</span></div>;
  }
  return <img className={className} src={previewSrc} alt={alt} />;
}

function StatusIcon({ level }: { level: Level }) {
  if (level === "error") return <AlertCircle size={15} color="#cf4b57" />;
  if (level === "warning") return <AlertCircle size={15} color="#b17a25" />;
  return <CheckCircle2 size={15} color="#16865b" />;
}

export function OgTool() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [meta, setMeta] = useState<Meta>(blankMeta);
  const [platform, setPlatform] = useState<Platform>("Facebook");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState<InspectResponse | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageCheck, setImageCheck] = useState("");

  const diagnostics = useMemo(() => result?.diagnostics || (mode === "create" || mode === "html" ? localDiagnostics(meta) : []), [result, mode, meta]);
  const tags = useMemo(() => generateTags(meta), [meta]);
  const setField = (field: keyof Meta, value: string) => {
    const flagMap: Partial<Record<keyof Meta, keyof Meta>> = { title: "hasOgTitle", description: "hasOgDescription", image: "hasOgImage", url: "hasOgUrl", type: "hasOgType", twitterCard: "hasTwitterCard" };
    setMeta((current) => ({ ...current, [field]: value, ...(flagMap[field] ? { [flagMap[field] as string]: Boolean(value.trim()) } : {}) }));
    setResult(null); setNotice("");
  };

  async function inspectUrl() {
    setError(""); setNotice(""); setResult(null); setLoading(true); setImageCheck("");
    try {
      const response = await fetch("/api/inspect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not inspect this URL.");
      setMeta(data.metadata); setResult(data); setNotice("Inspection complete. Edit any value to preview an updated card.");
    } catch (err) { setError(err instanceof Error ? err.message : "Inspection failed. Please try again."); }
    finally { setLoading(false); }
  }
  function inspectHtml() {
    setError(""); setNotice(""); setResult(null);
    if (!html.trim()) { setError("Paste the page HTML or document head first."); return; }
    try { setMeta(parseHtmlInBrowser(html, url)); setNotice("HTML parsed locally in your browser. This does not verify what a live crawler receives."); }
    catch { setError("Could not parse that HTML. Paste a complete HTML document or head section."); }
  }
  function resetEditor() { setMeta(blankMeta); setResult(null); setNotice("Editor reset. Add metadata to build a social preview."); setError(""); setShowCode(false); }
  async function checkImage() {
    if (!meta.image) { setImageCheck("Add an image URL first."); return; }
    setImageLoading(true); setImageCheck("");
    try {
      const response = await fetch("/api/image-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: meta.image }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Image check failed.");
      const image = data.image;
      setImageCheck(image.ok ? `${image.width} × ${image.height} · ${image.format.toUpperCase()} · ${(image.bytes / 1024).toFixed(0)} KB · HTTP ${image.status}` : image.error);
    } catch (err) { setImageCheck(err instanceof Error ? err.message : "Image check failed."); }
    finally { setImageLoading(false); }
  }
  async function copyTags() {
    try { await navigator.clipboard.writeText(tags); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { setError("Clipboard access is unavailable. Select and copy the generated code manually."); }
  }
  function switchMode(next: Mode) { setMode(next); setError(""); setNotice(""); if (next === "create") setResult(null); }

  const isReady = Boolean(meta.title || meta.description || meta.image);
  const domain = domainFrom(meta.url || url || meta.canonical);
  const cardTitle = meta.title || "Your page title will appear here";
  const cardDescription = meta.description || "A concise page description will appear below the title when this page is shared.";
  const cardImage = meta.image;

  return (
    <div className="tool-shell" id="tool">
      <div className="tool-top"><div className="tool-title"><span className="brand-mark" style={{ width: 27, height: 27, borderRadius: 8 }}><ScanSearch size={15} /></span> Open Graph workspace</div><div className="tool-status"><span className="proof-dot" /> Free · No account required</div></div>
      <div className="tab-row" role="tablist" aria-label="Choose inspection mode">
        <button className={`mode-tab ${mode === "url" ? "active" : ""}`} onClick={() => switchMode("url")} role="tab" aria-selected={mode === "url"}><ScanSearch size={14} /> Inspect URL</button>
        <button className={`mode-tab ${mode === "html" ? "active" : ""}`} onClick={() => switchMode("html")} role="tab" aria-selected={mode === "html"}><FileCode2 size={14} /> Paste HTML</button>
        <button className={`mode-tab ${mode === "create" ? "active" : ""}`} onClick={() => switchMode("create")} role="tab" aria-selected={mode === "create"}><WandSparkles size={14} /> Create preview</button>
      </div>
      <div className="tool-body">
        <section className="tool-input-panel" aria-label="Input and metadata editor">
          {mode === "url" && <>
            <label className="field-label" htmlFor="inspect-url">Website URL</label>
            <input id="inspect-url" className="text-input" type="url" inputMode="url" placeholder="https://example.com/article" value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !loading) void inspectUrl(); }} />
            <p className="field-help">Inspect the public HTML response, Open Graph tags, Twitter metadata and the referenced image.</p>
            <div className="action-row"><button className="primary-btn" onClick={() => void inspectUrl()} disabled={loading || !url.trim()}>{loading ? <LoaderCircle size={15} className="animate-spin" /> : <ScanSearch size={15} />} {loading ? "Inspecting page…" : "Inspect Open Graph"}</button><button className="secondary-btn" onClick={resetEditor}>Reset</button></div>
            <div className="field-help" style={{ marginTop: 14, padding: "11px 12px", background: "#f7f8fb", borderRadius: 9 }}><ShieldCheck size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 5 }} /> Public HTTP/HTTPS URLs only. Localhost and private network targets are blocked. Paste HTML for local pages.</div>
          </>}
          {mode === "html" && <>
            <label className="field-label" htmlFor="html-base-url">Page URL (optional, for resolving relative image paths)</label>
            <input id="html-base-url" className="text-input" type="url" placeholder="https://example.com/page" value={url} onChange={(event) => setUrl(event.target.value)} style={{ marginBottom: 12 }} />
            <label className="field-label" htmlFor="html-source">Paste page HTML or the document head</label>
            <textarea id="html-source" className="text-area" placeholder={'<!doctype html>\n<html>\n<head>\n  <title>My page</title>\n  <meta property="og:title" content="My page" />\n  ...\n</head>\n</html>'} value={html} onChange={(event) => setHtml(event.target.value)} />
            <p className="field-help">HTML is parsed locally in your browser. Useful for localhost, drafts and authenticated staging pages. No source is sent to the inspection API.</p>
            <div className="action-row"><button className="primary-btn" onClick={inspectHtml}><FileCode2 size={15} /> Extract metadata</button><button className="secondary-btn" onClick={() => { setHtml(""); setNotice(""); setError(""); }}>Clear HTML</button></div>
          </>}
          {mode === "create" && <div style={{ padding: "16px 0 4px" }}><div className="field-label" style={{ margin: 0 }}>Build your social card from scratch</div><p className="field-help" style={{ marginTop: 6 }}>Use the editor below to set your title, description, image, canonical URL and image alt text. The card updates live as you work.</p></div>}
          {error && <div className="error-box" role="alert">{error}</div>}
          {notice && <div className="success-box" role="status">{notice}</div>}
          {result && <div style={{ marginTop: 18, borderTop: "1px solid #edf0f4", paddingTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 9 }}><strong style={{ fontSize: 11 }}>Inspection summary</strong><span style={{ color: "#748090", fontSize: 10 }}>HTTP {result.response.status} · {(result.response.bytes / 1024).toFixed(0)} KB HTML</span></div>
            <div className="results-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 11 }}>
              <div className="metric-card"><div className="metric-label">Errors</div><div className="metric-value" style={{ color: result.summary.errors ? "#cf4b57" : "#16865b" }}>{result.summary.errors}</div></div>
              <div className="metric-card"><div className="metric-label">Warnings</div><div className="metric-value" style={{ color: result.summary.warnings ? "#a96a13" : "#16865b" }}>{result.summary.warnings}</div></div>
              <div className="metric-card"><div className="metric-label">Passed / info</div><div className="metric-value" style={{ color: "#16865b" }}>{result.summary.passed}</div></div>
            </div>
            {result.response.redirects.length > 0 && <p className="field-help">Redirected {result.response.redirects.length} time(s). Final URL: {result.response.finalUrl}</p>}
          </div>}
          {(isReady || mode === "create" || mode === "html") && <div style={{ marginTop: 19, borderTop: "1px solid #edf0f4", paddingTop: 15 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}><strong style={{ fontSize: 11 }}>Edit metadata</strong><span style={{ color: "#8b93a0", fontSize: 10 }}>Live preview</span></div>
            <div className="editor-grid">
              <div className="editor-field full"><label className="field-label" htmlFor="edit-title">Title</label><input id="edit-title" value={meta.title} onChange={(e) => setField("title", e.target.value)} placeholder="Page title" /></div>
              <div className="editor-field full"><label className="field-label" htmlFor="edit-desc">Description</label><input id="edit-desc" value={meta.description} onChange={(e) => setField("description", e.target.value)} placeholder="Page description" /></div>
              <div className="editor-field full"><label className="field-label" htmlFor="edit-image">Image URL</label><input id="edit-image" value={meta.image} onChange={(e) => setField("image", e.target.value)} placeholder="https://example.com/image.jpg" /></div>
              <div className="editor-field"><label className="field-label" htmlFor="edit-url">og:url</label><input id="edit-url" value={meta.url} onChange={(e) => setField("url", e.target.value)} placeholder="https://example.com" /></div>
              <div className="editor-field"><label className="field-label" htmlFor="edit-canonical">Canonical URL</label><input id="edit-canonical" value={meta.canonical} onChange={(e) => setField("canonical", e.target.value)} placeholder="https://example.com" /></div>
              <div className="editor-field"><label className="field-label" htmlFor="edit-alt">Image alt</label><input id="edit-alt" value={meta.imageAlt} onChange={(e) => setField("imageAlt", e.target.value)} placeholder="Image description" /></div>
              <div className="editor-field"><label className="field-label" htmlFor="edit-type">OG type</label><select id="edit-type" className="select-input" value={meta.type} onChange={(e) => setField("type", e.target.value)}><option value="website">website</option><option value="article">article</option><option value="product">product</option></select></div>
            </div>
            <div className="action-row"><button className="secondary-btn" onClick={checkImage} disabled={imageLoading || !meta.image}>{imageLoading ? <LoaderCircle size={13} className="animate-spin" /> : <ImageIcon size={13} />} Check image URL</button><button className="secondary-btn" onClick={() => setShowCode(!showCode)}><Code2 size={13} /> {showCode ? "Hide HTML" : "Generate HTML tags"}</button></div>
            {imageCheck && <div className="field-help" style={{ marginTop: 9 }}>{imageCheck}</div>}
            {showCode && <div style={{ marginTop: 13 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><strong style={{ fontSize: 11 }}>Generated head tags</strong><button className="secondary-btn" onClick={() => void copyTags()}>{copied ? <Check size={13} /> : <Clipboard size={13} />}{copied ? "Copied" : "Copy code"}</button></div><pre style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", borderRadius: 9, padding: 13, background: "#1d2130", color: "#e2e7f5", fontSize: 10, lineHeight: 1.6 }}>{tags}</pre></div>}
          </div>}
        </section>
        <section className="tool-preview-panel" aria-label="Social media preview">
          <div className="preview-heading"><strong>Social media preview</strong><span>Simulated layout</span></div>
          <div className="platform-tabs" role="tablist" aria-label="Preview platform">{platforms.map((item) => <button key={item} className={`platform-tab ${platform === item ? "active" : ""}`} onClick={() => setPlatform(item)} role="tab" aria-selected={platform === item}>{item}</button>)}</div>
          <div className="preview-frame">
            {platform === "WhatsApp" ? <div className="social-card whatsapp" style={{ maxWidth: 365 }}>{cardImage ? <PreviewImage src={cardImage} alt={meta.imageAlt || "Open Graph preview image"} /> : <div className="social-image-empty"><ImageIcon size={30} /></div>}<div className="social-meta"><div className="social-domain">{domain}</div><p className="social-title">{cardTitle}</p><p className="social-desc">{cardDescription}</p></div></div> : platform === "Discord" ? <div className="social-card discord" style={{ maxWidth: 375 }}><div className="social-meta"><div className="social-domain">{domain}</div><p className="social-title">{cardTitle}</p><p className="social-desc">{cardDescription}</p></div>{cardImage ? <PreviewImage src={cardImage} alt={meta.imageAlt || "Open Graph preview image"} /> : <div className="social-image-empty"><ImageIcon size={30} /></div>}</div> : <div className={`social-card ${platform === "X" ? "x-card" : platform.toLowerCase()}`}>{cardImage ? <PreviewImage src={cardImage} alt={meta.imageAlt || "Open Graph preview image"} /> : <div className="social-image-empty"><ImageIcon size={30} /><span style={{ fontSize: 10, marginLeft: 8 }}>Add an og:image to preview the card</span></div>}<div className="social-meta"><div className="social-domain">{domain}</div><p className="social-title">{cardTitle}</p><p className="social-desc">{cardDescription}</p></div></div>}
          </div>
          <p className="platform-note"><Info size={11} style={{ display: "inline", verticalAlign: "-2px", marginRight: 4 }} /> This is a visual approximation based on your metadata. Actual platform cards can differ due to rendering rules, cropping, device layout and cache.</p>
          <div className="preview-foot"><span><Monitor size={12} /> Desktop layouts</span><span><Smartphone size={12} /> Responsive cards</span></div>
        </section>
      </div>
      {(result || mode !== "url" || isReady) && <div className="results-section">
        <div className="results-header"><h3>{result ? "Metadata diagnostics" : "Metadata checklist"}</h3><span style={{ color: "#87909f", fontSize: 10 }}>{diagnostics.length} findings</span></div>
        <div className="audit-list">{diagnostics.map((item, index) => <div className="audit-item" key={`${item.title}-${index}`}><StatusIcon level={item.level} /><div><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}{diagnostics.length === 0 && <div className="preview-state"><Info size={14} /> Inspect a URL or enter metadata to see recommendations.</div>}</div>
        {result && <>
          <div className="tag-list">
            <div className="tag-row"><code>og:title</code><span>{result.metadata.title || "Not found"}</span></div>
            <div className="tag-row"><code>og:description</code><span>{result.metadata.description || "Not found"}</span></div>
            <div className="tag-row"><code>og:image</code><span>{result.metadata.image || "Not found"}</span></div>
            <div className="tag-row"><code>og:url</code><span>{result.metadata.url || "Not found"}</span></div>
            <div className="tag-row"><code>og:type</code><span>{result.metadata.type || "Not found"}</span></div>
            <div className="tag-row"><code>og:site_name</code><span>{result.metadata.siteName || "Not found"}</span></div>
            <div className="tag-row"><code>og:image:alt</code><span>{result.metadata.imageAlt || "Not found"}</span></div>
            <div className="tag-row"><code>canonical</code><span>{result.metadata.canonical || "Not found"}</span></div>
            <div className="tag-row"><code>twitter:card</code><span>{result.metadata.twitterCard || "Not found"}</span></div>
            <div className="tag-row"><code>twitter:title</code><span>{result.metadata.twitterTitle || "Fallback to OG/title"}</span></div>
          </div>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center" }}>
            <span style={{ color: "#7a8492", fontSize: 10, fontWeight: 700 }}>Official platform checks:</span>
            <a className="secondary-btn" href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer">Meta Sharing Debugger ↗</a>
            <a className="secondary-btn" href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer">LinkedIn Post Inspector ↗</a>
          </div>
          <p className="field-help">These official tools can request platform-side re-inspection. OpenGraph Preview itself does not clear third-party caches.</p>
        </>}
      </div>}
    </div>
  );
}
