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
