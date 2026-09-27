// Renders a one-sheet HTML file to PDF.
// Usage: NODE_PATH="$(npm root -g)" node scripts/one-sheet/render.cjs [input.html] [output.pdf]
// Defaults: one-sheet.html → public/brett-lechtenberg-speaker-one-sheet.pdf (the website one-sheet).
// Agency edition: node render.cjs agency-one-sheet.html Brett-Lechtenberg-Speaker-One-Sheet-AGENCY.pdf
// Requires globally installed playwright (used by the agent screenshot tool)
// with its Chromium cache. Fonts load from Google Fonts (needs network).
// If Playwright was upgraded and says "Executable doesn't exist", point it at
// any Chromium already in the cache instead of downloading a new one:
//   CHROMIUM_PATH="$(ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac*/*.app/Contents/MacOS/* | head -1)" \
//   NODE_PATH="$(npm root -g)" node scripts/one-sheet/render.cjs ...
// It also prints a page-fit check: every page must report contentBottom <= pageBottom
// (anything past that is cut off in the PDF).
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const htmlArg = process.argv[2] || "one-sheet.html";
  const outArg =
    process.argv[3] ||
    path.join("..", "..", "public", "brett-lechtenberg-speaker-one-sheet.pdf");
  const htmlPath = path.resolve(__dirname, htmlArg);
  const outPath = path.resolve(__dirname, outArg);

  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  const page = await browser.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const fit = await page.evaluate(() =>
    [...document.querySelectorAll(".page")].map((p, i) => ({
      page: i + 1,
      pageBottom: Math.round(p.getBoundingClientRect().bottom),
      contentBottom: Math.round(
        Math.max(...[...p.querySelectorAll("*")].map((el) => el.getBoundingClientRect().bottom)),
      ),
    })),
  );
  console.log("Page fit:", JSON.stringify(fit));
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
