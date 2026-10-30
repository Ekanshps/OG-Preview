import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { brotliDecompressSync, gunzipSync, inflateSync } from "node:zlib";
import { isIP } from "node:net";

type SafeResponse = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
  finalUrl: string;
  redirects: string[];
};

function ipv4ToNumber(ip: string) {
  return ip.split(".").reduce((acc, part) => ((acc << 8) | Number(part)) >>> 0, 0);
}
function inRange(ip: string, base: string, maskBits: number) {
  const value = ipv4ToNumber(ip);
  const network = ipv4ToNumber(base);
  const mask = maskBits === 0 ? 0 : (0xffffffff << (32 - maskBits)) >>> 0;
  return (value & mask) === (network & mask);
}
function isPublicAddress(address: string) {
  const version = isIP(address);
  if (version === 4) {
    const blocked: [string, number][] = [
      ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
      ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.0.2.0", 24],
      ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24], ["203.0.113.0", 24],
      ["224.0.0.0", 4], ["240.0.0.0", 4],
    ];
    return !blocked.some(([base, bits]) => inRange(address, base, bits));
  }
  if (version === 6) {
    const normalized = address.toLowerCase().split("%" )[0];
    if (normalized.startsWith("::ffff:")) {
      const mapped = normalized.slice(7);
      if (isIP(mapped) === 4) return isPublicAddress(mapped);
      return false;
    }
    // Only allow global-unicast IPv6 (2000::/3). Block known special-use,
    // documentation, benchmarking, transition and reserved ranges conservatively.
    if (!/^[23]/.test(normalized)) return false;
    const hextets = normalized.split(":");
    const second = hextets[1] ? Number.parseInt(hextets[1], 16) : 0;
    if (hextets[0] === "2001" && Number.isFinite(second) && second <= 0x01ff) return false; // IETF special-purpose assignments
    if (second === 0x0db8 || normalized.startsWith("2002:") || normalized.startsWith("3fff:")) return false;
    return true;
  }
  return false;
}

export function validatePublicUrl(input: string): URL {
  if (input.length > 2048) throw new Error("URL is too long.");
  let url: URL;
  try { url = new URL(input); } catch { throw new Error("Enter a valid, complete URL including https://."); }
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (url.username || url.password) throw new Error("URLs containing embedded credentials are not allowed.");
  const standardPort = url.protocol === "https:" ? "443" : "80";
  if (url.port && url.port !== standardPort) throw new Error("Only standard HTTP and HTTPS ports are allowed.");
  if (!url.hostname || url.hostname === "localhost" || url.hostname.endsWith(".localhost") || url.hostname.endsWith(".local")) {
    throw new Error("Private and localhost addresses cannot be inspected remotely. Paste the HTML instead.");
  }
  return url;
}

async function resolvePublicHost(hostname: string) {
  const ipVersion = isIP(hostname);
  if (ipVersion) {
    if (!isPublicAddress(hostname)) throw new Error("The requested host resolves to a private or reserved IP address.");
    return [{ address: hostname, family: ipVersion }];
  }
  const records = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!records.length || records.some((record) => !isPublicAddress(record.address))) {
    throw new Error("This hostname resolves to a private or reserved network address and cannot be inspected.");
  }
  return records;
}

function requestOnce(url: URL, maxBytes: number, timeoutMs: number): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: Buffer }> {
  return new Promise(async (resolve, reject) => {
    try {
      const addresses = await resolvePublicHost(url.hostname);
      const chosen = addresses.find((record) => record.family === 4) || addresses[0];
      const transport = url.protocol === "https:" ? https : http;
      const request = transport.request({
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        method: "GET",
        path: `${url.pathname}${url.search}`,
        headers: {
          "User-Agent": "OpenGraphPreviewBot/1.0 (+https://ogpreview.epsingh.in)",
          Accept: "text/html,application/xhtml+xml,image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.5",
          "Accept-Encoding": "identity",
          "Cache-Control": "no-cache",
        },
        // Pin the request to the validated DNS answers to reduce DNS-rebinding risk.
        // Node.js may call custom lookup functions with options.all=true (notably
        // when autoSelectFamily is enabled). In that mode the callback MUST receive
        // an array of { address, family } records, not a single address string.
        lookup: ((_hostname: string, lookupOptions: { family?: number; all?: boolean }, callback: (
          error: NodeJS.ErrnoException | null,
          address: string | Array<{ address: string; family: number }>,
          family?: number,
        ) => void) => {
          const eligible = lookupOptions?.family
            ? addresses.filter((record) => record.family === lookupOptions.family)
            : addresses;
          if (!eligible.length) {
            const error = Object.assign(new Error("No validated address matched the requested IP family."), { code: "ENOTFOUND" }) as NodeJS.ErrnoException;
            if (lookupOptions?.all) callback(error, []);
            else callback(error, "", 0);
            return;
          }
          if (lookupOptions?.all) {
            callback(null, eligible);
            return;
          }
          const selected = eligible.find((record) => record.family === 4) || eligible[0];
          callback(null, selected.address, selected.family);
        }) as never,
        servername: isIP(url.hostname) ? undefined : url.hostname,
        timeout: timeoutMs,
        signal: AbortSignal.timeout(timeoutMs),
      }, (response) => {
        const chunks: Buffer[] = [];
        let size = 0;
        response.on("data", (chunk: Buffer | string) => {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          size += buffer.length;
          if (size > maxBytes) {
            request.destroy(new Error("The response is larger than the allowed inspection limit."));
            return;
          }
          chunks.push(buffer);
        });
        response.on("end", () => {
          try {
            const compressed = Buffer.concat(chunks);
            const encoding = String(response.headers["content-encoding"] || "identity").toLowerCase();
            let body = compressed;
            if (encoding === "gzip" || encoding === "x-gzip") body = gunzipSync(compressed, { maxOutputLength: maxBytes });
            else if (encoding === "deflate") body = inflateSync(compressed, { maxOutputLength: maxBytes });
            else if (encoding === "br") body = brotliDecompressSync(compressed, { maxOutputLength: maxBytes });
            else if (encoding !== "identity") throw new Error("The website used an unsupported content encoding.");
            if (body.length > maxBytes) throw new Error("The decompressed response is larger than the allowed inspection limit.");
            resolve({ status: response.statusCode || 0, headers: response.headers, body });
          } catch (error) { reject(error); }
        });
        response.on("error", reject);
      });
      request.on("timeout", () => request.destroy(new Error("The website took too long to respond.")));
      request.on("error", reject);
      request.end();
    } catch (error) { reject(error); }
  });
}

export async function safeFetch(input: string, options?: { maxBytes?: number; timeoutMs?: number; maxRedirects?: number }): Promise<SafeResponse> {
  let current = validatePublicUrl(input);
  const maxBytes = options?.maxBytes ?? 2_000_000;
  const timeoutMs = options?.timeoutMs ?? 9_000;
  const maxRedirects = options?.maxRedirects ?? 4;
  const redirects: string[] = [];

  for (let hop = 0; hop <= maxRedirects; hop += 1) {
    const result = await requestOnce(current, maxBytes, timeoutMs);
    if ([301, 302, 303, 307, 308].includes(result.status)) {
      const location = result.headers.location;
      if (!location) return { ...result, finalUrl: current.toString(), redirects };
      if (hop === maxRedirects) throw new Error("The page redirected too many times.");
      const next = validatePublicUrl(new URL(location, current).toString());
      redirects.push(next.toString());
      current = next;
      continue;
    }
    return { ...result, finalUrl: current.toString(), redirects };
  }
  throw new Error("Could not complete the website request.");
}
