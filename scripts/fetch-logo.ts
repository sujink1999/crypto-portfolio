// scripts/fetch-logo.ts
// Usage: npx tsx scripts/fetch-logo.ts <slug> <page-url> [domain]
// Tries, in order: og:image / logo <img> on the given page, apple-touch-icon
// on the domain homepage, then Google favicon service.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [slug, pageUrl, domainArg] = process.argv.slice(2);
if (!slug || !pageUrl) {
  console.error("usage: fetch-logo <slug> <page-url> [domain]");
  process.exit(1);
}

const UA = { "user-agent": "Mozilla/5.0 (logo fetch for job pipeline)" };

async function html(url: string): Promise<string> {
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function extract(re: RegExp, s: string): string | null {
  const m = s.match(re);
  return m ? m[1] : null;
}

function absolute(src: string, base: string): string {
  return new URL(src, base).href;
}

async function candidates(): Promise<string[]> {
  const out: string[] = [];
  try {
    const page = await html(pageUrl);
    for (const re of [
      /<img[^>]+class="[^"]*logo[^"]*"[^>]+src="([^"]+)"/i,
      /<img[^>]+src="([^"]+)"[^>]+class="[^"]*logo[^"]*"/i,
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
      /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i,
    ]) {
      const hit = extract(re, page);
      if (hit) out.push(absolute(hit, pageUrl));
    }
  } catch (e) {
    console.error(`jd page failed: ${e}`);
  }
  const domain = domainArg ?? null;
  if (domain) {
    try {
      const home = await html(`https://${domain}`);
      for (const re of [
        /<link[^>]+rel="apple-touch-icon[^"]*"[^>]+href="([^"]+)"/i,
        /<link[^>]+href="([^"]+)"[^>]+rel="apple-touch-icon[^"]*"/i,
      ]) {
        const hit = extract(re, home);
        if (hit) out.push(absolute(hit, `https://${domain}`));
      }
    } catch (e) {
      console.error(`homepage failed: ${e}`);
    }
    out.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
  }
  return out;
}

const EXT: Record<string, string> = {
  "image/png": ".png", "image/jpeg": ".jpg", "image/svg+xml": ".svg", "image/webp": ".webp",
};

(async () => {
  for (const url of await candidates()) {
    try {
      const res = await fetch(url, { headers: UA, redirect: "follow" });
      if (!res.ok) continue;
      const type = (res.headers.get("content-type") ?? "").split(";")[0];
      const ext = EXT[type];
      if (!ext) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1024) continue; // skip tiny/broken favicons
      mkdirSync(join(process.cwd(), "public", "logos"), { recursive: true });
      const rel = join("public", "logos", `${slug}${ext}`);
      writeFileSync(join(process.cwd(), rel), buf);
      console.log(`/${rel.replace("public/", "logos/")}  (from ${url}, ${buf.length} bytes)`);
      process.exit(0);
    } catch { /* try next candidate */ }
  }
  console.error("no usable logo found");
  process.exit(2);
})();
