import * as cheerio from "cheerio";
import sharp from "sharp";
import { safeFetch } from "@/lib/safe-fetch";

export type SocialMetadata = {
  title: string;
  description: string;
  url: string;
  image: string;
  type: string;
  siteName: string;
  imageAlt: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  locale: string;
  pageTitle: string;
  metaDescription: string;
  duplicateTags: string[];
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
  hasOgUrl: boolean;
  hasOgType: boolean;
  hasTwitterCard: boolean;
  ogImageIsAbsolute: boolean;
  ogUrlIsAbsolute: boolean;
};
export type Diagnostic = { level: "error" | "warning" | "info"; title: string; detail: string };

function firstMeta($: cheerio.CheerioAPI, selectors: string[]) {
  for (const selector of selectors) {
    const value = $(selector).first().attr("content")?.trim();
    if (value) return value;
  }
  return "";
}
function resolveUrl(value: string, base: string) {
  if (!value) return "";
  try { return new URL(value, base).toString(); } catch { return value; }
}
function isHttpAbsolute(value: string) {
  try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; }
}

export function parseHtml(html: string, baseUrl = "https://example.com/"): SocialMetadata {
  const $ = cheerio.load(html);
  const ogTitle = firstMeta($, ['meta[property="og:title"]']);
  const ogDescription = firstMeta($, ['meta[property="og:description"]']);
  const ogImage = firstMeta($, ['meta[property="og:image"]', 'meta[property="og:image:url"]']);
  const ogUrl = firstMeta($, ['meta[property="og:url"]']);
  const ogType = firstMeta($, ['meta[property="og:type"]']);
  const twitterCard = firstMeta($, ['meta[name="twitter:card"]']);
  const title = ogTitle || $("title").first().text().trim();
  const description = ogDescription || firstMeta($, ['meta[name="description"]']);
  const imageRaw = ogImage;
  const urlRaw = ogUrl;
  const canonicalRaw = $('link[rel="canonical"]').first().attr("href")?.trim() || "";
  const keys = ["og:title", "og:description", "og:image", "og:url", "og:type", "twitter:card"];
  const duplicateTags = keys.filter((key) => {
    const selector = key.startsWith("og:") ? `meta[property="${key}"]` : `meta[name="${key}"]`;
    return $(selector).length > 1;
  });
  return {
    title,
    description,
    url: resolveUrl(urlRaw, baseUrl),
    image: resolveUrl(imageRaw, baseUrl),
    type: ogType,
    siteName: firstMeta($, ['meta[property="og:site_name"]']),
    imageAlt: firstMeta($, ['meta[property="og:image:alt"]']),
    twitterCard,
    twitterTitle: firstMeta($, ['meta[name="twitter:title"]']),
    twitterDescription: firstMeta($, ['meta[name="twitter:description"]']),
    twitterImage: resolveUrl(firstMeta($, ['meta[name="twitter:image"]']), baseUrl),
    canonical: resolveUrl(canonicalRaw, baseUrl),
    locale: firstMeta($, ['meta[property="og:locale"]']),
    pageTitle: $("title").first().text().trim(),
    metaDescription: firstMeta($, ['meta[name="description"]']),
    duplicateTags,
    hasOgTitle: Boolean(ogTitle),
    hasOgDescription: Boolean(ogDescription),
    hasOgImage: Boolean(ogImage),
    hasOgUrl: Boolean(ogUrl),
    hasOgType: Boolean(ogType),
    hasTwitterCard: Boolean(twitterCard),
    ogImageIsAbsolute: isHttpAbsolute(imageRaw),
    ogUrlIsAbsolute: isHttpAbsolute(urlRaw),
  };
}

export async function inspectImage(imageUrl: string) {
  if (!imageUrl) return null;
  try {
    const response = await safeFetch(imageUrl, { maxBytes: 6_000_000, timeoutMs: 5_000, maxRedirects: 3 });
    const contentType = String(response.headers["content-type"] || "").split(";")[0].toLowerCase();
    if (response.status < 200 || response.status >= 300) {
      return { ok: false, status: response.status, contentType, width: 0, height: 0, format: "", bytes: response.body.length, error: `Image URL returned HTTP ${response.status}.` };
    }
    if (!contentType.startsWith("image/")) {
      return { ok: false, status: response.status, contentType, width: 0, height: 0, format: "", bytes: response.body.length, error: `The image URL returned ${contentType || "an unknown content type"}, not an image.` };
    }
    if (contentType === "image/svg+xml" || contentType === "image/svg") return { ok: false, status: response.status, contentType, width: 0, height: 0, format: "svg", bytes: response.body.length, error: "SVG dimensions are not inspected. For broad social preview compatibility, use a raster image such as JPEG or PNG." };
    const metadata = await sharp(response.body, { failOn: "warning", limitInputPixels: 40_000_000 }).metadata();
    // Decode a tiny output to verify the image payload, not only its header metadata.
    await sharp(response.body, { failOn: "warning", limitInputPixels: 40_000_000 }).resize(1, 1).jpeg({ quality: 35 }).toBuffer();
    return {
      ok: Boolean(metadata.width && metadata.height), status: response.status, contentType,
      width: metadata.width || 0, height: metadata.height || 0, format: metadata.format || "unknown",
      bytes: response.body.length, error: metadata.width && metadata.height ? "" : "The file could not be decoded as a supported image.",
    };
  } catch (error) {
    return { ok: false, status: 0, contentType: "", width: 0, height: 0, format: "", bytes: 0, error: error instanceof Error ? error.message : "Image inspection failed." };
  }
}

