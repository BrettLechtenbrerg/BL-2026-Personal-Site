import type { Metadata } from "next";

// COMMS HUB — internal tool. noindex + not in sitemap.ts + not linked in the
// nav. The real security boundary is the HMAC session cookie every /api/hub/*
// route verifies (src/lib/hub-session.ts); this metadata just keeps the login
// page out of search results.
export const metadata: Metadata = {
  title: "Comms Hub | Brett Lechtenberg",
  description: "Internal communication tool.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
