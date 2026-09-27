import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Master's Edge | New Book Coming October 2026",
  description:
    "The Master's Edge: Ancient Discipline, Modern Leadership. Brett Lechtenberg's definitive guide to First Principles, Frontloading, and Flow, coming October 2026.",
  keywords: [
    "The Master's Edge book",
    "Brett Lechtenberg new book",
    "peak performance book",
    "leadership book 2026",
    "first principles frontloading flow",
    "flow state book",
    "martial arts leadership",
  ],
  openGraph: {
    title: "The Master's Edge | New Book Coming October 2026",
    description:
      "Ancient Discipline, Modern Leadership. Brett Lechtenberg's definitive guide to First Principles, Frontloading, and Flow.",
    url: "https://www.brettlechtenberg.com/books/masters-edge",
    images: [
      {
        url: "/books/masters-edge-stack.jpg",
        width: 1536,
        height: 1024,
        alt: "The Master's Edge hardcover book by Brett Lechtenberg",
      },
    ],
  },
  twitter: {
    title: "The Master's Edge | New Book Coming October 2026",
    description:
      "Ancient Discipline, Modern Leadership. Coming October 2026.",
  },
  alternates: {
    canonical: "https://www.brettlechtenberg.com/books/masters-edge",
  },
};

export default function MastersEdgeBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
