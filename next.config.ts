import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Academy media (hundreds of MB of NotebookLM audio/video) is served as static
  // files; never let it be traced into a serverless function bundle (250 MB cap).
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
