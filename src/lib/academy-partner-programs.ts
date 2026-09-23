// Pure, bounded metadata helpers. No module/progress/certificate dependencies.
export interface PartnerVideo {
  youtubeId: string;
  title: string;
  categories: string[];
  language: string;
  sourceUrl: string;
  version?: string;
}
// Locally stored poster frames. Site-owned files, so the library can show real faces
// without contacting the video host before a member deliberately presses Play.
// One directory plus fixed dimensions: each video's file is derived from its own ID,
// so a thumbnail can never be paired with the wrong video.
export interface PartnerThumbs {
  dir: string;
  width: number;
  height: number;
}
export function partnerThumbSrc(thumbs: PartnerThumbs, youtubeId: string): string | undefined {
  return isYouTubeId(youtubeId) ? `${thumbs.dir}/${youtubeId}.webp` : undefined;
}
export interface PartnerImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}
export interface PartnerProgramSummary {
  slug: string;
  title: string;
  description: string;
  creators: string[];
  logo: string;
  image?: PartnerImage;
  // The partner's own banner colour. Site-supplied so no brand is hardcoded in the
  // shared engine. Surfaces always pair it with white text, so it must be dark.
  brandColor?: string;
}
// Fallback matches the Academy's authored-dark surface, which is safe behind white text.
export const DEFAULT_BRAND_COLOR = "#1F2937";
export interface PartnerProgram extends PartnerProgramSummary {
  partnerCredit: string;
  website: string;
  catalogUrl: string;
  appUrl?: string;
  appDescription?: string;
  videos: PartnerVideo[];
  ribbon?: PartnerImage;
  thumbs?: PartnerThumbs;
}
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function isPartnerSlug(value: string): boolean {
  return value.length <= 60 && slugPattern.test(value);
}
export function isYouTubeId(value: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(value);
}
function httpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return value.length <= 2048 && url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}
function text(value: string, max = 600): boolean {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}
// Dark enough for the white text drawn on it to clear WCAG 2.2 AA (4.5:1).
// Focus rings are drawn outside these surfaces, so they contrast with the page instead.
function validBrandColor(value: string): boolean {
  if (!/^#[0-9a-fA-F]{6}$/.test(value)) return false;
  const channel = (i: number) => {
    const c = parseInt(value.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
  return (1.05 / (luminance + 0.05)) >= 4.5;
}
function validThumbs(t: PartnerThumbs): boolean {
  return /^\/partners\/[a-z0-9-]+\/[a-z0-9-]+$/.test(t.dir) &&
    Number.isInteger(t.width) && t.width > 0 && t.width <= 4096 &&
    Number.isInteger(t.height) && t.height > 0 && t.height <= 4096;
}
function validImage(image: PartnerImage): boolean {
  return /^\/partners\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|png|jpg)$/.test(image.src) &&
    typeof image.alt === "string" && image.alt.length <= 240 &&
    Number.isInteger(image.width) && image.width > 0 && image.width <= 4096 &&
    Number.isInteger(image.height) && image.height > 0 && image.height <= 4096;
}
export function definePartnerPrograms(programs: PartnerProgram[]): PartnerProgram[] {
  if (programs.length > 20) throw new Error("Too many partner programs");
  const slugs = new Set<string>();
  for (const p of programs) {
    if (!isPartnerSlug(p.slug) || slugs.has(p.slug) || !text(p.title, 160) ||
        !text(p.description) || !text(p.partnerCredit) ||
        p.creators.length < 1 || p.creators.length > 10 || !p.creators.every(c => text(c, 160)) ||
        !/^\/partners\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|png|jpg|svg)$/.test(p.logo) ||
        !httpsUrl(p.website) || !httpsUrl(p.catalogUrl) ||
        (p.image !== undefined && (!validImage(p.image) || !text(p.image.alt, 240))) ||
        (p.brandColor !== undefined && !validBrandColor(p.brandColor)) ||
        (p.ribbon !== undefined && !validImage(p.ribbon)) ||
        (p.thumbs !== undefined && !validThumbs(p.thumbs)) ||
        (p.appUrl !== undefined && !httpsUrl(p.appUrl)) ||
        (p.appDescription !== undefined && !text(p.appDescription)) ||
        p.videos.length < 1 || p.videos.length > 200) throw new Error("Invalid partner program metadata");
    slugs.add(p.slug);
    const ids = new Set<string>();
    for (const v of p.videos) {
      if (!isYouTubeId(v.youtubeId) || ids.has(v.youtubeId) || !text(v.title, 240) ||
          !httpsUrl(v.sourceUrl) || !/^[a-z]{2}(?:-[A-Z]{2})?$/.test(v.language) ||
          v.categories.length > 20 || !v.categories.every(c => text(c, 100)) ||
          (v.version !== undefined && !text(v.version, 100))) throw new Error("Invalid partner video metadata");
      ids.add(v.youtubeId);
    }
  }
  return programs;
}
export function partnerSummaries(programs: PartnerProgram[]): PartnerProgramSummary[] {
  return programs.map(({ slug, title, description, creators, logo, image, brandColor }) => ({ slug, title, description, creators, logo, image, brandColor }));
}
export function findPartnerProgram(programs: PartnerProgram[], slug: string) {
  return isPartnerSlug(slug) ? programs.find(p => p.slug === slug) : undefined;
}
// Read the RAW query so percent-encoded paths are not silently decoded into allowed ones.
// Only this exact internal route family is accepted; everything else retains the old destination.
export function partnerReturnPath(search: string): string {
  const fallback = "/academy/dashboard";
  if (search.length > 256 || !/^\?next=\/academy\/programs\/[a-z0-9-]+$/.test(search)) return fallback;
  const path = search.slice(6);
  return isPartnerSlug(path.slice("/academy/programs/".length)) ? path : fallback;
}
