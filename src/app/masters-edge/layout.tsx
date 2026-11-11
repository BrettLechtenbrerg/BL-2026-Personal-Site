import type { Metadata } from "next";

export const metadata: Metadata = {
  // Absolute so the full name isn't doubled by the root "| Brett Lechtenberg" template.
  title: { absolute: "The Master's Edge by Brett Lechtenberg | Coaching Methodology" },
  description:
    "A science-backed coaching system, custom-built to help you reach peak performance. Built on 30+ years of experience and flow state research reviewed by the Flow Research Collective. CLARIFY. SIMPLIFY. MAXIMIZE.",
  keywords: [
    "The Master's Edge",
    "peak performance methodology",
    "flow state coaching",
    "executive coaching system",
    "leadership methodology",
    "mindset mastery",
    "skillset enhancement",
    "systems design",
    "first principles thinking",
    "Brett Lechtenberg",
  ],
  openGraph: {
    title: "The Master's Edge by Brett Lechtenberg",
    description:
      "A science-backed coaching system for peak performance. CLARIFY. SIMPLIFY. MAXIMIZE.",
    url: "https://www.brettlechtenberg.com/masters-edge",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Master's Edge by Brett Lechtenberg",
      },
    ],
  },
  twitter: {
    title: "The Master's Edge by Brett Lechtenberg",
    description:
      "A science-backed coaching system for peak performance. CLARIFY. SIMPLIFY. MAXIMIZE.",
  },
  alternates: {
    canonical: "https://www.brettlechtenberg.com/masters-edge",
  },
};

// Always the full name: a lawn-care company owns themastersedge.com, so the
// bare name lets AI engines confuse the two (AEO board, Oct 2026).
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://www.brettlechtenberg.com/masters-edge#course",
  name: "The Master's Edge by Brett Lechtenberg",
  alternateName: "The Master's Edge Methodology",
  url: "https://www.brettlechtenberg.com/masters-edge",
  description:
    "A science-backed peak performance coaching methodology by Brett Lechtenberg: CLARIFY, SIMPLIFY, MAXIMIZE. Built on 30+ years of experience and flow state research reviewed by the Flow Research Collective.",
  inLanguage: "en-US",
  provider: { "@id": "https://www.brettlechtenberg.com/#organization" },
  creator: { "@id": "https://www.brettlechtenberg.com/#brett", "@type": "Person", name: "Brett Lechtenberg" },
  about: ["Peak Performance", "Leadership Development", "Flow State", "Mindset Mastery", "Systems Design"],
  workExample: { "@id": "https://www.brettlechtenberg.com/books/masters-edge#book" },
};

export default function MastersEdgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {children}
    </>
  );
}
