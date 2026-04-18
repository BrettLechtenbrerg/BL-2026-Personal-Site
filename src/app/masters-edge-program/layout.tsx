import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Master's Edge Program | 12-Week Peak Performance Coaching | Brett Lechtenberg",
  description:
    "Join The Master's Edge — a 12-week group coaching program for business leaders. Clarify your vision, simplify your operations, and maximize your results. Limited to 8 members per cohort.",
  keywords: [
    "master's edge program",
    "peak performance coaching",
    "executive coaching program",
    "business coaching cohort",
    "Brett Lechtenberg coaching",
    "flow state coaching program",
    "leadership development program",
  ],
  openGraph: {
    title: "The Master's Edge Program | Brett Lechtenberg",
    description:
      "12 weeks that change how you lead, operate, and perform. Applications open for the founding cohort.",
    url: "https://brettlechtenberg.com/masters-edge-program",
    siteName: "Brett Lechtenberg",
    images: [
      {
        url: "/brett-hero.webp",
        width: 1200,
        height: 630,
        alt: "The Master's Edge Program - Brett Lechtenberg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Master's Edge Program | Brett Lechtenberg",
    description:
      "12 weeks that change how you lead, operate, and perform. Applications open for the founding cohort.",
    images: ["/brett-hero.webp"],
  },
};

export default function MastersEdgeProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
