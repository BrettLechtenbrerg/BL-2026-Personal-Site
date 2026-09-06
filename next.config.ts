import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
