//==============================================================================
// Master's Edge Academy — module content (edit this file to add/change modules)
//==============================================================================
// ⚠️ SERVER-SIDE ONLY for quiz data: this file contains quiz ANSWERS
// (correctIndex/explanation). Client pages must never import it directly —
// they get quiz questions (sans answers) from /api/academy/quiz and module
// info from server components. Keep it that way.
//
// TO ADD A MODULE:
//   1. Append an entry below (order controls unlock sequence).
//   2. Drop assets into public/academy/<slug>/ and list them in pdfs/images.
//   3. Swap videoUrl for the real unlisted YouTube/Vimeo EMBED url.
// That's it — pages, quiz, badge, and unlock logic pick it up automatically.
// Each module automatically gets a completion badge "module-<slug>"
// (see badges.ts).
//==============================================================================

/** One section of the written lesson (for members who prefer reading). */
export interface LessonSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Index into options — NEVER send to the client. */
  correctIndex: number;
  /** Shown after the quiz is scored. */
  explanation: string;
}

export interface AcademyModule {
  slug: string;
  order: number;
  title: string;
  tagline: string;
  description: string;
  /** Embed URL — e.g. https://www.youtube.com/embed/<id> (unlisted). */
  videoUrl: string;
  /** Paths under /public, e.g. /academy/fire-yourself/workbook.pdf */
  pdfs: { label: string; href: string }[];
  /** Audio lessons (e.g. NotebookLM deep dives) under /public. Optional. */
  audio?: { label: string; href: string }[];
  /** Self-hosted video files (e.g. NotebookLM video overviews). Optional —
   *  renders IN ADDITION to videoUrl (YouTube embed) so both can be compared. */
  videoFiles?: { label: string; href: string }[];
  /** Paths under /public, e.g. /academy/fire-yourself/diagram.png */
  images: string[];
  /** Key teaching points shown on the module page. */
  keyPoints: string[];
  /** Full written lesson — same material the quiz tests, for readers. */
  lesson: LessonSection[];
  quiz: QuizQuestion[];
}

/** Pass threshold for every module quiz (percent). */
export const PASS_PERCENT = 80;

//------------------------------------------------------------------------------
// Courses (tracks) — modules are grouped by order range
//------------------------------------------------------------------------------
export interface AcademyCourse {
  id: string;
  title: string;
  emoji: string;
  description: string;
  /** Inclusive order range of the modules in this course. */
  fromOrder: number;
  toOrder: number;
  /** Optional banner image under /public (e.g. "/academy/covers/business-tools.jpg"). */
  cover?: string;
}

export const academyCourses: AcademyCourse[] = [
  {
    id: "business-tools",
    title: "Master's Edge Business Tools",
    emoji: "🛠️",
    description:
      "Fifteen practical tools for running and scaling your business — from firing yourself out of low-value work to competitor intelligence.",
    fromOrder: 1,
    toOrder: 15,
  },
  {
    id: "reclaiming-the-clock",
    title: "Reclaiming the Clock",
    emoji: "⏰",
    description:
      "Brett's best-selling time system: the Time Maze, your 5%, impact zones, the Daily Dozen, and the laws that make hours multiply.",
    fromOrder: 16,
    toOrder: 23,
  },
  {
    id: "masters-edge-book",
    title: "The Master's Edge Book",
    emoji: "⚔️",
    description:
      "Nineteen chapters of martial-arts wisdom meets performance science — parable by parable, from the Sword in the Shrine to the Six Pillars.",
    fromOrder: 24,
    toOrder: 42,
  },
  {
    id: "framework",
    title: "The Master's Edge Framework",
    emoji: "🎁",
    description:
      "The free giveaway course: the complete framework with the stories removed — the map of the room. One deep module, one serious 22-question exam.",
    fromOrder: 43,
    toOrder: 43,
  },
];

// PLACEHOLDER videos — Brett's existing media appearances, so modules play a
// real video today. Swap each for the actual unlisted lesson video when filmed.
const PLACEHOLDER_VIDEOS = [
  "https://www.youtube.com/embed/Dq7agUEBr6I", // Good Things Utah
  "https://www.youtube.com/embed/tHNnmrkqPrM", // The Daily Dish — CW30
  "https://www.youtube.com/embed/tos_1uWdW4E", // Profiles in Caring
];
const PLACEHOLDER_VIDEO = (n: number) =>
  PLACEHOLDER_VIDEOS[(n - 1) % PLACEHOLDER_VIDEOS.length];

