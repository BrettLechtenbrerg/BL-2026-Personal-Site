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
 * Linear unlock: module N+1 opens once module N is passed. Returns the slugs
 * currently unlocked given the set of passed module slugs.
 */
export function unlockedSlugs(passed: Set<string>): Set<string> {
  const unlocked = new Set<string>();
  for (const m of orderedModules()) {
    unlocked.add(m.slug);
    if (!passed.has(m.slug)) break; // everything after the first unpassed stays locked
  }
  return unlocked;
}
