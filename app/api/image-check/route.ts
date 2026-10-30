import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { inspectImage } from "@/lib/og";
import { validatePublicUrl } from "@/lib/safe-fetch";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { BodyTooLargeError, readJsonBody } from "@/lib/request-body";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const schema = z.object({ url: z.string().min(1).max(2048) });

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request.headers);
  try {
    const limit = await checkRateLimit(`image:${clientKey}`);
    if (!limit.success) return NextResponse.json({ error: "Rate limit reached. Please wait before checking another image." }, { status: 429 });
  } catch { return NextResponse.json({ error: "The image inspection service is temporarily unavailable." }, { status: 503 }); }
  let payload: unknown;
  try { payload = await readJsonBody(request, 10_000); }
  catch (error) {
    if (error instanceof BodyTooLargeError) return NextResponse.json({ error: error.message }, { status: 413 });
    return NextResponse.json({ error: "Send valid JSON." }, { status: 400 });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid image URL." }, { status: 400 });
  try {
    const url = validatePublicUrl(parsed.data.url);
    const result = await inspectImage(url.toString());
    if (!result) return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
    return NextResponse.json({ ok: result.ok, image: result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Image inspection failed." }, { status: 400 }); }
}
