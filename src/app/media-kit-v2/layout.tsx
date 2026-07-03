import { Metadata } from "next";

// HIDDEN DRAFT PAGE — Media Kit v2 (four-lane Talk & Training Topics).
// noindex + not in sitemap.ts + not linked in the Header nav.
// Side-by-side review draft; live page remains /media-kit untouched.
// Promote by moving the Talk & Training Topics section to /media-kit,
// then delete this route.
export const metadata: Metadata = {
  title: "Media Kit | Press & Speaking Resources",
  description:
    "Download Brett Lechtenberg's media kit, press photos, bio, and speaking topics. Everything event planners and media professionals need.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MediaKitV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
