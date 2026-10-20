import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Master's Edge | New Book by Brett Lechtenberg, Out Now",
  description:
    "The Master's Edge: Mastering Business and Life Through Mindset, Skillset, and Systems Design. Brett Lechtenberg's guide to First Principles, Frontloading, and Flow. Out now in paperback and on Kindle.",
  keywords: [
    "The Master's Edge book",
    "Brett Lechtenberg new book",
    "peak performance book",
    "leadership book 2026",
    "Mastering Business and Life Through Mindset, Skillset, and Systems Design",
    "first principles frontloading flow",
    "flow state book",
    "martial arts leadership",
  ],
  openGraph: {
    title: "The Master's Edge | New Book by Brett Lechtenberg, Out Now",
    description:
      "Ancient Discipline, Modern Leadership. Brett Lechtenberg's definitive guide to First Principles, Frontloading, and Flow.",
    url: "https://www.brettlechtenberg.com/books/masters-edge",
    images: [
      {
        url: "/books/masters-edge-og.jpg",
        width: 1200,
        height: 630,
        alt: "The Master's Edge by Brett Lechtenberg",
      },
    ],
  },
  twitter: {
    title: "The Master's Edge | New Book by Brett Lechtenberg, Out Now",
    description:
      "Ancient Discipline, Modern Leadership. Out now in paperback and on Kindle.",
    images: ["/books/masters-edge-og.jpg"],
  },
  alternates: {
    canonical: "https://www.brettlechtenberg.com/books/masters-edge",
  },
};

// Book structured data (published Oct 19, 2026). Helps search and AI engines
// tie "The Master's Edge" to Brett, not the unrelated themastersedge.com.
const bookSchema = {
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": "https://www.brettlechtenberg.com/books/masters-edge#book",
  name: "The Master's Edge",
  alternateName:
    "The Master's Edge: Mastering Business and Life Through Mindset, Skillset, and Systems Design",
  author: { "@id": "https://www.brettlechtenberg.com/#brett", "@type": "Person", name: "Brett Lechtenberg" },
  url: "https://www.brettlechtenberg.com/books/masters-edge",
  image: "https://www.brettlechtenberg.com/books/masters-edge-cover.jpg",
  datePublished: "2026-10-19",
  inLanguage: "en-US",
  description:
    "Mastery is a system you can build, on the mat and in the boardroom. Nineteen chapters on Mindset, Skillset, and Systems Design, taught the way a master teaches: parable first, principle second, practice always.",
  workExample: [
    {
      "@type": "Book",
      bookFormat: "https://schema.org/Paperback",
      isbn: "9798178891940",
      numberOfPages: 253,
      url: "https://www.amazon.com/dp/B0HNHZ2D7M",
    },
    {
      "@type": "Book",
      bookFormat: "https://schema.org/EBook",
      url: "https://www.amazon.com/dp/B0HNJ378J6",
    },
  ],
};

export default function MastersEdgeBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
      {children}
    </>
  );
}
