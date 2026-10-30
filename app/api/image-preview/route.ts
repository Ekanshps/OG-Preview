import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { safeFetch, validatePublicUrl } from "@/lib/safe-fetch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function GET(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return NextResponse.json({ error: "Cross-origin image proxy requests are not allowed." }, { status: 403 });
  }
  const target = request.nextUrl.searchParams.get("url") || "";
  if (!target || target.length > 2048) {
    return NextResponse.json({ error: "Provide a valid image URL." }, { status: 400 });
  }

  const clientKey = getClientKey(request.headers);
  try {
    const limit = await checkRateLimit(`image-preview:${clientKey}`);
    if (!limit.success) {
      return NextResponse.json({ error: "Image preview limit reached. Please wait before trying again." }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "Image preview is temporarily unavailable." }, { status: 503 });
  }

  try {
    const safeUrl = validatePublicUrl(target);
    const response = await safeFetch(safeUrl.toString(), { maxBytes: 6_000_000, timeoutMs: 5_000, maxRedirects: 3 });
    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json({ error: `Image server returned HTTP ${response.status}.` }, { status: 422 });
    }

    const contentType = String(response.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, AVIF and GIF previews are supported." }, { status: 415 });
    }

    const metadata = await sharp(response.body, { failOn: "warning", limitInputPixels: 40_000_000 }).metadata();
    if (!metadata.width || !metadata.height || !metadata.format || !["jpeg", "png", "webp", "heif", "avif", "gif"].includes(metadata.format)) {
      return NextResponse.json({ error: "The response could not be decoded as a supported raster image." }, { status: 415 });
    }
    await sharp(response.body, { failOn: "warning", limitInputPixels: 40_000_000 }).resize(1, 1).jpeg({ quality: 35 }).toBuffer();

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Length": String(response.body.length),
      "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-origin",
    });
    return new NextResponse(new Uint8Array(response.body), { status: 200, headers });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load this image." }, { status: 400 });
  }
}
