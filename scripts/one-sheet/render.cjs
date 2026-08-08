// Renders scripts/one-sheet/one-sheet.html → public/brett-lechtenberg-speaker-one-sheet.pdf
// Usage: NODE_PATH="$(npm root -g)" node scripts/one-sheet/render.cjs
// Requires globally installed playwright (used by the agent screenshot tool)
// with its Chromium cache. Fonts load from Google Fonts (needs network).
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const htmlPath = path.join(__dirname, "one-sheet.html");
  const outPath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "brett-lechtenberg-speaker-one-sheet.pdf"
  );

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: outPath,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log("Wrote", outPath);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
