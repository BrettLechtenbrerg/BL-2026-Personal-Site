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
