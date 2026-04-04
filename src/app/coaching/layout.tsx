import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive & Business Coaching",
  description:
    "Break through business plateaus with The Master's Edge coaching program. Custom toolkit built around your specific goals, challenges, and situation — grounded in flow state science.",
  keywords: [
    "executive coaching",
    "business coaching",
    "leadership coaching",
    "CEO coaching",
    "entrepreneur coaching",
    "performance coaching",
    "custom coaching program",
    "flow state coaching",
    "Brett Lechtenberg coach",
    "Utah business coach",
  ],
  openGraph: {
    title: "Executive & Business Coaching | Brett Lechtenberg",
    description:
      "Break through business plateaus with The Master's Edge coaching. Custom toolkit for peak performance.",
    url: "https://brettlechtenberg.com/coaching",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Executive & Business Coaching with Brett Lechtenberg",
      },
    ],
  },
  twitter: {
    title: "Executive Coaching | Brett Lechtenberg",
    description:
      "Break through business plateaus with custom coaching built for your goals.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/coaching",
  },
};

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
