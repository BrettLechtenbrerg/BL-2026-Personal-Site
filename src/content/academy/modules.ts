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
const PLACEHOLDER_VIDEO = (n: number) => PLACEHOLDER_VIDEOS[n - 1];

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
      "Set measurable expected outcomes and a review date — that's the feedback loop.",
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
