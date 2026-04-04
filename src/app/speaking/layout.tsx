import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speaking & Training",
  description:
    "Keynotes, workshops, and training sessions built on The Master's Edge methodology. Your audience leaves changed, not just entertained. Book Brett Lechtenberg for your event.",
  keywords: [
    "keynote speaker",
    "corporate speaker",
    "leadership speaker",
    "motivational speaker",
    "business speaker",
    "corporate training",
    "workshop facilitator",
    "peak performance speaker",
    "Brett Lechtenberg speaker",
    "Utah keynote speaker",
  ],
  openGraph: {
    title: "Speaking & Training | Brett Lechtenberg",
    description:
      "Keynotes and workshops that leave your audience changed, not just entertained. Book Brett for your event.",
    url: "https://brettlechtenberg.com/speaking",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brett Lechtenberg Speaking & Training",
      },
    ],
  },
  twitter: {
    title: "Speaking & Training | Brett Lechtenberg",
    description:
      "Keynotes that leave your audience changed, not just entertained.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/speaking",
  },
};

export default function SpeakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
