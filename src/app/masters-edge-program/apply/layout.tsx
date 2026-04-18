import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply to The Master's Edge Program | Brett Lechtenberg",
  description:
    "Submit your application for The Master's Edge 12-week coaching program. Limited to 12 members per cohort.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
