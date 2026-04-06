import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Brett | Hire a Keynote Speaker & Coach",
  description:
    "Book Brett Lechtenberg for your next event. Keynote speaking, corporate training, executive coaching, and workshop facilitation. Transform your team with The Master's Edge methodology.",
  keywords: [
    "book keynote speaker",
    "hire business coach",
    "corporate speaker Utah",
    "leadership speaker",
    "executive coach booking",
    "business event speaker",
    "motivational speaker",
    "corporate training",
  ],
  openGraph: {
    title: "Book Brett Lechtenberg | Keynote Speaker & Executive Coach",
    description:
      "Book Brett for keynote speaking, corporate training, or executive coaching. Transform your organization with The Master's Edge methodology.",
    url: "https://brettlechtenberg.com/book-brett",
    type: "website",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/book-brett",
  },
};

export default function BookBrettLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
