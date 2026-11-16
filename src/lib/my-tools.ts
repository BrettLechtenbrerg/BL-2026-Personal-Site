// "My tools" in the Power Hub: Brett's five dashboards. Only these fixed URLs are
// ever status-checked, so the API can't be used to probe other addresses.
// No sign-in codes here: this file ships in the browser bundle.

export type ToolLink = { label: string; url: string; note?: string };

export type Tool = {
  id: string;
  name: string;
  purpose: string;
  resume: string;
  links: ToolLink[]; // links[0] is the main Open button
  local?: string[]; // runs on the iMac only: no web page to check
  notes?: string[];
};

export const TOOLS: Tool[] = [
  {
    id: 'speakers-edge',
    name: "Speaker's Edge",
    purpose: "Find, track and win speaking gigs: Opportunities, Pipeline, Relationships and Today's 10.",
    resume: 'resume Speaker\'s Edge',
    links: [
      { label: "Speaker's Edge Next", url: 'https://speakers.brettlechtenberg.com', note: 'Sign in with the code emailed to you' },
      { label: 'Older prototype', url: 'https://speakersedge.brettlechtenberg.com', note: 'Personal code' },
    ],
  },
  {
    id: 'launch-portal',
    name: 'Launch Portal',
    purpose: 'Clients sign in and see their own launch; you see every launch and approve new requests.',
    resume: 'resume the launch portal',
    links: [{ label: 'Launch Portal', url: 'https://launch.brettlechtenberg.com', note: 'Email sign-in' }],
  },
  {
    id: 'visibility-edge',
    name: 'Visibility Edge',
    purpose: 'Measure how often AI answers (ChatGPT, Gemini and others) name a business, and what to fix.',
    resume: 'resume Visibility Edge',
    links: [{ label: 'Visibility Edge', url: 'https://visibility.brettlechtenberg.com' }],
  },
  {
    id: 'book-studio',
    name: 'Book Studio',
    purpose: "Write, design and launch your books: Author's Edge for the writing, PR Edge for the press.",
    resume: 'resume Book Studio',
    links: [
      { label: "Author's Edge", url: 'https://authorsedge.brettlechtenberg.com', note: 'Personal code' },
      { label: 'PR Edge', url: 'https://predge.brettlechtenberg.com', note: 'Personal code' },
    ],
    local: [
      "The Master's Edge (published)",
      'Powerful AI Strategies for Business Owners',
      'How To Build a Rockstar Team',
      'The 7 Deadly Sins of Business',
    ],
    notes: ["Author's Edge house AI keys are not in yet: the Ghostwriter needs your own key until they are."],
  },
  {
    id: 'audiobook-studio',
    name: 'Audiobook Studio',
    purpose: 'Turns a finished book into an audiobook on the iMac (no web page).',
    resume: 'resume Audiobook Studio',
    links: [],
    local: [
      "The Master's Edge: voice samples of the first chapters (Michael, Adam, George) in Books → The Masters Edge Book → Audio Samples",
      'Full book not rendered yet: pick a voice first',
    ],
    notes: ['To start one, say: "create an audio version of my book …"'],
  },
];

export type ToolStatus = { url: string; up: boolean; code: number | null; ms: number };

// A sign-in wall (401/403) still means the dashboard is running.
export function isUp(code: number | null): boolean {
  if (code === null) return false;
  return (code >= 200 && code < 400) || code === 401 || code === 403;
}

type FetchLike = (url: string, init: { method: string; redirect: 'follow'; cache: 'no-store'; signal: AbortSignal }) => Promise<{ status: number }>;

export async function checkUrl(url: string, fetchImpl: FetchLike = fetch, timeoutMs = 8000): Promise<ToolStatus> {
  const start = Date.now();
  try {
    const res = await fetchImpl(url, { method: 'GET', redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) });
    return { url, up: isUp(res.status), code: res.status, ms: Date.now() - start };
  } catch {
    return { url, up: false, code: null, ms: Date.now() - start };
  }
}

export function toolUrls(tools: Tool[] = TOOLS): string[] {
  return [...new Set(tools.flatMap((t) => t.links.map((l) => l.url)))];
}

export async function checkAll(tools: Tool[] = TOOLS, fetchImpl: FetchLike = fetch): Promise<Record<string, ToolStatus>> {
  const results = await Promise.all(toolUrls(tools).map((u) => checkUrl(u, fetchImpl)));
  return Object.fromEntries(results.map((r) => [r.url, r]));
}