export function buildDiagnostics(meta: SocialMetadata, image: Awaited<ReturnType<typeof inspectImage>>, pageStatus: number, finalUrl: string): Diagnostic[] {
  const checks: Diagnostic[] = [];
  if (pageStatus >= 200 && pageStatus < 300) checks.push({ level: "info", title: `Page responded with HTTP ${pageStatus}`, detail: `The server returned a successful response at ${finalUrl}.` });
  else checks.push({ level: "error", title: `Page returned HTTP ${pageStatus || "unknown"}`, detail: "A share crawler may be unable to read metadata from this response." });
  if (!meta.hasOgTitle) checks.push({ level: "error", title: "Missing og:title", detail: "Add a concise title that represents this specific page." });
  else checks.push({ level: "info", title: `og:title is present (${meta.title.length} characters)`, detail: "A page-specific Open Graph title was found." });
  if (!meta.hasOgDescription) checks.push({ level: "warning", title: "Missing og:description", detail: "Add an Open Graph description. A standard meta description is useful too." });
  if (!meta.hasOgType) checks.push({ level: "error", title: "Missing og:type", detail: "Set an appropriate Open Graph object type, such as website or article." });
  if (!meta.hasOgUrl) checks.push({ level: "error", title: "Missing og:url", detail: "Set the canonical URL for this Open Graph object." });
  if (!meta.hasOgImage) checks.push({ level: "error", title: "Missing og:image", detail: "Add an absolute HTTPS URL for the page's social sharing image." });
  else {
    if (!meta.ogImageIsAbsolute) checks.push({ level: "warning", title: "OG image URL is not absolute", detail: "Use a fully qualified image URL, including https:// and the hostname." });
    if (!/^https:\/\//i.test(meta.image)) checks.push({ level: "warning", title: "OG image does not use HTTPS", detail: "Use an HTTPS image URL where possible for compatibility and secure delivery." });
  }
  if (meta.hasOgUrl && !meta.ogUrlIsAbsolute) checks.push({ level: "warning", title: "og:url is not an absolute URL", detail: "Use the full canonical URL, including the scheme and hostname." });
  if (meta.image && image) {
    if (!image.ok) checks.push({ level: "error", title: "OG image could not be validated", detail: image.error || "The image request failed." });
    else {
      checks.push({ level: "info", title: `Image is reachable (${image.width} × ${image.height})`, detail: `${image.format.toUpperCase()} · ${(image.bytes / 1024).toFixed(0)} KB · HTTP ${image.status}.` });
      const expectedFormat: Record<string, string> = { "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp", "image/avif": "heif", "image/gif": "gif" };
      if (expectedFormat[image.contentType] && expectedFormat[image.contentType] !== image.format) checks.push({ level: "warning", title: "Image content type differs from decoded format", detail: `The server labels this as ${image.contentType}, but the file content looks like ${image.format}. Align the response Content-Type with the actual image format.` });
      const ratio = image.width / image.height;
      if (ratio < 1.75 || ratio > 2.05) checks.push({ level: "warning", title: "Image aspect ratio differs from common large-card dimensions", detail: "A landscape image around 1.91:1 (for example, 1200 × 630) is a useful cross-platform starting point. Preview cropping can still vary." });
      if (image.width < 600 || image.height < 315) checks.push({ level: "warning", title: "Image resolution is relatively small", detail: "Consider a larger source image for crisp large-card previews." });
      if (image.bytes > 5_000_000) checks.push({ level: "warning", title: "Image file is larger than 5 MB", detail: "Consider compressing the source. Platform file limits vary." });
    }
  }
  if (!meta.imageAlt && meta.image) checks.push({ level: "warning", title: "Missing og:image:alt", detail: "Add a concise description of the image for accessibility." });
  if (!meta.hasTwitterCard) checks.push({ level: "warning", title: "Twitter Card type is not explicit", detail: "Consider setting twitter:card to summary_large_image if you want a large image card on X." });
  if (meta.canonical && meta.url) {
    try { if (new URL(meta.canonical).host !== new URL(meta.url).host) checks.push({ level: "warning", title: "Canonical and og:url use different hosts", detail: "Confirm that the two URLs intentionally identify the same canonical page." }); } catch { checks.push({ level: "warning", title: "Canonical URL could not be parsed", detail: "Check the canonical link href and use a valid absolute URL." }); }
  }
  if (meta.duplicateTags.length) checks.push({ level: "warning", title: "Duplicate metadata properties found", detail: `Multiple values were found for: ${meta.duplicateTags.join(", ")}. Remove conflicting duplicates.` });
  return checks;
}
