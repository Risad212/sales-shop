import { chromium } from "playwright-core";

const URL = process.env.SHOT_URL ?? "http://localhost:3000/";
const OUT_TOP = "/tmp/shot-home-top.png";
const OUT_FULL = "/tmp/shot-home-full.png";

async function main(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors: string[] = [];
    page.on("pageerror", (e: Error) => errors.push("PAGEERROR: " + e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push("CONSOLE: " + m.text().slice(0, 200));
    });
    await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: OUT_TOP });
    await page.screenshot({ path: OUT_FULL, fullPage: true });
    console.log("ERRORS:", errors.length > 0 ? errors.join("\n") : "none");
  } finally {
    await browser.close();
  }
}

main().catch((e: unknown) => {
  console.error("SCRIPT FAILED:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
