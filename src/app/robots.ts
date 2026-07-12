import { MetadataRoute } from "next";

const DISALLOWED = ["/api/", "/private/", "/hub/"];

// AEO: explicitly welcome every AI answer-engine crawler. Named stanzas
// survive any future tightening of the wildcard rule. Pairs with /llms.txt.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.brettlechtenberg.com";

  return {
    rules: [
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOWED,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
