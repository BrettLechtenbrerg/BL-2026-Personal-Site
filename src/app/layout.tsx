import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";

// Google Analytics 4 Measurement ID for brettlechtenberg.com
// Verified June 15, 2026: G-E1WQV8Q2DK -> GA4 property "Brett Lechtenberg
// Website" (540646703), data flowing. Do not change without confirming
// GA4 -> Admin -> Data streams matches this ID.
const GA_MEASUREMENT_ID = "G-E1WQV8Q2DK";

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

// Base URL for all metadata (important for resolving relative URLs)
const siteUrl = "https://www.brettlechtenberg.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brett Lechtenberg | Peak Performance Coach, Speaker & Author",
    template: "%s | Brett Lechtenberg",
  },
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
    "performance optimization",
    "leadership coaching",
    "professional development",
    "business speaker",
    "corporate training",
    "mindset coaching",
    "Utah business coach",
    "Sandy Utah coach",
  ],
  authors: [{ name: "Brett Lechtenberg", url: siteUrl }],
  creator: "Brett Lechtenberg",
  publisher: "Brett Lechtenberg",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Brett Lechtenberg",
    title: "Brett Lechtenberg | Peak Performance Coach, Speaker & Author",
    description:
      "Discover who you're meant to become. Unlock peak performance through The Master's Edge methodology — 30+ years of real-world experience helping leaders achieve extraordinary results.",
    images: [
      {
        url: "/brett-hero.webp",
        width: 1200,
        height: 630,
        alt: "Brett Lechtenberg - Peak Performance Coach, Speaker & Author",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brett Lechtenberg | Peak Performance Coach",
    description: "Discover who you're meant to become with The Master's Edge methodology.",
    images: ["/brett-hero.webp"],
    creator: "@BrettLechtenberg",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Business",
  verification: {
    // Add these when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
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
      <head>
        {/* Google Analytics 4 (gtag.js) — loaded in <head> per Google guidance */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
