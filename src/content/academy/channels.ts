//==============================================================================
// Academy — community channels (static; safe to import from client files).
// `adminOnly` channels accept new posts only from me_users.role = 'admin'.
//==============================================================================

export interface AcademyChannel {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  adminOnly?: boolean;
}

export const channels: AcademyChannel[] = [
  { slug: "general", name: "General", emoji: "💬", description: "Questions, ideas, anything Master's Edge." },
  { slug: "welcome", name: "Welcome Aboard", emoji: "👋", description: "Introduce yourself and say what you're here to master." },
  { slug: "announcements", name: "Announcements", emoji: "📣", description: "Updates from Brett. Read-only for members.", adminOnly: true },
  { slug: "wins", name: "Show Off Your Wins", emoji: "🏅", description: "Post the win. Big or small — it counts." },
  { slug: "accountability", name: "Accountability", emoji: "🎯", description: "Declare the one thing you'll finish this week." },
  { slug: "office-hours", name: "Office Hours", emoji: "🆘", description: "Zoom links, call recordings, and questions for the next call." },
  { slug: "tools", name: "Tools To Review", emoji: "🛠️", description: "Templates, apps, and resources worth a look." },
];

export const DEFAULT_CHANNEL = "general";

export function channelBySlug(slug: string): AcademyChannel | undefined {
  return channels.find((c) => c.slug === slug);
}
