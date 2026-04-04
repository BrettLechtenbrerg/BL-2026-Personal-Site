import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Advisory Services",
  description:
    "AI implementation done right. Free your team to do what only humans can. Training, integration, and full-service AI solutions through Total Success AI.",
  keywords: [
    "AI consulting",
    "AI advisory",
    "AI implementation",
    "business AI",
    "AI training",
    "prompt engineering",
    "AI automation",
    "Total Success AI",
    "AI strategy",
    "enterprise AI solutions",
  ],
  openGraph: {
    title: "AI Advisory Services | Brett Lechtenberg",
    description:
      "AI done right starts with people. Training, integration, and full-service AI solutions.",
    url: "https://brettlechtenberg.com/ai-advisory",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AI Advisory Services",
      },
    ],
  },
  twitter: {
    title: "AI Advisory | Brett Lechtenberg",
    description:
      "Free your team to do what only humans can. AI implementation done right.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/ai-advisory",
  },
};

export default function AIAdvisoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
