// TEMPORARY preview (30 Oct 2026): About with timeline Version A, for Brett to compare with /about (Version B).
// Delete this folder once Brett picks a version; never index it.
import type { Metadata } from "next";
import { AboutContent } from "../AboutContent";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AboutTimelineClassicPreview() {
  return <AboutContent timeline="classic" />;
}
