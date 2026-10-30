import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { safeFetch, validatePublicUrl } from "@/lib/safe-fetch";
import { buildDiagnostics, inspectImage, parseHtml } from "@/lib/og";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { BodyTooLargeError, readJsonBody } from "@/lib/request-body";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ url: z.string().min(1).max(2048) });

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 10_000) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });

  const clientKey = getClientKey(request.headers);
  try {
    const limit = await checkRateLimit(clientKey);
    if (!limit.success) return NextResponse.json({ error: "Rate limit reached. Please wait a little before inspecting another URL." }, { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))) } });
  } catch {
    // An unavailable optional rate-limit service must not expose the inspector to unbounded traffic.
    return NextResponse.json({ error: "The inspection service is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  let payload: unknown;
  try { payload = await readJsonBody(request, 10_000); }
  catch (error) {
    if (error instanceof BodyTooLargeError) return NextResponse.json({ error: error.message }, { status: 413 });
    return NextResponse.json({ error: "Send a valid JSON request." }, { status: 400 });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid website URL." }, { status: 400 });

  try {
    const target = validatePublicUrl(parsed.data.url);
    const response = await safeFetch(target.toString(), { maxBytes: 2_000_000, timeoutMs: 7_000, maxRedirects: 4 });
    const contentType = String(response.headers["content-type"] || "").toLowerCase();
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      return NextResponse.json({ error: `The URL returned ${contentType.split(";")[0] || "an unknown content type"}, not an HTML page. Inspect a page URL instead.` }, { status: 422 });
    }
    if (response.status < 200 || response.status >= 400) {
      return NextResponse.json({ error: `The website returned HTTP ${response.status}. Check that the page is public and available.` }, { status: 502 });
    }
    const html = response.body.toString("utf8");
    const metadata = parseHtml(html, response.finalUrl);
    const image = metadata.image ? await inspectImage(metadata.image) : null;
    const diagnostics = buildDiagnostics(metadata, image, response.status, response.finalUrl);
    const summary = {
      errors: diagnostics.filter((item) => item.level === "error").length,
      warnings: diagnostics.filter((item) => item.level === "warning").length,
      passed: diagnostics.filter((item) => item.level === "info").length,
    };
    return NextResponse.json({
      ok: true,
      metadata,
      image,
      diagnostics,
      summary,
      response: {
        status: response.status,
        contentType: response.headers["content-type"] || "",
        finalUrl: response.finalUrl,
        redirects: response.redirects,
        bytes: response.body.length,
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not inspect this URL.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
