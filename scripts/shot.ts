import { chromium } from "playwright-core";

const shots: [string, string][] = [
  ["http://localhost:3100/", "/tmp/shot-home-full.png"],
  ["http://localhost:3100/shop", "/tmp/shot-shop.png"],
  ["http://localhost:3100/product/25", "/tmp/shot-product.png"],
];

async function main(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors: string[] = [];
    page.on("pageerror", (e: Error) => errors.push("PAGEERROR: " + e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push("CONSOLE: " + m.text().slice(0, 200));
    });
    for (const [url, path] of shots) {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path, fullPage: true });
      console.log("saved", path);
    }
    console.log("ERRORS:", errors.length > 0 ? errors.join("\n") : "none");
  } finally {
    await browser.close();
  }
}

main().catch((e: unknown) => {
  console.error("SCRIPT FAILED:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