export const academyModules: AcademyModule[] = [
  //----------------------------------------------------------------------------
  // Module 1 — The Fire Yourself Exercise
  //----------------------------------------------------------------------------
  {
    slug: "fire-yourself",
    videoFiles: [
      { label: "The Fire Yourself Exercise (NotebookLM video overview)", href: "/academy/fire-yourself/video-overview.mp4" },
    ],
    audio: [
      { label: "Deep Dive: The Fire Yourself Exercise (NotebookLM audio overview)", href: "/academy/fire-yourself/deep-dive.m4a" },
    ],
    order: 1,
    title: "The Fire Yourself Exercise",
    tagline: "Strategic Thinking",
    description:
      "A powerful thought experiment that helps you evolve your role and scale your business. Audit what you actually do all day, find the tasks only YOU can do, and build a 90-day plan to hand off the rest.",
    videoUrl: PLACEHOLDER_VIDEO(1),
    pdfs: [
      // { label: "Fire Yourself Workbook (PDF)", href: "/academy/fire-yourself/workbook.pdf" },
    ],
    images: [],
    keyPoints: [
      "The Hard Truth Audit: write the job description you'd hire to replace yourself.",
      "Price your tasks at open-market rates — most owners do $20–25/hr work with CEO-level stress.",
      "\"Only I can do it\" usually means \"only I currently do it.\"",
      "Every task that isn't truly yours goes to: team member, new hire, contractor, automation, or elimination.",
      "Spread the transition over 90 days; hand off the first task THIS week.",
    ],
    lesson: [
      {
        heading: "The Hard Truth Audit",
        paragraphs: [
          "Imagine you had to fire yourself today and hire a replacement. Your first job is to write that person's job description — not the flattering version, the REAL one. List the specific tasks you actually do every day: answering emails, chasing invoices, fixing scheduling conflicts, restocking supplies, posting on social media.",
          "Most owners are shocked by this list. The title says CEO; the task list says administrative assistant, bookkeeper, customer service rep, and janitor. You can't evolve a role you haven't honestly described.",
        ],
      },
      {
        heading: "Price Every Task at Market Rate",
        paragraphs: [
          "Next to each task, write what it would cost to hire someone competent to do it — open-market hourly rates. Scheduling and inbox management: $20–25/hr. Bookkeeping: $30–50/hr. Social posting: $25–40/hr.",
          "Now look at the pattern: most owners spend the bulk of their week doing $20–25/hr work while carrying CEO-level stress and CEO-level opportunity cost. Every hour you spend on a $20 task is an hour you didn't spend on the $500/hr work only you can do — strategy, key relationships, big decisions.",
        ],
      },
      {
        heading: "The 'Only I Can Do It' Lie",
        paragraphs: [
          "When you claim a task can only be done by you, be brutally honest: do you mean only you CAN, or only you currently DO? With training, systems, or a checklist, someone else could handle almost everything on your list.",
          "The tasks that genuinely require you — vision, key relationships, final calls on big bets — fit on a list of three to five items. Not thirty.",
        ],
        bullets: [
          "Every non-'only me' task gets one of five destinations:",
          "1. Existing team member (with training)",
          "2. New hire",
          "3. Contractor or freelancer",
          "4. Automation or software",
          "5. Elimination — some tasks simply shouldn't exist",
        ],
      },
      {
        heading: "The 90-Day Transition",
        paragraphs: [
          "Clarity without a deadline is a journal entry. Map the handoffs across 90 days: Month 1, the easy wins — tasks with existing owners or obvious automations. Month 2, the ones needing documentation or training. Month 3, the hard ones you've been hoarding.",
          "Then commit to ONE handoff this week — a named task, to a named person, by a named date. That first handoff breaks the dam.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the first step of the Fire Yourself Exercise?",
        options: [
          "Hire a replacement immediately",
          "Write the job description you'd use to replace yourself, with specific daily tasks",
          "Delegate everything to your team",
          "Calculate your annual revenue",
        ],
        correctIndex: 1,
        explanation:
          "The Hard Truth Audit starts by writing the exact job description for your current role — daily tasks and all. You can't evolve a role you haven't honestly described.",
      },
      {
        question: "Why do you price each of your current tasks at its open-market hourly rate?",
        options: [
          "To set your salary",
          "To negotiate with contractors",
          "To reveal that you're likely doing low-value work while carrying CEO-level stress",
          "To calculate taxes",
        ],
        correctIndex: 2,
        explanation:
          "Most owners discover they spend the bulk of their week on $20–25/hr tasks. Seeing the number makes the gap between current reality and the dream role undeniable.",
      },
      {
        question: "When you claim \"only I can do this task,\" what does it usually mean?",
        options: [
          "The task genuinely requires your unique skills",
          "Only you CURRENTLY do it — someone else could with training or systems",
          "The task should be eliminated",
          "You should raise your prices",
        ],
        correctIndex: 1,
        explanation:
          "The exercise pushes brutal honesty: 'only I can do it' is almost always 'only I currently do it.' Truly owner-only tasks are a list of 3–5, not 30.",
      },
      {
        question: "For a task that is NOT on your \"only me\" list, which is NOT one of the five options?",
        options: [
          "Existing team member",
          "Contractor or automation",
          "Elimination",
          "Keep doing it yourself but faster",
        ],
        correctIndex: 3,
        explanation:
          "The five destinations are: existing team member, new hire, contractor, automation, or elimination. 'Do it faster yourself' keeps you fired-but-still-working.",
      },
      {
        question: "How does the exercise turn insight into action?",
        options: [
          "A 90-day transition plan plus ONE task you hand off this week — to a named person, by a date",
          "A vision board",
          "A promise to delegate more someday",
          "Quarterly revenue targets",
        ],
        correctIndex: 0,
        explanation:
          "Clarity without a deadline is a journal entry. The exercise ends with Month 1/2/3 milestones and one concrete handoff committed for this week.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 2 — The Ideal Week Designer
  //----------------------------------------------------------------------------
  {
    slug: "ideal-week",
    videoFiles: [
      { label: "The Ideal Week Designer (NotebookLM video overview)", href: "/academy/ideal-week/video-overview.mp4" },
    ],
    audio: [
      { label: "Deep Dive: The Ideal Week Designer (NotebookLM audio overview)", href: "/academy/ideal-week/deep-dive.m4a" },
    ],
    order: 2,
    title: "The Ideal Week Designer",
    tagline: "Time Mastery",
    description:
      "Design a CEO-level weekly template that protects your high-value time. Map your energy, theme your days, batch the chaos, and defend the blocks that move the needle.",
    videoUrl: PLACEHOLDER_VIDEO(2),
    pdfs: [],
    images: [],
    keyPoints: [
      "Design your perfect week FIRST, then defend it — don't let the calendar control you.",
      "Theme your days: batching similar tasks slashes context-switching.",
      "Protect your power hours — guard the blocks when you're sharpest.",
      "Contain emails, calls, and meetings; don't scatter them.",
      "Build in buffer and recovery — rest is productive.",
    ],
    lesson: [
      {
        heading: "Design First, Then Defend",
        paragraphs: [
          "Most owners let the week happen TO them: the calendar fills with other people's priorities, and the important work gets whatever scraps remain. The Ideal Week flips the sequence — you architect the perfect week on paper first, based on YOUR priorities, then defend that design against the chaos.",
          "You won't hit the ideal every week. That's not failure — the template is a target, and even hitting it 70% transforms your output.",
        ],
      },
      {
        heading: "Map Your Energy, Theme Your Days",
        paragraphs: [
          "Track when you're genuinely sharp versus foggy across a few days. Those peak windows — your power hours — are your most valuable business asset. Deep, high-value work goes there. Email does not.",
          "Then theme your days: Maker Monday for deep work, Team Tuesday for one-on-ones and meetings, Finance Friday for numbers. Context-switching is the silent killer of productivity — every jump between task types costs you reorientation time. Batching similar work into themed blocks eliminates most of that tax.",
        ],
      },
      {
        heading: "Contain the Chaos",
        paragraphs: [
          "Email, calls, and 'quick questions' will scatter across every hour you let them. Give them containers instead: two or three fixed communication windows per day. Outside those windows, notifications off — the work in front of you gets your full attention.",
          "And schedule buffer and recovery on purpose. A week with zero slack shatters on the first surprise, and a depleted owner makes expensive decisions. Rest is not a reward for finishing — it's a component of the system.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the core philosophy of the Ideal Week Designer?",
        options: [
          "React to whatever the week throws at you",
          "Design your perfect week first, then defend it",
          "Work more hours than your competitors",
          "Eliminate all meetings permanently",
        ],
        correctIndex: 1,
        explanation:
          "Most owners let the calendar control them. The Ideal Week flips it: you architect the week around your priorities, then protect that design.",
      },
      {
        question: "Why theme your days (e.g., Maker Monday, Team Tuesday)?",
        options: [
          "It sounds impressive to clients",
          "Grouping similar tasks reduces context-switching and protects deep work",
          "It guarantees a four-day week",
          "It replaces the need for a calendar",
        ],
        correctIndex: 1,
        explanation:
          "Context-switching is the silent killer of CEO output. Themed days batch similar work so your brain stays in one mode longer.",
      },
      {
        question: "What are \"power hours\" in this system?",
        options: [
          "Overtime hours billed at a premium",
          "The times you're naturally sharpest — reserved for your highest-value work",
          "The first hour of every meeting",
          "Hours spent answering email",
        ],
        correctIndex: 1,
        explanation:
          "Phase 1 maps your energy: when you're mentally sharpest, that time gets guarded for deep work — not spent in your inbox.",
      },
      {
        question: "What does a \"sacred\" time block mean?",
        options: [
          "A block reserved for religious observance only",
          "A block you attend if nothing else comes up",
          "If someone wants that time, the answer is always no",
          "A block that repeats monthly",
        ],
        correctIndex: 2,
        explanation:
          "Sacred blocks are non-negotiable by definition. The moment you trade them away 'just this once,' the whole template collapses.",
      },
      {
        question: "Which of the five task categories should get your protected deep-work blocks?",
        options: [
          "Operations and admin",
          "Email and messages",
          "The categories you ranked as actually moving revenue and growth",
          "Whatever is most urgent that morning",
        ],
        correctIndex: 2,
        explanation:
          "Phase 2 ranks DEEP WORK, COMMUNICATION, OPERATIONS, LEADERSHIP, and GROWTH by needle-moving power — protected time goes to the top of that ranking, not to the loudest task.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 3 — The Decision Journal
  //----------------------------------------------------------------------------
  {
    slug: "decision-journal",
    order: 3,
    title: "The Decision Journal",
    tagline: "Strategic Thinking",
    description:
      "Document important decisions with full context BEFORE you commit, then review outcomes to sharpen your judgment. Eliminate hindsight bias and build pattern recognition over time.",
    videoUrl: PLACEHOLDER_VIDEO(3),
    pdfs: [],
    images: [],
    keyPoints: [
      "Use it before any significant decision: $1,000+, affects the team, or hard to reverse.",
      "Force clarity BEFORE you commit; capture reasoning while it's fresh.",
      "List all options — including 'do nothing' — with best and worst cases.",
      "Steel-man the argument AGAINST your gut leaning.",
      "Set a review date and compare outcomes to expectations — that's where judgment grows.",
    ],
    lesson: [
      {
        heading: "Why Document Decisions Before You Commit",
        paragraphs: [
          "After the outcome is known, your memory quietly rewrites history — wins feel inevitable, losses feel like bad luck. That's hindsight bias, and it makes it nearly impossible to learn from your own decisions. The Decision Journal defeats it by capturing your actual reasoning BEFORE reality weighs in: what you decided, why, what you expected, and how confident you were.",
        ],
      },
      {
        heading: "When to Open the Journal",
        paragraphs: [
          "Not every choice needs a journal entry — use it when the stakes clear a threshold: significant money, hard to reverse, affects people, or you notice you're deciding under pressure or strong emotion.",
          "For each entry: state the question in one sentence, list the real options (always including 'do nothing'), then steel-man the other side — argue the best case AGAINST your preferred choice. If you can't state the opposing case well, you don't understand the decision yet.",
        ],
      },
      {
        heading: "Confidence and the Review Date",
        paragraphs: [
          "Write down your expected outcome and a confidence percentage — 'I'm 80% sure this hire works out.' Then set a review date and keep it. When the date arrives, compare what happened to what you expected.",
          "The gaps are the gold: consistently overconfident on hires? Underestimating timelines? Over months, the journal turns vague gut feel into calibrated judgment — the single highest-leverage skill a business owner can build.",
        ],
      },
    ],
    quiz: [
      {
        question: "When should you open the Decision Journal?",
        options: [
          "Only after a decision goes wrong",
          "Before any significant decision — $1,000+, affects the team, or hard to reverse",
          "Once a year during planning",
          "For every email you send",
        ],
        correctIndex: 1,
        explanation:
          "The journal works BEFORE you commit. The threshold: meaningful money, team impact, or low reversibility.",
      },
      {
        question: "Why must options include \"do nothing\"?",
        options: [
          "To procrastinate with a clear conscience",
          "Because inaction is a real alternative with its own best and worst cases",
          "To make the list longer",
          "Because most decisions should be avoided",
        ],
        correctIndex: 1,
        explanation:
          "'Do nothing' is always on the menu and often underrated or overrated. Pricing its best/worst cases keeps the comparison honest.",
      },
      {
        question: "What does it mean to steel-man the opposite view?",
        options: [
          "Dismiss objections quickly",
          "Build the STRONGEST version of the argument against your leaning",
          "Ask your team to agree with you",
          "Delay the decision indefinitely",
        ],
        correctIndex: 1,
        explanation:
          "Part 3 asks for the main argument AGAINST your gut — stated as strongly as possible. If you can't argue the other side, you don't understand the decision yet.",
      },
      {
        question: "What makes an expected outcome useful for later review?",
        options: [
          "It's optimistic",
          "It's measurable — 'revenue up X%' not 'things will get better'",
          "It's kept secret",
          "It's approved by a mentor",
        ],
        correctIndex: 1,
        explanation:
          "Vague expectations can't be scored. Measurable ones plus a review date create the feedback loop that improves your judgment.",
      },
      {
        question: "How does the journal eliminate hindsight bias?",
        options: [
          "By recording your reasoning and confidence BEFORE the outcome is known",
          "By deleting bad decisions",
          "By only journaling wins",
          "By asking others to decide for you",
        ],
        correctIndex: 0,
        explanation:
          "'I knew it all along' dies when your actual pre-decision reasoning and confidence level are on paper. The record beats the rewrite.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 4 — The Problem Explainer
  //----------------------------------------------------------------------------
  {
    slug: "problem-explainer",
    order: 4,
    title: "The Problem Explainer",
    tagline: "Communication",
    description:
      "Turn messy, frustrating situations into crystal-clear explanations anyone can understand. Separate symptoms from root causes, define what 'solved' looks like, and tailor the message to any audience.",
    videoUrl: PLACEHOLDER_VIDEO(4),
    pdfs: [],
    images: [],
    keyPoints: [
      "If you can't explain it simply, you don't understand it well enough.",
      "Dump everything first — then separate the core problem from its symptoms.",
      "Identify who is affected and how; that's what makes people care.",
      "Define 'solved' in measurable terms before proposing anything.",
      "Create versions for different audiences — team, advisor, vendor.",
    ],
    lesson: [
      {
        heading: "Why People 'Don't Get It'",
        paragraphs: [
          "Most miscommunication in business isn't a listening problem — it's a definition problem. The problem was never clearly stated, so people solve the wrong thing, miss the real issue, or drown in details. Einstein's rule applies: if you can't explain it simply, you don't understand it well enough.",
          "The Problem Explainer is a repeatable process for getting from mental chaos to a clear explanation before an important conversation.",
        ],
      },
      {
        heading: "Dump, Then Separate Signal from Noise",
        paragraphs: [
          "Start by dumping everything — what's happening, what's frustrating, what's confusing. Don't organize yet; empty your head first.",
          "Then impose structure with four questions: What is the CORE problem, in one sentence? What are the SYMPTOMS — the visible signs something is wrong? What's the likely ROOT CAUSE? And who is AFFECTED, and how? Symptoms get confused for problems constantly — 'revenue is down' is a symptom; 'our follow-up process stopped happening after Sarah left' is a problem you can act on.",
        ],
      },
      {
        heading: "Define Success, Then Fit the Audience",
        paragraphs: [
          "Before you explain the problem to anyone, define what 'solved' looks like — in observable, countable terms. If the problem vanished tomorrow, what would be different? What would you measure?",
          "Finally, shape versions for each audience: your team needs context and their role in the fix; an advisor needs the facts and the decision you're weighing; a vendor needs the specific failure and remedy. Same problem, different framings — clarity is a courtesy to the listener.",
        ],
      },
    ],
    quiz: [
      {
        question: "According to the Problem Explainer, why does most miscommunication happen?",
        options: [
          "People don't listen carefully enough",
          "The problem was never clearly defined in the first place",
          "Teams are too busy",
          "Email is a bad medium",
        ],
        correctIndex: 1,
        explanation:
          "When the problem isn't clearly defined, people solve the wrong problem, miss the real issue, or get lost in details. Definition comes before communication.",
      },
      {
        question: "What's the difference between a symptom and a core problem?",
        options: [
          "They're the same thing",
          "Symptoms are visible signs something is wrong; the core problem is the underlying issue causing them",
          "Symptoms are always financial",
          "The core problem is whatever the loudest person says it is",
        ],
        correctIndex: 1,
        explanation:
          "'Revenue is down' is a symptom. 'Follow-up stopped happening after Sarah left' is a core problem you can actually fix. Confusing the two wastes everyone's effort.",
      },
      {
        question: "What should you do FIRST when using the Problem Explainer?",
        options: [
          "Write the perfect one-sentence summary",
          "Dump everything on your mind about the situation without organizing it",
          "Schedule a meeting",
          "Assign blame",
        ],
        correctIndex: 1,
        explanation:
          "Empty your head first — organized thinking comes AFTER you've externalized the mess, not before.",
      },
      {
        question: "How should you define 'solved'?",
        options: [
          "A general feeling that things are better",
          "In observable, measurable terms — what you'd see, hear, or count if the problem disappeared",
          "Whatever your team agrees to",
          "Revenue going up",
        ],
        correctIndex: 1,
        explanation:
          "If you can't measure 'solved', you can't tell whether any fix worked — and neither can the people helping you.",
      },
      {
        question: "Why create multiple versions of the same explanation?",
        options: [
          "To hide information from some people",
          "Different audiences need different context: team, advisor, and vendor each care about different things",
          "To practice your writing",
          "Longer explanations are always better",
        ],
        correctIndex: 1,
        explanation:
          "Your team needs their role in the fix; an advisor needs the decision you're weighing; a vendor needs the specific failure. Tailoring is clarity, not spin.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 5 — The Vendor Negotiation Prep
  //----------------------------------------------------------------------------
  {
    slug: "vendor-negotiation",
    order: 5,
    title: "The Vendor Negotiation Prep",
    tagline: "Money Mastery",
    description:
      "Walk into every vendor conversation prepared: know your position, your leverage, and your walk-away point before the call — and stop leaving money on the table.",
    videoUrl: PLACEHOLDER_VIDEO(5),
    pdfs: [],
    images: [],
    keyPoints: [
      "Never take a money conversation unprepared — prep is where the savings are.",
      "Know your BATNA: your best alternative if the negotiation fails completely.",
      "Inventory your leverage: tenure, spend, referrals, timing.",
      "Define your walk-away point BEFORE the call, not during it.",
      "Almost everything is negotiable — price, terms, timing, extras.",
    ],
    lesson: [
      {
        heading: "Why Owners Leave Money on the Table",
        paragraphs: [
          "Most business owners overpay vendors for predictable reasons: they don't prepare before calls, they don't know their alternatives, negotiating feels awkward, and they accept the first offer. The vendor negotiates for a living; you negotiate a few times a year. Preparation is how you level that field.",
          "Fifteen minutes of prep before a renewal call routinely saves hundreds or thousands of dollars a year — there is no better hourly rate in your business.",
        ],
      },
      {
        heading: "Know Your Position: BATNA and Leverage",
        paragraphs: [
          "Before any negotiation, answer: what am I currently paying, what do I want, and when must I decide? Then establish your BATNA — Best Alternative To a Negotiated Agreement. If this conversation completely fails, what's Plan B? A competitor quote? A workaround? Doing without? A real BATNA is the difference between negotiating and begging.",
          "Then inventory leverage you already have but rarely use: how long you've been a customer, how much you spend annually, referrals you've sent, and timing — vendors are most flexible at quarter-end and renewal time.",
        ],
      },
      {
        heading: "Set the Walk-Away Before the Call",
        paragraphs: [
          "Decide in advance the number or terms at which you'll walk. Deciding mid-conversation, under pressure, with a friendly rep on the line, is how bad deals happen. Write it down.",
          "And remember the menu is bigger than price: contract length, payment timing, onboarding fees, support tiers, added seats, and cancellation terms are all negotiable. If they won't move on price, move the conversation to what else they can include.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is a BATNA?",
        options: [
          "A negotiation tactic for lowering prices",
          "Your Best Alternative To a Negotiated Agreement — your Plan B if talks completely fail",
          "A type of vendor contract",
          "The vendor's final offer",
        ],
        correctIndex: 1,
        explanation:
          "Knowing exactly what you'll do if the deal falls through is what lets you negotiate from strength instead of fear.",
      },
      {
        question: "When should you define your walk-away point?",
        options: [
          "During the call, once you hear their tone",
          "Before the conversation — written down, decided calmly",
          "After the vendor makes their first offer",
          "You should never walk away",
        ],
        correctIndex: 1,
        explanation:
          "Deciding under pressure with a friendly rep on the line is how bad deals happen. The walk-away is set in advance or it doesn't exist.",
      },
      {
        question: "Which of these is NOT typically a source of leverage with a vendor?",
        options: [
          "Your years as a loyal customer",
          "Your annual spend with them",
          "Referrals you've sent their way",
          "Threatening a bad review you don't mean",
        ],
        correctIndex: 3,
        explanation:
          "Real leverage is factual: tenure, spend, referrals, timing. Empty threats destroy the relationship and your credibility — and pros can smell them.",
      },
      {
        question: "The vendor won't budge on price. What's the Master's Edge move?",
        options: [
          "Accept the price and move on",
          "Negotiate the rest of the menu: terms, onboarding fees, support tier, extra seats, cancellation rights",
          "Hang up",
          "Ask for a manager and start over",
        ],
        correctIndex: 1,
        explanation:
          "Price is one line on a bigger menu. Contract length, payment timing, and included extras often hold more value than a few percent off.",
      },
      {
        question: "Why does 15 minutes of prep matter so much before a vendor call?",
        options: [
          "It makes you sound smarter",
          "The vendor negotiates daily and you don't — preparation levels the field and routinely saves real money",
          "Vendors require an agenda",
          "It's only worthwhile for contracts over $100k",
        ],
        correctIndex: 1,
        explanation:
          "Their rep does this every day. Your prep sheet — position, BATNA, leverage, walk-away — is how you stop donating margin to better-prepared counterparts.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 6 — The Partnership Evaluator
  //----------------------------------------------------------------------------
  {
    slug: "partnership-evaluator",
    order: 6,
    title: "The Partnership Evaluator",
    tagline: "Due Diligence",
    description:
      "Evaluate any partnership, joint venture, or collaboration BEFORE you commit. Surface misaligned expectations, stress-test with hard questions, and decide: proceed, proceed with caution, or walk away.",
    videoUrl: PLACEHOLDER_VIDEO(6),
    pdfs: [],
    images: [],
    keyPoints: [
      "Bad partnerships are a top cause of business failure and stress.",
      "Most partnership pain comes from misaligned expectations and unclear roles.",
      "If you don't know what THEY want out of it, that's a red flag.",
      "Agree on the exit plan while everyone still likes each other.",
      "The output is a decision: proceed, proceed with caution, or walk away.",
    ],
    lesson: [
      {
        heading: "Where Partnerships Go Wrong",
        paragraphs: [
          "Bad partnerships rank among the top causes of business failure — and of sleepless nights. The damage almost always traces to five preventable causes: misaligned expectations, unclear roles, unequal contribution, no exit plan, and a values mismatch in how each side operates.",
          "None of these are discovered by optimism. They're discovered by asking hard questions BEFORE committing — when it's still cheap to walk away.",
        ],
      },
      {
        heading: "The Alignment Check",
        paragraphs: [
          "Get brutally specific about the trade: What do YOU bring — skills, money, network, time? What do THEY bring? What do YOU want out of it? And critically: what do THEY want out of it? If you can't answer that last one, stop — you don't understand the deal you're about to sign, and hidden motives surface at the worst times.",
          "Watch the contribution balance too. 'I do the work, they make introductions' partnerships breed resentment fast when the introductions dry up.",
        ],
      },
      {
        heading: "Stress-Test and Decide",
        paragraphs: [
          "Agree on the uncomfortable stuff up front: Who decides what? What happens if one side underdelivers? How does either party exit cleanly? Negotiating the exit while everyone still likes each other is a gift to your future self.",
          "Then make a clear-eyed call — proceed, proceed with caution (with named conditions), or walk away. The goal of evaluation is protection, not rationalizing a decision you've already made emotionally.",
        ],
      },
    ],
    quiz: [
      {
        question: "What causes most partnership problems?",
        options: [
          "Bad luck and market conditions",
          "Misaligned expectations, unclear roles, unequal contribution, no exit plan, values mismatch",
          "Not enough legal paperwork",
          "Partners living in different cities",
        ],
        correctIndex: 1,
        explanation:
          "All five causes are preventable — but only by asking hard questions before you commit, not after the resentment builds.",
      },
      {
        question: "You don't know what the other party wants from the partnership. What is that?",
        options: [
          "Normal — people keep goals private",
          "A red flag: you don't understand the deal, and hidden motives surface at the worst times",
          "A sign they're generous",
          "Irrelevant if the contract is good",
        ],
        correctIndex: 1,
        explanation:
          "Every partner wants something. If you can't name what they're getting, you can't predict how they'll behave when interests diverge.",
      },
      {
        question: "When is the best time to agree on an exit plan?",
        options: [
          "When problems first appear",
          "At the start — while everyone still likes each other",
          "Never — planning for failure causes failure",
          "Only in written legal partnerships",
        ],
        correctIndex: 1,
        explanation:
          "A clean-exit agreement negotiated in goodwill protects both sides. Negotiating it mid-conflict is expensive and ugly.",
      },
      {
        question: "What is the honest purpose of evaluating a partnership?",
        options: [
          "To build a case for the decision you've already made",
          "To protect your interests with a clear-eyed decision — even if the answer is 'walk away'",
          "To impress the potential partner",
          "To delay committing",
        ],
        correctIndex: 1,
        explanation:
          "The Evaluator exists to protect you, not to rationalize. Answer honestly — especially when you're excited.",
      },
      {
        question: "What are the three possible outcomes of the evaluation?",
        options: [
          "Yes, no, maybe later",
          "Proceed, proceed with caution (with named conditions), or walk away",
          "Sign, sue, or stall",
          "Equity split, revenue share, or handshake",
        ],
        correctIndex: 1,
        explanation:
          "'Proceed with caution' means naming the specific conditions and warning signs — not just crossing your fingers.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 7 — The Delegation Engine
  //----------------------------------------------------------------------------
  {
    slug: "delegation-engine",
    order: 7,
    title: "The Delegation Engine",
    tagline: "Leverage",
    description:
      "Break the Owner's Trap: calculate what your time is really worth, price the low-value work you're hoarding, and build a 90-day delegation roadmap that actually sticks.",
    videoUrl: PLACEHOLDER_VIDEO(7),
    pdfs: [],
    images: [],
    keyPoints: [
      "The Owner's Trap: 'can't afford help' → do everything → too busy to grow → flat revenue → repeat.",
      "Your time has three prices: what you pay yourself, what you cost, what you're worth.",
      "The question isn't 'Can someone else do this?' — it's 'Should I be the one doing this?'",
      "Audit a real week and attach a dollar value to every block.",
      "Delegate in order: highest hours × lowest value first.",
    ],
    lesson: [
      {
        heading: "The Owner's Trap",
        paragraphs: [
          "'I can't afford to hire help' — so you do everything yourself, which keeps you too busy to grow, which keeps revenue flat, which means you still can't afford help. Repeat forever. That loop is the single most common reason capable owners stay stuck.",
          "The Delegation Engine breaks it with arithmetic instead of willpower: once you see what your time is worth and what you're 'paying' yourself to do $15/hour work, the hiring math changes completely.",
        ],
      },
      {
        heading: "Your Time Has Three Prices",
        paragraphs: [
          "Price one: what you PAY yourself (your take-home). Price two: what you COST fully loaded (salary plus overhead). Price three: what you're WORTH per hour of genuinely high-value work — for most owners, $500+/hour when doing strategy, sales, and key relationships.",
          "Now audit an actual week and attach a rate to every block of time. The typical result: an owner worth $500/hour spending thirty hours a week on $15–25/hour tasks. That gap — hours × rate difference — is the real cost of not delegating, and it dwarfs any assistant's salary.",
        ],
      },
      {
        heading: "The 90-Day Roadmap That Sticks",
        paragraphs: [
          "Rank your delegation list by hours consumed × value gap — highest first. For each handoff: document the process, train the person, watch them do it, then let go with scheduled check-ins. Handoffs fail when owners skip the documentation and training steps, then declare 'it's faster to do it myself.'",
          "The core question isn't 'Can someone else do this as well as me?' It's 'Should the person steering the company be the one doing this at all?'",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the Owner's Trap?",
        options: [
          "Hiring too many people too fast",
          "'Can't afford help' → do everything yourself → too busy to grow → flat revenue → still can't afford help",
          "Taking too much vacation",
          "Overpaying vendors",
        ],
        correctIndex: 1,
        explanation:
          "It's a self-reinforcing loop — and it's broken by arithmetic (what your time is worth), not by working harder inside it.",
      },
      {
        question: "What are the three prices of your time?",
        options: [
          "Hourly, daily, and annual",
          "What you pay yourself, what you cost fully loaded, and what you're worth per high-value hour",
          "Gross, net, and after-tax",
          "Billable, non-billable, and overtime",
        ],
        correctIndex: 1,
        explanation:
          "The gap between what you're WORTH ($500+/hr on strategy and sales) and the $15–25/hr tasks filling your week is the true cost of not delegating.",
      },
      {
        question: "What's the right question to ask about a task on your plate?",
        options: [
          "'Can someone else do this as well as I can?'",
          "'Should the person steering the company be doing this at all?'",
          "'How fast can I finish it?'",
          "'Does anyone else want to do it?'",
        ],
        correctIndex: 1,
        explanation:
          "'Can someone else do it perfectly?' keeps everything on your plate. 'Should I be the one?' is the question that frees you.",
      },
      {
        question: "In what order should you delegate tasks?",
        options: [
          "Whatever you dislike most, first",
          "Highest hours consumed × biggest value gap first",
          "Easiest to explain first",
          "Random — order doesn't matter",
        ],
        correctIndex: 1,
        explanation:
          "A 10-hour/week $20 task beats a 1-hour/week annoyance. Rank by hours × value gap and the roadmap writes itself.",
      },
      {
        question: "Why do most delegation attempts fail?",
        options: [
          "Employees are less capable than owners",
          "The owner skips documenting and training, then concludes 'it's faster to do it myself'",
          "Delegation software is expensive",
          "Tasks genuinely require the owner",
        ],
        correctIndex: 1,
        explanation:
          "Document → train → watch → release with check-ins. Skip the first two steps and the handoff collapses — confirming the owner's excuse.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 8 — The SOP Factory
  //----------------------------------------------------------------------------
  {
    slug: "sop-factory",
    order: 8,
    title: "The SOP Factory",
    tagline: "Systems",
    description:
      "Document once, delegate forever. Extract the processes trapped in your head into clear SOPs anyone can follow — so the business stops depending on one person's availability.",
    videoUrl: PLACEHOLDER_VIDEO(8),
    pdfs: [],
    images: [],
    keyPoints: [
      "The Knowledge Trap: when every answer is 'ask the owner,' the owner is the bottleneck.",
      "Document once, delegate forever.",
      "Write SOPs for the task you're ABOUT to delegate — that's the trigger.",
      "A good SOP includes steps, decision points, and quality checks.",
      "Every documented process is a chance to spot automation opportunities.",
    ],
    lesson: [
      {
        heading: "The Knowledge Trap",
        paragraphs: [
          "'How do we handle refunds?' — 'Ask the owner, they know.' When critical processes live only in your head, you are the bottleneck for everything: you can't take vacation, can't scale, can't delegate, and the business depends on one person's availability. That's not a company — it's a job with overhead.",
          "The SOP Factory's motto: document once, delegate forever.",
        ],
      },
      {
        heading: "Extracting What's in Your Head",
        paragraphs: [
          "The trigger for writing an SOP is practical: document any process right before you delegate it, when you onboard someone new, or the moment you realize you're the only person who knows how something critical works.",
          "Talk through the process step by step as if teaching a smart new hire. Capture the steps — but also the decision points ('if the refund is over $200, do X') and the quality checks ('before sending, verify Y'). Steps without decision points produce robots who get stuck; decision points without quality checks produce confident mistakes.",
        ],
      },
      {
        heading: "From Document to Leverage",
        paragraphs: [
          "Each SOP should exist in two forms: the full document for training, and a short checklist for daily use — nobody re-reads three pages to do a routine task. Pair every SOP with a quick handoff plan: who learns it, when, and how you'll verify they've got it.",
          "Documentation has a bonus payoff: writing a process down exposes its waste. Steps that exist for no reason, approvals nobody needs, work that software could do — every SOP is an automation audit in disguise.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the Knowledge Trap?",
        options: [
          "Hiring people who know more than you",
          "Critical processes living only in the owner's head, making them the bottleneck for everything",
          "Reading too many business books",
          "Over-documenting simple tasks",
        ],
        correctIndex: 1,
        explanation:
          "When every answer is 'ask the owner,' you can't take vacation, can't scale, and the business depends on one person's availability.",
      },
      {
        question: "When should you write an SOP?",
        options: [
          "Once a year during planning week",
          "Right before delegating a task, when onboarding, or when you realize only you know something critical",
          "Only when required by regulators",
          "After something goes wrong",
        ],
        correctIndex: 1,
        explanation:
          "SOPs written 'someday' never happen. The trigger is practical: document at the moment the knowledge needs to move.",
      },
      {
        question: "Beyond steps, what must a good SOP include?",
        options: [
          "The company mission statement",
          "Decision points ('if X, then Y') and quality checks ('verify before sending')",
          "Legal disclaimers",
          "The owner's phone number for questions",
        ],
        correctIndex: 1,
        explanation:
          "Steps alone produce people who get stuck at the first exception. Decision points and quality checks are what make an SOP self-sufficient.",
      },
      {
        question: "Why keep a checklist version alongside the full SOP?",
        options: [
          "Checklists look more professional",
          "The full doc is for training; nobody re-reads three pages daily — the checklist is for actual use",
          "To satisfy auditors",
          "Checklists replace training",
        ],
        correctIndex: 1,
        explanation:
          "Two forms, two jobs: document to learn from, checklist to work from.",
      },
      {
        question: "What's the hidden bonus of documenting a process?",
        options: [
          "It fills your knowledge base",
          "Writing it down exposes waste and automation opportunities — every SOP is an automation audit in disguise",
          "It impresses investors",
          "It counts as marketing content",
        ],
        correctIndex: 1,
        explanation:
          "Pointless steps, unneeded approvals, and software-able work all become visible the moment a process hits paper.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 9 — The Difficult Conversations Coach
  //----------------------------------------------------------------------------
  {
    slug: "difficult-conversations",
    order: 9,
    title: "The Difficult Conversations Coach",
    tagline: "Leadership",
    description:
      "Transform dreaded workplace conversations — performance issues, conflicts, feedback — into growth opportunities using psychological safety and structured preparation.",
    videoUrl: PLACEHOLDER_VIDEO(9),
    pdfs: [],
    images: [],
    keyPoints: [
      "The conversation you're avoiding is the one your team needs most.",
      "Goal: find the truth together — not win, not just 'deliver a message.'",
      "Psychological safety turns confrontation into collaboration.",
      "Prepare: your intent, their perspective, likely reactions.",
      "Practice hard conversations before having them.",
    ],
    lesson: [
      {
        heading: "The Old Way vs. the Growth Way",
        paragraphs: [
          "Most difficult-conversation advice teaches you to 'deliver bad news' and control the outcome — an adversarial frame that produces compliance at best and hidden resentment at worst. The Master's Edge frame is different: create shared understanding, honor their perspective, and find the best path together.",
          "'I need to tell them…' becomes 'We need to understand…'. The result isn't just a softer conversation — it's problems actually getting solved and trust deepening instead of eroding.",
        ],
      },
      {
        heading: "Prepare With Their Perspective in the Room",
        paragraphs: [
          "Before the conversation, get clear on three things: your genuine intent (growth, not punishment), the facts as you see them, and — hardest — how the situation probably looks from THEIR side. Anticipate their likely reactions and decide how you'll respond to each without escalating.",
          "Frame openings around observation and curiosity: 'I've noticed X, and I want to understand what's happening' lands completely differently than 'We need to talk about your performance.'",
        ],
      },
      {
        heading: "Practice Before It's Real",
        paragraphs: [
          "Nobody delivers a hard conversation well on the first attempt — so don't let the real conversation BE the first attempt. Rehearse out loud: say the opening, respond to pushback, practice staying calm when they get defensive.",
          "And afterward, reflect: What did they say that surprised you? What would you do differently? Difficult conversations are a skill, and every one you stop avoiding makes the next one easier. Remember the core truth: the conversation you're avoiding is the one your team needs most.",
        ],
      },
    ],
    quiz: [
      {
        question: "What's the Master's Edge goal in a difficult conversation?",
        options: [
          "Deliver the message and minimize their reaction",
          "Create shared understanding and find the best path together",
          "Win the conversation with prepared arguments",
          "Get it over with quickly",
        ],
        correctIndex: 1,
        explanation:
          "The adversarial frame produces compliance and hidden resentment. The growth frame — truth-finding together — solves the actual problem and deepens trust.",
      },
      {
        question: "What does 'the conversation you're avoiding is the one your team needs most' mean?",
        options: [
          "Avoidance protects the team from stress",
          "The unaddressed issue keeps damaging the team while you wait — avoidance has a cost",
          "Teams prefer indirect hints",
          "Only formal reviews matter",
        ],
        correctIndex: 1,
        explanation:
          "Every week the issue goes unnamed, the behavior continues, others notice it's tolerated, and resentment compounds — avoidance is a decision too.",
      },
      {
        question: "What's the hardest — and most important — part of preparation?",
        options: [
          "Memorizing your talking points",
          "Honestly imagining how the situation looks from THEIR side",
          "Choosing the right meeting room",
          "Having HR present",
        ],
        correctIndex: 1,
        explanation:
          "Their perspective is the half of the conversation you can't script. Considering it beforehand is what turns confrontation into collaboration.",
      },
      {
        question: "Which opening line follows the psychological-safety approach?",
        options: [
          "'We need to talk about your performance.'",
          "'I've noticed X, and I want to understand what's happening.'",
          "'Everyone has complained about you.'",
          "'This isn't a big deal, but…'",
        ],
        correctIndex: 1,
        explanation:
          "Observation plus curiosity invites their side of the story. Verdicts and anonymous accusations trigger defense before the conversation starts.",
      },
      {
        question: "Why practice a difficult conversation out loud beforehand?",
        options: [
          "To memorize a script word-for-word",
          "So the real conversation isn't your first attempt — rehearsing pushback keeps you calm when it comes",
          "To time how long it will take",
          "Practice makes it feel less sincere",
        ],
        correctIndex: 1,
        explanation:
          "You rehearse responses to defensiveness so your composure is trained, not hoped for. Sincerity survives practice; panic doesn't.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 10 — The Hiring Oracle
  //----------------------------------------------------------------------------
  {
    slug: "hiring-oracle",
    order: 10,
    title: "The Hiring Oracle",
    tagline: "People",
    description:
      "Stop gut-feel hiring. Hire for values, train for skills — with structured interviews, culture-fit assessment, and candidate scorecards that predict who will actually thrive.",
    videoUrl: PLACEHOLDER_VIDEO(10),
    pdfs: [],
    images: [],
    keyPoints: [
      "Hire for values, train for skills — get it backwards and no training fixes it.",
      "Most hiring fails on fit, not ability.",
      "A wrong-values hire costs 6 months of friction and team morale.",
      "Score every candidate on the same criteria — gut feel lies.",
      "Structured beats improvised: same questions, same scorecard, every candidate.",
    ],
    lesson: [
      {
        heading: "Why Hiring Fails",
        paragraphs: [
          "Most bad hires aren't skill failures — they're fit failures. Software proficiency, process knowledge, and industry experience can all be taught. Integrity, work ethic, communication style, and growth mindset cannot. Hire someone with perfect skills and wrong values and you buy six months of friction, team morale damage, and an expensive exit.",
          "Hence the rule: hire for values, train for skills. Get it backwards and no amount of training fixes the problem.",
        ],
      },
      {
        heading: "Structure Beats Gut Feel",
        paragraphs: [
          "Unstructured interviews measure one thing: how much the candidate resembles the interviewer. The fix is boring and powerful — same questions, same order, same scorecard, every candidate. Behavioral questions ('tell me about a time you…') reveal values far better than hypotheticals, because past behavior is the best predictor of future behavior.",
          "Score each candidate on defined criteria immediately after the interview, before comparing notes with anyone — group discussion first means the most confident voice decides the hire.",
        ],
      },
      {
        heading: "The Decision, Systematized",
        paragraphs: [
          "Define your culture's actual values first — not poster words, but how your team really operates. Then assess candidates against those specific values, check references with real questions, and let the scorecard drive the decision.",
          "If the scorecard says no and your gut says yes, listen to the scorecard: 'gut yes' on a weak scorecard usually means the candidate is charming — which is a skill, and not the one you're hiring for.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the core rule of the Hiring Oracle?",
        options: [
          "Hire the most experienced candidate",
          "Hire for values, train for skills",
          "Hire fast, fire faster",
          "Only hire referrals",
        ],
        correctIndex: 1,
        explanation:
          "Skills can be taught; values can't. Reverse the rule and no training program fixes the mismatch.",
      },
      {
        question: "What does hiring someone with great skills but wrong values cost?",
        options: [
          "Nothing — skills are what matter",
          "Roughly six months of friction, team morale damage, and an expensive exit",
          "A slightly longer onboarding",
          "Extra software licenses",
        ],
        correctIndex: 1,
        explanation:
          "The expensive mistake isn't the salary — it's the friction, the morale damage to the rest of the team, and the eventual do-over.",
      },
      {
        question: "Why use the same questions and scorecard for every candidate?",
        options: [
          "It's legally required everywhere",
          "Unstructured interviews mostly measure resemblance to the interviewer — structure makes candidates comparable",
          "It saves preparation time",
          "Candidates prefer it",
        ],
        correctIndex: 1,
        explanation:
          "Without structure you're ranking charm and similarity. With it, you're ranking evidence against the same bar.",
      },
      {
        question: "Why do behavioral questions ('tell me about a time…') beat hypotheticals?",
        options: [
          "They're easier to answer",
          "Past behavior is the best predictor of future behavior — hypotheticals collect rehearsed ideals",
          "They take less time",
          "They test memory",
        ],
        correctIndex: 1,
        explanation:
          "Anyone can describe the right thing to do. What they actually DID last time under pressure is the signal.",
      },
      {
        question: "The scorecard says no but your gut says yes. What now?",
        options: [
          "Trust the gut — that's experience talking",
          "Trust the scorecard — 'gut yes' on weak evidence usually means the candidate is charming",
          "Flip a coin",
          "Extend the interview process indefinitely",
        ],
        correctIndex: 1,
        explanation:
          "Charm is a skill — just not the one you're hiring for. The scorecard exists precisely for this moment.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 11 — The Brand Book Creator
  //----------------------------------------------------------------------------
  {
    slug: "brand-book",
    order: 11,
    title: "The Brand Book Creator",
    tagline: "Identity",
    description:
      "Your brand book is the DNA of your business — who you are, how you sound, what you stand for. Build the North Star that keeps marketing consistent, hiring aligned, and decisions on-brand.",
    videoUrl: PLACEHOLDER_VIDEO(11),
    pdfs: [],
    images: [],
    keyPoints: [
      "Without a brand book, marketing is inconsistent and decisions have no North Star.",
      "The essentials: foundation, values, story, voice, personality, audience.",
      "Your brand story sells better than your feature list.",
      "Voice & tone rules let anyone write as the brand — not just you.",
      "The brand book feeds hiring: culture-fit needs defined culture.",
    ],
    lesson: [
      {
        heading: "The DNA of Your Business",
        paragraphs: [
          "Your brand book defines who you are, how you sound, what you stand for, and how you show up in the world. Without it, every piece of marketing gets invented from scratch (and shows it), hiring lacks a culture definition to screen against, and your team makes daily decisions with no North Star.",
          "A complete brand book covers fifteen sections, but the spine is six: brand foundation (name, purpose, vision, mission, positioning), core values, brand story, voice and tone, personality, and target audience.",
        ],
      },
      {
        heading: "Story and Voice Do the Heavy Lifting",
        paragraphs: [
          "People buy stories, not feature lists. Your origin story — why this business exists, what problem made you angry enough to solve it — belongs in short and full versions, ready for websites, pitches, and interviews.",
          "Voice and tone rules are what let anyone on your team write as the brand: the words you use, the words you never use, how formal you are, how you handle bad news. Without written voice rules, your brand sounds like whoever wrote the last email.",
        ],
      },
      {
        heading: "One Source of Truth, Many Uses",
        paragraphs: [
          "The brand book isn't a marketing document — it's an operating document. It feeds your hiring (culture-fit screening requires a defined culture), your vendor briefs (designers and agencies stop guessing), and your team's judgment calls ('would our brand do this?').",
          "Build it once, in sessions — essentials first, refinements over time — and every future decision gets faster and more consistent.",
        ],
      },
    ],
    quiz: [
      {
        question: "What happens to a business without a brand book?",
        options: [
          "Nothing — brand books are for big companies",
          "Marketing is inconsistent, hiring lacks culture alignment, and decisions have no North Star",
          "It saves money on design",
          "The logo does the work",
        ],
        correctIndex: 1,
        explanation:
          "Every touchpoint gets reinvented from scratch — and it shows. The brand book is the single source of truth everything else draws from.",
      },
      {
        question: "Which sections form the essential spine of a brand book?",
        options: [
          "Logo files and color codes only",
          "Foundation, values, story, voice & tone, personality, and target audience",
          "Legal trademarks and usage rules only",
          "Hashtags and keywords",
        ],
        correctIndex: 1,
        explanation:
          "Visual identity matters, but the six spine sections define WHO the brand is — everything visual expresses them.",
      },
      {
        question: "Why does your brand story matter more than your feature list?",
        options: [
          "Stories are shorter",
          "People buy stories and the 'why' behind a business — features get compared, stories get remembered",
          "Feature lists are illegal in ads",
          "Stories require no updates",
        ],
        correctIndex: 1,
        explanation:
          "Competitors can match your features. Nobody can match your origin story — it's differentiation that can't be copied.",
      },
      {
        question: "What do written voice & tone rules enable?",
        options: [
          "Longer marketing copy",
          "Anyone on the team can write as the brand — not just the founder",
          "Cheaper printing",
          "Automatic social posting",
        ],
        correctIndex: 1,
        explanation:
          "Without them, the brand sounds like whoever wrote the last email. With them, delegation of marketing becomes possible.",
      },
      {
        question: "How does the brand book connect to hiring?",
        options: [
          "Candidates must memorize it",
          "Culture-fit screening requires a defined culture — the brand book's values are that definition",
          "It replaces job descriptions",
          "It doesn't — they're separate",
        ],
        correctIndex: 1,
        explanation:
          "You can't hire for values you haven't written down. The brand book feeds the Hiring Oracle directly.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 12 — The P&L Creation System
  //----------------------------------------------------------------------------
  {
    slug: "pl-creation",
    order: 12,
    title: "The P&L Creation System",
    tagline: "Money Mastery",
    description:
      "A P&L is a roadmap, not just paperwork. Build a 3-year financial model with realistic revenue assumptions, honest expense categories, break-even clarity, and what-if scenarios.",
    videoUrl: PLACEHOLDER_VIDEO(12),
    pdfs: [],
    images: [],
    keyPoints: [
      "A P&L is a decision-making roadmap, not a tax formality.",
      "Revenue projections are only as good as their written assumptions.",
      "Know gross profit, operating profit, and net profit — and the difference.",
      "Profit on paper ≠ cash in the bank; timing is everything.",
      "Model best case, worst case, and most likely — then plan for worst.",
    ],
    lesson: [
      {
        heading: "Your P&L Is a Roadmap",
        paragraphs: [
          "Most small business owners either have no P&L, one too complex to use, or one that answers no real questions. Done right, a P&L is a decision-making tool: it projects revenue on stated assumptions, categorizes costs honestly, reveals true margins, and shows whether the business model actually works at scale.",
          "The discipline that matters most: write down the ASSUMPTIONS behind every revenue number — how many customers, at what price, growing at what rate, and why you believe it. A projection without assumptions is a wish.",
        ],
      },
      {
        heading: "The Three Profits",
        paragraphs: [
          "Gross profit is revenue minus the direct costs of delivering it (COGS) — it tells you whether the core offering makes money. Operating profit subtracts overhead — rent, salaries, software — and tells you whether the BUSINESS makes money. Net profit is what's left after everything.",
          "Owners who only watch the top line routinely grow revenue while margins quietly collapse. Watch all three lines and you'll spot the problem while it's still cheap to fix.",
        ],
      },
      {
        heading: "Cash Timing and Scenarios",
        paragraphs: [
          "Profit on paper is not cash in the bank. A profitable month can still bounce payroll if customers pay in 60 days and rent is due in 5. Project when money actually arrives and leaves — cash-flow timing kills more small businesses than lack of profit does.",
          "Finally, model three scenarios: best case, worst case, most likely. Know your break-even — the revenue that covers all costs — and make sure you survive the worst case. Optimism is a fine attitude and a terrible financial plan.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is a P&L, properly used?",
        options: [
          "A tax document your accountant needs",
          "A decision-making roadmap that reveals margins, break-even, and whether the model works",
          "A report for investors only",
          "A record of last year's mistakes",
        ],
        correctIndex: 1,
        explanation:
          "The P&L answers operating questions: can we afford this hire, when do we break even, which offering actually makes money.",
      },
      {
        question: "What makes a revenue projection credible?",
        options: [
          "Round numbers that grow 10% monthly",
          "Written assumptions: how many customers, at what price, growing at what rate, and why",
          "Matching last year exactly",
          "Being conservative enough to always beat",
        ],
        correctIndex: 1,
        explanation:
          "A projection without assumptions is a wish. Written assumptions can be checked, challenged, and corrected as reality arrives.",
      },
      {
        question: "What does GROSS profit tell you?",
        options: [
          "What's left after all expenses",
          "Whether your core offering makes money before overhead — revenue minus direct delivery costs",
          "Your salary",
          "Your tax bill",
        ],
        correctIndex: 1,
        explanation:
          "If gross margin is broken, no amount of overhead-cutting saves you — the offering itself needs repricing or redesign.",
      },
      {
        question: "How can a profitable business still bounce payroll?",
        options: [
          "It can't — profit means cash",
          "Cash timing: customers pay in 60 days while rent and payroll are due now",
          "Only through fraud",
          "Bank errors",
        ],
        correctIndex: 1,
        explanation:
          "Profit is an accounting concept; payroll is a cash event. Cash-flow timing kills more small businesses than lack of profit.",
      },
      {
        question: "Why model best case, worst case, AND most likely?",
        options: [
          "To have more spreadsheets",
          "Because you plan spending against the worst case — optimism is a fine attitude and a terrible financial plan",
          "Investors require three tabs",
          "The average of three guesses is accurate",
        ],
        correctIndex: 1,
        explanation:
          "The scenarios exist so the worst case can't kill you. Survive the downside and the upside takes care of itself.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 13 — The Referral Engine
  //----------------------------------------------------------------------------
  {
    slug: "referral-engine",
    order: 13,
    title: "The Referral Engine",
    tagline: "Growth",
    description:
      "Stop hoping for referrals and build a system: trackable referral links, clear rewards, and automated attribution so every advocate gets credited and every referral gets followed up.",
    videoUrl: PLACEHOLDER_VIDEO(13),
    pdfs: [],
    images: [],
    keyPoints: [
      "Hope is not a referral strategy — systems are.",
      "Every referrer gets a unique, trackable link.",
      "Attribution must survive the delay between click and purchase.",
      "Reward promptly and visibly — paid referrers refer again.",
      "One source of truth: referral data lives with your customer data.",
    ],
    lesson: [
      {
        heading: "From Hoping to Engineering",
        paragraphs: [
          "Most businesses treat referrals as luck: happy customers MIGHT mention you. A referral engine replaces hope with a system — give every advocate a unique trackable link, define what they earn for a successful referral, and automate the tracking so nobody's contribution gets lost.",
          "Word-of-mouth is your highest-converting channel. Engineering it isn't crass — it's respecting its value.",
        ],
      },
      {
        heading: "Attribution Is the Hard Part",
        paragraphs: [
          "The mechanics: a referrer shares their link, the click gets captured and remembered, and when that prospect eventually buys — days or weeks later — the sale credits the right referrer. That delay is why casual tracking fails: memory-based attribution collapses the moment a referral doesn't buy same-day.",
          "Keep referral data in the same system as your customer data — one source of truth. Separate spreadsheets and disconnected tools guarantee sync issues, missed credits, and annoyed advocates.",
        ],
      },
      {
        heading: "Rewards That Keep the Engine Running",
        paragraphs: [
          "Pay promptly and visibly. A referrer who gets credited fast refers again; one who has to chase you for their reward tells that story instead. Rewards don't have to be cash — credits, upgrades, and reciprocal referrals all work — but they must be defined up front and delivered without friction.",
          "Then work the system: thank-yous, leaderboards, seasonal bonuses. An engine needs fuel — attention is the fuel.",
        ],
      },
    ],
    quiz: [
      {
        question: "What separates a referral ENGINE from ordinary word-of-mouth?",
        options: [
          "Better customer service",
          "A system: unique trackable links, defined rewards, and automated attribution",
          "More social media posts",
          "Lower prices",
        ],
        correctIndex: 1,
        explanation:
          "Hope is not a strategy. The engine makes referrals trackable, rewardable, and repeatable.",
      },
      {
        question: "Why does casual, memory-based referral tracking fail?",
        options: [
          "People are dishonest",
          "Days or weeks pass between the click and the purchase — attribution must survive that gap",
          "Links are too long",
          "It doesn't — memory works fine",
        ],
        correctIndex: 1,
        explanation:
          "'Who sent you?' asked at checkout misses most referrals. The system remembers so nobody has to.",
      },
      {
        question: "Where should referral data live?",
        options: [
          "A dedicated spreadsheet",
          "In the same system as your customer data — one source of truth",
          "The referrer keeps their own records",
          "Email threads",
        ],
        correctIndex: 1,
        explanation:
          "Disconnected tools mean sync issues, missed credits, and annoyed advocates. One system, one truth.",
      },
      {
        question: "What happens when referral rewards are slow or unclear?",
        options: [
          "Nothing — people refer for love",
          "Referrers stop referring — and tell the story of chasing you for their reward",
          "Rewards become more valuable",
          "Taxes get simpler",
        ],
        correctIndex: 1,
        explanation:
          "Prompt, visible rewards create repeat referrers. Friction creates ex-referrers with a warning story.",
      },
      {
        question: "Which is a valid referral reward?",
        options: [
          "Cash only",
          "Cash, account credits, upgrades, or reciprocal referrals — defined up front, delivered without friction",
          "A verbal thank-you only",
          "Exposure",
        ],
        correctIndex: 1,
        explanation:
          "The form matters less than the clarity and promptness. Defined up front, paid fast — that's what keeps the engine running.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 14 — The CEO Dashboard
  //----------------------------------------------------------------------------
  {
    slug: "ceo-dashboard",
    order: 14,
    title: "The CEO Dashboard",
    tagline: "Visibility",
    description:
      "See the health of your entire business on one screen — revenue, customers, marketing, operations — updated automatically, without logging into five tools or asking 'how are we doing?'",
    videoUrl: PLACEHOLDER_VIDEO(14),
    pdfs: [],
    images: [],
    keyPoints: [
      "Checking numbers by 'clicking around' is driving by glancing out the window.",
      "Four views: Revenue, Customers, Marketing, Operations.",
      "Track trends, not snapshots — direction beats position.",
      "Automate the updates or the dashboard dies in a month.",
      "A few metrics you act on beat fifty you admire.",
    ],
    lesson: [
      {
        heading: "Driving by Glancing Out the Window",
        paragraphs: [
          "Most owners check business health by logging into tools and clicking around, asking the team 'how'd we do this month?', or looking at the bank balance and guessing. That's driving a car by occasionally glancing out the window. A CEO Dashboard puts every gauge on one panel — updated automatically.",
        ],
      },
      {
        heading: "The Four Views",
        paragraphs: [
          "Revenue: recurring revenue, growth rate, average revenue per customer, forecast. Customers: active count, churn rate, health, who's at risk. Marketing: lead volume, cost per lead, conversion rate, channel ROI. Operations: tasks, service levels, team workload.",
          "Together they answer the four questions every owner secretly asks: Are we growing? Are customers happy? Is marketing paying for itself? Is the machine running smoothly?",
        ],
      },
      {
        heading: "Trends, Automation, and Restraint",
        paragraphs: [
          "A number without a trend is almost meaningless — $40k revenue is great news on a $30k trend and alarming on a $60k one. Watch direction, not snapshots.",
          "Two rules keep dashboards alive: automate the data feeds (manually updated dashboards die within a month), and resist metric hoarding. A handful of numbers you check weekly and ACT on beats fifty charts you admire quarterly. If a metric changing wouldn't change a decision, it doesn't belong on the dashboard.",
        ],
      },
    ],
    quiz: [
      {
        question: "How do most small business owners check their numbers?",
        options: [
          "Real-time dashboards",
          "Clicking around tools, asking the team, or glancing at the bank balance — like driving by glancing out the window",
          "Monthly board meetings",
          "They don't check at all",
        ],
        correctIndex: 1,
        explanation:
          "Scattered, occasional checks mean problems are discovered late. The dashboard puts every gauge on one panel.",
      },
      {
        question: "What are the four views of the CEO Dashboard?",
        options: [
          "Sales, HR, Legal, IT",
          "Revenue, Customers, Marketing, Operations",
          "Daily, Weekly, Monthly, Yearly",
          "Profit, Loss, Assets, Debts",
        ],
        correctIndex: 1,
        explanation:
          "They answer the four real questions: growing? customers happy? marketing paying off? machine running smoothly?",
      },
      {
        question: "Why do trends matter more than snapshots?",
        options: [
          "Trends make prettier charts",
          "$40k revenue is great on a $30k trend and alarming on a $60k one — direction gives numbers meaning",
          "Snapshots are inaccurate",
          "Investors only read trends",
        ],
        correctIndex: 1,
        explanation:
          "The same number can be good or terrible news. Only the trend tells you which.",
      },
      {
        question: "What kills most dashboards within a month?",
        options: [
          "Software costs",
          "Manual updates — if the data doesn't feed automatically, the dashboard goes stale and gets abandoned",
          "Too few metrics",
          "Slow internet",
        ],
        correctIndex: 1,
        explanation:
          "A stale dashboard is worse than none — it breeds false confidence. Automation is what keeps it true.",
      },
      {
        question: "Which metrics belong on the dashboard?",
        options: [
          "Every metric you can collect",
          "Only ones where a change would change a decision — a few you act on beat fifty you admire",
          "Whatever competitors track",
          "Financial metrics only",
        ],
        correctIndex: 1,
        explanation:
          "Metric hoarding buries signal in noise. If it can't change a decision, it's decoration.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 15 — The Competitor Intelligence System
  //----------------------------------------------------------------------------
  {
    slug: "competitor-intelligence",
    order: 15,
    title: "The Competitor Intelligence System",
    tagline: "Market Awareness",
    description:
      "Stop playing chess without seeing your opponent's moves. Automatically monitor competitor pricing, services, and hiring pages — and get alerted the moment anything important changes.",
    videoUrl: PLACEHOLDER_VIDEO(15),
    pdfs: [],
    images: [],
    keyPoints: [
      "Manually 'keeping an eye on competitors' means finding out too late.",
      "Automate monitoring of pricing, services, homepage, and careers pages.",
      "A competitor hiring = growing; the roles reveal their strategy.",
      "Intelligence informs your strategy — it doesn't dictate copying.",
      "Watch suppliers and industry news too, not just rivals.",
    ],
    lesson: [
      {
        heading: "Chess Without Seeing the Board",
        paragraphs: [
          "Most owners 'keep an eye on competitors' by occasionally visiting their sites or hearing news from customers — usually too late to respond well. That's chess without seeing your opponent's moves. A competitor intelligence system watches automatically and alerts you the moment something important changes.",
        ],
      },
      {
        heading: "What to Watch, and What It Tells You",
        paragraphs: [
          "Pricing pages reveal raised prices (room for you to follow), lowered prices (pressure coming), and repackaged tiers. Services pages reveal new offerings and quiet discontinuations. The homepage reveals positioning shifts. Testimonials reveal whose customers they're winning.",
          "The underrated one: careers pages. A competitor hiring is a competitor growing — and the SPECIFIC roles telegraph strategy. Three sales hires means a push is coming; a first ops manager means they're systematizing.",
        ],
        bullets: [
          "Beyond rivals, monitor: industry news for market trends,",
          "regulatory pages for compliance changes,",
          "and supplier sites for pricing and availability shifts.",
        ],
      },
      {
        heading: "Intelligence, Not Imitation",
        paragraphs: [
          "The system's output is awareness, not instructions. Competitor intel informs your strategy — it doesn't mean copying every move. React to what threatens you, learn from what works, and exploit what they get wrong: a competitor's mistake — a botched redesign, an unpopular price hike — is your opening, but only if you know about it while it matters.",
        ],
      },
    ],
    quiz: [
      {
        question: "What's wrong with manually 'keeping an eye on' competitors?",
        options: [
          "It's illegal",
          "You find out about changes too late to respond well — chess without seeing your opponent's moves",
          "It takes too much bandwidth",
          "Competitors block repeat visitors",
        ],
        correctIndex: 1,
        explanation:
          "Occasional visits and customer rumors deliver stale intelligence. Automation delivers it while it's still actionable.",
      },
      {
        question: "A competitor's careers page shows three new sales roles. What does that tell you?",
        options: [
          "Nothing useful",
          "They're growing, and a sales push is coming — specific roles telegraph strategy",
          "They're about to close",
          "Their software is failing",
        ],
        correctIndex: 1,
        explanation:
          "Hiring = growing, and the role mix is the tell. Sales hires signal a push; a first ops manager signals systematizing.",
      },
      {
        question: "Which pages yield the highest-value competitor intelligence?",
        options: [
          "Privacy policy and terms only",
          "Pricing, services, homepage, testimonials, and careers pages",
          "The 404 page",
          "Site maps",
        ],
        correctIndex: 1,
        explanation:
          "Each answers a strategic question: what they charge, what they sell, how they position, who they're winning, and where they're investing.",
      },
      {
        question: "Besides competitors, what else is worth monitoring?",
        options: [
          "Nothing — focus only on rivals",
          "Industry news, regulatory pages, and supplier sites",
          "Employees' social media",
          "Random popular blogs",
        ],
        correctIndex: 1,
        explanation:
          "Market trends, compliance changes, and supplier pricing shifts all move your business — the same watching system covers them.",
      },
      {
        question: "A competitor botches a redesign and customers are complaining. The right response?",
        options: [
          "Copy their redesign anyway",
          "Treat it as an opening — a competitor's mistake is your opportunity, but only while it's fresh",
          "Publicly mock them",
          "Ignore it — their problems aren't your business",
        ],
        correctIndex: 1,
        explanation:
          "Intelligence informs strategy: react to threats, learn from wins, exploit mistakes — imitation is none of those.",
      },
    ],
  },

  //============================================================================
  // RECLAIMING THE CLOCK — modules 16–23, from Brett's best-selling book
  // (Time Maze™, Responsibility Backpack™, Acceptance Catapult™ © 2017)
  //============================================================================

  //----------------------------------------------------------------------------
  // Module 16 — The Time Maze
  //----------------------------------------------------------------------------
  {
    slug: "time-maze",
    order: 16,
    title: "The Time Maze",
    tagline: "Reclaiming the Clock",
    description:
      "Stop racing the clock and start solving the maze. Brett's signature framework: your day is a maze, your obligations are a backpack — and there's a trick to solving any maze faster.",
    videoUrl: PLACEHOLDER_VIDEO(16),
    pdfs: [],
    images: [],
    keyPoints: [
      "Your day is a maze; your tasks are a backpack you empty as you navigate it.",
      "Unfinished tasks roll into tomorrow's NEW maze — a heavier pack, different traps.",
      "Ounces equal pounds, pounds equal pain: a compounding backpack breaks you down.",
      "Only carry what's truly YOURS — others slip their weight into your pack.",
      "Solve the maze backwards: from the finish, the path is obvious.",
    ],
    lesson: [
      {
        heading: "Your Day Is a Maze, Not a Clock",
        paragraphs: [
          "Racing a clock is a losing game — the clock never gets tired. So change the picture: each day is a maze you enter in the morning, with turns, distractions, and dead ends. Your daily tasks and responsibilities ride in a backpack, and completing a task is dropping an item from the pack at its right place along the route. The goal is to reach the exit — pack empty — with time to spare.",
          "Most people never make it out. Phone calls, emails, random interruptions and wrong turns keep them from emptying the pack — they give up mid-maze and 'start again tomorrow.'",
        ],
      },
      {
        heading: "The Compounding Backpack",
        paragraphs: [
          "Here's the trap: tomorrow isn't the same maze. It's a NEW maze with different dead ends — and every task you didn't finish yesterday is still in your pack, under today's new load. Backpackers and soldiers know the rule: ounces equal pounds, and pounds equal pain. Day after day the pack gets heavier, the stress compounds — sleep suffers, focus slips, family time evaporates, money worries grow.",
          "And much of that weight was never yours. People slip their duties into your backpack constantly. Part of reclaiming the clock is refusing weight that doesn't belong to you — taking on someone else's load only after a careful, strategic decision that it works for YOU.",
        ],
      },
      {
        heading: "Solve It Backwards",
        paragraphs: [
          "There are three ways to solve a maze. Most people get dropped at the entrance and wander — no map, no plan, maximum frustration. Better: view it from the top down and trace start to finish — that's having a strategy. But the trick that beats both: work the maze BACKWARDS, from finish to start. Try it on paper — it's almost always faster.",
          "Applied to your life: start from what a finished, successful day looks like and work back to now. The rest of this course — values, impact zones, the Daily Dozen, selective ignorance, the 30% rule — is how you build that backwards map.",
        ],
      },
    ],
    quiz: [
      {
        question: "In the Time Maze framework, what does your backpack represent?",
        options: [
          "Your fears about work",
          "The day's tasks and responsibilities, which you drop off as you complete them",
          "Your long-term goals",
          "Money worries",
        ],
        correctIndex: 1,
        explanation:
          "You load the pack each morning, navigate the maze, and empty it task by task — aiming to exit with an empty pack and time to spare.",
      },
      {
        question: "Why do unfinished tasks hurt more than one bad day?",
        options: [
          "They don't — tomorrow is a fresh start",
          "They roll into tomorrow's NEW maze on top of new tasks — the pack compounds daily: ounces equal pounds, pounds equal pain",
          "Your boss notices",
          "They expire and disappear",
        ],
        correctIndex: 1,
        explanation:
          "Tomorrow brings a different maze AND a heavier pack. The compounding weight is what breaks people down — stress, sleep, focus, family.",
      },
      {
        question: "What's the fastest way to solve a maze — and a day?",
        options: [
          "Enter at the start and figure it out as you go",
          "Work it backwards from the finish — then build your day from the outcome back to now",
          "Move faster through every turn",
          "Skip the maze entirely",
        ],
        correctIndex: 1,
        explanation:
          "Backwards is almost always faster on paper mazes — and in life. Start from what a completed day looks like and map back.",
      },
      {
        question: "What should be in your backpack?",
        options: [
          "Everything anyone asks of you — that's teamwork",
          "Only tasks that are truly YOURS — others' weight gets in only by deliberate, strategic choice",
          "As much as possible, to build endurance",
          "Only work tasks, never personal ones",
        ],
        correctIndex: 1,
        explanation:
          "People slip their obligations into your pack constantly. Reclaiming the clock starts with refusing weight that was never yours.",
      },
      {
        question: "Why does the book replace the clock metaphor with a maze?",
        options: [
          "Clocks are old-fashioned",
          "You can't beat a clock — but a maze can be SOLVED, with a map, a strategy, and a lighter pack",
          "Mazes are more fun",
          "Time isn't real",
        ],
        correctIndex: 1,
        explanation:
          "Racing time is unwinnable. Solving a maze is a skill you can learn — which is exactly what this course teaches.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 17 — Mapping Your Values
  //----------------------------------------------------------------------------
  {
    slug: "mapping-values",
    order: 17,
    title: "Mapping Your Values",
    tagline: "Reclaiming the Clock",
    description:
      "Time is the universal amplifier. Map your true top-ten values — not the ones pushed on you — and align your goals so every reclaimed hour amplifies what actually matters.",
    videoUrl: PLACEHOLDER_VIDEO(17),
    pdfs: [],
    images: [],
    keyPoints: [
      "Conflict occurs when your goals and your values are out of alignment.",
      "List YOUR top ten values — not what others value or pushed on you.",
      "Time is the universal amplifier: it multiplies whatever you point it at.",
      "Almost every 'why don't I have X?' answer boils down to time.",
      "Make time itself a top value — it feeds every other value on the list.",
    ],
    lesson: [
      {
        heading: "Values First, Backpack Second",
        paragraphs: [
          "Value mapping decides what goes in your backpack at all — it's how you keep the pack light. Write your top ten values: peace of mind, health, relationship with spouse or kids, financial security, faith, free time, accomplishment — whatever is genuinely YOURS. Not what your parents valued, not what culture pushed on you.",
          "The test that matters: conflict occurs when your goals and your values are out of alignment. What you want has to agree with what you believe is important — otherwise every day is a quiet fight with yourself.",
        ],
      },
      {
        heading: "Time Is the Universal Amplifier",
        paragraphs: [
          "Point all your time at any one thing and that thing grows — focus every hour on making money and you WILL make money. Time multiplies whatever it touches. That's why it amplifies neglect too: ask people why they don't have the marriage, health, or finances they want and the answers all boil down to 'I don't have time.'",
          "Imagine your spouse saying 'I'm leaving — I never see you,' or your doctor saying 'drop thirty pounds or you have six months.' Suddenly the time appears. The ultimatum didn't create time; it re-aimed it. Value mapping is how you re-aim WITHOUT the ultimatum.",
        ],
      },
      {
        heading: "Make Time Your #1 Value",
        paragraphs: [
          "Brett's own answer: put TIME above everything. Do whatever it takes to create time first — because reclaimed time feeds every other value. Create time and the date nights happen, the workouts happen, the business grows, the mission gets funded.",
          "Fill the values sheet out for real — don't play the broken telephone game of assuming you know how it ends. Your top ten, on paper. Everything else in this course gets built on it.",
        ],
      },
    ],
    quiz: [
      {
        question: "When does inner conflict occur, according to the book?",
        options: [
          "When you work too many hours",
          "When your goals and your values are out of alignment",
          "When others disagree with you",
          "When you have too many values",
        ],
        correctIndex: 1,
        explanation:
          "What you want (goals) must agree with what you believe is important (values) — misalignment turns every day into a quiet fight with yourself.",
      },
      {
        question: "What does 'time is the universal amplifier' mean?",
        options: [
          "Time makes everything louder",
          "Time multiplies whatever you point it at — focus and neglect both compound",
          "Time heals all wounds",
          "More hours always equals more money",
        ],
        correctIndex: 1,
        explanation:
          "Aim all your time at anything and it grows. That's also why neglected values wither — they're being amplified toward zero.",
      },
      {
        question: "Whose values belong on your top-ten list?",
        options: [
          "A balanced mix of yours and your family's expectations",
          "Only YOURS — not what others value or what was pushed upon you",
          "Whatever successful people list",
          "The 25 from the book, in order",
        ],
        correctIndex: 1,
        explanation:
          "The sheet only works if it's honest. Inherited or imposed values put someone else's items in your backpack.",
      },
      {
        question: "Why do the spouse-ultimatum and doctor-ultimatum stories matter?",
        options: [
          "They prove ultimatums are healthy",
          "They show the time was always available — crisis just re-aimed it. Value mapping re-aims it WITHOUT the crisis",
          "They show some people can't change",
          "They're about communication skills",
        ],
        correctIndex: 1,
        explanation:
          "'I don't have time' really means 'it's not currently a priority.' The exercise moves your real priorities up before life forces them up.",
      },
      {
        question: "Why did Brett make TIME his #1 value?",
        options: [
          "He collects watches",
          "Reclaimed time feeds every other value — create time first and relationships, health, and business all improve",
          "Time is easier to measure than love",
          "His coach told him to",
        ],
        correctIndex: 1,
        explanation:
          "Time is the input every other value consumes. Secure the amplifier first, then point it at what matters.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 18 — The Daily Dozen
  //----------------------------------------------------------------------------
  {
    slug: "daily-dozen",
    order: 18,
    title: "The Daily Dozen",
    tagline: "Reclaiming the Clock",
    description:
      "Win your morning, win your day: build your personal set of before-9am activities — joy-bringers and stress-killers — so even a chaotic day starts accomplished and at peace.",
    videoUrl: PLACEHOLDER_VIDEO(18),
    pdfs: [],
    images: [],
    keyPoints: [
      "The Daily Dozen: activities you complete before 9am so the day starts won.",
      "It rarely equals twelve — seven to nine is typical. It evolves over time.",
      "Pick joy-bringers (tied to your values) and stress-eliminators.",
      "Affirmations work in present tense — as if already happening.",
      "Values → clarity → goals → Daily Dozen: the order matters.",
    ],
    lesson: [
      {
        heading: "Win the Morning, Win the Day",
        paragraphs: [
          "Your Daily Dozen is the set of activities you work to accomplish before 9am — so that even if the rest of the day totally falls apart, you already feel accomplished and at peace. The name is a nickname, not a quota: most people run seven to nine items, and the list evolves as your life does.",
          "The order of construction matters: values first, then clarity, then the goals your values produce — THEN the Daily Dozen falls into place easily. Done right, you wake with energy, stop skipping meals and rushing, stop living for the weekend, and start living for each day.",
        ],
      },
      {
        heading: "Build It From Joy and Stress-Relief",
        paragraphs: [
          "Two selection rules: pick things that bring you the most JOY (correlated to your values), and things that ELIMINATE recurring stress. Brett's own dozen is a model, not a mandate: positive reading, a present-tense affirmation, appreciation, music and a big glass of water, shower, healthy breakfast with vitamins, checking the bank account, talking with his wife and son, a workout, maximizing his first impact zone, and Facebook birthday wishes.",
          "Details that matter: affirmations are spoken as if already happening — 'I am living it now,' not 'someday I will.' The glass of water replaces the coffee you thought you needed — you lose eight to twelve ounces of water overnight just by breathing, and rehydrating restores energy on its own.",
        ],
      },
      {
        heading: "Make It Yours, Keep It Consistent",
        paragraphs: [
          "Audio books versus paper, gym versus walk, God versus gratitude — the medium is yours; the structure is what counts. Appreciation deserves a permanent slot: it's easy to fixate on what went wrong, so spend a few deliberate minutes on what's going well.",
          "Consistency converts the list into identity. When your first two waking hours are pre-decided and value-aligned, you stop negotiating with yourself every morning — and the maze gets solved before it even starts.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the Daily Dozen?",
        options: [
          "Twelve annual goals",
          "The set of activities you complete before 9am so the day starts already won",
          "A dozen work tasks per day",
          "Twelve affirmations",
        ],
        correctIndex: 1,
        explanation:
          "Even if the rest of the day falls apart, you feel accomplished and at peace — the day starts won, not chased.",
      },
      {
        question: "How many items does a Daily Dozen usually contain?",
        options: [
          "Exactly twelve — it's a strict quota",
          "Seven to nine is typical — the name is a nickname, and the list evolves",
          "At least twenty",
          "Three maximum",
        ],
        correctIndex: 1,
        explanation:
          "Brett himself usually runs seven to nine. What matters is joy, stress-relief, and consistency — not hitting a number.",
      },
      {
        question: "What two criteria select an activity for your Daily Dozen?",
        options: [
          "Difficulty and duration",
          "It brings you joy (tied to your values) or eliminates recurring stress",
          "Whatever successful people do",
          "Productivity and profit",
        ],
        correctIndex: 1,
        explanation:
          "Joy-bringers correlated to values, plus stress-eliminators — that's the whole filter.",
      },
      {
        question: "How should affirmations be phrased?",
        options: [
          "As future hopes: 'someday I will…'",
          "Present tense, as if already happening: 'I am living it now'",
          "As questions",
          "As warnings about failure",
        ],
        correctIndex: 1,
        explanation:
          "You program yourself by living the outcome now, not by postponing it to a vague someday.",
      },
      {
        question: "Why the big glass of water first thing every morning?",
        options: [
          "It's a tradition",
          "You lose 8–12 ounces overnight just breathing — rehydrating restores energy, often replacing the coffee",
          "It fills you up so you eat less",
          "Cold water builds discipline",
        ],
        correctIndex: 1,
        explanation:
          "Overnight dehydration drains energy and clarity. Water first — then see if you even need the stimulant.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 19 — Your 5% and Impact Zones
  //----------------------------------------------------------------------------
  {
    slug: "five-percent",
    order: 19,
    title: "Your 5% and Impact Zones",
    tagline: "Reclaiming the Clock",
    description:
      "Find the handful of activities only you can do brilliantly — your 5% — and schedule them into your daily impact zones, the 2–4 hour windows when you're naturally sharpest.",
    videoUrl: PLACEHOLDER_VIDEO(19),
    pdfs: [],
    images: [],
    keyPoints: [
      "Your 5%: the work you love that uses your unique gifts.",
      "'That's not in my 5%' — the phrase that grows your team and frees your time.",
      "The 70% rule: if someone can do it 70% as well, hand it off — they'll improve.",
      "Impact zones: 2–3 daily windows of peak clarity, lasting 2–4 hours.",
      "Highest-focus work goes in impact zones; everything else goes elsewhere.",
    ],
    lesson: [
      {
        heading: "Work in Your 5%",
        paragraphs: [
          "Out of everything you do, a thin slice — about 5% — is work you love that uses your unique gifts. That slice is where your greatest value lives. The discipline is moving everything else OUT: listing your daily activities on the left of a page and systematically moving only the true 5% to the right.",
          "The objection is always 'nobody can do it as well as me.' Maybe true — but do you really need to be filing, filling the company car, or writing the budget? If someone can do it 70% as well today, hand it off: with training and reps, they'll close the gap, and some will eventually beat you at it. Your team can't grow if you never give them the chance.",
        ],
      },
      {
        heading: "'That's Not in My 5%'",
        paragraphs: [
          "When Brett's team brought him tasks they could handle, the answer became a mantra: 'I trust you. You can do it. It's not in my 5%.' If they hadn't been trained, he trained them — but if they knew how and were just leaning on him, that was someone cramming weight into his backpack.",
          "Expect turbulence: you may lose people who were only there for a paycheck. But empowering the team to own their work — and their own 5% — is how the business grows dramatically while your time frees up.",
        ],
      },
      {
        heading: "Impact Zones",
        paragraphs: [
          "You already know the feeling — 'in the groove,' 'in the zone.' Those are impact zones: windows when your clarity, focus, and output peak. Most people have two or three per day, each lasting two to four hours — they just never track them, so the magic seems random.",
          "Brett's run 8:30–11:30am and 5:00–7:30pm. Find yours by observing a week, then schedule deliberately: the 5% work — writing, designing, strategy — goes IN the zones; checkbook, lawn, lunch meetings go elsewhere. You can even shift zones slightly by adjusting sleep and meal patterns. Work your 5% inside your impact zones and the effect is exponential: more done in a week than most manage in a month.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is your 5%?",
        options: [
          "The profit margin you keep",
          "The work you love that uses your unique gifts — where your greatest value lives",
          "The hardest 5% of your tasks",
          "Five percent of your calendar",
        ],
        correctIndex: 1,
        explanation:
          "The exercise: list all activities, then systematically move only the true 5% to your side of the page. Everything else finds another owner.",
      },
      {
        question: "What is the 70% rule for delegation?",
        options: [
          "Keep 70% of tasks for yourself",
          "If someone can do it 70% as well today, hand it off — training and reps close the gap",
          "Only delegate to people with 70% of your experience",
          "Delegate 70% of your salary",
        ],
        correctIndex: 1,
        explanation:
          "'Nobody does it as well as me' is usually true AND irrelevant. They get better because you train them — some end up better than you.",
      },
      {
        question: "What does the phrase 'That's not in my 5%' accomplish?",
        options: [
          "It avoids blame",
          "It stops trained people from leaning on you and cramming their weight into your backpack — while empowering them to own the work",
          "It ends meetings faster",
          "It impresses clients",
        ],
        correctIndex: 1,
        explanation:
          "'I trust you. You can do it. It's not in my 5%.' — the mantra that grows the team and frees the owner.",
      },
      {
        question: "What are impact zones?",
        options: [
          "Gym time slots",
          "Your 2–3 daily windows of peak clarity and focus, each lasting 2–4 hours",
          "Deadline periods",
          "Meeting-free days",
        ],
        correctIndex: 1,
        explanation:
          "'In the groove' isn't random — it recurs daily at trackable times. Find yours by observing a week.",
      },
      {
        question: "What belongs inside your impact zones?",
        options: [
          "Email and errands — get them done fast while sharp",
          "Your 5% — the highest-focus, highest-value work. Low-thought tasks get scheduled elsewhere",
          "Whatever comes up first",
          "Meetings, so you perform well",
        ],
        correctIndex: 1,
        explanation:
          "5% work inside impact zones is the exponential combination — a week's output beating most people's month.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 20 — The Ten Rules of Freedom
  //----------------------------------------------------------------------------
  {
    slug: "rules-of-freedom",
    order: 20,
    title: "The Ten Rules of Freedom",
    tagline: "Reclaiming the Clock",
    description:
      "Rewire how you think about time, work, and retirement: live for right now, ride your cycles of inspiration, honor self-promises, and make retirement your worst-case scenario — not the goal.",
    videoUrl: PLACEHOLDER_VIDEO(20),
    pdfs: [],
    images: [],
    keyPoints: [
      "Live your life for right now — don't park your dreams behind retirement.",
      "Interest and energy are cyclical — capture inspiration when it strikes.",
      "Action first: emotion builds AFTER you start, not before.",
      "Emphasize your strengths; let weaknesses sit if you choose.",
      "Honor self-promises — positive stress is deadlines you set and keep.",
    ],
    lesson: [
      {
        heading: "Retirement as Worst-Case Scenario",
        paragraphs: [
          "The rules are ordered to a provocative end: make retirement the WORST-case outcome, not the finish line. Rule #1 — live your life for right now. Don't build a bucket list for age 65; make your business or job revolve around attaining the life you want NOW, instead of making your life revolve around the job.",
          "Money gets demoted too: money is rarely a solution — it only solves the problems that not having money created. And watch net versus gross: many people burn enormous time generating impressive gross income that nets almost nothing after the dust settles.",
        ],
      },
      {
        heading: "Ride Your Cycles, Start Before You Feel Ready",
        paragraphs: [
          "Interest and energy are cyclical. Mid-project, you'll get sudden inspiration for something else entirely — don't fight it or lose it; log the idea (notepad beside the keyboard, voice memo) and return to your task. The idea is safe, your focus is intact.",
          "And don't wait to 'feel motivated': emotion builds when you start with action, not before it. Related: don't wait for permission either — act, and ask forgiveness if you ever need to (you probably won't).",
        ],
      },
      {
        heading: "Strengths, Enough-ness, and Positive Stress",
        paragraphs: [
          "Emphasize your strengths — build your work around what you're great at; weaknesses can be worked on or simply left to sit. But beware too much of a good thing: master these tools, and you could end up with abundant time and nothing to aim it at. Time without purpose is not the win — find the purpose.",
          "Finally, the engine of it all: positive stress. Negative stress is worrying about money; positive stress is setting a timeline and honoring the self-promise. Set it, announce it to yourself, make it happen — only the weak break self-promises. Each kept promise spikes positive stress briefly, then drops negative stress dramatically. That trade is the freedom.",
        ],
      },
    ],
    quiz: [
      {
        question: "How are the Ten Rules of Freedom deliberately ordered?",
        options: [
          "Alphabetically",
          "To make retirement the worst-case scenario — not the goal you defer your life toward",
          "Easiest to hardest",
          "By age group",
        ],
        correctIndex: 1,
        explanation:
          "Live for right now: make the business revolve around the life you want today, not a bucket list parked at 65.",
      },
      {
        question: "Mid-project, you're hit with inspiration for something unrelated. The rule?",
        options: [
          "Suppress it — focus means ignoring ideas",
          "Log it immediately (notepad, voice memo), then return to your task — the idea is saved, focus intact",
          "Abandon the current project",
          "Schedule a meeting about it",
        ],
        correctIndex: 1,
        explanation:
          "Interest and energy are cyclical — inspiration is fuel, not a distraction, IF you capture it without derailing.",
      },
      {
        question: "What's the relationship between action and motivation?",
        options: [
          "Wait for motivation, then act",
          "Emotion builds AFTER you start — action first, feelings follow",
          "Neither matters without talent",
          "Motivation is permanent once found",
        ],
        correctIndex: 1,
        explanation:
          "Waiting to feel ready is the trap. Start, and the emotional momentum arrives on its own.",
      },
      {
        question: "What does 'money is rarely a solution' mean?",
        options: [
          "Money doesn't matter at all",
          "Money only solves the problems that not having money created — misaligned values are the real bottleneck",
          "Never seek higher income",
          "Barter instead",
        ],
        correctIndex: 1,
        explanation:
          "If goals and values are misaligned, more money won't fix the life. Align first — then focused time creates the income anyway.",
      },
      {
        question: "What is positive stress?",
        options: [
          "Stress that feels exciting",
          "Setting a timeline, honoring the self-promise, and feeling negative stress drop when you deliver",
          "Other people's deadlines",
          "Caffeine",
        ],
        correctIndex: 1,
        explanation:
          "Self-imposed deadlines you actually keep — brief positive spike, dramatic negative drop. Only the weak break self-promises.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 21 — The Laws of Maximization
  //----------------------------------------------------------------------------
  {
    slug: "laws-of-maximization",
    order: 21,
    title: "The Laws of Maximization",
    tagline: "Reclaiming the Clock",
    description:
      "Fifteen tactical laws for squeezing more from every hour: Parkinson's Law, the least-slack rule, embedding, batching, the post-it note philosophy, and the 30% rule that ends lateness forever.",
    videoUrl: PLACEHOLDER_VIDEO(21),
    pdfs: [],
    images: [],
    keyPoints: [
      "Parkinson's Law: tasks expand to fill the time you give them — so give less.",
      "Least slack rule: shortest task first — the snowball is mathematically real.",
      "Embed short tasks inside long-running ones; batch similar tasks together.",
      "Never touch things twice: do it right, do it to completion.",
      "The 30% rule: pad every time estimate by 30% and lateness disappears.",
    ],
    lesson: [
      {
        heading: "Compress and Sequence",
        paragraphs: [
          "Parkinson's Law: any task expands in complexity based on how much time you give it. The counter is a challenging, self-imposed time limit — honored like any self-promise. More time doesn't make it easier; it makes it bigger.",
          "Then sequence with the least-slack rule: shortest task first. Five minutes, then ten, then fifteen — the snowball effect is backed by real operations math. And embed: start the laundry (long-running), and while it rolls, make the short call, then clean the floors. Series tasks nest inside each other.",
        ],
      },
      {
        heading: "Protect Completion",
        paragraphs: [
          "Do things right the first time — or make time to do them again. Never touch things twice — no half-doing a task and ping-ponging back later; do it to completion. Batch similar tasks: email two or three times a day and ONLY then (email is almost never your 5%, and it certainly doesn't belong in an impact zone); file all at once; return calls all at once.",
          "Work both ways: never walk anywhere empty-handed — upstairs trip, downstairs return, both with a purpose. Simple reprogramming, twice the throughput.",
        ],
      },
      {
        heading: "Plan Small, Pad Smart",
        paragraphs: [
          "The post-it note philosophy: fifteen minutes of planning to start the day, fifteen to close it, thirty once a week — and if the day's plan doesn't fit on a post-it note in normal handwriting, it isn't going to happen. Working in your 5%, the post-it is a full day.",
          "And the law that ends lateness: the 30% rule. The nine-minute school run takes nine minutes only when every light cooperates and every shoe is pre-tied — which is never. Pad every estimate by 30% and you arrive calm, early, and trusted. Schedule your day at 70% capacity and surprises stop being emergencies.",
        ],
      },
    ],
    quiz: [
      {
        question: "What does Parkinson's Law say about tasks?",
        options: [
          "Tasks get easier with more time",
          "Tasks expand in complexity to fill the time you give them — so set challenging limits",
          "Tasks are fixed in size",
          "Only work tasks obey laws",
        ],
        correctIndex: 1,
        explanation:
          "Give a task a week and it becomes a week-sized task. The counter: tight self-imposed deadlines, honored as self-promises.",
      },
      {
        question: "Facing a 5-minute, 10-minute, and 15-minute task, what order does the least-slack rule prescribe?",
        options: [
          "Longest first — eat the frog",
          "Shortest first: 5, then 10, then 15 — the snowball effect has real math behind it",
          "Random order",
          "Hardest first regardless of length",
        ],
        correctIndex: 1,
        explanation:
          "Shortest-to-longest — the 'least slack rule' from operations science — builds momentum and completions fastest.",
      },
      {
        question: "What does 'never touch things twice' forbid?",
        options: [
          "Delegating anything",
          "Half-doing a task and ping-ponging back later — do it right AND to completion",
          "Rereading emails",
          "Editing your work",
        ],
        correctIndex: 1,
        explanation:
          "Partial work plus a return trip costs more than finishing once. Schedule tasks so they get DONE.",
      },
      {
        question: "How often should you handle email, per the batching law?",
        options: [
          "Continuously — responsiveness wins",
          "Two or three fixed times a day, and only then — email is rarely your 5% and never impact-zone work",
          "Once a week",
          "Only when the inbox is full",
        ],
        correctIndex: 1,
        explanation:
          "Batch it with filing and calls: all at once, outside your peak windows, leaving impact zones for real work.",
      },
      {
        question: "What is the 30% rule?",
        options: [
          "Save 30% of income",
          "Pad every time estimate by 30% — the nine-minute trip only takes nine when everything is perfect, which is never",
          "Work 30% harder than peers",
          "Delegate 30% of tasks",
        ],
        correctIndex: 1,
        explanation:
          "Chronic lateness is chronic under-padding. Estimate +30% and arrive calm, early, and trusted.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 22 — Harmony and the Acceptance Catapult
  //----------------------------------------------------------------------------
  {
    slug: "harmony-acceptance",
    order: 22,
    title: "Harmony and the Acceptance Catapult",
    tagline: "Reclaiming the Clock",
    description:
      "Stop chasing 'balance' — it doesn't exist. Build harmony across family, fitness, finances, and faith, and use the Acceptance Catapult to stop fighting reality and start compounding.",
    videoUrl: PLACEHOLDER_VIDEO(22),
    pdfs: [],
    images: [],
    keyPoints: [
      "Balance is a scale that never settles; harmony is everyone doing their part over time.",
      "The four aspects to keep in harmony: family, fitness, finances, faith.",
      "Sometimes you give 10%, sometimes 90% — harmony absorbs the swings.",
      "Front-of-mind awareness: what you focus on daily, you get more of.",
      "The Acceptance Catapult: accept that some things are hard — then do them anyway.",
    ],
    lesson: [
      {
        heading: "Harmony, Not Balance",
        paragraphs: [
          "Balance implies a scale sitting perfectly level — and life never sits level. Chasing it wastes energy and breeds guilt. Harmony is different: like Jerry the restaurant trainer taught Brett's management class, on any shift you'll FEEL like you're doing all the work — and the others feel exactly the same about you. Focus on your best; the freeloaders weed themselves out over time.",
          "Sometimes you're at 10%, sometimes 90%. In a marriage, sometimes you carry more, sometimes your spouse does. That's not imbalance — that's harmony absorbing life's swings.",
        ],
      },
      {
        heading: "The Four-Part Harmony Practice",
        paragraphs: [
          "Keep four aspects of life in harmony: family, fitness, finances, and faith (or spirituality, whatever that means for you). The practices: put hobbies back into your week — you're reclaiming the time for them now. Keep fitness non-negotiable — reclaimed time is worthless if you're too unhealthy to use it. Keep a consistent schedule, especially sleep and your Daily Dozen.",
          "Mind your money daily — checking the bank account puts finances at the front of your mind, and front-of-mind awareness is real: like seeing your new car's model everywhere, whatever you consciously track, you get more of.",
        ],
      },
      {
        heading: "The Acceptance Catapult",
        paragraphs: [
          "Most people burn energy hunting shortcuts or resenting difficulty. The Acceptance Catapult flips it: accept five truths — 'this is the way it is, and I'll deal with it' — and the acceptance itself catapults you forward. The first: some things are just HARD. Social media, bookkeeping, difficult conversations — hard. Accept it, stop negotiating with reality, and do the work.",
          "Acceptance isn't resignation — it's the end of the exhausting inner argument about whether the work should be easier. That reclaimed energy goes into the work itself. Liberation through acceptance: that's the catapult.",
        ],
      },
    ],
    quiz: [
      {
        question: "Why does the book reject 'balance' as a goal?",
        options: [
          "Balance is too easy",
          "Balance is a scale that never settles — life swings constantly, and chasing level wastes energy and breeds guilt",
          "Balance is only for gymnasts",
          "Work should always come first",
        ],
        correctIndex: 1,
        explanation:
          "Harmony replaces it: everyone doing their part over time, absorbing the natural swings between 10% days and 90% days.",
      },
      {
        question: "What did Jerry the restaurant trainer teach about feeling like you do all the work?",
        options: [
          "Confront slackers immediately",
          "Everyone feels that way about everyone else — focus on your best and the true freeloaders weed themselves out",
          "Work less to match the others",
          "Report it to management",
        ],
        correctIndex: 1,
        explanation:
          "The feeling is universal and mostly mutual. Do your part, extend trust, and time sorts out the rest.",
      },
      {
        question: "What are the four aspects to keep in harmony?",
        options: [
          "Work, sleep, food, exercise",
          "Family, fitness, finances, and faith",
          "Money, power, respect, fame",
          "Mind, body, soul, career",
        ],
        correctIndex: 1,
        explanation:
          "The four F's — supported by hobbies, consistent schedules, daily money awareness, and the Daily Dozen.",
      },
      {
        question: "Why check your bank account every day?",
        options: [
          "To catch bank errors",
          "Front-of-mind awareness — what you consciously track daily, you get more of, like suddenly seeing your new car everywhere",
          "Banks require it",
          "To feel guilty about spending",
        ],
        correctIndex: 1,
        explanation:
          "Focus on your money and you start having more of it — the new-car effect applied to finances.",
      },
      {
        question: "What is the Acceptance Catapult?",
        options: [
          "A technique for lowering your standards",
          "Accepting hard truths — 'this is how it is, I'll deal with it' — which ends the inner argument and catapults that energy into the work",
          "Giving up on difficult goals",
          "A morning stretching routine",
        ],
        correctIndex: 1,
        explanation:
          "Some things are just hard. Acceptance isn't resignation — it's reclaiming the energy you were burning on resentment.",
      },
    ],
  },

  //----------------------------------------------------------------------------
  // Module 23 — Tools, Technology, and Making It Stick
  //----------------------------------------------------------------------------
  {
    slug: "tools-and-stick",
    order: 23,
    title: "Tools, Technology, and Making It Stick",
    tagline: "Reclaiming the Clock",
    description:
      "Three free tools beat three hundred apps: capture ideas instantly, coordinate projects visibly, schedule everything. Then the part that matters — working the program so the skills never fade.",
    videoUrl: PLACEHOLDER_VIDEO(23),
    pdfs: [],
    images: [],
    keyPoints: [
      "Three tools, not three hundred apps: capture, coordinate, schedule.",
      "Capture ideas the moment they strike — voice or text — so your mind can rest.",
      "Schedule EVERYTHING: personal time, workouts, appointments — that's harmony kept.",
      "The program only works as well as you work it.",
      "All skills are perishable — review often, like swimming after ten years away.",
    ],
    lesson: [
      {
        heading: "Three Tools Beat Three Hundred Apps",
        paragraphs: [
          "You don't need three hundred apps when three will do. Brett's stack (free versions, no affiliation): a note-capture tool (Evernote) — project files you can talk into from a bank line, a car, or bed, so inspiration is never lost; a project board (Trello) — when an editor, a writer, and a cover designer share one project, everyone sees where everything stands; and a scheduler (Acuity) — preset links and times, so appointments book themselves into slots YOU chose.",
          "The specific brands matter less than the three functions: capture instantly, coordinate visibly, schedule everything. If you have no tools, adopt three. If you have thirty, scale back.",
        ],
      },
      {
        heading: "Capture and Schedule Like You Mean It",
        paragraphs: [
          "The capture habit connects to the Rules of Freedom: inspiration is cyclical, so bank every idea the moment it strikes — talk into the phone, hit save, done. Ease the stress off your mind and watch how many MORE ideas flood in.",
          "And schedule everything — not just business. Personal time, workout time, date nights, naps: if it matters to your harmony, it gets a slot. What gets scheduled gets protected; what floats gets eaten by other people's priorities.",
        ],
      },
      {
        heading: "The Program Only Works If You Work It",
        paragraphs: [
          "The wrap-up truth: most people never evaluate how they spend their life until it's too late — finishing this course already puts you in the top percentage. But the results belong to those who IMPLEMENT: the students who report back amazed are the ones who put the material in place within days.",
          "Final warning: all skills are perishable. Swim after ten years away and you still swim — just worse. Time management decays the same way. Review the frameworks often — the maze, the values, the Dozen, the 5%, the laws — and you become, in the book's words, a productivity machine.",
        ],
      },
    ],
    quiz: [
      {
        question: "What's the book's rule on productivity apps?",
        options: [
          "More tools = more productivity",
          "Three tools covering capture, coordination, and scheduling beat three hundred apps",
          "Never pay for software",
          "Paper only — digital is a distraction",
        ],
        correctIndex: 1,
        explanation:
          "Capture instantly, coordinate visibly, schedule everything. Too many tools IS the time problem.",
      },
      {
        question: "Why capture ideas the instant they strike?",
        options: [
          "To prove you had them first",
          "Inspiration is cyclical and perishable — banking it eases your mind, and MORE ideas flood in",
          "To fill your note app",
          "Ideas are only valid when written",
        ],
        correctIndex: 1,
        explanation:
          "Talk into the phone, save, return to work. The mind, relieved of remembering, generates more.",
      },
      {
        question: "What should go on your calendar?",
        options: [
          "Business appointments only",
          "Everything that matters to your harmony — personal time, workouts, date nights included",
          "Only recurring meetings",
          "As little as possible, for flexibility",
        ],
        correctIndex: 1,
        explanation:
          "What gets scheduled gets protected. What floats gets eaten by other people's priorities.",
      },
      {
        question: "Who gets results from this program?",
        options: [
          "Everyone who reads it",
          "Those who implement within days — the program only works as well as you work it",
          "Natural organizers",
          "People with assistants",
        ],
        correctIndex: 1,
        explanation:
          "Reading is the entry fee. The students who report back amazed are the ones who put material in place immediately.",
      },
      {
        question: "Why must you review these skills regularly?",
        options: [
          "The rules change yearly",
          "All skills are perishable — like swimming after ten years away, unused time-management skill decays",
          "To memorize the book",
          "You don't — once learned, always learned",
        ],
        correctIndex: 1,
        explanation:
          "Review often — maze, values, Dozen, 5%, laws — and stay a productivity machine instead of becoming a former one.",
      },
    ],
  },

  //============================================================================
  // THE MASTER'S EDGE BOOK — modules 24–42, one per chapter
  // (parables, frameworks, and practices from Brett's book, 2026)
  //============================================================================

{
  slug: "sword-in-shrine",
  order: 24,
  title: "The Sword in the Shrine: The Master's Edge",
  tagline: "The Master's Edge Book",
  description: "The lord owned the better sword. The captain kept the better promise. Discover the three meanings of the edge — and why yesterday's sharpness belongs to yesterday.",
  videoUrl: PLACEHOLDER_VIDEO(24),
  pdfs: [],
  images: [],
  keyPoints: [
    "The edge is not in the steel; it is in the stone — lifted daily.",
    "Yesterday's edge belongs to yesterday: mastery is a condition, not a credential.",
    "Sharpening is removal — grind away everything that doesn't serve the cut.",
    "The plain sword, kept, beats the famous sword kept in silk.",
    "A sword is a promise; the edge is whether you've kept it.",
  ],
  lesson: [
    {
      heading: "Osen and the Shrine Sword",
      paragraphs: [
        "A lord enshrined the most famous sword in the province behind silk cords and told visitors, 'While this sword is in my house, my house is safe.' Meanwhile Osen, the quiet captain of his guard, met every dawn in the courtyard with a flat stone and a plain blade. When the young guards teased her — 'Captain, your sword was sharp yesterday' — she answered, 'Yesterday's edge belongs to yesterday.'",
        "When raiders came over the passes, the lord drew his famous blade for the first time in his life — and it cut nothing. Years of stillness had rounded the edge; the finest steel in the province had become a bar of iron with a famous name. It was Osen's plain sword, honed that very morning, that held the gate. Her lesson to the humbled lord: 'The edge is not in the steel. It is in the stone — and the stone must be lifted every day.'",
      ],
    },
    {
      heading: "The Three Meanings of the Edge",
      paragraphs: [
        "First, the edge is the essential line — everything useless ground away. You don't add sharpness; you remove every particle that isn't serving the cut. Second, the edge is where growth lives: the narrow band where a challenge slightly exceeds your skill — 'hard fun' — where every real gain on the mat, in your company, in your marriage actually happens. Third, and this is the meaning almost everyone misses: the edge is a maintenance discipline, not a possession. Conditions decay. The masters are the people who never stopped lifting the stone.",
        "The craft has three components. Mindset Mastery is the steel — the frameworks and resilience the blade is made of, because brittle steel fails no matter how finely you grind it. Skillset Enhancement is the geometry — layered, connecting capabilities that shape the cut. Systems Design is the daily stone — the habits and environment everyone skips because it looks like maintenance instead of progress. Underneath run three engines: frontloading, first principles thinking, and flow — the state the whole system is built to reach.",
      ],
      bullets: [
        "Mindset Mastery — the steel",
        "Skillset Enhancement — the geometry",
        "Systems Design — the daily stone",
      ],
    },
    {
      heading: "The Monday Morning Test",
      paragraphs: [
        "This framework survived the most honest feedback loop in the world: a martial arts floor, almost every day for thirty years, then a second room full of business owners who needed it to work by Monday. So the only test we'll ever use is this: did it change what you DO? Not what you know, not what you highlighted — what your hands do Monday morning when the book is closed and the week comes at you.",
        "Start sharpening now. Run the Edge Audit — rate yourself one to five on mindset, skillset, and systems, no aspirational scoring; the lowest number is where this work pays first. Name your One Strike: the single capability that, perfected, would change your next year most. Take the Shrine Inventory — list what you're proudest of and date its last deliberate practice; anything over six months is resting on silk cords. Then lift the stone once: one ten-minute maintenance act, same time tomorrow morning.",
      ],
    },
  ],
  quiz: [
    {
      question: "Why did the lord's famous sword fail when the raiders came?",
      options: [
        "The smith had used inferior steel from the start",
        "The lord swung it with poor technique",
        "Years of stillness had rusted and rounded its unmaintained edge",
        "Osen had secretly swapped it for a replica",
      ],
      correctIndex: 2,
      explanation: "The steel was the finest in the province. But an edge is a condition, and conditions decay — the shrine preserved the sword's fame while quietly destroying its function. Sharpness is maintained daily or lost quietly.",
    },
    {
      question: "According to the chapter, how is a blade actually sharpened?",
      options: [
        "By removal — grinding away everything that doesn't serve the cut",
        "By adding layers of harder steel to the edge",
        "By resting it so the metal can recover",
        "By using it constantly in real combat",
      ],
      correctIndex: 0,
      explanation: "You don't add your way to an edge; you grind away what isn't serving the cut. That's why mastery looks minimal — and why this book will keep asking what you'll remove, not just what you'll add.",
    },
    {
      question: "What are the three components of the Master's Edge craft, in order?",
      options: [
        "Talent, opportunity, luck",
        "Mindset Mastery, Skillset Enhancement, Systems Design",
        "Strength, speed, strategy",
        "Vision, execution, delegation",
      ],
      correctIndex: 1,
      explanation: "Mindset is the steel, skillset is the geometry, and systems are the daily stone. They come in that order because each one is the platform the next stands on — skip a layer and the system breaks.",
    },
    {
      question: "Which component do most people skip — and why?",
      options: [
        "Mindset, because it feels too abstract",
        "Skillset, because it takes too long to build",
        "Systems Design, because it looks like maintenance instead of progress",
        "None — most people balance all three naturally",
      ],
      correctIndex: 2,
      explanation: "Systems Design is Osen in the courtyard at dawn — unglamorous, invisible, essential. Without the right systems, even the strongest mindset and sharpest skills erode. Every unlifted stone is a slow disaster.",
    },
    {
      question: "What is the only test this book applies to its own teaching?",
      options: [
        "Whether you can pass a written exam on the concepts",
        "Whether you feel more motivated after reading",
        "Whether you can explain the frameworks to others",
        "Whether it changed what you DO on Monday morning",
      ],
      correctIndex: 3,
      explanation: "Training that merely informs is entertainment with homework. Training that transforms changes the way your hands move — Monday morning, when the book is closed and the week comes at you.",
    },
  ],
},
{
  slug: "acceptance-catapult",
  order: 25,
  title: "The Acceptance Catapult",
  tagline: "The Master's Edge Book",
  description: "Liang climbed a mountain chasing the Dragon's Breath — and found a mirror instead. Acceptance isn't the soft skill it sounds like. Done right, it's a catapult.",
  videoUrl: PLACEHOLDER_VIDEO(25),
  pdfs: [],
  images: [],
  keyPoints: [
    "What you resist, persists. What you accept, transforms.",
    "Acceptance is not resignation — it's an accurate map of the terrain.",
    "Five acceptances, in order: skip one and the catapult won't fire.",
    "Budget 10x the effort, focus, time, and resources you expect.",
    "Mastery isn't a summit you stand on; it's an altitude you maintain.",
  ],
  lesson: [
    {
      heading: "Liang and the Dragon's Breath",
      paragraphs: [
        "Liang was a skilled young martial artist with a restless heart, convinced that mastering the legendary Dragon's Breath technique would finally make him content. He climbed the Whispering Mountains to find Master Wu — and for weeks the master taught him only to tend the garden, meditate by streams, and practice forms before dawn. Not one word about the Dragon's Breath. Liang's patience finally shattered.",
        "Master Wu led him to a reflecting pool. 'You have been seeking the Dragon's Breath not as a technique, but as a solution to your unrest,' he said. 'True mastery lies not in seeking, but in accepting. The Dragon's Breath is not a technique; it is the moment when acceptance ignites the power within.' Liang had been so fixed on what he thought he needed that he missed the lessons around him. You've met Liang — the owner chasing the one funnel, hire, or software that will finally fix everything, while the unglamorous reps feel like a distraction. They aren't the distraction. They ARE the goal.",
      ],
    },
    {
      heading: "The 5-Step Acceptance Catapult",
      paragraphs: [
        "Five acceptances, in order — skip one and the catapult won't fire. One: accept that some things will be really challenging for YOU, not people in general; difficulty is not a malfunction, it's the price of anything worth having. Two: accept that overcoming it requires Success Habits — daily practices that carry you when motivation won't, moving through a study phase, an application phase, and a mastery phase. Three: accept that you must fall in love with those habits, so completely that you do them every day no matter what. The habit you negotiate with daily is a habit you've already lost.",
        "Four: accept that success is your duty — and that it will take ten times the effort, focus, time, and resources you expect. Budget for 10x from the start and the long road stops feeling like evidence you're failing. Five: after you achieve the dream, accept that you must keep the fundamental habits that got you there, or slide back to where you started. Stockdale lived every step in a prison camp: unwavering faith he'd prevail, paired with the discipline to confront the brutal facts of his reality. The blind optimists — home by Christmas, then Easter — didn't make it. Acceptance did.",
      ],
      bullets: [
        "1. Accept it will be really challenging — for you",
        "2. Accept it requires Success Habits",
        "3. Accept you must fall in love with those habits",
        "4. Accept success is your duty — and budget 10x",
        "5. Accept you must keep the fundamentals after you arrive",
      ],
    },
    {
      heading: "The Acceptance Audit — Your Practice",
      paragraphs: [
        "Every coaching engagement I run begins with an acceptance audit before any strategy: we name what is true right now — the real numbers, the real habits, the real hours — with zero judgment. Clients expect it to be discouraging. It's the opposite; you can feel the room exhale. Energy that was spent defending a story gets reassigned to building a future. You cannot navigate terrain you refuse to see.",
        "Start with one drill this week. The Mirror Breath: hand on heart, three slow breaths, then 'I accept who I am and who I'm becoming' — before the hard call, not after. The Progress Journal: two lines at day's end — one thing done well, one thing you're working on. The Accept-the-Moment Drill: when frustration spikes mid-task, one breath, 'This is where I am. I keep going.' Works in sparring, works in spreadsheets. Frustration is a sign you're growing — perfection is not the goal; presence is.",
      ],
    },
  ],
  quiz: [
    {
      question: "What was Master Wu actually teaching Liang through gardening, meditation, and pre-dawn forms?",
      options: [
        "Patience as punishment for his arrogance",
        "That acceptance of yourself and the journey is the true mastery",
        "Basic conditioning required before advanced techniques",
        "That the Dragon's Breath requires physical stillness to perform",
      ],
      correctIndex: 1,
      explanation: "The Dragon's Breath was never a technique — it's the moment acceptance ignites the power within. Liang was chasing a solution to his unrest; Wu handed him a mirror instead.",
    },
    {
      question: "In the 5-Step Acceptance Catapult, how much effort should you budget compared to your expectations?",
      options: [
        "Twice as much",
        "Half as much, if you work smart",
        "Ten times the effort, focus, time, and resources",
        "Exactly what you planned, executed consistently",
      ],
      correctIndex: 2,
      explanation: "Step 4: success is your duty, and it takes 10x what you expect. Brett has watched that multiplier hold for belt tests and businesses alike. Budget for it from the start and the long road stops feeling like failure.",
    },
    {
      question: "According to Stockdale, which prisoners didn't survive the camp?",
      options: [
        "The optimists who kept predicting release dates they couldn't control",
        "The pessimists who gave up all hope of release",
        "The prisoners who resisted their captors most openly",
        "The ones without military discipline",
      ],
      correctIndex: 0,
      explanation: "The men who said 'home by Christmas,' then Easter, then Christmas again — until their hearts broke. Stockdale held unwavering faith he'd prevail while confronting the brutal facts. That's the Acceptance Catapult under the worst conditions imaginable.",
    },
    {
      question: "What does the chapter say acceptance is NOT?",
      options: [
        "A daily practice",
        "A source of strength",
        "A door into flow",
        "Resignation — wanting less or training softer",
      ],
      correctIndex: 3,
      explanation: "Master Wu never told Liang to want less or train softer. Acceptance is the opposite of resignation: it's an accurate map. You cannot navigate terrain you refuse to see.",
    },
    {
      question: "What is the fate of a habit you negotiate with daily?",
      options: [
        "It eventually becomes automatic anyway",
        "It's a habit you've already lost",
        "It builds willpower through repeated decisions",
        "It works fine as long as you win most negotiations",
      ],
      correctIndex: 1,
      explanation: "Step 3 demands you embrace Success Habits so completely that you do them every day, no matter what. 'Fall in love' is a stretch on purpose — you don't need to enjoy every rep, but daily renegotiation means the habit is already gone.",
    },
  ],
},
{
  slug: "masters-garden",
  order: 26,
  title: "The Master's Garden: Personal Responsibility",
  tagline: "The Master's Edge Book",
  description: "You can't control the rain, the sun, or the insects — but you can always control the tending. The garden was never a distraction from the training. It IS the training.",
  videoUrl: PLACEHOLDER_VIDEO(26),
  pdfs: [],
  images: [],
  keyPoints: [
    "You can't control everything — you can always control your response.",
    "The Gardener's Stance: the controls live inside you, not in the weather.",
    "Small neglected problems compound — in gardens, in ledgers, in teams.",
    "The stance is a choice, re-chosen at every setback, forever.",
    "Your team learns ownership by watching you take it.",
  ],
  lesson: [
    {
      heading: "Kai and the Neglected Corner",
      paragraphs: [
        "At a legendary school known for producing wise masters, the famous garden held a secret: no gardener tended it — every student was responsible for its care. Young Kai protested: 'Why do we waste time pulling weeds instead of training in the dojo?' The Master walked him to a withered, weed-choked corner. 'This corner reflects your current state of mind. Ignore your life, and weeds of doubt, blame, and procrastination will choke the potential within you.'",
        "'But I can't control everything!' Kai argued. 'Sometimes it rains too much, the sun is too harsh, insects come no matter what.' The Master knelt and pulled weeds by hand. 'True. But you control how you respond. You can choose to weed, to water, to nurture. A warrior does not become great by blaming the world or waiting for perfect conditions. Mastery begins when you take total responsibility for every area of your life.' Now walk your own property: your business has a neglected corner — and listen to how you talk about it: you'll hear Kai. The market rained too much. The algorithm changed.",
      ],
    },
    {
      heading: "The Gardener's Stance vs. the Spectator's Stance",
      paragraphs: [
        "Psychologists call it locus of control; I call it the Gardener's Stance. Everyone I've ever trained sorts into one of two stances. The Spectator's Stance says the controls live outside you — the economy, the boss, the ref, the weather. It feels safe because you're never guilty. But notice the price: if the controls are out there, so is the power. You've traded blame for helplessness, and it costs more stress, more anxiety, and disconnection from your own life.",
        "The Gardener's Stance says the controls live inside you — not control of everything, control of your response to everything. When things go wrong, the first question is 'what's mine here?' And here's the move most people miss: the stance is a choice, available at every setback, forever. You choose it at this weed, then the next one. Viktor Frankl proved it in the worst place on earth: stripped of everything down to his name, he found the one freedom no one could take — the freedom to choose one's attitude in any circumstances. He didn't control the rain. He controlled the tending.",
      ],
      bullets: [
        "Spectator's Stance: controls outside → blame, helplessness, anxiety",
        "Gardener's Stance: controls inside → 'what's mine here?'",
        "The stance is re-chosen at every single setback",
      ],
    },
    {
      heading: "Whose Weed Is That? — Your Practice",
      paragraphs: [
        "In my consulting work I use one line borrowed from my own dojang: 'Whose weed is that?' A client explains a missed quarter — the market, the platform, the salesperson who quit — and I let them finish, then ask it. Not to shame them; the weather they describe is usually real. But we can't work on the weather. The whole engagement turns the day the client starts answering 'mine' before I ask — because every weed they own is a weed we can actually pull.",
        "Start with one practice. The Weed-Pulling Challenge: name one habit that chokes you and choose the plant that replaces it — a pulled weed with nothing planted grows back. Responding with Calm: next time something goes sideways, take one breath before you respond; that breath is where the Gardener's Stance gets chosen. Lead by Example: take responsibility this week for one thing nobody asked you to own — don't announce it, let it be noticed. This is how leaders are recognized before they're ever appointed.",
      ],
    },
  ],
  quiz: [
    {
      question: "What was the true secret of the legendary school's garden?",
      options: [
        "It was tended by the Master himself every night",
        "It grew wild, proving nature needs no interference",
        "No gardener tended it — every student was responsible for its care",
        "Only students who failed their tests were assigned to it",
      ],
      correctIndex: 2,
      explanation: "The garden was the curriculum. Every weed pulled and plant nurtured was a reflection of each student's own journey toward mastery — which is why Kai's question 'shouldn't we be training instead?' missed the point. The garden WAS the training.",
    },
    {
      question: "In the Gardener's Stance framework, what do you actually control?",
      options: [
        "Your response to everything, not everything itself",
        "Every outcome, if you take enough responsibility",
        "Nothing — circumstances decide results",
        "Only your business, not external markets",
      ],
      correctIndex: 0,
      explanation: "The weather isn't yours; the weeding is. Not control of everything — control of your response to everything. The first question when things go wrong: 'what's mine here?'",
    },
    {
      question: "What hidden price does the Spectator's Stance charge?",
      options: [
        "It makes you work harder than necessary",
        "If the controls are out there, so is the power — blame buys helplessness",
        "It causes you to over-invest in planning",
        "It damages only your reputation, not your results",
      ],
      correctIndex: 1,
      explanation: "The Spectator's Stance feels safe because you're never guilty. But you've traded blame for helplessness — plus more stress, more anxiety, and that gnawing disconnection from your own life.",
    },
    {
      question: "How often is the Gardener's Stance chosen?",
      options: [
        "Once, in a defining moment of commitment",
        "Only during major crises",
        "It's a personality trait — some people are born with it",
        "At every setback, separately, forever — weed by weed",
      ],
      correctIndex: 3,
      explanation: "You don't take the Gardener's Stance once and own it for life. You choose it at this weed, then the next one. String enough choices together and it becomes who you are.",
    },
    {
      question: "What did Viktor Frankl conclude could never be taken from a person?",
      options: [
        "Their professional knowledge and skills",
        "Their physical resilience",
        "The freedom to choose one's attitude in any circumstances",
        "Their memories of loved ones",
      ],
      correctIndex: 2,
      explanation: "Everything was stripped from Frankl — his manuscript, his family, even his name. Yet he observed that the last human freedom is choosing one's attitude in any given set of circumstances. He didn't control the rain; he controlled the tending.",
    },
  ],
},
{
  slug: "two-beliefs",
  order: 27,
  title: "The Two Beliefs: Fixed vs Growth Mindset",
  tagline: "The Master's Edge Book",
  description: "Master Goro never trained two students — he trained two beliefs. One boy defended a gift for seven years; the other built himself. The ceiling you keep hitting is painted on.",
  videoUrl: PLACEHOLDER_VIDEO(27),
  pdfs: [],
  images: [],
  keyPoints: [
    "Talent decides where you start; belief decides whether you move.",
    "A protected gift becomes a cage — challenges become threats to it.",
    "Growth or fixed is a choice — and it's re-chosen daily.",
    "The counter-move costs one word: yet.",
    "The verdict never argues with reps — you out-evidence it.",
  ],
  lesson: [
    {
      heading: "Haru, Ren, and the Flying Scissor Takedown",
      paragraphs: [
        "Two boys entered Master Goro's school the same spring. Haru had balance like a cat and memory like a scroll — within a season the village called him gifted. Ren fell during stances and kicked with the wrong leg; the village had a word for him too, and it was not kind. Then something strange happened, slowly. Haru stopped entering tournaments he wasn't certain to win — every loss put the word 'gifted' on trial. When the flying scissor takedown resisted him, he declared it impractical and never touched it again.",
        "Ren had no reputation to protect, so his hands were free. He lost constantly and mined every loss like ore. He failed the takedown four hundred times — and on the four hundred and first, it worked, and he alone could do it. When Ren defeated Haru in their seventh year, the crowd called it a miracle. Master Goro corrected them: 'I never trained two students. I trained two beliefs. One believed he was something, and spent seven years defending it. One believed he was becoming something, and spent seven years building it. Talent decides where you start. Belief decides whether you move.'",
      ],
    },
    {
      heading: "The Ceiling Is Painted On",
      paragraphs: [
        "The villain of the parable isn't Haru — it's the word 'gifted' and what believing it did to him. A fixed mindset says your ability is static, leading to a life spent looking capable: avoiding challenges, quitting early, seeing effort as proof you lack the gift, ignoring feedback, feeling threatened by others' success. A growth mindset says ability is developed — so challenges become invitations, obstacles become curriculum, effort becomes the path, criticism becomes coaching. Carol Dweck proved this single belief predicts achievement better than talent — and that it can be changed.",
        "Here's the strange historical part: for most of a century, our culture decided intelligence alone was fixed at birth. Nobody thought a deadlift or a golf swing was genetic destiny — but thinking? Carved in stone at delivery. The irony history forgot: Alfred Binet, inventor of the intelligence test, called fixed intelligence 'brutal pessimism' and designed 'mental orthopedics' — reps for the mind. The measuring stick's own maker said the measurement was a starting line, not a ceiling. If the father of the IQ test believed your mind was trainable, whose permission are you waiting for?",
      ],
    },
    {
      heading: "CATCH — CHOOSE — PROVE",
      paragraphs: [
        "Three moves to switch columns. CATCH the verdict: fixed mindset talks in identity language — 'I'm bad at this,' 'I'm not that kind of person.' You cannot choose against a voice you haven't noticed, so catch it the way a sparring student sees the shoulder twitch before the punch. CHOOSE the growth response: the counter-move costs one word — yet. 'I can't read a financial statement — yet.' On my mat this choice has a call-and-response every student knows: 'Are you ready for a challenge?' 'Bring it on, sir!' We install the answer before the challenge arrives.",
        "PROVE it with reps: a belief you never test is just a slogan. Ren didn't out-believe Haru with affirmations — he failed the takedown four hundred times on purpose. Start this week: keep a Verdict Log for seven days, catching every fixed-mindset verdict you think or say. Friday, run the Yet Edit — append 'yet' to every entry that deserves a future. Then launch a 401 Project: pick one skill a verdict has kept from you, schedule three deliberate reps a week for thirty days, and log each one. You're not chasing mastery in a month; you're building evidence the verdict can't survive.",
      ],
      bullets: [
        "CATCH the verdict — identity language is the tell",
        "CHOOSE growth — one word: yet",
        "PROVE it — reps the fixed voice can't argue with",
      ],
    },
  ],
  quiz: [
    {
      question: "Why did Haru — the gifted student — stop growing?",
      options: [
        "He lacked the natural talent everyone believed he had",
        "Master Goro secretly favored Ren with better instruction",
        "He suffered an injury that limited his training",
        "Every challenge became a threat to the word 'gifted' — so he avoided them",
      ],
      correctIndex: 3,
      explanation: "The moment Haru's ability became a fixed possession, every loss put 'gifted' on trial. He entered only tournaments he could win and abandoned techniques that resisted him. A protected gift becomes a cage.",
    },
    {
      question: "How does the fixed-mindset voice reveal itself?",
      options: [
        "It talks in identity language — what you ARE instead of where you are so far",
        "It argues that the task requires too much effort",
        "It speaks only in moments of physical exhaustion",
        "It compares you unfavorably to specific rivals",
      ],
      correctIndex: 0,
      explanation: "The voice never argues about effort — it argues about identity. 'I'm not a numbers person.' The tell is any sentence about what you are instead of where you are so far. Catching it is Move 1: pure awareness.",
    },
    {
      question: "What single word converts a verdict into a growth choice?",
      options: [
        "Try",
        "Yet",
        "Believe",
        "Maybe",
      ],
      correctIndex: 1,
      explanation: "'I can't read a financial statement — yet.' One word turns a verdict about identity into a statement about position on a path. That's Move 2: CHOOSE — and it's installed in the calm, before the challenge arrives.",
    },
    {
      question: "What did Alfred Binet, inventor of the intelligence test, believe about intelligence?",
      options: [
        "That his test proved intelligence was fixed at birth",
        "That intelligence could not be measured at all",
        "That fixed intelligence was 'brutal pessimism' — the mind could be trained",
        "That only children under ten could grow their intelligence",
      ],
      correctIndex: 2,
      explanation: "Binet built the test to identify children who needed help — then spent his career protesting its use as a life verdict. He designed 'mental orthopedics,' reps for the mind. The measuring stick's maker said measurement was a starting line, not a ceiling.",
    },
    {
      question: "How do you silence the fixed-mindset verdict, according to Move 3?",
      options: [
        "Debate it with positive affirmations each morning",
        "Ignore it until it fades on its own",
        "Avoid situations that trigger it",
        "Out-evidence it with scheduled, deliberate reps",
      ],
      correctIndex: 3,
      explanation: "You don't debate the fixed voice into silence — you out-evidence it, four hundred and one times if necessary. Ren's proof wasn't a belief; it was the four hundred and first attempt. A belief you never test is just a slogan.",
    },
  ],
},
{
  slug: "burned-dojo",
  order: 28,
  title: "The Burned Dojo: Optimism",
  tagline: "The Master's Edge Book",
  description: "The fire decided what Master Ono lost — it didn't get to decide what he did that morning. Trained optimism isn't predicting sunshine. It's something you supply.",
  videoUrl: PLACEHOLDER_VIDEO(28),
  pdfs: [],
  images: [],
  keyPoints: [
    "The fire decides what you lost — not what you do this morning.",
    "Take inventory of what the fire couldn't touch.",
    "Grief is honest; despair is lazy.",
    "Rewrite it true, not rosy — temporary, specific, situational.",
    "When you can't bring your best, bring your attitude — it's the event you can still win.",
  ],
  lesson: [
    {
      heading: "Master Ono's Morning in the Ashes",
      paragraphs: [
        "Master Ono's dojo — the hall his grandfather raised beam by beam — burned on a winter night. By morning the village had gathered at the black rectangle in the snow, and his students stood in silent line, waiting to learn what kind of man their teacher was. 'Master… everything is lost,' said Daiki. Ono walked the char line, then pressed his palm to the scorched foundation stone. 'The dojo my grandfather built is gone. That is true, and we will grieve it properly. But look — the stone survived. It always does.'",
        "Then he took inventory: a foundation that had already survived fire; forty students who now knew they trained for the art and not the building; his grandfather's ground with no walls on it — which meant they could finally build the hall the school had become. 'The fire decided what we lost. It does not get to decide what we do this morning. Grief is honest. Despair is lazy. We will train at dawn tomorrow in the field — and men who train in snow get strong in ways men with roofs never learn.' A master's first act in the ashes is to take inventory of what the fire couldn't touch.",
      ],
    },
    {
      heading: "What Died in the Camp, What Lived in the Ashes",
      paragraphs: [
        "Remember Stockdale's optimists, home by Christmas until their hearts quit? What died in that camp wasn't optimism. It was wishing: hope with no discipline under it, mortgaged to a calendar they didn't control. Ono predicted nothing: he took inventory, told the truth, and brought something to the morning. Martin Seligman proved optimism isn't a temperament — it's an explanatory style you can train. Pessimists explain bad events as permanent, everywhere, and personal; optimists as temporary, specific, and situational. Trainable, measurable, and it predicts who keeps functioning under fire.",
        "And a sixteen-year-old girl gave us the genuine article. Dr. Edith Eger, a trained ballerina, was forced to dance in Auschwitz hours after her parents were killed — and she danced, because dancing was the one thing the camp couldn't take. She shared her loaf of bread with the other prisoners. At fifty she earned her PhD and became one of the world's great trauma psychologists. Her whole discipline distills into one working question she asked all her life: 'What am I doing now? And is it working?' Pain is unavoidable; suffering is what happens when we stop asking better questions.",
      ],
    },
    {
      heading: "READ IT — REWRITE IT — BRING IT",
      paragraphs: [
        "Three moves, run in order, every time life burns something down. READ IT: within minutes of any setback your mind files a story running on the three pessimist settings — permanent ('the business is finished'), everywhere ('everything is falling apart'), personal ('I'm the kind of person this happens to'). Catch the story you just told yourself. REWRITE IT: not rosy — true. 'The business is finished' rewrites to 'revenue is down 67 percent and I don't yet know the way back' — worse-sounding and infinitely more useful, because that sentence has handles on it. A season, not a sentence.",
        "BRING IT: when a setback has genuinely capped your performance, attitude is the event you can still win. Mark Petersen taught me this — training for Spartan races through cancer treatment, finishing the sixty-hour Agoge on a broken foot, back from a kidney transplant to teach again. His line: no matter what, he can always bring the enthusiasm and optimism. Start with the Story Audit — log the story you tell after each setback and grade it against the three settings. Then the Bring List: three things you can still bring where your performance is capped. Bring one tomorrow. That's competing.",
      ],
      bullets: [
        "READ IT — catch the permanent/everywhere/personal story",
        "REWRITE IT — true, not rosy: temporary, specific, situational",
        "BRING IT — contribute something anyway",
      ],
    },
  ],
  quiz: [
    {
      question: "What was Master Ono's first act in the ashes of his dojo?",
      options: [
        "He announced the date the new hall would be finished",
        "He took inventory of what the fire couldn't touch",
        "He led the village in a formal mourning ceremony",
        "He dismissed his students until spring",
      ],
      correctIndex: 1,
      explanation: "The surviving foundation stone, forty students, his grandfather's ground with no walls on it. He grieved honestly — but a master's first act in the ashes is counting what survived, then training at dawn in the field.",
    },
    {
      question: "What actually killed Stockdale's fellow prisoners, according to this chapter?",
      options: [
        "Optimism itself — hope is dangerous under extreme conditions",
        "Their refusal to cooperate with captors",
        "Wishing — predictions mortgaged to a calendar they didn't control",
        "Physical weakness from the conditions",
      ],
      correctIndex: 2,
      explanation: "What died in the camp wasn't optimism — it was hope with no discipline under it. When 'home by Christmas' failed, the belief collapsed. Ono predicted nothing; he took inventory and brought something to the morning.",
    },
    {
      question: "How do pessimists explain bad events, per Seligman's research?",
      options: [
        "As permanent, everywhere, and personal",
        "As temporary, specific, and situational",
        "As random and meaningless",
        "As caused entirely by other people",
      ],
      correctIndex: 0,
      explanation: "Seligman proved optimism is a trainable explanatory style, not a temperament. Pessimists file setbacks as permanent, everywhere, personal; optimists as temporary, specific, situational — and that style predicts who keeps functioning under fire.",
    },
    {
      question: "What does the REWRITE IT move demand of your new story?",
      options: [
        "That it emphasizes the silver lining in every loss",
        "That it assigns responsibility to the right people",
        "That it predicts a realistic recovery date",
        "That it's true — not rosy — with the real numbers in it",
      ],
      correctIndex: 3,
      explanation: "The NO LIES standard applies to hope too. 'Revenue is down 67 percent and I don't yet know the way back' sounds worse than sunshine — and is infinitely more useful, because that sentence has handles on it.",
    },
    {
      question: "What did Mark Petersen say he can always bring, no matter what?",
      options: [
        "His physical best, through sheer willpower",
        "The enthusiasm and optimism",
        "A detailed recovery plan",
        "Financial resources to solve the problem",
      ],
      correctIndex: 1,
      explanation: "Through cancer, a broken-foot Agoge finish, and a kidney transplant, Mark's discipline held: when your performance is genuinely capped, attitude is the event you can still win. Optimism isn't something you feel — it's something you supply.",
    },
  ],
},
{
  slug: "bamboo-warrior",
  order: 29,
  title: "The Bamboo Warrior: Resilience",
  tagline: "The Master's Edge Book",
  description: "Getting knocked down is the curriculum. Learn the Bend-Endure-Rise framework that turns every storm — a lost client, a brutal season, a million-dollar mistake — into height.",
  videoUrl: PLACEHOLDER_VIDEO(29),
  pdfs: [],
  images: [],
  keyPoints: [
    "Resilience isn't a personality trait — it's a structure you can build.",
    "Bend is a moment, Endure is a season, Rise is a choice — train all three.",
    "Sort your business into roots (never change) and branches (free to bend) before the storm.",
    "A storm you don't learn from is a storm you'll take twice.",
    "Bamboo grows in groves — isolated owners snap first.",
  ],
  lesson: [
    {
      heading: "The Parable of the Bamboo Warrior",
      paragraphs: [
        "Young Kenji sat on the dojo steps, head hung low, convinced he wasn't strong enough to be a great warrior. Master Ryota walked him to the garden and pointed at the bamboo swaying in the wind. The mighty oak, he explained, will sometimes snap under a great storm. But the bamboo bends — it sways, it endures, and when the storm passes, it stands tall again. \"Do not fear the storm. Become the bamboo — bend, endure, and rise stronger than before.\"",
        "I've watched hundreds of business owners meet their storms, and they sort almost perfectly into Ryota's two trees. Oak owners meet the storm with pure rigidity — \"we've always done it this way\" — and one storm at the wrong angle breaks what wouldn't bend. Bamboo owners hold a rooted core — their values, their craft, their reason — with total flexibility about everything above ground. The offer can change. The model can change. The roots don't.",
      ],
    },
    {
      heading: "The Framework: Bend — Endure — Rise",
      paragraphs: [
        "Here's what took me years to see: resilience isn't something nature hands out. Bamboo isn't brave; bamboo has the right architecture — which means you can build it. Scientists call the method stress inoculation: building capacity through controlled doses of pressure. On the mat we've always called it Tuesday. The framework is three distinct moves, and most people only train their favorite.",
        "BEND — adapt at the moment of impact. When the storm hits, your first job isn't to fix it; it's to not snap. Soften the stance, breathe, and let go of the plan the market just voted on. ENDURE — hold your core through the ugly middle where nothing works yet and quitting feels reasonable. You don't need heroics; you need to still be there when the weather turns. RISE — come back stronger, not merely upright. Bamboo grows past its old position. Harvest the storm: what did it teach us, what do we rebuild differently?",
      ],
      bullets: [
        "Bend is a moment: absorb the impact instead of defending a dead plan.",
        "Endure is a season: your values and daily fundamentals carry you through the middle.",
        "Rise is a choice: grow past your old height so the next storm finds you built differently.",
      ],
    },
    {
      heading: "Roots and Branches: Build It Before the Storm",
      paragraphs: [
        "In 2007 my wife and I joined a franchise that defrauded its members — our million-dollar education. On one of the worst days, my mentor Senior Master Don MacKay told me two things: \"In ninety days, this will be different — if you let it,\" and to see the lost money not as a loss but as an investment in my education. Years later, when a second franchise system turned, every expensive page of that education protected us. We exited on our terms, with real profit, while others fell into the same hole.",
        "Your move this week: sort your business into roots and branches BEFORE storm season — two columns on one page. Roots are what you will not change under pressure: values, quality bar, how you treat people. Branches are what you're free to bend: pricing, offers, schedules, org chart. It takes twenty minutes and pays for itself the first bad quarter, because inside the storm is the worst possible time to decide what you're willing to lose. And build your grove — bamboo doesn't grow alone, and neither should you.",
      ],
      bullets: [
        "Bend & Breathe: on the next surprise hit, drop your shoulders and exhale before you respond.",
        "Fail Forward: after each wobble, write one sentence — what did that attempt teach me?",
        "The Support Circle: weekly, share one challenge and one way you're meeting it. Groves beat lone trees.",
      ],
    },
  ],
  quiz: [
    {
      question: "Why does Master Ryota say the bamboo is stronger than the mighty oak?",
      options: [
        "Bamboo grows faster and taller than any oak.",
        "Bamboo's wood is denser and harder to cut.",
        "Bamboo bends with the storm instead of snapping, then stands tall again.",
        "Bamboo hides from the storm behind the mountains.",
      ],
      correctIndex: 2,
      explanation: "The oak looks unbeatable in calm weather, but rigidity breaks at the wrong angle. Bamboo sways, endures, and rises — strength at impact looks like bending, not resisting.",
    },
    {
      question: "In Brett's framework, what is the correct nature of each move?",
      options: [
        "Bend is a moment, Endure is a season, Rise is a choice.",
        "Bend is a choice, Endure is a moment, Rise is a season.",
        "All three happen simultaneously in every storm.",
        "Bend and Rise are optional; only Endure matters.",
      ],
      correctIndex: 0,
      explanation: "Three different skills on three different timescales. Most people only train their favorite — the framework works because it forces you to train all three.",
    },
    {
      question: "What did Don MacKay tell Brett to do with the million dollars lost in the 2007 franchise disaster?",
      options: [
        "Sue the franchise to recover every cent.",
        "See it not as a loss, but as an investment in his education.",
        "Forget it ever happened and move on quickly.",
        "Write it off and never trust a partner again.",
      ],
      correctIndex: 1,
      explanation: "It felt almost cruel in the moment — and it was the truest thing anyone said that year. Those lessons protected Brett when a second franchise turned a decade later.",
    },
    {
      question: "What belongs in the ROOTS column of the roots-and-branches exercise?",
      options: [
        "Pricing and current offers.",
        "The org chart and class schedule.",
        "This quarter's marketing campaigns.",
        "Your values, quality bar, and how you treat people.",
      ],
      correctIndex: 3,
      explanation: "Roots are what you will not change under pressure. Everything else — pricing, offers, schedules, structure — is a branch you're free to bend when the storm hits.",
    },
    {
      question: "Why does Brett say \"bamboo grows in groves\"?",
      options: [
        "Dense planting shields bamboo from the wind entirely.",
        "Resilience is contagious in both directions — isolated owners snap first.",
        "Teams slow you down but make failure less embarrassing.",
        "Groves guarantee no storm can ever reach you.",
      ],
      correctIndex: 1,
      explanation: "Owners hide their storms out of pride. A support circle — team, family, peers — gives everyone watching permission to get back up, and keeps you from breaking alone.",
    },
  ],
},
{
  slug: "swordsmiths-fire",
  order: 30,
  title: "The Swordsmith's Fire: Tenacity",
  tagline: "The Master's Edge Book",
  description: "The blade isn't afraid of fire — the blade is made of fire. Learn the Forging Cycle that turns week-eight moments, setbacks, and fear itself into unbreakable steel.",
  videoUrl: PLACEHOLDER_VIDEO(30),
  pdfs: [],
  images: [],
  keyPoints: [
    "No blade is ruined by fire, hammer, fold, or rest — only by the smith who quits between them.",
    "The Forging Cycle: Heat, Hammer, Fold, Quench — repeated for as long as you're serious.",
    "The hotter the fire, the harder the steel — pick work at the edge of your ability.",
    "A folded setback becomes structural strength; a skipped one is a crack waiting for pressure.",
    "Become what you fear — the thing you fear holds power only while it stays outside you.",
  ],
  lesson: [
    {
      heading: "The Parable of the Swordsmith's Fire",
      paragraphs: [
        "In the village of Kurogane, Master Tetsu forged blades that could not be broken. His apprentice Hiro hammered cold iron all day and blamed the metal. \"The iron is honest,\" Tetsu smiled. \"It is the smith who is impatient.\" The real secret: first the fire — iron must feel heat it believes it cannot survive. Then the hammer — a thousand blows, each placed where the last one taught him to strike. Then the fold — burying each day's lessons deep in the blade where no enemy can reach them. And finally the quench — because strength is set in the stillness after the effort, never during it.",
        "Every January my academy fills, and every March it empties a little — week eight is when the novelty dies and only the work remains. That's where I lose the students who came for the feeling, and where I first spot the future black belts. The difference isn't talent; I've had forty years to check. It's tenacity. Your business is your iron. Your habits are the hammer. And your week-eight moments are the fire. Cold iron never changes.",
      ],
    },
    {
      heading: "The Framework: The Forging Cycle",
      paragraphs: [
        "Tenacity isn't summoned — it's built, in four moves run in rhythm. HEAT: walk into the challenge that scares you — the bigger client, the harder conversation, the number you've never hit. The hotter the fire, the harder the steel; comfortable reps make warm iron, and warm iron doesn't change. HAMMER: strike in rhythm, not in rage. One heroic all-nighter changes nothing. A thousand blows — daily, structured, unglamorous — and the hammer never negotiates about whether today counts.",
        "FOLD: after every attempt, fold what you learned back into the work — the objection you can now answer, the hire you'll never make again, the pricing mistake that taught you your worth. That's the difference between ten years of experience and one year repeated ten times. QUENCH: set the strength in stillness. Push without recovery and the fire's work is wasted — ask any burned-out owner who confused exhaustion with commitment. Then back into the fire, one lesson deeper, unbreakable not because you avoided the blows but because you're made of them.",
      ],
      bullets: [
        "Heat: pick work at the edge of your ability — hot enough that you come out different.",
        "Hammer: daily structured effort; rhythm beats rage every time.",
        "Fold: bury each lesson in the blade — skipped setbacks become cracks.",
        "Quench: rest is where strength becomes permanent, not a break from the forging.",
      ],
    },
    {
      heading: "Become What You Fear",
      paragraphs: [
        "Grand Master Tom Fisher — Vietnam veteran, business owner, lifelong teacher — handed me the deepest version of the swordsmith's secret: \"Become what you fear.\" He wasn't telling us to become frightening. Whatever you fear — the confrontation, the failure, the fire itself — it holds power over you exactly as long as it stays outside you. Walk into it, study it, drill it, absorb what makes it formidable, and the fear doesn't just shrink. It changes owners. Flow research confirms it: peak states trigger at the edge of your ability — right where fear lives.",
        "Wilma Rudolph proved the cycle past all reason. Told at eight she'd never walk without a brace after polio, her family went to work — fifty-mile bus rides to therapy, siblings massaging her leg daily for years. Heat, hammer, fold, quench. By nine the brace came off. In Rome in 1960 she became the first American woman to win three track-and-field golds in a single Olympics. The girl in the brace and the fastest woman alive were the same iron. When you hit the ugly middle, ask my consulting question: \"Is this the fire, or is this the ruin?\" Almost always, it's just the fire.",
      ],
      bullets: [
        "The Balance and Rise Challenge: re-attempt one thing this week that failed last time — the getting-back-up IS the exercise.",
        "Mindful Mastery Breathing: in for four, hold, out for four, two minutes — the quench that sets the steel.",
        "Name what you fear in your business right now — then stop circling it and train toward it.",
      ],
    },
  ],
  quiz: [
    {
      question: "According to Master Tetsu, what is the only thing that can ruin a blade?",
      options: [
        "Fire that burns too hot for the iron.",
        "Folding the metal too many times.",
        "The smith who quits between the steps.",
        "Bad iron that should have been replaced.",
      ],
      correctIndex: 2,
      explanation: "No blade is ever ruined by the fire, the hammer, the folding, or the rest. Stumbling is part of the process; stopping is the only failure with no lesson in it.",
    },
    {
      question: "What does the FOLD step represent in your business?",
      options: [
        "Folding each setback's lesson back into how you work, making it structural strength.",
        "Doubling your effort whenever progress stalls.",
        "Hiding your failures so competitors can't exploit them.",
        "Restarting the plan from scratch after every setback.",
      ],
      correctIndex: 0,
      explanation: "The objection you can now answer, the hire you'll never repeat — folded lessons become strength no storm can reach. Skipped ones are cracks waiting for pressure. That's ten years of experience versus one year repeated ten times.",
    },
    {
      question: "Why does Brett insist the QUENCH is not optional?",
      options: [
        "Rest is a reward you earn only after hitting your goals.",
        "Cooling down prevents injuries during training.",
        "Taking breaks impresses your team with work-life balance.",
        "Strength is set in the stillness after effort — push without recovery and the fire's work is wasted.",
      ],
      correctIndex: 3,
      explanation: "The quench isn't a break from the forging; it's the step where strength becomes permanent. Burned-out owners confuse exhaustion with commitment — even steel must rest.",
    },
    {
      question: "What did Grand Master Tom Fisher mean by \"Become what you fear\"?",
      options: [
        "Make yourself intimidating so others fear you.",
        "Train into the thing you fear until its strength lives inside you and the fear changes owners.",
        "Accept that fear is permanent and work around it.",
        "Avoid fearful situations until you feel confident.",
      ],
      correctIndex: 1,
      explanation: "The thing you fear holds power over you exactly as long as it remains outside you. Walk into it, study it, drill it — Tom's lesson is a flow trigger with a warrior's name on it.",
    },
    {
      question: "What made Wilma Rudolph's transformation from leg brace to Olympic gold possible?",
      options: [
        "A rare natural talent that surfaced once the polio passed.",
        "An experimental medical treatment unavailable to others.",
        "Years of relentless, repeated work — therapy trips and daily massage — folding lessons into the blade.",
        "Switching sports until she found one her leg could handle.",
      ],
      correctIndex: 2,
      explanation: "The girl in the brace and the fastest woman alive were the same iron. The difference was a family that kept running the forging cycle when every expert said the metal was ruined.",
    },
  ],
},
{
  slug: "one-mountain",
  order: 31,
  title: "The One Mountain: G.R.I.T.",
  tagline: "The Master's Edge Book",
  description: "Toughness survives the storm; grit points it at the same summit for a decade. Learn the four letters Brett has drilled into forty years of students: Guts, Resilience, Intensity, Tenacity.",
  videoUrl: PLACEHOLDER_VIDEO(31),
  pdfs: [],
  images: [],
  keyPoints: [
    "G.R.I.T. = Guts, Resilience, Intensity, Tenacity — four qualities fused into one operating state.",
    "Summits collected are coins; a mountain married is a fortune — depth beats collection.",
    "Change routes freely; change mountains almost never.",
    "Grit answers to someone — name who you'd have to explain your quitting to.",
    "REPS are Repeated Excellence Protocols, not repetitions — intensity makes years count.",
  ],
  lesson: [
    {
      heading: "The Parable of the One Mountain",
      paragraphs: [
        "Young Taro announced he would climb every peak in the range until no one could question him. The old guide Sadao said only: \"Or you could climb one.\" Ten years later Taro had touched eleven mountains, finished four — the four easiest — and owned none of them. Sadao had climbed Kita-dake for fifty-one years. He failed on her north face nine times; it took nineteen years to solve it, and that solving is why lowland climbers pay for a guide from his village at all. \"Storms turned me back forty times,\" he said. \"Not once did they change which mountain I woke up facing.\"",
        "Which mountain should you marry? Sadao's answer is the whole test: \"It's the one you kept thinking about while you were climbing all the others.\" Resilience taught you to bend through a storm. Tenacity forged you through a season. What's left is direction, held for years — the part almost everyone gets wrong about toughness. Angela Duckworth's research proved it: passion plus perseverance, aimed at the same goal across years, predicts achievement better than talent does. But on my mat, grit was an acronym before it was a bestseller.",
      ],
    },
    {
      heading: "The Framework: Guts, Resilience, Intensity, Tenacity",
      paragraphs: [
        "G — Guts: the courage to start, and to stay enrolled. Guts isn't the absence of the minute of doubt — I had mine on the edge of a bed during COVID, business down sixty-seven percent, functionally blind from cataracts, both legs screaming. Guts is what happens after the minute: you swing your legs down anyway. R — Resilience: bend, endure, rise, running continuously in the background, absorbing each hit so the mission never has to. I — Intensity: not drama — quality of attention. Reps are REPS: Repeated Excellence Protocols. Ten thousand distracted repetitions build a distracted black belt.",
        "T — Tenacity: the forge — the refusal to quit inside any single storm, the closer that finishes each round so Guts can start the next one. Now watch the loop: Guts starts the climb, Resilience absorbs the rockfall, Intensity makes every attempt a lesson, Tenacity finishes the season — and then Guts starts again, same mountain, next season. That loop, run for years without changing mountains, is grit. The storm asks: can you survive tonight? The decade asks the harder question: will you still be pointed at the same summit in ten years?",
      ],
      bullets: [
        "Guts gets you enrolled and keeps you enrolled when the plates disappear from the breakfast table.",
        "Intensity is the difference between spending a decade on something and letting a decade pass near it.",
        "Grit answers to someone: Brett's day three of CDT was won by two sons who weren't in the room.",
      ],
    },
    {
      heading: "Routes Change. Mountains Don't.",
      paragraphs: [
        "My friend Bill Schuffenhauer grew up in chaos — drug-addicted parents, seventeen foster homes, stretches eating from a dumpster behind a McDonald's. He decided to change his stars, clawed up to elite decathlete — and an injury took the 2000 Olympics away at the doorstep. Taro would have switched mountains. Bill switched routes and kept the mountain: the dream was never \"decathlon,\" it was the Games. He rebuilt as a bobsledder, and in 2002 stood on the Olympic podium — in Salt Lake City, about a mile from that dumpster. Twenty years of one mountain between the starting line and the summit.",
        "When the shiny new vertical or pivot tempts you — the Taro moment — run the One Mountain audit. Three questions: What is your actual mountain, the one-sentence mission under the business? Is this new idea a new ROUTE up that mountain, or a different mountain wearing makeup? And if you take it, what happens to the nineteen years of north-face knowledge you've already paid for? Route changes get a green light all day — that's how Bill won his medal. Mountain changes need to survive all three questions in writing.",
      ],
      bullets: [
        "Name Your Mountain: write the mission that would still be true if your business model died tomorrow.",
        "The Who-You'd-Tell Drill: list the people you couldn't face after quitting — read it on hard mornings.",
        "The Starting-Line Photo: own your origin — the dumpster doesn't shrink the medal; it's the medal's unit of measurement.",
      ],
    },
  ],
  quiz: [
    {
      question: "What do the four letters of Brett's G.R.I.T. acronym stand for?",
      options: [
        "Goals, Rigor, Integrity, Toughness.",
        "Guts, Resilience, Intensity, Tenacity.",
        "Growth, Resolve, Initiative, Training.",
        "Grind, Repeat, Improve, Triumph.",
      ],
      correctIndex: 1,
      explanation: "Guts starts the climb, Resilience absorbs the rockfall, Intensity makes every attempt a lesson, Tenacity finishes the season — and the loop, run for years at one mountain, is grit.",
    },
    {
      question: "What was Sadao's advantage over Taro after fifty-one years?",
      options: [
        "He had summited more total peaks than Taro.",
        "He was naturally stronger and faster on rock.",
        "He climbed only in perfect weather, avoiding all risk.",
        "He married one mountain and let her teach him everything — depth Taro's collection could never buy.",
      ],
      correctIndex: 3,
      explanation: "Taro collected summits like coins — and coins spend. Sadao failed nine times on one face, took nineteen years to solve it, and became the reason climbers survive the mountain.",
    },
    {
      question: "How did Bill Schuffenhauer demonstrate the route/mountain distinction?",
      options: [
        "He lost the decathlon but kept the Olympics — switching routes to bobsled, never the mountain.",
        "He quit sports entirely and rebuilt his life in business.",
        "He kept training as a decathlete until his injury fully healed.",
        "He collected medals across many unrelated sports.",
      ],
      correctIndex: 0,
      explanation: "The dream was never 'decathlon' — it was the Games. Change routes freely; change mountains almost never. His 2002 medal came a mile from the dumpster he once ate from.",
    },
    {
      question: "What kept Brett from quitting on day three of the brutal CDT course?",
      options: [
        "The refund policy made quitting too expensive.",
        "His fever finally broke and the pain stopped.",
        "He couldn't face explaining to his sons how Daddy quit because something was hard and painful.",
        "Don MacKay ordered him to finish the course.",
      ],
      correctIndex: 2,
      explanation: "Grit almost always answers to someone. Name the people you'd have to explain your quitting to — before the morning you need them — and you've found your deepest reserve.",
    },
    {
      question: "What does Brett mean when he says reps are really REPS?",
      options: [
        "Repetitions Every Practice Session — daily volume is everything.",
        "Repeated Excellence Protocols — one specific point of excellence per rep, not distracted counting.",
        "Rest, Eat, Practice, Sleep — the full training cycle.",
        "Rapid Execution Performance Standards for competition.",
      ],
      correctIndex: 1,
      explanation: "Ten thousand distracted repetitions build a distracted black belt. Intensity — quality of attention — is what makes a decade of study different from a decade merely passing nearby.",
    },
  ],
},
{
  slug: "calm-river",
  order: 32,
  title: "The Calm River: Reappraisal Over Anxiety",
  tagline: "The Master's Edge Book",
  description: "Anxiety is almost never about what's happening — it's about what you're pre-living. Learn the Rule of Reappraisal and the 5×5 breathing protocol that manufacture calm before the 1 percent arrives.",
  videoUrl: PLACEHOLDER_VIDEO(32),
  pdfs: [],
  images: [],
  keyPoints: [
    "Calm isn't the absence of obstacles — it's a current that has learned to move around them.",
    "The Rule of Reappraisal: turn around and appraise what you've already accomplished.",
    "Your brain registers headwinds vividly and forgets tailwinds — correct the count.",
    "The 1 percent is not won in the 1 percent — it's won in the 99.",
    "5×5 Breathing: in for five, hold, out for five, hold empty — five cycles, about a hundred seconds.",
  ],
  lesson: [
    {
      heading: "The Parable of the Calm River",
      paragraphs: [
        "Aria was Master Li's most agile student, but her greatest battle was in her own thoughts: \"What if I fail? What if I let everyone down?\" Master Li walked her to the river at dawn and had her watch the current navigate the rocks. \"Notice how the river never stops or panics. It simply adjusts, flowing patiently and calmly. Anxiety and stress are like the stones — impossible to avoid. But cultivate a mind as steady as the river, and we keep moving peacefully forward.\" He taught her three skills: mindful breathing, positive self-talk, and grounding in the present moment.",
        "Now read the owner's version of Aria's worry: What if the launch flops? What if payroll gets tight? What if that key client walks? Same sentence structure, same machine. Business owners don't call it anxiety — they call it \"staying on top of things\" — but the two a.m. ceiling stare is the same pre-lived disaster in high definition. Notice what Master Li did NOT teach: removing the stones. The river never gets a cleared channel, and neither do you. There will always be a launch, a payroll, a client.",
      ],
    },
    {
      heading: "The Rule of Reappraisal",
      paragraphs: [
        "When I hit a wall in my training and felt hopeless, Grand Master Na gave me one sentence that changed my relationship with learning: \"Don't focus on the road ahead. Look at how far you've come.\" A few years earlier I could barely do anything; now I was doing jump spin kicks and breaking bricks. The Rule of Reappraisal: when discouraged or anxious, deliberately turn around and appraise what you've already accomplished — and who helped you. Four questions, in order: What have I achieved? What can I say I've done that I couldn't say before? How have others helped me? How does it make me feel?",
        "The science backs the masters. Davidai and Gilovich documented the headwinds/tailwinds asymmetry: your brain vividly registers obstacles and almost immediately forgets advantages and wins. You're wired to lose track of your own progress. Seligman's team found that five to ten minutes a day writing what went well measurably increased happiness for six months. Anxiety lives on the road ahead. Reappraisal corrects the count. Keep a running tailwinds file: wins, solved problems, skills that didn't exist ninety days ago.",
      ],
      bullets: [
        "Question 1: What have I achieved?",
        "Question 2: What can I say I've done that I couldn't say before?",
        "Question 3: How have others helped me?",
        "Question 4: How does it make me feel?",
      ],
    },
    {
      heading: "Range Time: Winning the 1 Percent in the 99",
      paragraphs: [
        "Tom Patire — America's Leading Personal Safety Expert, my teacher through CDT and bodyguard school — has a line that belongs in every business book: \"Bodyguard work is 99 percent boredom and 1 percent sheer terror.\" Running a company has the same shape. Tom's real lesson: the 1 percent is not won in the 1 percent. It's won in the 99. The bodyguard who stays calm in terror has rehearsed so many times in the boredom that terror has nothing new to say to him. The research calls it Frontloading — load the tools and rehearsal in before the challenge, and you outperform anyone learning mid-crisis.",
        "Your range time is 5×5 Breathing: in through the nose for five, hold for five, out for five — then hold for five more with lungs empty. Five cycles, about a hundred seconds, no equipment. The empty-lung hold is the hard part — that's the design: sitting calmly while your body suggests panicking is composure practice in miniature. My student Dale Hughes ran the protocol with his family after their car rolled into a ditch — he didn't find calm, he brought it, manufactured a hundred seconds at a time on ordinary days. Practice in your 99 percent, and your 1 percent meets a person who is ready.",
      ],
      bullets: [
        "River Breathing: in for four, hold for two, out for four — watch each worry drift downstream.",
        "The Three-Breath Bell: pick one recurring sound; every time it rings — stop, three slow breaths, small smile, continue.",
        "The P.A.P.A. Meditation: Presence, Appreciation, Projecting, Allowing — start at one minute per phase.",
      ],
    },
  ],
  quiz: [
    {
      question: "What does the calm river teach about the stones in its path?",
      options: [
        "With enough patience, the current eventually removes every stone.",
        "The stones never leave — the river adjusts and flows around them without panicking.",
        "A wise river finds a channel with no stones at all.",
        "Stones only matter to rivers that flow too fast.",
      ],
      correctIndex: 1,
      explanation: "Master Li never taught Aria to remove the stones. There will always be a launch, a payroll, a client. Calm isn't the absence of obstacles — it's a current that moves around them.",
    },
    {
      question: "What is the first question of the Rule of Reappraisal?",
      options: [
        "What have I achieved?",
        "What should I do next?",
        "What went wrong this quarter?",
        "Who is responsible for my setbacks?",
      ],
      correctIndex: 0,
      explanation: "The four questions run in order: What have I achieved? What can I say I've done that I couldn't say before? How have others helped me? How does it make me feel? Turn around and correct the count.",
    },
    {
      question: "What is the headwinds/tailwinds asymmetry?",
      options: [
        "Obstacles always outnumber advantages in any real business.",
        "Optimists see tailwinds; pessimists see headwinds — it's fixed personality.",
        "Markets punish businesses facing headwinds twice as hard.",
        "The brain vividly registers obstacles but almost immediately forgets advantages and wins.",
      ],
      correctIndex: 3,
      explanation: "Davidai and Gilovich showed you're wired to lose track of your own progress. You're not negative because your business is failing — the brain won't check the record unless you make it.",
    },
    {
      question: "According to Tom Patire's lesson, where is the 1 percent of sheer terror actually won?",
      options: [
        "In the moment itself, through raw courage.",
        "By avoiding high-stakes situations altogether.",
        "In the 99 percent — through rehearsal so thorough that terror has nothing new to say.",
        "By hiring specialists to handle every crisis.",
      ],
      correctIndex: 2,
      explanation: "Composure is manufactured in the boring reps that feel unnecessary on a quiet Tuesday. The science calls it Frontloading: load the tools in before the challenge, not mid-crisis.",
    },
    {
      question: "What makes 5×5 Breathing different from most breathing exercises?",
      options: [
        "The empty-lung hold after the exhale — deliberate composure practice in miniature.",
        "It requires a special app to time the cycles precisely.",
        "It takes a full twenty minutes to complete properly.",
        "It only works when performed during an actual crisis.",
      ],
      correctIndex: 0,
      explanation: "In for five, hold, out for five, hold empty for five — five cycles, about a hundred seconds. Sitting calmly with empty lungs while your body suggests panicking is the design, not a flaw. Start with a three count and earn your way up.",
    },
  ],
},
{
  slug: "warriors-ledger",
  order: 33,
  title: "The Warrior's Ledger: Confidence",
  tagline: "The Master's Edge Book",
  description: "Confidence isn't the absence of doubt — it's the presence of evidence. Learn the four-step Personal Confidence Model that Brett has built into thousands of students and tested in his own research.",
  videoUrl: PLACEHOLDER_VIDEO(33),
  pdfs: [],
  images: [],
  keyPoints: [
    "The fearful mind is a poor historian — it forgets victories and files every stumble twice.",
    "Self-talk must be RCB: Real, Credible, backed by a Body of work. No lies.",
    "Feed your Personal Lie Detector proof — it vetoes any belief it can't verify.",
    "Plan and practice from the controllables only — process goals, not outcome wishes.",
    "Practice makes permanent; only mindful practice makes perfect.",
  ],
  lesson: [
    {
      heading: "The Parable of the Warrior's Ledger",
      paragraphs: [
        "Sana was quick of foot, strong of technique, and convinced she was neither. When she asked to be excused from the village demonstration, Master Ryo didn't argue. He handed her a small gray book — a warrior's ledger — with one rule: record only what actually happened. Nothing you hope, nothing you fear. Held my stance a full minute when last month I could not. Fell nine times; stood up nine times. Months later, asked again to be excused, Ryo said: \"First, read me your ledger.\" Somewhere in the reading, her voice changed. \"Master, I've been telling myself a story that my own book contradicts.\"",
        "\"The fearful mind is a poor historian,\" said Ryo. \"It forgets every victory and files every stumble twice. But ink does not flinch. When your courage fails, you do not need louder words — you need truer records.\" Parents bring me their children for confidence more than for any kick or punch, and most believe it's something a child either has or doesn't. Business owners believe the same lie about themselves. Nobody is built that way. Confidence is a learnable, developable skill — constructed on evidence — with one warning attached: it's far easier to build than to repair.",
      ],
    },
    {
      heading: "The Framework: The Personal Confidence Model",
      paragraphs: [
        "Step 1: Arm yourself with self-talk that passes the lie detector — and frontload it. Every phrase must be RCB: Real, Credible, backed by a Body of work. NO LIES. Say what's true and earned: I've trained hard for this. I've made payroll through two recessions. Build your Credibility Inventory — the hard things you've actually overcome — before you need it. Step 2: Determine what is actually possible. Your mind's Personal Lie Detector vetoes any belief it can't verify. Don't fight the detector — feed it proof, and belief stops being a wish and becomes a verdict.",
        "Step 3: Outline the steps within your control. You don't control whether the client says yes; you control the proposal, the follow-up cadence, the preparation. Process goals, not outcome wishes. Step 4: Practice mindfully until the steps are reflex. Practice makes permanent — only mindful practice, each rep aimed at one specific improvement, makes perfect. Reps are Repeated Excellence Protocols. Drill the controllables until they run without thinking, and pressure won't need your nerves' permission. Self-talk that's true. Belief that's verified. Steps that are yours. Practice that's mindful.",
      ],
      bullets: [
        "Step 1: RCB self-talk plus a frontloaded Credibility Inventory.",
        "Step 2: Feed the Personal Lie Detector proof of what's possible.",
        "Step 3: Separate controllables from uncontrollables — plan from the left column only.",
        "Step 4: Mindful REPS until the skills are reflex.",
      ],
    },
    {
      heading: "Become the Evidence",
      paragraphs: [
        "For decades the four-minute mile was the Personal Lie Detector of an entire species — physiologists said it sat at the edge of human capacity. Roger Bannister, a medical student training on lunch breaks, ran the model: RCB self-talk grounded in training logs, possibility verified by studying the physiology, controllables — pace, splits, pacemakers — drilled until reflex. On May 6, 1954, he ran 3:59.4. Forty-six days later John Landy ran faster. The body didn't change in forty-six days. The evidence changed — and the world's lie detector stopped vetoing the belief for everyone.",
        "My friend Sal Rossano, retired Green Beret, opens every talk with: \"According to every statistic, I shouldn't be standing here today.\" A 1.93 GPA. A first Selection attempt ended by hypothermia — an exit most would file as a verdict. Sal filed it as an unfinished ledger entry, went back knowing what it cost, and earned the Green Beret. Then cum laude, a master's, PA board certification. His Evidence Method — Choose, Prepare, Act, Collect Evidence, Become — has its engine in the middle: action creates evidence; evidence creates belief. Confidence is the paycheck, not the prerequisite.",
      ],
      bullets: [
        "Start Your Ledger tonight: ten hard things you've actually overcome — specific, dated, true.",
        "The RCB Rewrite: if your body doesn't respond when you read it aloud, it's not true enough yet.",
        "The Two-Column Split: controllables left, uncontrollables right — plan from the left only, revisit weekly.",
      ],
    },
  ],
  quiz: [
    {
      question: "What was Master Ryo's one rule for the warrior's ledger?",
      options: [
        "Write your goals for tomorrow every night.",
        "Record only your victories to stay motivated.",
        "Write daily affirmations of who you want to become.",
        "Record only what actually happened — nothing you hope, nothing you fear.",
      ],
      correctIndex: 3,
      explanation: "No boasts, no despair — only what you did. Boasts and despair are both lies, and the fearful mind is a poor historian. When courage fails, you don't need louder words — you need truer records.",
    },
    {
      question: "What does RCB stand for in Step 1 of the Personal Confidence Model?",
      options: [
        "Real, Credible, backed by a Body of work.",
        "Repeat, Commit, Believe.",
        "Resilient, Confident, Brave.",
        "Record, Check, Build.",
      ],
      correctIndex: 0,
      explanation: "Your mind knows the difference between a claim and a record — hollow affirmations bounce off; evidence sinks in and holds. The rule that binds it all: never say what you hope to do. No lies.",
    },
    {
      question: "How do you handle your Personal Lie Detector, according to Step 2?",
      options: [
        "Override it by repeating affirmations more loudly.",
        "Ignore it — doubt is just fear talking.",
        "Feed it proof that what you want has been done, so belief becomes a verdict instead of a wish.",
        "Set smaller goals so it never triggers.",
      ],
      correctIndex: 2,
      explanation: "The detector will let you believe you can break a brick or build a million-dollar business because it has seen others do it. It vetoes what it can't verify — so don't fight it, feed it.",
    },
    {
      question: "What proved that the four-minute-mile barrier was never in the runners' legs?",
      options: [
        "Bannister used a revolutionary new training technology.",
        "John Landy broke it just forty-six days after Bannister — the evidence changed, not the human body.",
        "Doctors discovered the physiology papers had a calculation error.",
        "Track surfaces improved dramatically in 1954.",
      ],
      correctIndex: 1,
      explanation: "Runners had chased it since the 1880s, stalling at 4:01 and 4:02. Once the world's Personal Lie Detector saw it done, it stopped vetoing the belief — for everyone. Today strong high schoolers break four minutes.",
    },
    {
      question: "In Sal Rossano's Evidence Method, what is the engine that drives confidence?",
      options: [
        "Belief creates action, and action creates results.",
        "Visualizing success until it feels inevitable.",
        "Surrounding yourself with confident people.",
        "Action creates evidence; evidence creates belief — courage comes before confidence.",
      ],
      correctIndex: 3,
      explanation: "Choose. Prepare. Act. Collect Evidence. Become. Not belief first — evidence first. Confidence is the paycheck, not the prerequisite, and the arena is the only place evidence gets minted.",
    },
  ],
},
{
  slug: "twin-tigers",
  order: 34,
  title: "The Twin Tigers: Lead With Your Strengths",
  tagline: "The Master's Edge Book",
  description: "Whatever you lead with becomes the frame for everything that follows. Learn to ring your bell first, work your gaps like projects, and find the partner whose mallet matches your bell.",
  videoUrl: PLACEHOLDER_VIDEO(34),
  pdfs: [],
  images: [],
  keyPoints: [
    "Whatever you lead with becomes the frame for everything that follows",
    "Name your bell: you cannot lead with a strength you haven't named",
    "Work gaps with curiosity, as projects — never as identity",
    "Some gaps you shouldn't close yourself: hire your Riku, partner with your Hana",
    "Under pressure, fall back to your foundation — never experiment under fire",
  ],
  lesson: [
    {
      heading: "The Parable of the Twin Tigers",
      paragraphs: [
        "High in emerald mountains, Master Arata trained two siblings known as the Twin Tigers. Hana had lightning speed; Riku had thunderous strength. Yet each led with what they lacked — Hana mourned her weak strikes, Riku his slow feet — and every time they led with weakness, their shoulders drooped and their training plateaued. So the master handed Hana a bell and Riku a mallet: ring your speed, strike your power. The dojo applauded. Then he pointed to a broad stone neither could lift alone. Together — Hana guiding footing, Riku providing force — they raised it easily.",
        "Master Arata's correction wasn't 'ignore your weaknesses.' It was a sequence: gifts first, gaps second, and gaps approached with curiosity instead of complaint. Once the Tigers led with their strengths, positive emotion opened their minds — Hana found power in her hips, Riku mastered footwork drills. You've heard the business version of their complaints: 'I'm terrible at marketing.' 'I'm not a numbers person.' Same soundtrack, better shoes — and the same plateau, until you change what you lead with.",
      ],
    },
    {
      heading: "The Framework: Strengths First, Gaps Second",
      paragraphs: [
        "Three moves. First, name your bell — the skill people compliment, the work that energizes instead of drains. Most owners list their weaknesses in seconds and go silent when asked for strengths. Second, lead with it — out loud, first, daily. Answer 'how's business?' with what's working before what's worrying. This isn't fluff: Barbara Fredrickson's broaden-and-build research shows leading with what's going well literally expands awareness and opens the mind to creative solutions. Positive emotion isn't the reward for solving problems; it's the state that solves them.",
        "Third, work your gaps with curiosity, as projects — not as identity. 'I'm bad at sales' is a label; 'I'm running a ninety-day project to get competent at sales' is a plan. And some gaps you shouldn't close personally at all — that's what the stone teaches. Hana didn't need to become strong; she needed Riku. Wozniak never became a marketer and Jobs never became an engineer; each led so completely with his strength that the other's gift ran at full power. Hire your Riku. Partner with your Hana. The stone doesn't care whose muscles moved it.",
      ],
      bullets: [
        "Name your bell — you can't lead with an unnamed strength",
        "Lead with it out loud, first, daily",
        "Work gaps as projects, with curiosity — never as identity",
      ],
    },
    {
      heading: "Practice: Foundation Under Pressure",
      paragraphs: [
        "Grand Master Tom Fisher taught me the high-stakes version: your strength is a foundation you have built on — thousands of reps deep, pressure-tested, load-bearing. When adrenaline hits, you don't rise to the technique you admire; you fall to the foundation you've drilled. A fighter who experiments under fire donates the fight. So when the negotiation turns hostile or the quarter collapses, plant your feet on what you've built. The time to work gaps is in training, with curiosity. The high-stakes moment belongs to your foundation.",
        "Start this week with the Strength Spotlight: ask three people who know your work, 'What am I best at?' and write down what they say. Then pick ONE business gap — not five — and run Targeted Reps: one small daily rep, charted for a week. Trade strengths with a peer in Partner Swap Coaching, alternate strength-work then gap-work in that order, and end team meetings with each person naming one win they saw in someone else. A team arranged around its bells and mallets outperforms the same team arranged around its job titles — every single time.",
      ],
      bullets: [
        "Ask three people: 'What am I best at?'",
        "Choose ONE gap and chart a small daily rep",
        "End meetings with each person naming a win they saw in someone else",
      ],
    },
  ],
  quiz: [
    {
      question: "What was actually holding the Twin Tigers back?",
      options: [
        "They lacked natural talent",
        "Their master pushed them too hard",
        "They led with their weaknesses, which framed everything that followed",
        "They refused to train together",
      ],
      correctIndex: 2,
      explanation: "Hana and Riku had real gifts — speed and strength. The problem was where they led: every complaint dropped their shoulders and plateaued their training. Whatever you lead with becomes the frame for everything that follows.",
    },
    {
      question: "According to Fredrickson's broaden-and-build research cited in the chapter, positive emotion is…",
      options: [
        "The state that opens the mind to creative solutions",
        "The reward you earn after solving problems",
        "A distraction from serious deliberate practice",
        "Useful only for beginners who need encouragement",
      ],
      correctIndex: 0,
      explanation: "Leading with what's going well literally expands your awareness. That's why Hana found power in her hips only after she started leading with her speed — positive emotion isn't the prize for solving problems; it's the state that solves them.",
    },
    {
      question: "What does the heavy stone in the parable teach about weaknesses?",
      options: [
        "Every weakness must eventually be fixed personally",
        "Weaknesses disappear once you name your strengths",
        "Strength always beats speed when combined",
        "Some gaps should be closed by partnership, not by you",
      ],
      correctIndex: 3,
      explanation: "Hana didn't need to become strong; she needed Riku. Wozniak never became a marketer and Jobs never became an engineer — each led with his strength so the other's could run at full power. Hire your Riku; the stone doesn't care whose muscles moved it.",
    },
    {
      question: "Tom Fisher's rule for high-pressure moments is:",
      options: [
        "Try the newest tactic you've learned to surprise opponents",
        "Stand on your proven foundation — pressure is the worst lab for the unproven",
        "Focus on fixing your weakness while stakes are high",
        "Avoid high-pressure situations until your gaps are closed",
      ],
      correctIndex: 1,
      explanation: "Under adrenaline you fall to the foundation you've drilled, not the technique you admire. Work gaps in training, with curiosity; the high-stakes moment belongs to your thousands-of-reps, load-bearing foundation.",
    },
    {
      question: "How does the chapter reframe 'I'm bad at sales'?",
      options: [
        "As proof you should delegate all selling forever",
        "As honest self-awareness worth repeating daily",
        "As a temporary project: 'a ninety-day project to get competent at sales'",
        "As a sign you chose the wrong business",
      ],
      correctIndex: 2,
      explanation: "'I'm bad at sales' is an identity label; a ninety-day competence project is a plan. Weaknesses addressed after strengths become temporary projects instead of permanent labels — worked from momentum instead of shame.",
    },
  ],
},
{
  slug: "garden-of-words",
  order: 35,
  title: "The Garden of Words: Compassionate Communication",
  tagline: "The Master's Edge Book",
  description: "You'll throw ten thousand more sentences than punches, and every one lands on someone. Train your tongue like you train your hands — with the Way of the Open Palm.",
  videoUrl: PLACEHOLDER_VIDEO(35),
  pdfs: [],
  images: [],
  keyPoints: [
    "Words are stones in the sand — you're always planting thorns or flowers",
    "Under nearly every blowup sit two unmet needs wearing armor",
    "The Way of the Open Palm: breathe, observe, feel, name the need, request",
    "You can be honest and kind at the same time — truth intact, contempt removed",
    "A true martial artist controls fists, feet, AND tongue",
  ],
  lesson: [
    {
      heading: "The Parable of the Garden of Words",
      paragraphs: [
        "At Harmony House Martial Arts, Master Aya's dojo, two teens collided. Jin was intense and blunt; Mira was bright, talkative, and giggled when nervous. When Mira tripped during drills, Jin snapped: 'This isn't a comedy show.' Mira fired back, and the dojo's energy dropped like a stone. Master Aya led them to her rock garden — her Garden of Words — placed a stone in the sand, and raked lines around it. 'This stone is a difficult moment. What you say in that moment shapes what grows around it. You can plant thorns, or you can plant flowers.'",
        "Then she went under the conflict. Jin's sharpness was fear that people wouldn't respect the training he cared about. Mira's joking was fear she didn't belong. Both needs were real; both had been expressed as weapons. So each tried again — 'When you laugh during drills, I feel frustrated, because I want us both to get better. Could we focus this round and joke after?' — truth without attacking character. That's compassionate communication: words as bridges, not weapons; listening to understand, not just to respond. Underneath nearly every blowup sit two unmet needs wearing armor.",
      ],
    },
    {
      heading: "The Way of the Open Palm",
      paragraphs: [
        "I'll confess: I was Jin. For years I believed harsh was motivating — sharp words for my team, brutal words in my own head. Then an interview with performance psychologist Dr. Michael Gervais stopped me cold: negative self-talk can whip you into getting better, but you may not like who you've become when you get there. The research supports language that builds the performer, not just extracts the performance. I rebuilt my words from inside the house — so when I tell you a Jin can learn to speak like a master without losing an ounce of standards, I'm reporting a renovation, not a theory.",
        "The framework is the Way of the Open Palm — open hand instead of closed fist, backed by Marshall Rosenberg's Nonviolent Communication. Five moves, in order: Breathe — one breath lets your rational mind outrun your temper. Observe without judgment — state facts a camera would agree with; indictments get appealed, not heard. Share feelings without blaming — 'you made me feel' turns listeners into lawyers. Name the need under the feeling — unspoken needs are the problem, never the needs themselves. Make a clear, positive request — ask for what you want, not what you're sick of.",
      ],
      bullets: [
        "Breathe before anything",
        "Observe without judgment — camera facts only",
        "Share feelings without blame",
        "Name the need under the feeling",
        "Make a clear, positive request",
      ],
    },
    {
      heading: "Practice: The Sentence Frame and the Rehearsed Card",
      paragraphs: [
        "The frame my students learn — children and CEOs alike: 'When ___ happened, I felt ___, because I need ___.' It looks simple. A front kick looks simple too; both take a thousand reps to own. Nelson Mandela ran the whole framework from a prison cell — studying Afrikaans, seeing men inside a system instead of monsters, naming the fear beneath their hostility, making requests with everyone's dignity intact. Some warders became lifelong friends. Your hostile negotiation and fractured partnership are smaller stones in the same garden.",
        "This week: list your five most-said stress phrases, sort them thorns or flowers, and rewrite every thorn. Use the feelings-first frame once at work and once at home. Practice the Listening Stance: eyes on the speaker, body turned, mouth closed, mind open — two full minutes, no rehearsing your reply. Take the bluntest thing you need to say, write the harsh version, then rewrite it honest AND kind before delivering. And before any difficult conversation, write the Open Palm sequence on one card and rehearse it aloud until it survives your own adrenaline — it's armor for your composure.",
      ],
      bullets: [
        "Rewrite your five stress phrases from thorns to flowers",
        "Run the sentence frame once at work, once at home",
        "Rehearse hard conversations on one card: observation, feeling, need, request",
      ],
    },
  ],
  quiz: [
    {
      question: "What did Master Aya find underneath Jin's sharpness and Mira's joking?",
      options: [
        "Laziness and a lack of discipline",
        "Legitimate unmet needs — respect for the training, and belonging",
        "A rivalry over who would earn rank first",
        "Two students who simply didn't like each other",
      ],
      correctIndex: 1,
      explanation: "Jin feared disrespect for the training he loved; Mira feared she didn't belong. Underneath nearly every blowup sit two unmet needs wearing armor — the words were weapons, but the needs were legitimate.",
    },
    {
      question: "Which statement is an observation in the Open Palm sense?",
      options: [
        "\"You never take anything seriously\"",
        "\"You're being disrespectful again\"",
        "\"You obviously don't care about this team\"",
        "\"You laughed during the drill\"",
      ],
      correctIndex: 3,
      explanation: "An observation states facts a camera would agree with. 'You never take anything seriously' is an indictment — and indictments get appealed, not heard.",
    },
    {
      question: "The question Dr. Gervais's interview put in front of Brett was:",
      options: [
        "Who are you becoming while harsh language gets results?",
        "Does negative self-talk ever produce results?",
        "Should coaches ever raise their voices?",
        "How do elite athletes handle criticism?",
      ],
      correctIndex: 0,
      explanation: "Harsh language had produced results for years — that was never the question. Gervais's point: you can whip yourself into getting better, but you may not like what you've become once you get there. The research favors language that builds the performer.",
    },
    {
      question: "Which move in the Open Palm sequence does the chapter say almost nobody does?",
      options: [
        "Breathing before speaking",
        "Sharing feelings honestly",
        "Naming the need under the feeling",
        "Making any request at all",
      ],
      correctIndex: 2,
      explanation: "Needs are universal and legitimate — they're never the problem. Unspoken needs are. Naming the need under the feeling is the move that changes everything, and the one people skip.",
    },
    {
      question: "How did Mandela demonstrate compassionate communication in prison?",
      options: [
        "He refused to speak to guards until they showed respect",
        "He won debates against the warders using superior logic",
        "He stayed silent and let his conduct speak entirely",
        "He learned his jailers' language and spoke to their needs with dignity intact",
      ],
      correctIndex: 3,
      explanation: "Mandela studied Afrikaans, saw men inside a system rather than monsters, understood the fear beneath their hostility, and made requests with everyone's dignity intact. Some of those warders became lifelong friends — his words built the bridge his enemies walked across.",
    },
  ],
},
{
  slug: "stone-steps",
  order: 36,
  title: "The Stone Steps: Goal Setting",
  tagline: "The Master's Edge Book",
  description: "Most people set goals like tourists climb mountains — staring at the summit, tripping over the next step. Masters climb with three types of goals, in the right order.",
  videoUrl: PLACEHOLDER_VIDEO(36),
  pdfs: [],
  images: [],
  keyPoints: [
    "The size of a goal is not its power — the clarity of the next step is",
    "Outcome goals give direction, but you don't fully control them",
    "Process goals are the stones — daily actions you completely control",
    "Progress goals are the motivation engine: the look back down the mountain",
    "One summit per season, three to five daily stones, a Friday progress review",
  ],
  lesson: [
    {
      heading: "The Parable of the Stone Steps",
      paragraphs: [
        "Young Tomo asked Master Rin for the secret to greatness. Instead of an answer, the master led him to stone steps carved into a mountainside — the Steps of Intention, where every warrior left behind a goal for each step. 'You do not reach the top by climbing randomly,' Master Rin said. 'Greatness is not a single leap. It is the sum of many small, intentional steps.' On each stone Tomo wrote one small goal: drink more water, practice forms five minutes longer, help a younger student, hold his stance with better posture.",
        "Halfway up, Tomo paused and looked down at dozens of steps behind him. Each goal had seemed insignificant — together, they had changed him. 'You don't need to see the top,' the master said. 'You just need to take the next step.' Now audit your own goals honestly. 'Double revenue.' 'Scale to seven figures.' Summit statements — real, worthy, and unclimbable as written, because you can't put your foot on a summit. The size of a goal is not its power. The clarity of the next step is its power.",
      ],
    },
    {
      heading: "The Framework: The Three Types of Goals",
      paragraphs: [
        "Every goal you'll ever set is one of three types, and most people fail because they only set the first. Outcome Goals are the summit — the larger result that gives the journey direction: the next belt, the revenue number, selling on your terms. You need one, but it has a brutal limitation: you don't fully control it. Process Goals are the stones — daily actions you completely control: fifteen minutes of forms, five sales conversations a day, the weekly numbers review that actually happens. Discipline, structure, and every dream that ever became real were built here.",
        "Progress Goals are the look back down the mountain — the stance held ten seconds longer, closing rate up three points. They convert effort into visible evidence, and visible progress is among the most powerful motivators a human can access. The order matters: outcome for direction, process for action, progress for fuel. John Wooden proved the process scales — he scripted practices to the minute, taught All-Americans to put on socks properly, and almost never mentioned winning. Ten national championships in twelve years. The summit took care of itself because nobody was staring at it.",
      ],
      bullets: [
        "Outcome goal: the summit — direction, set once per season",
        "Process goals: the stones — daily actions you fully control",
        "Progress goals: the look back — visible evidence that fuels the climb",
      ],
    },
    {
      heading: "Practice: Slaying Your Goliath, Stone by Stone",
      paragraphs: [
        "My own summit was set as a freshman: win the Washington state title in triple jump — from the smallest class A school in the state, in an event I first couldn't do without a person under each arm. I missed districts by one place, got in on an injury, and lost anyway — but the stone got placed: preparation lets you seize opportunities the moment they appear. Senior year, with weeks left, I finally ran the brutal 400-meter sprint plan I'd been avoiding. At the 106-degree state championships I felt calm — the heat was bad, but NOT THAT BAD. Gold medal. The reps I'd banked were load-bearing.",
        "Build your year the way I coach clients: ONE outcome goal per season, three to five process goals owned daily, and a fifteen-minute progress review every Friday — 'what does the ledger say this week?' Then practice: put three process goals on a card you check daily and rewrite weekly. Build a Goal Ladder — the five stones between here and your quarterly summit — where your team can see it. End each day naming the one stone you placed. And map your next 'belt': the specific capabilities, numbers, and systems that mark your next level. Most owners chase 'more.' Masters test for the next rank.",
      ],
      bullets: [
        "Three process goals on a pocket card — not ten, three",
        "Friday progress review: fifteen minutes, every week",
        "Define your next business 'belt' and map the stones to it",
      ],
    },
  ],
  quiz: [
    {
      question: "Why does the chapter call \"double revenue this year\" unclimbable as written?",
      options: [
        "Because doubling revenue is unrealistic for most businesses",
        "Because it's a summit statement — you can't put your foot on a summit",
        "Because revenue goals should always be quarterly",
        "Because it lacks a financial forecast behind it",
      ],
      correctIndex: 1,
      explanation: "The goal is real and worthy — but it's a destination, not a step. The size of a goal is not its power; the clarity of the next step is. Summits give direction, then you live in your stones.",
    },
    {
      question: "What is the brutal limitation of outcome goals?",
      options: [
        "They take too long to define clearly",
        "They only work for athletes, not business owners",
        "You don't fully control them",
        "They make daily work feel meaningless",
      ],
      correctIndex: 2,
      explanation: "The outcome goal is the destination, not the climbing. You need it for direction — a staircase to nowhere is just exercise — but the daily actions you completely control live in your process goals.",
    },
    {
      question: "What was the first thing John Wooden taught every UCLA team?",
      options: [
        "How to put on their socks properly",
        "The championship schedule for the season",
        "His famous definition of success",
        "Full-court defensive rotations",
      ],
      correctIndex: 0,
      explanation: "Wrinkles cause blisters, blisters steal practice time, and practice is where everything is built. Wooden lived in process goals — and ten national championships in twelve years followed because nobody was staring at the summit.",
    },
    {
      question: "What role do progress goals play in the system?",
      options: [
        "They replace outcome goals once you're experienced",
        "They set the direction for the whole year",
        "They keep you accountable to your coach",
        "They convert effort into visible evidence — the motivation engine",
      ],
      correctIndex: 3,
      explanation: "Progress goals are the look back down the mountain: the stance held longer, the closing rate up three points. Visible progress is among the most powerful motivators a human can access — outcome for direction, process for action, progress for fuel.",
    },
    {
      question: "What mix does Brett prescribe to coaching clients?",
      options: [
        "Ten outcome goals reviewed monthly",
        "One outcome goal per season, 3-5 daily process goals, a Friday progress review",
        "One process goal per quarter, reviewed annually",
        "Five outcome goals with weekly accountability partners",
      ],
      correctIndex: 1,
      explanation: "Most owners arrive inverted — ten summits, no stones, no look back down the mountain. The Friday review is the piece they fight and then never give up: fifteen minutes of 'what does the ledger say this week?' — where next week's motivation actually comes from.",
    },
  ],
},
{
  slug: "consistent-warrior",
  order: 37,
  title: "The Consistent Warrior: Consistency",
  tagline: "The Master's Edge Book",
  description: "Inspiration is weather; consistency is climate — and you can't build anything on weather. The water shapes the stone, and consistency shapes the warrior.",
  videoUrl: PLACEHOLDER_VIDEO(37),
  pdfs: [],
  images: [],
  keyPoints: [
    "Inspiration is weather; consistency is climate — you can't build on weather",
    "The stream beats the stone with attendance, not intensity",
    "Flow daily: decide your minimum in advance and never negotiate it",
    "Small and steady beats big and rare — frequency builds automaticity",
    "Track the practice daily; check the stone monthly",
  ],
  lesson: [
    {
      heading: "The Parable of the Consistent Warrior",
      paragraphs: [
        "Kenta was strong, quick, and eager — but he only practiced when he felt inspired, skipping days when tired or unmotivated. When he asked Master Toshi why he hadn't improved like the others, the master led him to a stream and pointed at a large, smooth stone in the water. 'The water does not strike the rock with force, yet through its consistent flow, it has worn the stone smooth. Mastery is not achieved by bursts of effort. The stone is shaped not by power but by persistence.'",
        "Kenta's flaw hides well because he wasn't lazy — the talent was real. His flaw was a dependency: effort chained to inspiration. Now find the Kenta in your operation: follow-up calls that happen in enthusiastic streaks, the financial review that occurs when anxiety spikes instead of every Friday, content and prospecting brilliant in bursts and absent in between. Burst effort feels productive. But the stream doesn't beat the stone with intensity. It beats it with attendance. Keep this sentence: inspiration is weather; consistency is climate. You can't build anything on weather.",
      ],
    },
    {
      heading: "The Framework: The Stream's Three Rules",
      paragraphs: [
        "Rule one: flow daily — show up regardless of feeling. The stream doesn't consult its mood. Decide your daily minimum in advance and divorce it completely from inspiration, energy, and circumstances. Rule two: small and steady beats big and rare. Five focused minutes every day outbuilds five heroic hours once a month. The habit researchers measured why: automaticity — the point where a behavior runs without willpower — is built by frequency, not size. On average it takes about two months of daily repetition before a behavior carries itself. Bursts reset the clock every time.",
        "Rule three: let the stone do the telling. Day to day, nothing visibly changes — and that's exactly when Kentas quit. Track the practice, not the feeling: a checked box, a logged rep, a chart on the wall. Then, monthly, look at the stone — the smoother technique, the fuller pipeline, the calmer numbers. Cal Ripken Jr. lived it: 2,632 consecutive games, shattering Gehrig's 'unbreakable' record. The streak wasn't 2,632 heroic performances — he had bad games by the hundreds. Its material was attendance: the decision, made once and renewed daily, that showing up was not weather-dependent.",
      ],
      bullets: [
        "Flow daily — the stream doesn't consult its mood",
        "Small and steady beats big and rare",
        "Let the stone do the telling — track daily, review monthly",
      ],
    },
    {
      heading: "Practice: One Commitment, Insultingly Small",
      paragraphs: [
        "New clients ask me for the perfect weekly system. I give them something smaller and far harder: ONE daily commitment, sized so small it's embarrassing. Five sales touches. One page of the financials. Ten minutes on the skill they're avoiding. The rule: it happens every business day and is never skipped for being too easy. Clients laugh at the size — then around week six the thing starts running itself, and we stack the next stone. A year later they have six automatic behaviors compounding daily. The owner who wanted the perfect system is running something better: a climate.",
        "This week, keep it insultingly small: one business skill, five minutes, daily, non-negotiable — too small to skip is the whole design. Hold your most boring-but-vital commitment thirty days without redesigning it. Put a consistency chart on the wall where your team can watch the chain grow — an unbroken chain becomes something you protect. Weld new habits to existing anchors: financials with the first coffee, follow-ups right after lunch. And run one technique daily for a week, then compare Friday to Monday. That visible delta converts more people to consistency than any speech.",
      ],
      bullets: [
        "One daily commitment, too small to skip",
        "Thirty days on one boring-but-vital routine — no redesigning",
        "Chart the chain where everyone can see it",
      ],
    },
  ],
  quiz: [
    {
      question: "What was Kenta's actual flaw?",
      options: [
        "He lacked the natural talent of the other students",
        "His effort was chained to inspiration — he only trained when he felt like it",
        "He trained too hard and burned out",
        "He refused to listen to Master Toshi's corrections",
      ],
      correctIndex: 1,
      explanation: "Kenta wasn't lazy — he was strong, quick, and eager. His flaw was a dependency: when the feeling showed up, so did he. Mastery only ever shows up on a schedule.",
    },
    {
      question: "How does the stream shape the stone?",
      options: [
        "With overwhelming force applied at the right moment",
        "By striking hardest during storms",
        "With attendance — steady flow over time, not intensity",
        "By finding the stone's weakest point",
      ],
      correctIndex: 2,
      explanation: "The water never strikes with force. Burst effort feels productive because it's intense, but the stream beats the stone with attendance — small, steady actions repeated over time.",
    },
    {
      question: "What did habit researchers find about automaticity?",
      options: [
        "It's built by frequency, not size — roughly two months of daily repetition",
        "It arrives after any thirty-day challenge",
        "It requires intense willpower throughout",
        "It only develops for physical habits, not mental ones",
      ],
      correctIndex: 0,
      explanation: "Automaticity — where a behavior runs without willpower — comes from frequency, not size. Five daily minutes outbuilds five heroic hours monthly, because bursts reset the clock every time.",
    },
    {
      question: "What was Cal Ripken Jr.'s streak actually made of?",
      options: [
        "2,632 consecutive heroic performances",
        "Superior conditioning that prevented all injuries",
        "A contract that required him to play every game",
        "Attendance — a decision made once and renewed daily",
      ],
      correctIndex: 3,
      explanation: "Ripken had bad games, ordinary games, forgettable games by the hundreds. The streak's material was showing up, not weather-dependent brilliance — and the sport understood: the streak WAS the achievement.",
    },
    {
      question: "Why does Brett size a client's first daily commitment 'so small it's embarrassing'?",
      options: [
        "To avoid overwhelming clients who lack discipline",
        "Because bigger commitments cost too much time",
        "Too small to skip is the design — it must never be negotiable",
        "To test whether the client is serious before real work",
      ],
      correctIndex: 2,
      explanation: "The rule is that it happens every business day and is never skipped for being too easy. Around week six it starts running itself; then you stack the next stone. A year later, six automatic behaviors are compounding — a climate, not a system.",
    },
  ],
},
{
  slug: "lantern-bearer",
  order: 38,
  title: "The Lantern Bearer: Help First",
  tagline: "The Master's Edge Book",
  description: "Two words that matter most at the exact moment every instinct votes against them — when you're the one drowning. The lantern bearer never walks in darkness.",
  videoUrl: PLACEHOLDER_VIDEO(38),
  pdfs: [],
  images: [],
  keyPoints: [
    "When you're in trouble and someone else is too — help first",
    "The lantern lights both paths: the light you hold for another falls on your road",
    "Helping first switches sides of the rope and ends the tug-of-war",
    "Help first doesn't mean help only — the lantern bearer still walks home",
    "Small help counts: the rule runs on gestures, not grand rescues",
  ],
  lesson: [
    {
      heading: "The Parable of the Lantern Bearer",
      paragraphs: [
        "In Master Hana's mountain dojo, new student Daiki noticed something odd: every evening, the senior students paused at the gate with their lanterns and waited — sometimes minutes — for a villager headed the same way. Then they walked beside the stranger, holding the lantern high, lighting the other's path before their own. When Daiki asked why, Master Hana handed him a lantern: 'When you hold the lantern for another, whose path is lit?' Daiki looked at the light spilling across the stones. 'Both of ours, Master. And the light spreads wider when I hold it higher for someone else.'",
        "'You have just seen the secret,' the master said. 'The lantern bearer never walks in darkness. Help another traveler first — especially on the nights you feel most lost — and you will find your own path lit in ways you cannot explain to those who have never tried it.' Years later Daiki handed his own student a lantern and asked the same question. That is the Master's Edge: the strongest hand is the one holding the light for someone else — and standing in the brightest part of the road because of it.",
      ],
    },
    {
      heading: "The Framework: Help First",
      paragraphs: [
        "The rule in full: when you're in a difficult situation and you notice someone else is too — help first. It's completely counterintuitive, and that's the point. In trouble, every instinct narrows you toward yourself: my deadline, my stress, my drowning. But a home or workplace where everyone waits for help is a tug-of-war — both sides pulling, both wondering why the other won't budge. The person who helps first switches sides of the rope. Suddenly you're on the same team, the other person feels understood, and they're far more likely to reciprocate — usually right when you need it most.",
        "I teach it with two mornings. Same overwhelmed father, same chaotic kids, same wife at her limit. Morning one, he slips past like Tom Cruise in Mission Impossible — and the day ends in tears and days of damage. Morning two, he says two words — help first — and becomes a first responder: separates the kids, hugs his wife, asks what he can do. Her mood lifts everyone's, and when he sits down to work she's his biggest supporter. Same chaos; the only variable was which direction he pointed his lantern first. Help first doesn't mean help only — the lantern bearer still walks home.",
      ],
      bullets: [
        "Trouble is the signal to help, not the excuse to hide",
        "Helping first switches you to the same side of the rope",
        "Give with boundaries — help first, not help only",
      ],
    },
    {
      heading: "Practice: Handing Out Lanterns",
      paragraphs: [
        "When the 2010 earthquake leveled Port-au-Prince, chef Jos\u00e9 Andr\u00e9s flew in and did the only thing he knew: he started cooking. Out of it came World Central Kitchen, built on a dojo-simple idea: when people are drowning, don't assess, don't committee — show up and feed them first. Millions of meals later, he became one of the world's most trusted humanitarian voices. And Help First is the quiet engine of my business life too: networking doesn't work — helping works. Walk into every room asking who needs a lantern, and within a year you'll be the person everyone wants to walk beside.",
        "This week: install the Two-Word Reset — when you're overwhelmed AND notice someone else struggling, say 'help first' before doing anything, then take one action; the phrase flips the first-responder switch. Run a Lift Inventory: write down three people whose help got you somewhere you couldn't have gone alone, and message one of them. Do one deliberate no-ledger act of help daily. Find your stuck tug-of-war — you already know which relationship — and switch sides with one genuine, no-strings act. Leaders: open one meeting with 'Who's drowning, and who can help?' Then go first.",
      ],
      bullets: [
        "Two-Word Reset: say 'help first,' then take one action",
        "One no-ledger act of help per day",
        "Audit your stuck tug-of-war and switch sides first",
      ],
    },
  ],
  quiz: [
    {
      question: "Why did Master Hana's senior students wait at the gate each night?",
      options: [
        "To walk beside villagers, lighting the stranger's path before their own",
        "To guard the dojo against intruders after dark",
        "To earn rank promotions through visible service",
        "Because Master Hana required it as discipline training",
      ],
      correctIndex: 0,
      explanation: "The waiting wasn't duty or display — it was wisdom. The lantern held high for another lights both paths, and spreads wider. The lantern bearer never walks in darkness.",
    },
    {
      question: "When does the Help First rule matter most?",
      options: [
        "When you have spare time and energy to give",
        "Precisely when you're the one drowning — trouble is the signal, not the excuse",
        "Only in professional settings where reciprocity is likely",
        "After your own tasks are safely finished",
      ],
      correctIndex: 1,
      explanation: "The moment the rule matters most is exactly the moment every instinct votes against it. The mornings you most want to hide in the bathroom are the mornings the rule pays most.",
    },
    {
      question: "In the two-mornings story, what was the only variable that changed?",
      options: [
        "The father's schedule was lighter the second morning",
        "The kids were calmer the second time",
        "His wife asked directly for help",
        "Which direction he pointed his lantern first",
      ],
      correctIndex: 3,
      explanation: "Same chaos, same behind-schedule man. Two words — help first — flipped the first-responder switch, and the ending rewrote itself: his wife gained strength, her mood lifted everyone's, and he ended the day supported instead of buried.",
    },
    {
      question: "What caveat does the givers-and-takers research add to Help First?",
      options: [
        "Givers should always help anonymously",
        "Takers ultimately outperform givers in competitive fields",
        "The least successful people are also givers — the ones with no boundaries",
        "Generosity only pays off inside close-knit teams",
      ],
      correctIndex: 2,
      explanation: "The most successful people long-term are disproportionately givers — but so are the least successful: those who help with no boundaries. Help first doesn't mean help only; the lantern bearer still walks home.",
    },
    {
      question: "What made José Andrés's response in Haiti a Help First example?",
      options: [
        "He donated money from his restaurant empire",
        "With his own empire bearing down, he showed up and fed people first — no assessing, no committees",
        "He waited for governments to coordinate, then assisted",
        "He publicized the disaster through his television fame",
      ],
      correctIndex: 1,
      explanation: "Andrés had every reason to point the lantern inward — his own kitchens, his own full schedule. He cooked in the mud instead. World Central Kitchen was built on the dojo-simple idea: when people are drowning, show up and feed them first.",
    },
  ],
},
{
  slug: "trust-trinity",
  order: 39,
  title: "The Trust Trinity",
  tagline: "The Master's Edge Book",
  description: "Every owner has a trust problem — in themselves, their systems, or their people. Learn the three-legged framework that turns eighty-hour weeks into a business that compounds.",
  videoUrl: PLACEHOLDER_VIDEO(39),
  pdfs: [],
  images: [],
  keyPoints: [
    "Doubt is a skill-capper — capability can't flow past broken trust.",
    "The trinity is a stool: trust yourself, trust the system, trust your people.",
    "Each trust has its own build; diagnose the short leg — they don't fix each other.",
    "Trust the process especially at the plateau — the river shapes over generations.",
    "Delegation isn't a task-transfer, it's a trust-transfer.",
  ],
  lesson: [
    {
      heading: "Kenji on the Rock",
      paragraphs: [
        "In Master Sora's mountain dojo trained a young warrior named Kenji — strong, skilled, and stuck. He questioned his abilities, his training methods, and his fellow warriors: all three trusts down at once. So Master Sora took him to a river and had him step onto a rock midstream — afraid, before any lecture — and named the Trust Trinity. First, trust yourself: you are capable of more than you know. Second, trust the system: the training methods, like the river, have been refined over generations. Third, trust your teammates and coaches, who walk the path beside you.",
        "Kenji realized his doubts were the only opponent that ever really had him beaten. He trained on with newfound confidence and became celebrated not just for skill, but for unwavering trust. Notice the order of the lesson: the rock came before the lecture. Trust is built by doing the scary thing with support — never by being talked into it. Your business runs on the same stool. Count your legs.",
      ],
    },
    {
      heading: "The Three Legs — and the Proof From Space",
      paragraphs: [
        "The trinity builds in order. Trust yourself: confidence built on evidence — your track record, your ledger, your reps — because the other two trusts are decisions, and a person who doesn't trust themselves can't hold a decision. Trust the system: letting your processes work through setbacks; a system you override on every exception is a system you don't have. Trust your people: the one that scales. When Google studied hundreds of its own teams, the number one factor in the best ones wasn't talent — it was psychological safety. Same trinity, measured in spreadsheets.",
        "Apollo 13 ran the trinity at full load. Self-trust: three drilled astronauts flew a crippled ship manually with zero margin for panic. System-trust: nobody improvised from scratch — they fell back on procedures, checklists, and simulations, adapting the system but trusting its bones. People-trust: the crew bet their lives, hour after hour, on calculations done by strangers in Houston. Three days later the parachutes opened. Your worst quarter is not two hundred thousand miles from Earth — the trinity that brought them home will hold your business.",
      ],
    },
    {
      heading: "Find Your Short Leg",
      paragraphs: [
        "Each missing leg produces its own signature limp. Missing self-trust looks like second-guessing every decision. Missing system-trust looks like chaos worshipped as flexibility — nothing documented, everything living in your head. Missing people-trust is the expensive one: the eighty-hour weeks, the bottleneck at your desk. \"Nobody does it like I do\" — true, and if it stays true, you own a job, not a business. When a client tells me \"I can't delegate,\" I run the trinity diagnostic — and usually it's not the people at all. Build the missing leg and the \"people problem\" dissolves.",
        "This week, run the drills. The Trinity Audit: three columns — Myself, My Systems, My People — honest trust level and one piece of evidence under each; the shortest column is your next ninety days. The Form Practice: run one documented process for thirty days exactly as written, no overrides. The Partner Drill: hand off one meaningful task with a documented process and a feedback loop — then don't touch it. And the Rock Step: name the decision you've been circling and take the smallest step onto it. Trust is built mid-step, never before it.",
      ],
      bullets: [
        "Trinity Audit: find your shortest column — that's your next ninety days.",
        "Run one process thirty days with zero overrides.",
        "Hand off one task with a process and feedback loop — the drill is for you.",
        "Take the smallest step onto the thing you've been circling.",
      ],
    },
  ],
  quiz: [
    {
      question: "In the parable, what was Kenji's actual problem?",
      options: [
        "He lacked the physical skill of his fellow warriors",
        "His training methods were genuinely flawed",
        "Broken trust — in himself, the system, and his teammates",
        "He trained too hard and burned out",
      ],
      correctIndex: 2,
      explanation: "Kenji was strong and skilled — and stuck. All three trusts were down at once. Capability can't flow past broken trust; fix the trust and the skill you already have gets released.",
    },
    {
      question: "Why does self-trust come first in the Trust Trinity system?",
      options: [
        "The other two trusts are decisions, and you can't hold a decision without it",
        "It's the easiest of the three to build",
        "Systems and people can't be trusted until they're proven",
        "Confidence attracts better employees",
      ],
      correctIndex: 0,
      explanation: "Trusting the system and trusting people are choices you make. A person who doesn't trust themselves can't hold a decision — so self-trust, built on evidence, is the foundation.",
    },
    {
      question: "What did Google's study of its own teams find was the number one factor in the best ones?",
      options: [
        "Individual talent and seniority",
        "Balanced workload across the team",
        "Clear performance metrics",
        "Psychological safety",
      ],
      correctIndex: 3,
      explanation: "The top factor wasn't talent, seniority, or workload — it was psychological safety: shared confidence that the team can be trusted with your honest effort and honest mistakes. The people-trust leg, measured in spreadsheets.",
    },
    {
      question: "Brett says a system you override on every exception is…",
      options: [
        "A flexible system that adapts to reality",
        "A system you don't have",
        "A sign your people need more training",
        "Proof the system needs a rewrite",
      ],
      correctIndex: 1,
      explanation: "System-trust means letting the process work through setbacks instead of abandoning it at the first bad week. Constant overrides mean nobody follows the system — so effectively there isn't one.",
    },
    {
      question: "When an owner says \"I can't delegate — nobody does it right,\" what does the trinity diagnostic usually reveal?",
      options: [
        "The people really are the problem and need replacing",
        "The owner should hire more experienced staff",
        "A missing system or missing self-trust — not a people problem",
        "The tasks simply can't be delegated",
      ],
      correctIndex: 2,
      explanation: "Usually there's no documented way to do it \"right\" (missing system) or the owner's identity is being the only one who can (missing self-trust). Build the missing leg and the \"people problem\" dissolves. Delegation is a trust-transfer.",
    },
  ],
},
{
  slug: "masters-state",
  order: 40,
  title: "The Master's State: Engineering Flow",
  tagline: "The Master's Edge Book",
  description: "Flow isn't a gift that descends on the worthy — it's a state with conditions, and the conditions can be engineered. Learn to oil the hinges so the door stands open when you arrive.",
  videoUrl: PLACEHOLDER_VIDEO(40),
  pdfs: [],
  images: [],
  keyPoints: [
    "The masters don't move faster — they arrive fully; speed is a byproduct of undivided presence.",
    "The door has hinges: flow has conditions, and conditions can be engineered.",
    "The edge is the doorway — calibrate challenges slightly past your skill.",
    "The four pillars are the load-bearing infrastructure of every peak state.",
    "Chasing flow closes the door; building a life where it lives opens it.",
  ],
  lesson: [
    {
      heading: "The Master Who Slowed Time",
      paragraphs: [
        "In a harbor town lived Master Ito, famous for one strange fact: no one had ever seen him hurry. Young Kazuo watched him spar four attackers at a festival — silver-haired, unhurried, untouched, arriving at each moment slightly before it happened. \"How did you move so fast?\" Kazuo asked. \"I have never moved fast in my life,\" said Ito. \"Their minds were in four places. Mine was in one. When the whole of you arrives in a single moment, the moment opens — wide and slow, like a door swinging open. Inside that door, there is no hurry.\"",
        "Kazuo trained for years chasing the door, then begged for the secret technique. \"There is no technique,\" Ito said. \"The door has hinges, and the hinges can be oiled. Sleep like it matters. Train at the edge of what you can do. Give each practice one clear task. Do these things every day, and the door will be standing open when you get there.\" That answer refuses the mystique — and it's the whole difference between engineering flow and every airport book about \"getting in the zone.\" Hope is not a system.",
      ],
    },
    {
      heading: "Oiling the Hinges",
      paragraphs: [
        "You already know flow — you've entered it by accident your whole life: the day before vacation, the conversation that felt like five minutes, the stadium singing as one. This chapter is about doing it on purpose. Hinge 1 is the Four Pillars — nutrition and hydration, sleep, exercise, socialization/mindfulness. You train sleep the way you train a kick; a sleep-starved brain doesn't enter flow, it enters survival. Hinge 2 is Csikszentmihalyi's challenge/skills balance: a challenge slightly beyond your skill. Too easy and the mind wanders; too hard and fear drags it out.",
        "Hinge 3: one clear task with immediate feedback — \"work on the business\" never produced flow; \"draft the pricing section before 11\" opens the door. Hinge 4: your Impact Zones — the ultradian windows when you're naturally most focused; guard the majors for your 5% work. Hinge 5: the recovery cycle — flow works like lifting weights; skip recovery and you get less flow, then none. I proved this in my own lab: sixteen martial artists, three months, a rubber knife, deliberately induced flow. Learning that tradition schedules across months became functional in hours — with retention bundled in.",
      ],
      bullets: [
        "Hinge 1: Four Pillars — nutrition/hydration, sleep, exercise, socialization/mindfulness.",
        "Hinge 2: challenge/skills balance — train at the edge.",
        "Hinge 3: one clear task, immediate feedback.",
        "Hinge 4: Impact Zones — schedule with your biology, not against it.",
        "Hinge 5: recovery — flow is earned in the off-hours.",
      ],
    },
    {
      heading: "Your First Flow Assignment",
      paragraphs: [
        "The first assignment I give every coaching client: for five workdays, keep an energy log — one line per hour, focus rated one to five. By Friday your Impact Zones sit right there in the data, usually two majors. Then we perform surgery on the calendar: the zones get strategy, sales, and creation; meetings, email, and errands get exiled to the valleys. No new skills, nothing purchased — clients routinely call it the highest-leverage change of the whole engagement. The same person, re-scheduled onto their own biology, does more by Wednesday than the old calendar allowed all week.",
        "Then clear the blockers, in order. Sleep first — a person who isn't sleeping isn't flowing. Then the phone: out of reach during your zones, stripped of every badge and buzzer. Then rhythm: key into your ultradian cycles so your biology is an ally, not an ambush. Notice that none of these require talent. They require decisions. Run the Pillar Audit — rate each pillar one to five and improve only the lowest for two weeks — and the Edge Calibration: is your biggest project boring you or scaring you into avoidance? Adjust one variable until it sits just past your skill, and feel the pull.",
      ],
    },
  ],
  quiz: [
    {
      question: "What did Master Ito mean by \"I have never moved fast in my life\"?",
      options: [
        "He was being modest about decades of speed training",
        "His attackers were unskilled, so he didn't need speed",
        "He used deception to appear slower than he was",
        "Undivided presence opens the moment — speed is a byproduct of arriving fully",
      ],
      correctIndex: 3,
      explanation: "His opponents' minds were in four places; his was in one. When the whole of you arrives in a single moment, the moment opens wide and slow. The masters don't move faster than life — they build a life where the moment opens.",
    },
    {
      question: "According to the challenge/skills balance, where does flow live?",
      options: [
        "In a challenge slightly beyond your current skill",
        "In tasks you've fully mastered, where confidence is highest",
        "In the hardest challenge you can find — pressure creates focus",
        "In alternating easy and hard tasks throughout the day",
      ],
      correctIndex: 0,
      explanation: "Csikszentmihalyi's sweet spot: slightly beyond current skill. Too easy and the mind wanders out of the moment; too hard and fear drags it out. Calibrate the edge and recalibrate as you grow.",
    },
    {
      question: "What are Impact Zones?",
      options: [
        "The moments of highest pressure in a negotiation",
        "Your natural ultradian windows of peak focus, usually two to four hours",
        "The first and last hours of every workday",
        "Deep-work blocks you schedule at random to stay flexible",
      ],
      correctIndex: 1,
      explanation: "Impact Zones are the windows when you're naturally most focused — scientists call them ultradian rhythms. Map majors and minors, guard the majors for your 5% work, and give the valleys your administrivia.",
    },
    {
      question: "What did Brett's rubber-knife experiment show about deliberately induced flow?",
      options: [
        "Only young, experienced students benefited from it",
        "It worked, but skills faded before the next session",
        "Learning accelerated across age and experience, with retention bundled in — but flow is an accelerant, not a magic wand",
        "Three hours was enough to master all four common knife attacks",
      ],
      correctIndex: 2,
      explanation: "Time dilation was near-universal, learning rate barely varied by age or experience, and skills held at the next session. The honest note: three hours covered two of four attacks — flow compresses tuition; it doesn't waive it.",
    },
    {
      question: "Which blocker does Brett screen for first with every client?",
      options: [
        "Phone notifications",
        "Sleep",
        "Poorly defined goals",
        "A misaligned calendar",
      ],
      correctIndex: 1,
      explanation: "Sleep comes first — a person who isn't sleeping isn't flowing, full stop. Then the phone, then rhythm. None of these require talent; they require decisions.",
    },
  ],
},
{
  slug: "unseen-belt",
  order: 41,
  title: "The Unseen Belt: Strong Ethical Character",
  tagline: "The Master's Edge Book",
  description: "What does your company do when you're not in the room? That answer IS your business. Character isn't installed by inspiration — it's installed by repetition, exactly like a kick.",
  videoUrl: PLACEHOLDER_VIDEO(41),
  pdfs: [],
  images: [],
  keyPoints: [
    "True character is what you do when no one is watching.",
    "Doing the right thing builds an inner strength that compounds like a ledger.",
    "Integrity is a daily practice — small right decisions, made until they make you.",
    "People follow who you are before they follow what you say.",
    "Your greatest rank is the one in your heart.",
  ],
  lesson: [
    {
      heading: "Kaito and the Clear Belt",
      paragraphs: [
        "At Integrity Dojo, Master Daigo cared more about character than medals. His student Kaito was fast, strong, and hungry to win — but when no one was watching, he cut corners: skipped the bow, ignored struggling classmates, even took credit for someone else's move. So Master Daigo handed out a strange new belt — clear, almost invisible. \"This is the Unseen Belt — the one that shows up in how you act when no one's watching, how you treat people who can't help you, and how honest you are with yourself.\"",
        "The dojo ran a thirty-day Character Challenge: daily points not for kicks, but for helping without being asked, owning mistakes honestly, showing respect in frustration, keeping small promises, returning what wasn't yours. Kaito struggled — he'd been best at techniques, not at being trustworthy. Then something shifted: he stayed late with a shy beginner, stood up for a teased classmate, and felt a quiet pride that came not from applause but from doing what was right. \"This one,\" Daigo said, hand over his heart, \"doesn't fade, can't be taken, and is what real mastery is made of.\"",
      ],
    },
    {
      heading: "Character Is a System, Not a Sermon",
      paragraphs: [
        "Kaito didn't have a mindset problem — he had a systems problem. Master Daigo didn't lecture him into integrity; he built a system — thirty days, daily points, observable behaviors — and let the system train the character. Character is installed by repetition, exactly like a kick. In business, character is the system that governs all your other systems: every process has a moment where the procedure meets a temptation. What decides it isn't the flowchart — it's the unseen belt of the person executing it, starting with yours; a team's character converges toward the owner's at cruising speed.",
        "The Character Challenge runs on three rules. One: make it behavioral, not aspirational — \"be more honest\" trains nothing; \"own one mistake out loud this week\" trains character the way reps train a punch. Two: track it like revenue — the measurement isn't the reward, it's the attention; what you track, you become conscious of, and conscious choosing hardens into excellence as habit. Character is consistency applied to values. Three: aim for the quiet pride — internal, un-stealable, compounding. When your people work for that currency, no competitor can poach your culture.",
      ],
    },
    {
      heading: "The Integrity Invoice — Decide Before It Arrives",
      paragraphs: [
        "In 1982, someone laced Tylenol capsules with cyanide, and seven people died. The contamination was local to Chicago; Johnson & Johnson was legally a victim; advisors called a national recall unnecessary. CEO James Burke pulled every bottle in America anyway — thirty-one million bottles, nine figures burned. His explanation: the company credo put customers first, and it wasn't decoration — it was the operating system. The decision had been made years before the crisis, when the company decided what it was. Tylenol returned in tamper-proof packaging and won back its market within a year.",
        "Your version will be smaller and it will still cost something — the refund nobody would catch, the disclosure, the promise the market shift made expensive. I call these integrity invoices, and I teach owners to decide them BEFORE they arrive: a one-page \"we always / we never\" list, written in calm times, posted where the team can see it. Owners who write the list make Burke decisions in minutes; owners who don't negotiate with themselves in the dark — and the dark usually wins.",
      ],
      bullets: [
        "Invisible Acts Challenge: one unposted act of kindness or honesty this week.",
        "Right-Thing Rehearsals: write your three likeliest integrity invoices and decide them now, in calm.",
        "The 3 Daily Do Rights: small character habits, done daily, tracked.",
        "Heart Belt Reflection: weekly — \"What kind of person am I becoming?\"",
      ],
    },
  ],
  quiz: [
    {
      question: "What is the Unseen Belt?",
      options: [
        "The character shown when no one is watching — how you treat people who can't help you, and how honest you are with yourself",
        "A secret rank awarded only to instructors",
        "The reputation you build over years of visible wins",
        "The humility to hide your accomplishments from others",
      ],
      correctIndex: 0,
      explanation: "Master Daigo's clear belt lives over the heart, not around the waist. Reputation is what your business does while being watched — and being watched is a part-time condition. Character is what you really are.",
    },
    {
      question: "Why does Brett say Kaito had a systems problem, not a mindset problem?",
      options: [
        "Kaito's dojo lacked proper rules and supervision",
        "Character was installed by a repeatable system — thirty days of tracked, observable behaviors — not by a lecture",
        "Kaito's techniques were poorly systematized",
        "Mindset problems can't actually be fixed",
      ],
      correctIndex: 1,
      explanation: "Master Daigo didn't lecture Kaito into integrity. He built a system — daily points for specific behaviors — and let the system train the character. Character is installed by repetition, exactly like a kick.",
    },
    {
      question: "What made James Burke's Tylenol recall remarkable?",
      options: [
        "It was legally required and he executed it flawlessly",
        "It cost nothing because insurance covered the losses",
        "The government forced it, but Burke took the credit",
        "Nobody required it — the credo decided it years before the crisis, when the company decided what it was",
      ],
      correctIndex: 3,
      explanation: "The contamination was local and the company was legally a victim, yet Burke pulled thirty-one million bottles at nine-figure cost. The credo was the operating system, not decoration — the unseen belt worn at corporate scale.",
    },
    {
      question: "What is an \"integrity invoice\"?",
      options: [
        "A fine issued for ethics violations",
        "The annual cost of a compliance program",
        "A moment where doing the right thing has a visible price tag",
        "A bill you send clients for extra honest work",
      ],
      correctIndex: 2,
      explanation: "The refund nobody would catch, the mis-quote in the client's favor, the star who hits numbers by cutting corners. Decide these BEFORE they arrive with a \"we always / we never\" list — the crisis is the worst time to discover your values.",
    },
    {
      question: "Which practice makes character behavioral rather than aspirational?",
      options: [
        "Resolving to \"be more honest\" this quarter",
        "Owning one mistake out loud this week and tracking it",
        "Reading a book on ethics every month",
        "Posting your values statement on the wall",
      ],
      correctIndex: 1,
      explanation: "\"Be more honest\" trains nothing. Specific, observable, repeated behaviors — own an error, keep a small promise, help unasked — train character the way reps train a punch.",
    },
  ],
},
{
  slug: "six-pillars",
  order: 42,
  title: "The Six Pillars: Building Systems That Teach",
  tagline: "The Master's Edge Book",
  description: "Every craft has a final test, and it's never performance — it's transmission. Six pillars turn \"I know how\" into \"now they know how,\" and build a business that teaches even when you're gone.",
  videoUrl: PLACEHOLDER_VIDEO(42),
  pdfs: [],
  images: [],
  keyPoints: [
    "Skill that lives only in your body dies with your body.",
    "The system is the senior student — teaching continues whether you're present or not.",
    "Every lesson should rehearse your absence — the Learning Circle closes with the teacher silent.",
    "Hard fun is the standard: challenged AND engaged, or the design is wrong.",
    "The greatest students build builders.",
  ],
  lesson: [
    {
      heading: "The Empty Dojo",
      paragraphs: [
        "When Emi earned her final rank, she asked Master Rokuro, \"I can defeat every student in this hall. Is that mastery?\" \"No,\" he said, and walked her a full day to a small dojo in a neighboring town. Through the doorway she watched a class in full motion — seniors correcting juniors, a young woman leading forms, the curriculum painted in stages on the wall so every student could see the whole mountain and their place on it. \"Their teacher is skilled,\" Emi said. \"Which one is he?\" \"He is not here,\" said Rokuro. \"He has been away for a month.\"",
        "\"Anyone can build skill that lives in their body, Emi. It dies with the body. A master builds skill that lives in a system — in the ordering of the lessons, in the eyes of the seniors, in the walls themselves. When you can be absent and your teaching remains present, then you may call yourself a master.\" Now run the test on your business: if you stepped away for a month tomorrow, would the visitor see systems running and seniors teaching juniors — or drift, bottleneck, and forty texts a day to the absent master? If your presence is the system, you don't have a system. You ARE the system.",
      ],
    },
    {
      heading: "The Six Pillars of Effective Training",
      paragraphs: [
        "Whether you're building an onboarding, a team skills program, or a client curriculum, the same six pillars hold the roof. Pillar 1: Structured Planning & Design — map the journey from where they are to where they need to be. Pillar 2: Defined Objectives & Goals — what will they be able to DO after this that they couldn't before? \"Understand leadership\" trains nothing. Pillar 3: Structured Content Modules — discrete, digestible units, each with one clear purpose. Pillar 4: Actionable & Relevant Content — \"hard fun,\" the challenge/skills balance from the flow chapter applied to teaching.",
        "Pillar 5: Assessment & Measurement — not a quiz at the end but a system for knowing whether behavior actually changed; what you refuse to measure, you've agreed not to know. Pillar 6: Feedback Loops — collect input from learners, teachers, and results every cycle and fold it back into the design. Beneath all six runs the Learning Circle: create a vision, do it WITH the students, tell them how, then step back and let the team perform without the instructor. Look at that last step — every single lesson is a small rehearsal of the empty dojo.",
      ],
      bullets: [
        "Pillar 1: Structured Planning & Design",
        "Pillar 2: Defined Objectives & Goals",
        "Pillar 3: Structured Content Modules",
        "Pillar 4: Actionable & Relevant Content — hard fun",
        "Pillar 5: Assessment & Measurement",
        "Pillar 6: Feedback Loops",
      ],
    },
    {
      heading: "Build the Room That Teaches",
      paragraphs: [
        "My academy has survived every storm in this book because it was built on these pillars. The curriculum climbs its wall in painted stages; the seniors teach the juniors; the Lantern Bearers are the living Pillar 6. When a client tells me \"training doesn't stick with my team,\" the same two pillars are almost always missing: Pillar 5 — nothing was measured, so nothing was expected — and Pillar 6 — the program never improved because nobody asked it to. We rebuild their onboarding as a belt system, and people who can SEE the mountain and their place on it climb differently.",
        "Start this week. The Empty Room Test: write what would actually happen during a one-month absence, area by area — every \"it would stall\" is your systems to-do list, pre-prioritized. The Belt Map: pick one role and map its visible stages from novice to mastery, with objectives at each stage. The Learning Circle Rep: take one task you always do yourself — create the vision, do it WITH your person, tell them how, then step back and resist the touch-up. The silence is the lesson. A master's job is to make himself progressively unnecessary, one system at a time.",
      ],
    },
  ],
  quiz: [
    {
      question: "What did Master Rokuro show Emi as the true test of mastery?",
      options: [
        "A tournament where his students won every division",
        "A dojo that ran and taught perfectly while its master had been absent for a month",
        "A library of scrolls documenting every technique",
        "A duel that proved technique beats strength",
      ],
      correctIndex: 1,
      explanation: "The dojo was empty of its master and completely full of his teaching — seniors teaching juniors, the curriculum painted on the wall. Skill that lives only in your body dies with your body; mastery is what remains when you leave the room.",
    },
    {
      question: "Which pillar does the objective \"resolve a tier-one complaint in under ten minutes using our process\" exemplify?",
      options: [
        "Pillar 2: Defined Objectives & Goals — something you can watch happen",
        "Pillar 4: Actionable & Relevant Content",
        "Pillar 6: Feedback Loops",
        "Pillar 1: Structured Planning & Design",
      ],
      correctIndex: 0,
      explanation: "Pillar 2 asks: what will they be able to DO after this that they couldn't before? \"Understand leadership\" trains nothing — a defined, observable behavior trains something you can watch happen.",
    },
    {
      question: "What is \"hard fun\"?",
      options: [
        "Training so difficult that only the committed survive it",
        "Gamifying lessons with points and prizes",
        "Team-building activities scheduled after real training",
        "Content challenging enough to demand growth and relevant enough to use this week — the challenge/skills balance applied to teaching",
      ],
      correctIndex: 3,
      explanation: "Hard fun puts the learner in the same flow state the Master Who Slowed Time lived in. Boring training isn't just wasteful — it's flow-proof. If people aren't challenged AND engaged, the design is wrong, not the people.",
    },
    {
      question: "How does the Learning Circle end — and why does that matter?",
      options: [
        "With a written test that certifies the student",
        "With the teacher demonstrating the perfect version one last time",
        "With the team performing without the instructor — a small rehearsal of the empty dojo",
        "With a group discussion of what was learned",
      ],
      correctIndex: 2,
      explanation: "Create a vision, do it WITH the students, tell them how, then step back. The Circle ends with the teacher deliberately unnecessary — every lesson rehearses your absence.",
    },
    {
      question: "When training \"doesn't stick,\" which two pillars are almost always missing?",
      options: [
        "Pillars 1 and 2 — no plan and no objectives",
        "Pillars 5 and 6 — nothing measured, and no feedback loop to improve the program",
        "Pillars 3 and 4 — content too long and too dull",
        "Pillars 2 and 3 — vague goals and unstructured modules",
      ],
      correctIndex: 1,
      explanation: "Nothing was measured, so nothing was expected (Pillar 5), and the program never improved because nobody asked it to (Pillar 6). Rebuild as a belt system: visible stages, real tests, and a debrief after every cohort.",
    },
  ],
},

  //============================================================================
  // THE MASTER'S EDGE FRAMEWORK — module 43, the free giveaway course
  // (from Appendix A of the book: the framework with the stories removed)
  //============================================================================
  {
    slug: "masters-edge-framework",
    order: 43,
    title: "The Master's Edge Framework",
    tagline: "Free Course",
    audio: [
      {
        label: "Deep Dive: The Master's Edge for Peak Performance (NotebookLM audio overview)",
        href: "/academy/masters-edge-framework/deep-dive.m4a",
      },
    ],
    videoFiles: [
      {
        label: "Engineering Human Performance: The Master's Edge Stack (NotebookLM video overview)",
        href: "/academy/masters-edge-framework/video-overview.mp4",
      },
    ],
    description:
      "The complete Master's Edge system in one sitting — the map of the room. Three pillars, three sciences, six pillars of training design, five failure modes, and the scorecard. Then prove you own it: a 26-question scenario exam.",
    videoUrl: PLACEHOLDER_VIDEO(43),
    pdfs: [],
    images: [],
    keyPoints: [
      "Training should transform, not inform — the only measure is whether behavior changed.",
      "Three pillars: Mindset Mastery (steel), Skillset Enhancement (geometry), Systems Design (daily stone).",
      "Three sciences underneath: Frontloading, First Principles, Flow.",
      "The layers stack: science → capability → delivery. Skip a layer and the system breaks.",
      "Six pillars of training design, five ways programs fail, one scorecard to rate yourself.",
    ],
    lesson: [
      {
        heading: "The Map of the Room",
        paragraphs: [
          "The chapters of The Master's Edge walk you around the room the way Master Na walked Brett — sign by sign, story by story. This framework is something different: the system with the stories removed, gathered in one place so you can find any piece of it in thirty seconds, years later. It's what Brett hands clients on day one.",
          "The whole system rests on one principle: peak performance — in business, teams, and life — comes from mastering three interconnected elements. And underneath everything runs one philosophy, the test for every tool Brett builds: training should transform, not inform. The only measure that finally matters is whether it changed what people do.",
        ],
      },
      {
        heading: "The Three Pillars of Capability",
        paragraphs: [
          "Mindset Mastery is the steel — the mental frameworks, growth orientation, and resilience that let you perform under any conditions: focus, energy, and the confidence to take decisive action. Brittle steel fails no matter how finely you grind it.",
          "Skillset Enhancement is the geometry — practical capabilities that drive results: leadership, communication, goals, consistency, trust. Skills are never taught in isolation; they layer and connect to create compound growth. Systems Design is the daily stone — deliberately designing the environment, habits, structures, and relationships that sustain performance over time. Optimizers tune what exists; masters design what should exist. Without the right systems, even the strongest mindset and sharpest skills eventually erode.",
        ],
      },
      {
        heading: "The Scientific Foundation: Frontloading",
        paragraphs: [
          "Frontloading means equipping people BEFORE they face the challenge — not while they're scrambling to survive it. Load the critical knowledge, context, and preparation in first; the challenge comes second. From educational research to Toyota's development process, the finding repeats: prepared people dramatically outperform people expected to learn on the fly.",
          "Why it works: it reduces cognitive overload (learning first means every resource goes to execution when it counts), it builds confidence before pressure arrives (people freeze when they feel unprepared), and it eliminates expensive downstream problems (problems solved early cost a fraction of problems discovered late). A martial arts student drills techniques hundreds of times before belt-test pressure arrives. A business owner practices the negotiation framework before the hard negotiation — not during it.",
        ],
      },
      {
        heading: "First Principles and Flow",
        paragraphs: [
          "First Principles Thinking — as old as Aristotle — refuses to reason by analogy ('everyone does it this way, so we should too'). It breaks a problem down to its most fundamental, indisputable truths, then rebuilds from that bedrock. It solves the RIGHT problems (the owner who 'needs more marketing' may actually have a product that doesn't solve a compelling problem), eliminates inherited limitations ('how we've always done it' builds invisible ceilings), and creates truly custom solutions — no two toolkits look alike. It's the martial arts method itself: master stance, balance, rotation, follow-through, and the complex technique assembles naturally.",
          "Flow — identified by Mihaly Csikszentmihalyi — is the state of optimal performance: so absorbed in a challenging activity that time dissolves and performance peaks. It is not luck; it's reproducible, with one core condition: a precise balance between challenge and skill. Too little challenge produces boredom; too much produces anxiety. Matched at a high level — with clear goals and immediate feedback — the brain floods with performance-enhancing neurochemistry. Flow shows up more at WORK than at leisure; training that doesn't help people access it leaves their best work on the table.",
        ],
      },
      {
        heading: "The Layered System and the Six Pillars",
        paragraphs: [
          "The framework stacks, bottom to top: the Scientific Foundation (Frontloading, First Principles, Flow) informs the Capability Builder (Mindset, Skillset, Systems), which fuels the Delivery System — the six pillars of training design. Every layer depends on the ones below it. Skip a layer and the system breaks.",
          "The six pillars: (1) Structured Planning & Design — map the whole journey before teaching a single lesson; proven architecture creates MORE flexibility, not less. (2) Defined Objectives — finish the sentence 'after this training, participants will be able to…' with a specific, observable action. (3) Structured Content Modules — sequenced, digestible units, each with a mini-objective and a bridge to the next. (4) Actionable & Relevant Content — 'hard fun' that passes the Monday morning test: usable today, in their actual role. (5) Assessment & Measurement — belt-testing philosophy: measure behavior change under pressure, not satisfaction. (6) Feedback Loops — collect input, act on it VISIBLY, collect again.",
        ],
      },
      {
        heading: "Five Failures and the Scorecard",
        paragraphs: [
          "The six pillars exist because five failures are everywhere: treating training as an event instead of a system (events create awareness; systems create change), measuring satisfaction instead of behavior change (a five-star evaluation tells you nothing), delivering generic content to a specific audience, skipping the foundation to look advanced (the spinning kick before the front kick — impressive, and it collapses under pressure), and never closing the feedback loop — which is worse than not asking, because it teaches people their input doesn't matter.",
          "Rate yourself on each pillar, 1 to 5. 25–30: optimized — keep refining. 18–24: solid — your two lowest scores are your next moves. 10–17: significant gaps — strengthen Planning and Objectives first; the rest can't deliver without them. Below 10: rebuild — you're training by instinct rather than design. And under any score, three deeper questions: Am I frontloading the right preparation? Am I solving first-principles problems or surface symptoms? Am I creating the conditions for flow? The ultimate test never changes: did it change what people DO?",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the single philosophy underneath the entire Master's Edge framework?",
        options: [
          "Work harder than your competition",
          "Training should transform, not inform — the only measure is whether it changed what people do",
          "Knowledge is power",
          "Customers come first"
        ],
        correctIndex: 1,
        explanation:
          "Every tool Brett builds is tested against one question: did it change behavior? Not what people know, not what they enjoyed — what they actually do differently.",
      },
      {
        question: "Match the metaphor: in the three-pillar model, what are the steel, the geometry, and the daily stone?",
        options: [
          "Vision, mission, values",
          "Planning, execution, review",
          "Mindset Mastery (steel), Skillset Enhancement (geometry), Systems Design (daily stone)",
          "Frontloading (steel), First Principles (geometry), Flow (daily stone)"
        ],
        correctIndex: 2,
        explanation:
          "The blade metaphor from chapter one maps the capability model: what the blade is made of, the shape of its cut, and the maintenance that keeps it sharp.",
      },
      {
        question: "A business owner with strong skills and a resilient mindset still burns out and backslides within a year. Which pillar did they most likely neglect?",
        options: [
          "Systems Design — without the right environment and habits, even the strongest mindset and sharpest skills erode",
          "None — burnout is unavoidable",
          "Mindset Mastery — they need more resilience",
          "Skillset Enhancement — they need more training"
        ],
        correctIndex: 0,
        explanation:
          "Systems Design is the pillar everyone skips because it looks like maintenance instead of progress. It's Osen in the courtyard at dawn — and it's what sustains the other two.",
      },
      {
        question: "What is the difference between an optimizer and a master, in Systems Design terms?",
        options: [
          "Optimizers tune what exists; masters design what SHOULD exist",
          "Optimizers use data; masters use intuition",
          "There is no difference",
          "Optimizers are faster; masters are slower"
        ],
        correctIndex: 0,
        explanation:
          "Systems Design is not optimizing what happens to exist — it's deliberately designing the environment, habits, structures, and relationships that should exist.",
      },
      {
        question: "Your team keeps fumbling client crises, so you plan a workshop DURING the next crisis so lessons stick. Which science says this is backwards?",
        options: [
          "Flow — crises are too boring for engagement",
          "Frontloading — equip people BEFORE the challenge; learning during it splits attention between understanding the problem and learning how to solve it",
          "First Principles — you should question whether clients matter",
          "None — pressure is the best teacher"
        ],
        correctIndex: 1,
        explanation:
          "Meeting a challenge and new concepts simultaneously causes cognitive overload. Frontload the training first, so every resource goes to execution when the crisis arrives.",
      },
      {
        question: "Why does frontloading eliminate 'expensive downstream problems'?",
        options: [
          "It shifts blame to the trainer",
          "It makes training cheaper to deliver",
          "Problems solved early cost a fraction of problems discovered late — in product development and human performance alike",
          "It reduces the number of problems to zero"
        ],
        correctIndex: 2,
        explanation:
          "Toyota's development process and educational research agree: catch it early, pay pennies; discover it late, pay dollars. Preparation is the cheap insurance.",
      },
      {
        question: "'Everyone in our industry charges hourly, so we charge hourly.' What kind of reasoning is this — and what does First Principles Thinking do with it?",
        options: [
          "Flow reasoning — it balances challenge and skill",
          "Frontloading — it prepares you for negotiations",
          "First-principles reasoning — keep it",
          "Reasoning by analogy — First Principles rejects it, breaks pricing down to fundamental truths, and rebuilds from bedrock regardless of precedent"
        ],
        correctIndex: 3,
        explanation:
          "'Everyone does it this way' builds invisible ceilings. First Principles asks WHY until it hits bedrock, then rebuilds — finding solutions the analogy-following competition never will.",
      },
      {
        question: "An owner says 'I need more marketing.' Applying First Principles, what should you check FIRST?",
        options: [
          "Whether the real problem is deeper — e.g. a product that doesn't solve a compelling problem. Most people solve symptoms",
          "What competitors spend on marketing",
          "Whether they can afford an agency",
          "Which ad platform has the best rates"
        ],
        correctIndex: 0,
        explanation:
          "First Principles solves the RIGHT problem. 'More marketing' may be a symptom; the fundamental truth underneath might be product-market fit.",
      },
      {
        question: "How does the martial arts method embody First Principles Thinking?",
        options: [
          "Students copy the master's style exactly",
          "Before mastering a complex technique you master its components — stance, balance, rotation, follow-through — and the technique assembles naturally",
          "Belts are awarded by seniority",
          "Techniques never change across generations"
        ],
        correctIndex: 1,
        explanation:
          "Each component is a first principle. Master the fundamentals and complexity assembles itself — in martial arts and in business performance alike.",
      },
      {
        question: "What is the CORE condition for entering flow?",
        options: [
          "Working alone",
          "Total silence and no deadlines",
          "A precise balance between the challenge of the task and the skill of the performer — with clear goals and immediate feedback",
          "High caffeine and high stakes"
        ],
        correctIndex: 2,
        explanation:
          "Too little challenge → boredom. Too much → anxiety. Matched at a high level with clear goals and immediate feedback, performance chemistry floods in.",
      },
      {
        question: "Your best analyst is bored and coasting. Per flow science, what's the right move?",
        options: [
          "Move them to an easier team",
          "Add more meetings for engagement",
          "Reduce their workload further so they can rest",
          "Raise the challenge to match their skill — boredom means the challenge sits below their ability"
        ],
        correctIndex: 3,
        explanation:
          "The challenge-skill balance works both directions: anxiety means lower the challenge or raise the skill; boredom means raise the challenge. Flow lives on the line between.",
      },
      {
        question: "Where does research say flow shows up MORE often — and why does that matter for training?",
        options: [
          "At work — so any training program that doesn't help people access flow is leaving their best work on the table",
          "On vacation — so offer more PTO",
          "Nowhere measurable — flow is anecdotal",
          "At leisure — so work should be easier"
        ],
        correctIndex: 0,
        explanation:
          "People in flow report their highest productivity, creativity, and satisfaction — and it happens more at work than leisure. Training should engineer the conditions for it.",
      },
      {
        question: "In the layered system, what is the correct bottom-to-top stack?",
        options: [
          "Delivery System → Capability Builder → Scientific Foundation",
          "Scientific Foundation (Frontloading, First Principles, Flow) → Capability Builder (Mindset, Skillset, Systems) → Delivery System (six pillars)",
          "Six pillars → three sciences → three capabilities",
          "Mindset → Flow → Feedback"
        ],
        correctIndex: 1,
        explanation:
          "Science informs capability; capability fuels delivery; delivery creates the conditions for flow. Every layer depends on the ones below — skip one and the system breaks.",
      },
      {
        question: "A consultant delivers a brilliant one-day leadership workshop. Evaluations average 4.9 stars. Six weeks later, nothing has changed. Which TWO failure modes is this?",
        options: [
          "Too advanced + too long",
          "Generic content + skipped foundation",
          "Training as an event instead of a system + measuring satisfaction instead of behavior change",
          "No objectives + no modules"
        ],
        correctIndex: 2,
        explanation:
          "Events create awareness; systems create change. And a five-star evaluation tells you nothing about whether anyone applied a single thing.",
      },
      {
        question: "Pillar 2 demands you finish one sentence. Which is it — and which completion PASSES?",
        options: [
          "'Participants will understand…' — 'the importance of leadership'",
          "'The deck includes…' — '47 slides and a workbook'",
          "'This training will cover…' — 'the fundamentals of communication'",
          "'After this training, participants will be able to…' — 'run a five-step objection-handling conversation with a live prospect'"
        ],
        correctIndex: 3,
        explanation:
          "The completion must be a specific, OBSERVABLE action. 'Understand' and 'cover' are invisible; a demonstrable conversation is a yellow-belt front kick — you can test it.",
      },
      {
        question: "What is the 'Monday morning test' (Pillar 4)?",
        options: [
          "Could a participant use this content TODAY, in their actual role? If not, it's interesting but not actionable",
          "Schedule all training on Mondays",
          "Test energy levels before training",
          "Quiz participants first thing Monday"
        ],
        correctIndex: 0,
        explanation:
          "Relevance is the filter. Content pitched as 'hard fun' that applies immediately in the participant's real role transforms; everything else entertains.",
      },
      {
        question: "What is 'hard fun' — and which pillar does it belong to?",
        options: [
          "Team-building games — Pillar 6",
          "Challenge that stretches people just past their comfort zone without shutting them down — Pillar 4, Actionable & Relevant Content",
          "Punishing workloads — Pillar 1",
          "Optional homework — Pillar 3"
        ],
        correctIndex: 1,
        explanation:
          "Hard fun is the flow condition applied to teaching: difficult enough to demand all of you, never so brutal you shut down. That's the edge where growth lives.",
      },
      {
        question: "Belt-testing philosophy says you advance by ____, not by ____. (Pillar 5)",
        options: [
          "Enthusiasm; accuracy",
          "Attendance; participation",
          "Demonstrating techniques under pressure; answering questions about them",
          "Seniority; skill"
        ],
        correctIndex: 2,
        explanation:
          "Measure behavior change — did the person change what they DO? That's the only assessment that ultimately matters, at every level: reaction, learning, behavior, results.",
      },
      {
        question: "Why is collecting feedback and filing it away WORSE than never asking (Pillar 6)?",
        options: [
          "It creates legal liability",
          "It isn't worse — any collection helps",
          "It wastes storage space",
          "It teaches people their input doesn't matter — the power is in acting on it VISIBLY, then collecting again"
        ],
        correctIndex: 3,
        explanation:
          "The loop is the power: collect → act visibly → collect again. Brett's methodology was refined for three decades in the most honest loop there is — the martial arts classroom.",
      },
      {
        question: "A trainer opens with advanced closing techniques because 'basics bore people.' Reps look impressive in class and collapse with real prospects. Which failure mode — and what's the martial arts parallel?",
        options: [
          "Skipping the foundation to look advanced — teaching the spinning kick before the front kick",
          "Generic content — wrong audience",
          "No feedback loop — nobody was surveyed",
          "Event thinking — the workshop was too short"
        ],
        correctIndex: 0,
        explanation:
          "Advanced-first looks impressive and collapses under real-world pressure. Foundations aren't optional — they're what the impressive stuff stands on.",
      },
      {
        question: "You score your training program: Planning 2, Objectives 2, Modules 4, Content 4, Assessment 3, Feedback 3 (total 18). What does the scorecard prescribe?",
        options: [
          "Celebrate — 18 is optimized",
          "Strengthen your two lowest scores first: Planning and Objectives — the rest can't deliver without them",
          "Rebuild everything from scratch",
          "Add more content modules"
        ],
        correctIndex: 1,
        explanation:
          "18–24 is a solid foundation, and your two lowest scores are your next moves. Planning and Objectives are also the prescribed first fixes for 10–17 — everything else stands on them.",
      },
      {
        question: "Under any scorecard result, which three deeper questions sit underneath?",
        options: [
          "Who approved it? What did it cost? When does it end?",
          "Is it profitable? Is it scalable? Is it popular?",
          "Am I frontloading the right preparation? Am I solving first-principles problems or surface symptoms? Am I creating the conditions for flow?",
          "Do people like me? Is it modern? Is it digital?"
        ],
        correctIndex: 2,
        explanation:
          "The three sciences never stop applying — they're the questions under every score, every program, every tool.",
      },
      {
        question: "What is the Custom Toolkit Promise — and what keeps the customization rigorous instead of random?",
        options: [
          "Clients build their own tools — self-service is the rigor",
          "Tools are chosen from a menu of 50 options",
          "Every client gets the same proven toolkit — consistency is the rigor",
          "Every engagement builds tools that fit YOU and no one else — kept rigorous because every tool is grounded in Frontloading, First Principles, and Flow"
        ],
        correctIndex: 3,
        explanation:
          "The tools are always unique to the person; the science driving them is proven and repeatable. That's the difference between custom and random.",
      },
      {
        question: "Why does structure create MORE flexibility, not less (Pillar 1)?",
        options: [
          "A proven architecture lets you adapt WITHIN it instead of improvising from scratch",
          "Structure eliminates the need to adapt",
          "Flexible people don't need plans",
          "It doesn't — structure is rigidity"
        ],
        correctIndex: 0,
        explanation:
          "Without architecture, training is a collection of activities that entertain but don't transform. With it, adaptation has a frame to adapt inside.",
      },
      {
        question: "The six pillars are 'an ecosystem, not a checklist.' What does that mean in practice?",
        options: [
          "You can skip any three pillars if the others are strong",
          "Each pillar feeds the next — planning gives the blueprint, objectives say what to build, modules organize, actionable content makes it real, assessment tells you if it worked, feedback improves the next version. Skip one and the structure weakens",
          "The order doesn't matter",
          "Only trainers need to understand them"
        ],
        correctIndex: 1,
        explanation:
          "Start with intention. Build with structure. Deliver with relevance. Measure with rigor. Improve with feedback. Repeat — the closing sequence of the whole framework.",
      },
      {
        question: "The ultimate test of any training — the one that 'never changes' — is:",
        options: [
          "Did attendance grow?",
          "Did participants enjoy it?",
          "Did it change what people DO — not what they know, not what they enjoyed?",
          "Did it finish on time and on budget?"
        ],
        correctIndex: 2,
        explanation:
          "Transform, not inform. Behavior is the only scoreboard — the framework opens with this philosophy and closes with it.",
      },
    ],
  },
];

//==============================================================================
// Final certification exam (server-side scored, like module quizzes)
//==============================================================================
export const finalExam: QuizQuestion[] = [
  {
    question: "What is the ultimate goal of the Fire Yourself Exercise?",
    options: [
      "To quit your business",
      "To evolve your role toward high-value work by systematically handing off everything else",
      "To reduce payroll costs",
      "To work longer hours more efficiently",
    ],
    correctIndex: 1,
    explanation:
      "Firing yourself from low-value tasks is how you hire yourself into the CEO role your business actually needs.",
  },
  {
    question: "Across all three tools, what is the common discipline?",
    options: [
      "Working harder than everyone else",
      "Making deliberate choices BEFORE the pressure hits — then reviewing against reality",
      "Avoiding all risk",
      "Delegating every decision",
    ],
    correctIndex: 1,
    explanation:
      "Design the week before it starts, describe the role before you fill it, document the decision before you commit — deliberate first, review after.",
  },
  {
    question: "Your ideal week keeps collapsing because 'urgent' requests eat your deep-work blocks. The Master's Edge response?",
    options: [
      "Abandon the template — it clearly doesn't fit your business",
      "Declare those blocks sacred, batch the chaos into contained windows, and defend the design",
      "Answer requests immediately to keep everyone happy",
      "Work evenings to make up the lost deep work",
    ],
    correctIndex: 1,
    explanation:
      "The template only works if sacred means sacred. Chaos gets a container (batched communication windows); the design gets defended.",
  },
  {
    question: "A $15,000, hard-to-reverse vendor contract is on your desk. Which habit applies FIRST?",
    options: [
      "Trust your gut and sign — speed wins",
      "Open the Decision Journal: state the question, list options including 'do nothing', steel-man the other side",
      "Delegate the decision to your newest hire",
      "Wait until the deadline forces your hand",
    ],
    correctIndex: 1,
    explanation:
      "Significant money + low reversibility is exactly the Decision Journal threshold. Clarity before commitment.",
  },
  {
    question: "Six months from now, how do you know these tools are working?",
    options: [
      "You feel busier than ever",
      "Measurable shifts: more hours on owner-only work, protected blocks surviving, decision reviews matching expectations",
      "Your team asks fewer questions",
      "You've memorized all three frameworks",
    ],
    correctIndex: 1,
    explanation:
      "Every tool ends in measurable outcomes and review dates — the proof is in the scoreboard, not the feeling.",
  },
];

/** Modules in unlock order. */
export function orderedModules(): AcademyModule[] {
  return [...academyModules].sort((a, b) => a.order - b.order);
}

export function getModule(slug: string): AcademyModule | undefined {
  return academyModules.find((m) => m.slug === slug);
}

/**
 * PREVIEW MODE (Brett's request while he decides the final layout):
 * every module is unlocked. To restore linear unlocking — module N+1 opens
 * once module N is passed, per course — swap in the commented block below.
 */
export function unlockedSlugs(passed: Set<string>): Set<string> {
  void passed; // unused while preview mode is on
  return new Set(orderedModules().map((m) => m.slug));
  /* Linear per-course unlock — restore when the layout is final:
  const unlocked = new Set<string>();
  for (const course of academyCourses) {
    for (const m of orderedModules().filter(
      (x) => x.order >= course.fromOrder && x.order <= course.toOrder
    )) {
      unlocked.add(m.slug);
      if (!passed.has(m.slug)) break; // rest of THIS course stays locked
    }
  }
  return unlocked;
  */
}
