import type { Metadata } from "next";

// Internal preview page — never indexed, never in the sitemap or nav.
export const metadata: Metadata = {
  title: "Quiz Results Gallery (Internal) | Brett Lechtenberg",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function QuizResultsGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
