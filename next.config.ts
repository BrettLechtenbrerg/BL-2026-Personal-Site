import type { NextConfig } from "next";
import { MEDIA_EXTENSIONS } from "./src/lib/r2-presign.mjs";

const nextConfig: NextConfig = {
  // Academy media (GBs of NotebookLM audio/video) must never be traced into a
  // serverless function bundle (250 MB cap). On Vercel it plays from R2; see rewrites().
  outputFileTracingExcludes: { "*": ["./public/academy/**"] },
  images: {
    // Academy profile photos live in Supabase Storage (public bucket).
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site uses no camera, microphone or location; embedded videos keep fullscreen and autoplay.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Only this site and Brett's own subdomains may show these pages in a frame (clickjacking).
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://*.brettlechtenberg.com" },
        ],
      },
    ];
  },
  async rewrites() {
    // Lesson video and audio live in a private R2 bucket (docs/ACADEMY.md, "Lesson media on R2"). On Vercel the files
    // are left out of the deployment, so the address falls through to the members-only gate. Where the file is still
    // in /public (a Mac), it is served from there as before: these rewrites only run when no file matches.
    return [
      {
        source: `/academy/:slug/:file([a-z0-9][a-z0-9-]*\\.(?:${Object.keys(MEDIA_EXTENSIONS).join("|")}))`,
        destination: "/api/media/academy/:slug/:file",
      },
    ];
  },
  async redirects() {
    return [
      // Old static-site URLs Google still remembers (301 -> canonical pages)
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/adults.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
