// Renders a one-sheet HTML file to PDF.
// Usage: NODE_PATH="$(npm root -g)" node scripts/one-sheet/render.cjs [input.html] [output.pdf]
// Defaults: one-sheet.html → public/brett-lechtenberg-speaker-one-sheet.pdf (the website one-sheet).
// Agency edition: node render.cjs agency-one-sheet.html Brett-Lechtenberg-Speaker-One-Sheet-AGENCY.pdf
// Requires globally installed playwright (used by the agent screenshot tool)
// with its Chromium cache. Fonts load from Google Fonts (needs network).
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const htmlArg = process.argv[2] || "one-sheet.html";
  const outArg =
    process.argv[3] ||
    path.join("..", "..", "public", "brett-lechtenberg-speaker-one-sheet.pdf");
  const htmlPath = path.resolve(__dirname, htmlArg);
  const outPath = path.resolve(__dirname, outArg);

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
