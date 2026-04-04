import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Brett Lechtenberg",
  description:
    "8th-degree black belt, 30+ years in business, published author, and validated flow state researcher. Discover the person behind The Master's Edge methodology.",
  keywords: [
    "Brett Lechtenberg",
    "about Brett Lechtenberg",
    "peak performance coach bio",
    "8th degree black belt",
    "flow state researcher",
    "business owner",
    "martial arts master",
    "leadership expert",
    "author speaker coach",
    "Sandy Utah coach",
  ],
  openGraph: {
    title: "About Brett Lechtenberg",
    description:
      "8th-degree black belt, 30+ years in business, flow state researcher. The person behind The Master's Edge.",
    url: "https://brettlechtenberg.com/about",
    images: [
      {
        url: "/brett-hero.webp",
        width: 1200,
        height: 630,
        alt: "Brett Lechtenberg",
      },
    ],
  },
  twitter: {
    title: "About Brett Lechtenberg",
    description:
      "8th-degree black belt, 30+ years in business. Meet the creator of The Master's Edge.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
