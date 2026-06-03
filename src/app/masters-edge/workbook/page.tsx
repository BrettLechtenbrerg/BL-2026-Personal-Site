"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import {
  Zap,
  Target,
  Layers,
  Wind,
  Trophy,
  CheckCircle2,
  FileDown,
  Mail,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Quote,
  Lightbulb,
} from "lucide-react";

// ============================================================================
// THE MASTER'S EDGE — INTERACTIVE PARTICIPANT WORKBOOK
// ----------------------------------------------------------------------------
// Hidden course (noindex via layout.tsx, not in sitemap, not linked in nav).
// Ported from the TSAI "hidden workshop" pattern to the BL personal-site stack:
//   - Tailwind v4 + cranberry/gold brand tokens (globals.css)
//   - Lucide icons (no react-icons on this site)
//   - localStorage autosave, sticky section toolbar, Framer Motion transitions
//   - PDF export (html2pdf CDN) + email-results mailto builder
//   - GHL lead capture via /api/workbook-lead  (workflow TODO — see that file)
// ============================================================================

const STORAGE_KEY = "bl_masters_edge_workbook";

// ==============================
// TYPES
// ==============================
interface WorkbookData {
  participantName: string;
  participantEmail: string;
  // Week 1 — Clarify / First Principles
  w1_thought_problem: string;
  w1_assumption: string;
  w1_real_problem: string;
  w1_one_target: string;
  // Week 2 — Simplify / Frontloading
  w2_recurring_moment: string;
  w2_load_advance: string;
  w2_cut_simplify: string;
  // Week 3 — Maximize / Flow
  w3_block_target: string;
  w3_block_when: string;
  w3_remove: string;
  w3_recovery_ritual: string;
  // Week 4 — Integration / Three-Pillar Review
  w4_mindset_score: string;
  w4_skillset_score: string;
  w4_support_score: string;
  w4_weakest_move: string;
  // 7-day habit trackers (week_day_done / week_day_note)
  [key: `track_${number}_${number}_done`]: boolean;
  [key: `track_${number}_${number}_note`]: string;
}

const defaultData: WorkbookData = {
  participantName: "",
  participantEmail: "",
  w1_thought_problem: "",
  w1_assumption: "",
  w1_real_problem: "",
  w1_one_target: "",
  w2_recurring_moment: "",
  w2_load_advance: "",
  w2_cut_simplify: "",
  w3_block_target: "",
  w3_block_when: "",
  w3_remove: "",
  w3_recovery_ritual: "",
  w4_mindset_score: "",
  w4_skillset_score: "",
  w4_support_score: "",
  w4_weakest_move: "",
} as WorkbookData;

// init 4 weeks × 7-day trackers
for (let w = 1; w <= 4; w++) {
  for (let d = 1; d <= 7; d++) {
    (defaultData as unknown as Record<string, string | boolean>)[
      `track_${w}_${d}_done`
    ] = false;
    (defaultData as unknown as Record<string, string | boolean>)[
      `track_${w}_${d}_note`
    ] = "";
  }
}

// ==============================
// SECTION + CONTENT MODEL
// ==============================
const sections = ["welcome", "week1", "week2", "week3", "week4"] as const;
type Section = (typeof sections)[number];

const sectionMeta: Record<
  Section,
  { label: string; short: string; icon: React.ReactNode; color: string }
> = {
  welcome: { label: "Start", short: "Start", icon: <Zap size={16} />, color: "bg-cranberry" },
  week1: { label: "Week 1 · Clarify", short: "Clarify", icon: <Target size={16} />, color: "bg-cranberry" },
  week2: { label: "Week 2 · Simplify", short: "Simplify", icon: <Layers size={16} />, color: "bg-gold-dark" },
  week3: { label: "Week 3 · Maximize", short: "Maximize", icon: <Wind size={16} />, color: "bg-cranberry-light" },
  week4: { label: "Week 4 · The Master's Edge", short: "Integrate", icon: <Trophy size={16} />, color: "bg-gold" },
};

