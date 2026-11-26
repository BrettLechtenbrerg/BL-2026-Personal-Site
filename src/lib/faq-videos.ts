// Website FAQ answer videos, made with Brett's AI Assistant (HeyGen Avatar 6, scripts approved by Brett, 25 Nov 2026).
// Files live in public/videos/faq/<slug>.mp4|.jpg|.vtt (540x960 web copies; masters in the Video Edge project).
export const FAQ_VIDEO_UPLOAD_DATE = "2026-11-25";
const SITE = "https://www.brettlechtenberg.com";

export type FaqVideo = { slug: string; question: string; seconds: number };

export const faqVideos = {
  coachingWho: { slug: "faq-01-who-is-coaching-for", question: "Who is The Master's Edge coaching for?", seconds: 34 },
  coachingDifferent: { slug: "faq-02-how-is-this-different", question: "How is this different from other coaching programs?", seconds: 31 },
  coachingResults: { slug: "faq-03-how-long-to-see-results", question: "How long does it take to see results?", seconds: 29 },
  coachingLaunch: { slug: "faq-04-launch-book-talk-brand", question: "I already have a book, talk or brand. Can you help me launch it?", seconds: 30 },
  programTime: { slug: "faq-05-weekly-time", question: "How much time should I expect to commit each week?", seconds: 27 },
  programVs1to1: { slug: "faq-06-program-vs-1-1", question: "How is this different from 1:1 coaching?", seconds: 35 },
  programCohort: { slug: "faq-07-next-cohort", question: "When does the next cohort start?", seconds: 29 },
  programVirtual: { slug: "faq-08-virtual-or-in-person", question: "Is this virtual or in person?", seconds: 25 },
  programMissed: { slug: "faq-09-miss-a-session", question: "What if I miss a session?", seconds: 22 },
  programRefund: { slug: "faq-10-refund-policy", question: "Is there a refund policy?", seconds: 23 },
  programQuestions: { slug: "faq-11-still-have-questions", question: "What if I still have questions?", seconds: 21 },
  intro: { slug: "n1-is-this-really-brett", question: "Is this really Brett in these videos?", seconds: 22 },
  method: { slug: "n2-what-is-the-masters-edge", question: "What is The Master's Edge?", seconds: 35 },
  booking: { slug: "n3-book-brett-to-speak", question: "How do I book Brett to speak?", seconds: 28 },
  topics: { slug: "n4-what-brett-speaks-about", question: "What does Brett speak about?", seconds: 41 },
  aiStart: { slug: "n5-where-to-start-with-ai", question: "Where do we start with AI?", seconds: 33 },
} satisfies Record<string, FaqVideo>;

export const faqVideoSrc = (slug: string, ext: "mp4" | "jpg" | "vtt") => `/videos/faq/${slug}.${ext}`;

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// schema.org VideoObject list for the page's structured data (Google video results).
export function faqVideoSchema(videos: FaqVideo[], pagePath: string) {
  return {
    "@context": "https://schema.org",
    "@graph": videos.map((v) => ({
      "@type": "VideoObject",
      name: v.question,
      description: `${v.question} Answered by Brett's AI Assistant: an AI version of Brett Lechtenberg speaking words Brett wrote and approved.`,
      thumbnailUrl: `${SITE}${faqVideoSrc(v.slug, "jpg")}`,
      contentUrl: `${SITE}${faqVideoSrc(v.slug, "mp4")}`,
      uploadDate: FAQ_VIDEO_UPLOAD_DATE,
      duration: `PT${v.seconds}S`,
      inLanguage: "en",
      isFamilyFriendly: true,
      url: `${SITE}${pagePath}`,
      author: { "@id": `${SITE}/#brett` },
    })),
  };
}
