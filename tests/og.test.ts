import { describe, expect, it } from "vitest";
import { parseHtml, buildDiagnostics } from "@/lib/og";
import { validatePublicUrl } from "@/lib/safe-fetch";

describe("Open Graph parsing", () => {
  it("extracts core OG properties and resolves relative image paths", () => {
    const metadata = parseHtml(`<!doctype html><html><head><title>Fallback title</title><meta property="og:title" content="Article title"><meta property="og:description" content="A short description"><meta property="og:type" content="article"><meta property="og:url" content="https://example.com/post"><meta property="og:image" content="/share.jpg"><meta property="og:image:alt" content="Article cover"><meta name="twitter:card" content="summary_large_image"></head></html>`, "https://example.com/post");
    expect(metadata.title).toBe("Article title");
    expect(metadata.image).toBe("https://example.com/share.jpg");
    expect(metadata.hasOgTitle).toBe(true);
    expect(metadata.hasOgUrl).toBe(true);
  });
  it("flags absent required properties separately from title fallbacks", () => {
    const metadata = parseHtml("<html><head><title>Page title only</title></head></html>", "https://example.com/");
    expect(metadata.title).toBe("Page title only");
    expect(metadata.hasOgTitle).toBe(false);
    const diagnostics = buildDiagnostics(metadata, null, 200, "https://example.com/");
    expect(diagnostics.some((item) => item.title === "Missing og:title")).toBe(true);
  });
});

describe("Public URL guard", () => {
  it("accepts standard public HTTP and HTTPS URL syntax", () => {
    expect(validatePublicUrl("https://example.com/article").hostname).toBe("example.com");
    expect(validatePublicUrl("http://example.com/").protocol).toBe("http:");
  });
  it("rejects localhost, private-like names, credentials and nonstandard ports", () => {
    expect(() => validatePublicUrl("http://localhost:3000")).toThrow();
    expect(() => validatePublicUrl("http://service.local")).toThrow();
    expect(() => validatePublicUrl("https://user:pass@example.com")).toThrow();
    expect(() => validatePublicUrl("https://example.com:8080")).toThrow();
  });
});
