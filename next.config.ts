import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
