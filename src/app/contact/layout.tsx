import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Brett Lechtenberg",
  description:
    "Book a conversation with Brett Lechtenberg. No pitch, no pressure — just a genuine discussion about where you are and where you want to be.",
  keywords: [
    "contact Brett Lechtenberg",
    "book a call",
    "schedule consultation",
    "executive coaching contact",
    "speaking inquiry",
    "coaching consultation",
    "business coach contact",
    "leadership coaching inquiry",
    "get in touch",
    "free consultation",
  ],
  openGraph: {
    title: "Contact | Brett Lechtenberg",
    description:
      "Book a conversation. No pitch, no pressure — just a genuine discussion about your goals.",
    url: "https://brettlechtenberg.com/contact",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Brett Lechtenberg",
      },
    ],
  },
  twitter: {
    title: "Contact | Brett Lechtenberg",
    description: "Book a conversation about your goals and potential.",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
