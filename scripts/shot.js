const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("CONSOLE: " + m.text().slice(0, 200));
  });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "/tmp/shot-home-top.png" });
  await page.screenshot({ path: "/tmp/shot-home-full.png", fullPage: true });
  console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
  await browser.close();
})().catch((e) => {
  console.error("SCRIPT FAILED:", e.message);
  process.exit(1);
});
