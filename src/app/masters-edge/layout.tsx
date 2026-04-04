import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Master's Edge Methodology",
  description:
    "A science-backed, custom-built coaching system for unlocking peak performance. Built on 30+ years of experience and validated flow state research. CLARIFY. SIMPLIFY. MAXIMIZE.",
  keywords: [
    "The Master's Edge",
    "peak performance methodology",
    "flow state coaching",
    "executive coaching system",
    "leadership methodology",
    "mindset mastery",
    "skillset enhancement",
    "support structure",
    "first principles thinking",
    "Brett Lechtenberg",
  ],
  openGraph: {
    title: "The Master's Edge | Brett Lechtenberg",
    description:
      "A science-backed coaching system for unlocking peak performance. CLARIFY. SIMPLIFY. MAXIMIZE.",
    url: "https://brettlechtenberg.com/masters-edge",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Master's Edge Methodology",
      },
    ],
  },
  twitter: {
    title: "The Master's Edge | Brett Lechtenberg",
    description:
      "A science-backed coaching system for peak performance. CLARIFY. SIMPLIFY. MAXIMIZE.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/masters-edge",
  },
};

export default function MastersEdgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
