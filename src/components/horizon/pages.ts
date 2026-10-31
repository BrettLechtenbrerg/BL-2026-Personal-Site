// Pages built in the Horizon design whose photo top runs under the menu (the menu stays clear until you scroll).
// Add a path here when its page is converted (Groups 1–4, Oct 2026). Every blog post is a Horizon page.
const HORIZON_HERO_PATHS: ReadonlySet<string> = new Set([
  "/", "/about", "/coaching", "/masters-edge", "/speaking", "/ai-advisory", "/testimonials", "/masters-edge-program",
  "/books", "/books/masters-edge", "/media-kit", "/blog",
]);

export function isHorizonHeroPath(pathname: string): boolean {
  return HORIZON_HERO_PATHS.has(pathname) || pathname.startsWith("/blog/");
}
