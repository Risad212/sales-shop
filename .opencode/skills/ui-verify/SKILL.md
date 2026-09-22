---
name: ui-verify
description: Visually verify pages with headless Chromium screenshots plus server checks. Use when the UI looks broken, after visual changes, or when asked to check, screenshot, or see what a page looks like.
---

# UI Verify skill (sales-shop)

Tooling is already installed: `playwright-core` (dev dep) + Chromium in the ms-playwright cache. Do NOT reinstall unless the cache is wiped.

## Screenshot script

`scripts/shot.js` — extend per need (viewport, URL, fullPage, interactions):

```js
const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text().slice(0, 200)); });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2500); // let client-side product fetch finish
  await page.screenshot({ path: "/tmp/shot-home-full.png", fullPage: true });
  console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
  await browser.close();
})();
```

Run with `node scripts/shot.js`, then **read the PNG** to judge layout/images. `pageerror`/`console error` capture counts as a failure.

## Server-side checks (do first)

- Dev server: `npx next dev` (port 3000). Kill strays first: `pkill -f "next dev"` — stale servers cause the "missing required error components, refreshing..." loop; the fix is a fresh server + hard refresh (Cmd+Shift+R).
- Pages must return 200: `/ /shop /cart /wishlist /contact /product/1 /category/electronics`.
- `src/app/error.tsx` + `global-error.tsx` boundaries exist — render errors must land there, never a refresh loop.
- Images: `curl -o /dev/null -w "%{http_code}"` on `public/` assets; every `<img>` in `src/**/*.tsx` must be local (`/products/…`, `/seed/…`), never remote.
- Product photos must topically match the product (past incident: random picsum placeholders). When replacing, prefer Wikimedia Commons via `scripts/fetch-real-photos.ts` and **visually read** each result — reject paintings, drawings, duplicates, mismatches.
