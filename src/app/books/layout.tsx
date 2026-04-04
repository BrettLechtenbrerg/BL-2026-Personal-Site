import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books by Brett Lechtenberg",
  description:
    "Seven published books on peak performance, martial arts mastery, and business success. Including The Master's Edge and foundational works on mindset and skill development.",
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
      "Seven published books on peak performance, martial arts mastery, and business success.",
    url: "https://brettlechtenberg.com/books",
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
      "Seven books on peak performance and business success.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/books",
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
