import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brett Lechtenberg | Peak Performance Coach, Speaker & Author",
  description:
    "Discover who you're meant to become. Brett Lechtenberg helps leaders unlock peak performance through The Master's Edge — a proven methodology built on 30+ years of real-world experience and validated flow state research.",
  keywords: [
    "peak performance coach",
    "executive coaching",
    "leadership development",
    "flow state",
    "The Master's Edge",
    "Brett Lechtenberg",
    "keynote speaker",
    "business coach",
    "mindset mastery",
  ],
  authors: [{ name: "Brett Lechtenberg" }],
  creator: "Brett Lechtenberg",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brettlechtenberg.com",
    siteName: "Brett Lechtenberg",
    title: "Brett Lechtenberg | Peak Performance Coach, Speaker & Author",
    description:
      "Discover who you're meant to become. Unlock peak performance through The Master's Edge methodology.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 1200,
        alt: "Brett Lechtenberg Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brett Lechtenberg | Peak Performance Coach",
    description: "Discover who you're meant to become with The Master's Edge.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