const weekNumber: Record<Exclude<Section, "welcome">, number> = {
  week1: 1,
  week2: 2,
  week3: 3,
  week4: 4,
};

// ==============================
// PRESENTATIONAL FIELD COMPONENTS (module-level so inputs keep focus)
// ==============================
function Field({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-cranberry">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-black/10 rounded-lg px-3 py-2 text-base mt-1.5 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none resize-y bg-white"
      />
    </div>
  );
}

function HabitTracker({
  week,
  title,
  data,
  onToggle,
  onNote,
}: {
  week: number;
  title: string;
  data: Record<string, string | boolean>;
  onToggle: (key: string, value: boolean) => void;
  onNote: (key: string, value: string) => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-5">
      <h4 className="font-heading font-bold text-black mb-1">7-Day Habit Tracker</h4>
      <p className="text-sm text-warm-gray mb-4">{title}</p>
      <div className="space-y-2">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
          const doneKey = `track_${week}_${day}_done`;
          const noteKey = `track_${week}_${day}_note`;
          const done = !!data[doneKey];
          return (
            <div key={day} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onToggle(doneKey, !done)}
                className={`shrink-0 w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all ${
                  done
                    ? "bg-cranberry border-cranberry text-white"
                    : "border-black/15 text-transparent hover:border-cranberry"
                }`}
                aria-label={`Day ${day} done`}
              >
                <CheckCircle2 size={18} />
              </button>
              <span className="shrink-0 w-12 text-sm font-semibold text-warm-gray">
                Day {day}
              </span>
              <input
                type="text"
                value={(data[noteKey] as string) || ""}
                onChange={(e) => onNote(noteKey, e.target.value)}
                placeholder="What I noticed…"
                className="flex-1 border border-black/10 rounded-lg px-3 py-2 text-base focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none bg-white"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==============================
// COMPONENT
// ==============================
export default function MastersEdgeWorkbook() {
  const [data, setData] = useState<WorkbookData>(defaultData);
  const [currentSection, setCurrentSection] = useState<Section>("welcome");
  const [saveStatus, setSaveStatus] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Load saved data
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed.data }));
        if (parsed.section && sections.includes(parsed.section)) {
          setCurrentSection(parsed.section);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Auto-save (debounced)
  const save = useCallback(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data, section: currentSection })
      );
      setSaveStatus("Saved \u2713");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch {
      /* ignore */
    }
  }, [data, currentSection]);

  useEffect(() => {
    const t = setTimeout(save, 500);
    return () => clearTimeout(t);
  }, [data, save]);

  const set = (field: string, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }) as WorkbookData);
  };

  const goTo = (section: Section) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // GHL webhook — fire-and-forget (never blocks UI)
  const sendWebhook = (event: "started" | "completed") => {
    if (!data.participantEmail) return;
    fetch("/api/workbook-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.participantName,
        email: data.participantEmail,
        workbook: "masters-edge",
        workbook_name: "The Master's Edge — Four Weeks to Peak Performance",
        event,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  };

  const currentIdx = sections.indexOf(currentSection);
  const prevSection = currentIdx > 0 ? sections[currentIdx - 1] : null;
  const nextSection =
    currentIdx < sections.length - 1 ? sections[currentIdx + 1] : null;

  // Progress
  const dd = data as unknown as Record<string, string | boolean>;
  const countFilled = () => {
    let filled = 0,
      total = 0;
    for (const key in dd) {
      if (["participantName", "participantEmail"].includes(key)) continue;
      total++;
      const v = dd[key];
      if (typeof v === "boolean" ? v : typeof v === "string" && v.trim())
        filled++;
    }
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };
  const progress = countFilled();

  // PDF export
  const exportPDF = async () => {
    sendWebhook("completed");
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      alert("PDF library still loading. Please try again in a moment.");
      return;
    }
    const prev = currentSection;
    setIsPrinting(true);
    await new Promise((r) => setTimeout(r, 300));

    const el = document.getElementById("workbookContent");
    if (!el) {
      setIsPrinting(false);
      setCurrentSection(prev);
      return;
    }
    const name = data.participantName || "Workbook";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (html2pdf as any)()
      .set({
        margin: [10, 10, 10, 10],
        filename: `Masters-Edge-Workbook-${name.replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(el)
      .save();

    setIsPrinting(false);
    setCurrentSection(prev);
  };

  // Email results
  const emailResults = () => {
    sendWebhook("completed");
    const trackerText = (w: number) => {
      let out = "";
      for (let day = 1; day <= 7; day++) {
        const done = dd[`track_${w}_${day}_done`] ? "[x]" : "[ ]";
        const note = dd[`track_${w}_${day}_note`] || "";
        out += `    Day ${day} ${done} ${note ? `— ${note}` : ""}\n`;
      }
      return out;
    };

    let body = `THE MASTER'S EDGE — Four Weeks to Peak Performance\n`;
    body += `Clarify · Simplify · Maximize\n\n`;
    body += `Name: ${data.participantName}\n\n`;

    body += `=== WEEK 1 — CLARIFY (First Principles · Mindset) ===\n`;
    body += `  The problem I thought I had: ${data.w1_thought_problem || "(not filled)"}\n`;
    body += `  The assumption underneath it: ${data.w1_assumption || "(not filled)"}\n`;
    body += `  The REAL problem, in one sentence: ${data.w1_real_problem || "(not filled)"}\n`;
    body += `  My One Target this week: ${data.w1_one_target || "(not filled)"}\n`;
    body += `  7-Day "Strip & Aim" Tracker:\n${trackerText(1)}\n`;

    body += `=== WEEK 2 — SIMPLIFY (Frontloading · Skillset) ===\n`;
    body += `  The recurring moment I'll prepare for: ${data.w2_recurring_moment || "(not filled)"}\n`;
    body += `  What I'll load in advance: ${data.w2_load_advance || "(not filled)"}\n`;
    body += `  What I can cut or simplify: ${data.w2_cut_simplify || "(not filled)"}\n`;
    body += `  7-Day "Load Tomorrow Tonight" Tracker:\n${trackerText(2)}\n`;

    body += `=== WEEK 3 — MAXIMIZE (Flow · Support Structure) ===\n`;
    body += `  Tomorrow's 90-minute target: ${data.w3_block_target || "(not filled)"}\n`;
    body += `  When the block happens: ${data.w3_block_when || "(not filled)"}\n`;
    body += `  What I'll remove (distractions): ${data.w3_remove || "(not filled)"}\n`;
    body += `  My recovery ritual after: ${data.w3_recovery_ritual || "(not filled)"}\n`;
    body += `  7-Day "Engineer One Block" Tracker:\n${trackerText(3)}\n`;

    body += `=== WEEK 4 — THE MASTER'S EDGE (Integration) ===\n`;
    body += `  Mindset score (1-10): ${data.w4_mindset_score || "(not filled)"}\n`;
    body += `  Skillset score (1-10): ${data.w4_skillset_score || "(not filled)"}\n`;
    body += `  Support Structure score (1-10): ${data.w4_support_score || "(not filled)"}\n`;
    body += `  Weakest pillar + my 30-day move: ${data.w4_weakest_move || "(not filled)"}\n`;
    body += `  7-Day "Three-Pillar Review" Tracker:\n${trackerText(4)}\n`;

    body += `\n---\nNext step: book a strategy conversation with Brett at BrettLechtenberg.com\n`;

    const subject = encodeURIComponent(
      `The Master's Edge Workbook — ${data.participantName || "My Results"}`
    );
    window.location.href = `mailto:${data.participantEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  // ==============================
  // SHARED UI HELPERS
  // ==============================
  const WeekHeader = ({
    section,
    quote,
    quoteSource,
  }: {
    section: Exclude<Section, "welcome">;
    quote: string;
    quoteSource: string;
  }) => {
    const meta = sectionMeta[section];
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-12 h-12 rounded-xl ${meta.color} text-white flex items-center justify-center`}
          >
            {meta.icon}
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-dark font-bold">
              Week {weekNumber[section]}
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-cranberry">
              {meta.label.split("· ")[1]}
            </h2>
          </div>
        </div>
        <blockquote className="flex gap-3 rounded-xl border-l-4 border-gold bg-black/[0.03] p-4">
          <Quote size={18} className="shrink-0 text-gold-dark mt-1" />
          <div>
            <p className="italic text-black">{quote}</p>
            <cite className="block mt-1 text-sm not-italic text-warm-gray">
              — {quoteSource}
            </cite>
          </div>
        </blockquote>
      </div>
    );
  };

  const IdeaBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-xl bg-cranberry/[0.04] p-5 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={18} className="text-cranberry" />
        <h3 className="font-heading font-bold text-cranberry">The Idea</h3>
      </div>
      <p className="text-black leading-relaxed">{children}</p>
    </div>
  );

  const ExerciseCard = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl border border-cranberry/20 bg-white shadow-sm p-6">
      <h3 className="font-heading font-bold text-black mb-1">In-Room Exercise</h3>
      <div className="space-y-4 mt-4">{children}</div>
    </div>
  );

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FBF8F4]">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />

      {/* ===== STICKY TOOLBAR ===== */}
      <div className="sticky top-16 z-30 bg-white border-b border-black/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="flex-1 bg-black/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-cranberry h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-xs text-warm-gray whitespace-nowrap">
              {progress}%
            </span>
            {saveStatus && (
              <span className="text-xs text-green-600 whitespace-nowrap">
                {saveStatus}
              </span>
            )}
            <button
              onClick={exportPDF}
              className="text-xs bg-cranberry text-white px-3 py-2 rounded-lg hover:bg-cranberry-dark transition-colors flex items-center gap-1"
            >
              <FileDown size={13} /> <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={emailResults}
              className="text-xs bg-gold text-black px-3 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-1"
            >
              <Mail size={13} /> <span className="hidden sm:inline">Email</span>
            </button>
            <button
              onClick={() => setShowHelp(true)}
              className="text-xs bg-black/5 text-black px-3 py-2 rounded-lg hover:bg-black/10 transition-colors flex items-center gap-1"
              title="Help"
            >
              <HelpCircle size={13} />{" "}
              <span className="hidden sm:inline">Help</span>
            </button>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {sections.map((sec) => {
              const meta = sectionMeta[sec];
              const isActive = currentSection === sec;
              return (
                <button
                  key={sec}
                  onClick={() => goTo(sec)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-cranberry text-white"
                      : "text-warm-gray hover:bg-black/5"
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span className="hidden sm:inline">{meta.short}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div
        className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8"
        id="workbookContent"
      >
        {/* ===================== WELCOME ===================== */}
        {(isPrinting || currentSection === "welcome") && (
          <motion.div
            data-section="welcome"
            initial={isPrinting ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isPrinting ? 0 : 0.5 }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gold-dark font-bold mb-3">
              The Referral Community · Peak Performance Series
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-cranberry mb-3">
              The Master&rsquo;s Edge
            </h1>
            <p className="text-warm-gray text-lg mb-1">
              Four Weeks to Peak Performance
            </p>
            <p className="text-gold-dark font-semibold tracking-wide text-sm mb-8">
              CLARIFY · SIMPLIFY · MAXIMIZE
            </p>

            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mb-10 text-left border border-black/5">
              <h3 className="font-heading font-bold text-black mb-4">Your Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-warm-gray font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={data.participantName}
                    onChange={(e) => set("participantName", e.target.value)}
                    onBlur={() => sendWebhook("started")}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-base mt-1 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm text-warm-gray font-medium">
                    Email (for sending your workbook)
                  </label>
                  <input
                    type="email"
                    value={data.participantEmail}
                    onChange={(e) => set("participantEmail", e.target.value)}
                    onBlur={() => sendWebhook("started")}
                    className="w-full border border-black/10 rounded-lg px-3 py-2 text-base mt-1 focus:border-cranberry focus:ring-2 focus:ring-cranberry/20 outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto rounded-2xl bg-white border border-black/5 shadow-sm p-6 mb-10 text-left">
              <h3 className="font-heading font-bold text-cranberry mb-3">
                One System, Three Layers
              </h3>
              <p className="text-black leading-relaxed mb-2">
                Over four weeks we install three foundations one at a time, then
                stand them all up together. Each layer rests on the one below
                it — skip a layer and the system breaks.
              </p>
              <ul className="text-black leading-relaxed list-disc pl-5 space-y-1">
                <li>
                  <strong>First Principles Thinking</strong> drives{" "}
                  <strong>CLARIFY</strong> — strip away assumptions, see the real
                  problem.
                </li>
                <li>
                  <strong>Frontloading</strong> drives <strong>SIMPLIFY</strong>{" "}
                  — load the tools and frameworks before the challenge arrives.
                </li>
                <li>
                  <strong>Flow</strong> drives <strong>MAXIMIZE</strong> —
                  engineer the reproducible conditions for peak performance.
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
              {(
                Object.entries(sectionMeta) as [
                  Section,
                  (typeof sectionMeta)[Section],
                ][]
              )
                .filter(([key]) => key !== "welcome")
                .map(([key, meta], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => goTo(key)}
                    className="bg-white rounded-xl p-5 shadow-md border border-black/5 text-left cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`w-9 h-9 rounded-full ${meta.color} text-white flex items-center justify-center`}
                      >
                        {meta.icon}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-cranberry">
                        {meta.label}
                      </h4>
                    </div>
                    <p className="text-sm text-warm-gray">
                      Tap to begin this week
                    </p>
                  </motion.div>
                ))}
            </div>

            {!isPrinting && (
              <button
                onClick={() => goTo("week1")}
                className="inline-flex items-center gap-2 bg-cranberry text-white font-semibold px-8 py-4 rounded-lg hover:bg-cranberry-dark transition-colors shadow-lg shadow-cranberry/25"
              >
                Begin Week 1 <ArrowRight size={18} />
              </button>
            )}
          </motion.div>
        )}

        {/* ===================== WEEK 1 ===================== */}
        {(isPrinting || currentSection === "week1") && (
          <motion.div
            data-section="week1"
            initial={isPrinting ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isPrinting ? 0 : 0.4 }}
          >
            <WeekHeader
              section="week1"
              quote="You must not fool yourself — and you are the easiest person to fool."
              quoteSource="Richard Feynman, &ldquo;Cargo Cult Science&rdquo; (Caltech, 1974)"
            />
            <IdeaBlock>
              A black belt&rsquo;s power doesn&rsquo;t come from the arm — it
              comes from the hip and the floor. First principles is that same
              move applied to your life and business: most people inherited
              beliefs about pricing, marketing, and &ldquo;how it&rsquo;s
              done&rdquo; that they&rsquo;ve never once questioned. Strip away the
              assumptions and see the real problem. You cannot aim at a target
              you haven&rsquo;t defined down to the truth — clarity is the first
              cut.
            </IdeaBlock>
            <p className="text-warm-gray mb-1 text-sm font-semibold uppercase tracking-wide">
              Pillar this week: Mindset
            </p>
            <p className="text-black mb-2">
              <strong>Your habit — &ldquo;Strip &amp; Aim&rdquo;:</strong> Each
              morning, before email, take your biggest challenge and ask,
              &ldquo;What do I actually know to be true, and what am I just
              assuming?&rdquo; Keep cutting until you reach the real problem.
              Then name the single One Target it points to — and defend your
              first 90 minutes for that target alone.
            </p>

            <div className="mt-6">
              <ExerciseCard>
                <Field
                  label="The problem I thought I had:"
                  value={data.w1_thought_problem}
                  onChange={(v) => set("w1_thought_problem", v)}
                />
                <Field
                  label="The assumption underneath it:"
                  value={data.w1_assumption}
                  onChange={(v) => set("w1_assumption", v)}
                />
                <Field
                  label="The REAL problem, in one sentence:"
                  value={data.w1_real_problem}
                  onChange={(v) => set("w1_real_problem", v)}
                />
                <Field
                  label="My One Target this week:"
                  value={data.w1_one_target}
                  onChange={(v) => set("w1_one_target", v)}
                />
              </ExerciseCard>
            </div>

            <HabitTracker
              week={1}
              title="&ldquo;Strip &amp; Aim&rdquo; — each morning before email"
              data={dd}
              onToggle={set}
              onNote={set}
            />

            <div className="mt-6 rounded-xl bg-cranberry/[0.04] p-4 text-center text-cranberry font-semibold">
              Edge Check: You can&rsquo;t simplify or maximize what you
              haven&rsquo;t first clarified.
            </div>
          </motion.div>
        )}

        {/* ===================== WEEK 2 ===================== */}
        {(isPrinting || currentSection === "week2") && (
          <motion.div
            data-section="week2"
            initial={isPrinting ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isPrinting ? 0 : 0.4 }}
          >
            <WeekHeader
              section="week2"
              quote="Victorious warriors win first and then go to war."
              quoteSource="Sun Tzu, The Art of War"
            />
            <IdeaBlock>
              We never learn a self-defense response in the moment of the attack
              — we drill it a thousand times before, so the body executes under
              stress. A black belt looks calm because the work was already done.
              Be prepared, not surprised: load the knowledge, tools, and mental
              frameworks before you face the challenge — not during it, not
              after. When the work is front-loaded, the moment gets simple: you
              stop improvising and start executing.
            </IdeaBlock>
            <p className="text-warm-gray mb-1 text-sm font-semibold uppercase tracking-wide">
              Pillar this week: Skillset
            </p>
            <p className="text-black mb-2">
              <strong>Your habit — &ldquo;Load Tomorrow Tonight&rdquo;:</strong>{" "}Each evening, queue the first move on your One Target, prep the
              materials, draft the key points of the hard conversation before it
              happens. Each week, run one deliberate-practice rep on a core
              skill — and simplify by subtraction.
            </p>

            <div className="mt-6">
              <ExerciseCard>
                <Field
                  label="The recurring high-stakes moment I'll prepare for:"
                  value={data.w2_recurring_moment}
                  onChange={(v) => set("w2_recurring_moment", v)}
                  placeholder="A sales call, a pitch, a negotiation…"
                />
                <Field
                  label="What I'll load in advance (3 things):"
                  value={data.w2_load_advance}
                  onChange={(v) => set("w2_load_advance", v)}
                  rows={3}
                />
                <Field
                  label="What I can cut or simplify around it:"
                  value={data.w2_cut_simplify}
                  onChange={(v) => set("w2_cut_simplify", v)}
                />
              </ExerciseCard>
            </div>

            <HabitTracker
              week={2}
              title="&ldquo;Load Tomorrow Tonight&rdquo; — each evening"
              data={dd}
              onToggle={set}
              onNote={set}
            />

            <div className="mt-6 rounded-xl bg-cranberry/[0.04] p-4 text-center text-cranberry font-semibold">
              Edge Check: Preparation is what makes mastery look effortless.
              Frontload the work; simplify the moment.
            </div>
          </motion.div>
        )}

        {/* ===================== WEEK 3 ===================== */}
        {(isPrinting || currentSection === "week3") && (
          <motion.div
            data-section="week3"
            initial={isPrinting ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isPrinting ? 0 : 0.4 }}
          >
            <WeekHeader
              section="week3"
              quote="Be water, my friend."
              quoteSource="Bruce Lee, The Pierre Berton Show (1971)"
            />
            <IdeaBlock>
              No fighter peaks by accident — and none grind at 100% around the
              clock either. Flow on the mat is engineered: the right opponent for
              the right stretch, the breath, the ritual, the recovery between
              rounds. Flow isn&rsquo;t luck — it&rsquo;s a reproducible state with
              specific conditions: a clear goal, fast feedback, a challenge just
              past your skill, and no distraction. The cycle runs struggle →
              release → flow → recovery. Manage energy, not time.
            </IdeaBlock>
            <p className="text-warm-gray mb-1 text-sm font-semibold uppercase tracking-wide">
              Pillar this week: Support Structure
            </p>
            <p className="text-black mb-2">
              <strong>Your habit — &ldquo;Engineer One Block&rdquo;:</strong>{" "}Each day, build one 90-minute flow block — clear target, calibrated
              challenge, phone out of the room — followed by a genuine recovery
              ritual. Before anything high-stakes, run four rounds of box
              breathing: inhale 4, hold 4, exhale 4, hold 4.
            </p>

            <div className="mt-6">
              <ExerciseCard>
                <Field
                  label="Tomorrow's 90-minute target:"
                  value={data.w3_block_target}
                  onChange={(v) => set("w3_block_target", v)}
                />
                <Field
                  label="When the block happens:"
                  value={data.w3_block_when}
                  onChange={(v) => set("w3_block_when", v)}
                />
                <Field
                  label="What I'll remove (distractions):"
                  value={data.w3_remove}
                  onChange={(v) => set("w3_remove", v)}
                />
                <Field
                  label="My recovery ritual after:"
                  value={data.w3_recovery_ritual}
                  onChange={(v) => set("w3_recovery_ritual", v)}
                />
              </ExerciseCard>
            </div>

            <HabitTracker
              week={3}
              title="&ldquo;Engineer One Block&rdquo; — one 90-minute block per day"
              data={dd}
              onToggle={set}
              onNote={set}
            />

            <div className="mt-6 rounded-xl bg-cranberry/[0.04] p-4 text-center text-cranberry font-semibold">
              Edge Check: You don&rsquo;t rise to your goals — you fall to your
              systems. Maximize by engineering the conditions.
            </div>
          </motion.div>
        )}

        {/* ===================== WEEK 4 ===================== */}
        {(isPrinting || currentSection === "week4") && (
          <motion.div
            data-section="week4"
            initial={isPrinting ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isPrinting ? 0 : 0.4 }}
          >
            <WeekHeader
              section="week4"
              quote="We are what we repeatedly do. Excellence, then, is not an act, but a habit."
              quoteSource="Will Durant, The Story of Philosophy (1926), distilling Aristotle"
            />
            <IdeaBlock>
              The black belt is a white belt who never quit — but more precisely,
              it&rsquo;s the person in whom mindset, skill, and environment
              finally move as one. No single pillar makes a master. The
              integration does. Because the layers stack, the weakest pillar caps
              the whole system: a strong mindset with no skillset is just
              positive thinking; great skills with no support structure burn out;
              a great environment with no clarity just drifts efficiently in the
              wrong direction.
            </IdeaBlock>
            <p className="text-warm-gray mb-1 text-sm font-semibold uppercase tracking-wide">
              Pillar this week: Integration
            </p>
            <p className="text-black mb-2">
              <strong>Your habit — &ldquo;The Three-Pillar Review&rdquo;:</strong>{" "}Once a week, audit all three. Mindset: am I focused, resilient, and
              confident on my real target? Skillset: which one capability am I
              sharpening? Support: is my environment serving the work or
              sabotaging it? Anchor it with a consistent ritual and a 30-day
              consistency commitment.
            </p>

            <div className="mt-6">
              <ExerciseCard>
                <Field
                  label="Mindset score (1–10) — and why:"
                  value={data.w4_mindset_score}
                  onChange={(v) => set("w4_mindset_score", v)}
                />
                <Field
                  label="Skillset score (1–10) — and why:"
                  value={data.w4_skillset_score}
                  onChange={(v) => set("w4_skillset_score", v)}
                />
                <Field
                  label="Support Structure score (1–10) — and why:"
                  value={data.w4_support_score}
                  onChange={(v) => set("w4_support_score", v)}
                />
                <Field
                  label="My weakest pillar and my one 30-day move:"
                  value={data.w4_weakest_move}
                  onChange={(v) => set("w4_weakest_move", v)}
                  rows={3}
                />
              </ExerciseCard>
            </div>

            <HabitTracker
              week={4}
              title="&ldquo;The Three-Pillar Review&rdquo; — weekly audit, daily reps"
              data={dd}
              onToggle={set}
              onNote={set}
            />

            <div className="mt-6 rounded-xl bg-gold/10 border border-gold/40 p-5 text-center">
              <p className="text-cranberry font-bold mb-1">
                The edge isn&rsquo;t one breakthrough.
              </p>
              <p className="text-black">
                It&rsquo;s Clarify, Simplify, Maximize — run as a system,
                repeated until it&rsquo;s simply who you are.
              </p>
            </div>

            {!isPrinting && (
              <div className="mt-8 text-center">
                <button
                  onClick={exportPDF}
                  className="inline-flex items-center gap-2 bg-cranberry text-white font-semibold px-8 py-4 rounded-lg hover:bg-cranberry-dark transition-colors shadow-lg shadow-cranberry/25"
                >
                  <FileDown size={18} /> Save My Completed Workbook (PDF)
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== PREV / NEXT NAV ===== */}
        {!isPrinting && (
          <div className="flex items-center justify-between mt-10">
            {prevSection ? (
              <button
                onClick={() => goTo(prevSection)}
                className="inline-flex items-center gap-2 text-cranberry font-semibold px-5 py-3 rounded-lg border border-cranberry/30 hover:bg-cranberry/5 transition-colors"
              >
                <ArrowLeft size={16} /> {sectionMeta[prevSection].short}
              </button>
            ) : (
              <span />
            )}
            {nextSection ? (
              <button
                onClick={() => goTo(nextSection)}
                className="inline-flex items-center gap-2 bg-cranberry text-white font-semibold px-5 py-3 rounded-lg hover:bg-cranberry-dark transition-colors"
              >
                {sectionMeta[nextSection].short} <ArrowRight size={16} />
              </button>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>

      {/* ===== HELP MODAL ===== */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-cranberry">
                How this workbook works
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-warm-gray hover:text-black"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-3 text-base text-black">
              <li className="flex gap-2">
                <CheckCircle2 size={18} className="text-cranberry shrink-0 mt-0.5" />
                Your answers <strong>save automatically</strong> on this device —
                come back anytime and pick up where you left off.
              </li>
              <li className="flex gap-2">
                <FileDown size={18} className="text-cranberry shrink-0 mt-0.5" />
                Tap <strong>PDF</strong> to download your completed workbook.
              </li>
              <li className="flex gap-2">
                <Mail size={18} className="text-cranberry shrink-0 mt-0.5" />
                Tap <strong>Email</strong> to send your results to yourself.
              </li>
              <li className="flex gap-2">
                <Target size={18} className="text-cranberry shrink-0 mt-0.5" />
                Use the week tabs at the top to move through Clarify → Simplify →
                Maximize → Integration.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
