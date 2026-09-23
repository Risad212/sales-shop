import { writeFileSync } from "fs";

async function pic(query: string): Promise<string> {
  const p = new URLSearchParams({
    action: "query", format: "json", generator: "search",
    gsrsearch: query, gsrnamespace: "6", gsrlimit: "6",
    prop: "imageinfo", iiprop: "url|size", iiurlwidth: "800", origin: "*",
  });
  const r = await fetch("https://commons.wikimedia.org/w/api.php?" + p, {
    headers: { "User-Agent": "sales-shop/1.0" },
  });
  const d = (await r.json()) as {
    query?: { pages?: Record<string, { title?: string; imageinfo?: { thumburl?: string; url?: string }[] }> };
  };
  for (const pg of Object.values(d.query?.pages ?? {})) {
    const u = pg.imageinfo?.[0]?.thumburl ?? pg.imageinfo?.[0]?.url;
    if (u && /\.(jpe?g|png|webp)(\?|$)/i.test(u)) return u;
  }
  throw new Error("miss: " + query);
}

async function main(): Promise<void> {
  const jobs: [string, string][] = [
    ["children clothes", "public/seed/cat-kids.jpg"],
    ["colorful toys", "public/seed/cat-toys.jpg"],
  ];
  for (const [q, f] of jobs) {
    const u = await pic(q);
    const r = await fetch(u);
    if (!r.ok) throw new Error("download failed: " + q);
    writeFileSync(f, Buffer.from(await r.arrayBuffer()));
    console.log("saved", f);
    await new Promise((rr) => setTimeout(rr, 800));
  }
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
