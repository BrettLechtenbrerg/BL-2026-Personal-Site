import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books by Brett Lechtenberg",
  description:
    "Seven books, five bestsellers, on time management, family safety, and AI for business owners. Plus The Master's Edge, coming October 2026.",
  keywords: [
    "Brett Lechtenberg books",
    "The Master's Edge book",
    "peak performance books",
    "martial arts books",
    "business books",
    "leadership books",
    "mindset books",
    "flow state book",
    "self improvement books",
    "professional development books",
  ],
  openGraph: {
    title: "Books by Brett Lechtenberg",
    description:
      "Seven books, five bestsellers, on time management, family safety, and AI for business owners.",
    url: "https://www.brettlechtenberg.com/books",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Books by Brett Lechtenberg",
      },
    ],
  },
  twitter: {
    title: "Books by Brett Lechtenberg",
    description:
      "Seven books, five bestsellers. The Master's Edge is coming October 2026.",
  },
  alternates: {
    canonical: "https://www.brettlechtenberg.com/books",
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
