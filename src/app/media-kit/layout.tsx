import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Kit | Press & Speaking Resources",
  description:
    "Download Brett Lechtenberg's media kit, press photos, bio, and speaking topics. Everything event planners and media professionals need.",
  keywords: [
    "Brett Lechtenberg media kit",
    "speaker press kit",
    "keynote speaker bio",
    "speaker headshots",
    "press resources",
    "event planner resources",
    "speaker one sheet",
  ],
  openGraph: {
    title: "Brett Lechtenberg Media Kit | Press & Speaking Resources",
    description:
      "Access Brett's official bio, headshots, speaking topics, and press materials for media and event planning.",
    url: "https://brettlechtenberg.com/media-kit",
    type: "website",
  },
  alternates: {
    canonical: "https://brettlechtenberg.com/media-kit",
  },
};

export default function MediaKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
