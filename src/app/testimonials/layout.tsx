import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "Real results from real clients. Read success stories from business owners, executives, and leaders who have transformed through The Master's Edge coaching and training.",
  keywords: [
    "Brett Lechtenberg testimonials",
    "coaching testimonials",
    "client reviews",
    "success stories",
    "business coaching results",
    "executive coaching reviews",
    "leadership training testimonials",
    "peak performance results",
    "The Master's Edge reviews",
    "coaching client feedback",
  ],
  openGraph: {
    title: "Client Testimonials | Brett Lechtenberg",
    description:
      "Real results from real clients. Success stories from leaders transformed by The Master's Edge.",
    url: "https://brettlechtenberg.com/testimonials",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Client Testimonials",
      },
    ],
  },
  twitter: {
    title: "Testimonials | Brett Lechtenberg",
    description:
      "Real results from real clients transformed by The Master's Edge.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/testimonials",
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
