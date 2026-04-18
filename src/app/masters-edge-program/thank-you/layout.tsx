import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Received | The Master's Edge Program | Brett Lechtenberg",
  description:
    "Thank you for applying to The Master's Edge Program. Brett will review your application within 48 hours.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
