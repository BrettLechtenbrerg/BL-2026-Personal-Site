"use client";

//==============================================================================
// Member surveys — results for the survey team (me_users.survey_reviewer and
// admins). Count cards, group averages for the ratings, one row per member
// (one column per survey), click a name for their surveys side by side,
// spreadsheet download, and remove a single response (test answers, or to let
// a member redo one). Team accounts are left out of counts and averages once
// real members (non-team accounts) exist; while every account is on the team
// (test phase) they count.
//==============================================================================

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Download, Eye, Loader2, RefreshCw, Search, Trash2 } from "lucide-react";
import Avatar from "@/components/academy/Avatar";
import SurveyAnswersView, { Change, formatSurveyDate } from "./SurveyAnswersView";
import {
  FIRST_SURVEY,
  RATING_QUESTIONS,
  SURVEYS,
  SURVEY_SLUGS,
  latestAfterFirst,
  ratingAverages,
  readAnswers,
  scoreChange,
  surveyBySlug,
  surveySchedule,
  type SurveySlug,
  type SurveyStatus,
} from "@/lib/surveys";
import { averagesNote, cap, changeNote, LIST_PHRASE, MEMBER, MEMBERS, TEAM_LABEL } from "@/lib/survey-text";

const FIRST_SLUG = FIRST_SURVEY?.slug ?? "";
// Static class names (Tailwind only sees whole literals): count cards = members + each survey + due now.
const CARD_COLS: Record<number, string> = { 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" };
const SURVEY_COLS: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };
// Member column + one per survey + change.
const TABLE_COLS = SURVEYS.length + 2;

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  photoUrl: string | null;
  leader: boolean;
  joinedAt: string;
}

interface Response {
  id: string;
  user_id: string;
  survey_slug: SurveySlug;
  answers: unknown;
  submitted_at: string;
}

const card = "rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-5 backdrop-blur-md";

function StatusCell({ status }: { status: SurveyStatus }) {
  if (status.state === "done") return <span>✓ {formatSurveyDate(status.submittedAt!)}</span>;
  if (status.state === "open")
    return <span className="rounded-full bg-academy-accent/20 px-2 py-0.5 text-xs font-semibold text-academy-accent">Due now</span>;
  if (status.opensAt) return <span className="text-academy-fg/60">Opens {formatSurveyDate(status.opensAt)}</span>;
  return <span className="text-academy-fg/50">—</span>;
}

export default function SurveyReview() {
  const [state, setState] = useState<"loading" | "ready" | "notSetUp" | "error">("loading");
  const [members, setMembers] = useState<Member[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  // null = automatic: count team accounts only while nobody outside the team has an account.
  const [includeChoice, setIncludeChoice] = useState<boolean | null>(null);
  const onlyTeam = members.length > 0 && members.every((m) => m.leader);
  const includeLeaders = includeChoice ?? onlyTeam;
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/surveys/review", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState(json.notSetUp ? "notSetUp" : "error");
        if (!json.notSetUp) setError(json.error || "Could not load survey results.");
        return;
      }
      setMembers(json.members ?? []);
      setResponses(json.responses ?? []);
      setError(null);
      setState("ready");
    } catch {
      setState("error");
      setError("Could not load survey results.");
    }
  }, []);

  useEffect(() => {
    // Deferred a tick so no state is set synchronously inside the effect.
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const rows = useMemo(() => {
    const now = new Date();
    return members
      .filter((m) => includeLeaders || !m.leader)
      .map((m) => {
        const mine = responses.filter((r) => r.user_id === m.id);
        const bySlug = Object.fromEntries(mine.map((r) => [r.survey_slug, r])) as Partial<Record<SurveySlug, Response>>;
        const start = bySlug[FIRST_SLUG] ? readAnswers(bySlug[FIRST_SLUG].answers) : null;
        const latestRaw = latestAfterFirst(bySlug);
        const latest = latestRaw ? readAnswers(latestRaw.answers) : null;
        return {
          member: m,
          bySlug,
          schedule: surveySchedule(mine, now),
          change: scoreChange(start, latest),
        };
      });
  }, [members, responses, includeLeaders]);

  const counted = useMemo(() => new Set(rows.map((r) => r.member.id)), [rows]);
  const countedResponses = useMemo(() => responses.filter((r) => counted.has(r.user_id)), [responses, counted]);
  const averages = useMemo(() => ratingAverages(countedResponses), [countedResponses]);
  const visibleRows = rows.filter((r) => {
    const needle = q.trim().toLowerCase();
    return !needle || r.member.name.toLowerCase().includes(needle) || r.member.email.toLowerCase().includes(needle);
  });

  const remove = async (response: Response, name: string) => {
    const title = surveyBySlug(response.survey_slug).title;
    if (!window.confirm(`Remove ${name}'s ${title}?\n\nThis can't be undone. They will be able to take it again.`)) return;
    setBusyId(response.id);
    setError(null);
    const res = await fetch(`/api/academy/surveys/review?id=${encodeURIComponent(response.id)}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) {
      const json = res ? await res.json().catch(() => ({})) : {};
      setError(json.error || "Could not remove that response.");
    }
    await load();
    setBusyId(null);
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-academy-accent" size={32} aria-label="Loading" />
      </div>
    );
  }

  const count = (slug: SurveySlug) => countedResponses.filter((r) => r.survey_slug === slug).length;
  const dueNow = rows.filter((r) => r.schedule.some((s) => s.state === "open")).length;
  const cards = [
    { label: cap(MEMBERS), value: rows.length },
    ...SURVEYS.map((s) => ({ label: s.shortTitle, value: count(s.slug) })),
    { label: "Due now", value: dueNow },
  ];

  return (
    <div className="[overflow-wrap:anywhere]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold">Survey Results</h1>
          <p className="mt-1 text-academy-fg/75">{`${cap(TEAM_LABEL)} only. Every ${MEMBER}'s ${LIST_PHRASE} answers.`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/academy/surveys/preview"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-academy-fg/15 px-4 py-2 text-sm hover:bg-academy-fg/10"
          >
            <Eye size={16} aria-hidden /> Preview the surveys
          </Link>
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-academy-fg/15 px-4 py-2 text-sm hover:bg-academy-fg/10"
          >
            <RefreshCw size={16} aria-hidden /> Refresh
          </button>
          {state === "ready" && (
            <a
              href="/api/academy/surveys/review?format=csv"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-4 py-2 text-sm font-bold text-academy-fg hover:bg-academy-primary-dark"
            >
              <Download size={16} aria-hidden /> Download spreadsheet
            </a>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-academy-primary/40 bg-academy-primary/15 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {state === "notSetUp" && <p className={`mt-6 ${card}`}>Surveys are still being set up: the database step hasn&apos;t been run yet.</p>}

      {state === "ready" && (
        <>
          {/* Count cards */}
          <ul className={`mt-6 grid grid-cols-2 gap-3 ${CARD_COLS[cards.length] ?? "sm:grid-cols-4"}`}>
            {cards.map((c) => (
              <li key={c.label} className={`${card} text-center`}>
                <p className="font-heading text-3xl font-bold text-academy-accent">{c.value}</p>
                <p className="mt-1 text-sm text-academy-fg/75">{c.label}</p>
              </li>
            ))}
          </ul>

          <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-academy-fg/80">
            <input type="checkbox" checked={includeLeaders} onChange={(e) => setIncludeChoice(e.target.checked)} className="h-4 w-4 accent-[var(--academy-accent-base)]" />
            {`Include ${TEAM_LABEL} accounts in counts and averages`}
            {includeChoice === null && onlyTeam && <span className="text-academy-fg/60">(on while every account is on the team)</span>}
          </label>

          {/* Group averages */}
          <section aria-labelledby="averages-heading" className={`mt-4 ${card}`}>
            <h2 id="averages-heading" className="font-heading text-lg font-bold text-academy-accent">Group averages</h2>
            <p className="mt-1 text-sm text-academy-fg/70">{averagesNote()}</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-academy-fg/10 text-academy-fg/70">
                    <th scope="col" className="py-2 pr-3 font-semibold">Question</th>
                    {SURVEYS.map((s) => (
                      <th key={s.slug} scope="col" className="px-3 py-2 font-semibold">{s.shortTitle}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATING_QUESTIONS.map((rq) => (
                    <tr key={rq.id} className="border-b border-academy-fg/5 last:border-0">
                      <th scope="row" className="py-2 pr-3 font-normal">{rq.short}</th>
                      {SURVEY_SLUGS.map((slug) => {
                        const a = averages[slug][rq.id];
                        return (
                          <td key={slug} className="px-3 py-2">
                            {a.avg === null ? <span className="text-academy-fg/50">—</span> : (
                              <>
                                <span className="font-heading font-bold">{a.avg.toFixed(1)}</span>
                                <span className="text-academy-fg/60"> / {rq.options.length} · n={a.n}</span>
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Members */}
          <section aria-labelledby="members-heading" className={`mt-4 ${card}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="members-heading" className="font-heading text-lg font-bold text-academy-accent">{cap(MEMBERS)}</h2>
              <label className="relative">
                <span className="sr-only">{`Search ${MEMBERS}`}</span>
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-academy-fg/50" aria-hidden />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or email"
                  className="min-h-11 w-64 max-w-full rounded-lg border border-academy-fg/15 bg-academy-bg/30 py-2 pl-9 pr-3 text-base text-academy-fg placeholder-academy-fg/50 outline-none focus:border-academy-accent"
                />
              </label>
            </div>
            <p className="mt-1 text-sm text-academy-fg/70">{changeNote()}</p>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-academy-fg/10 text-academy-fg/70">
                    <th scope="col" className="py-2 pr-3 font-semibold">{cap(MEMBER)}</th>
                    {SURVEYS.map((s) => (
                      <th key={s.slug} scope="col" className="px-3 py-2 font-semibold">{s.shortTitle}</th>
                    ))}
                    <th scope="col" className="px-3 py-2 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={TABLE_COLS} className="py-4 text-academy-fg/60">{`No ${MEMBERS} match.`}</td>
                    </tr>
                  )}
                  {visibleRows.map(({ member: m, bySlug, schedule, change }) => {
                    const expanded = openId === m.id;
                    const start = bySlug[FIRST_SLUG] ? readAnswers(bySlug[FIRST_SLUG].answers) : null;
                    return (
                      <Fragment key={m.id}>
                        <tr className="border-b border-academy-fg/5">
                          <th scope="row" className="py-1 pr-3 font-normal">
                            <button
                              type="button"
                              aria-expanded={expanded}
                              onClick={() => setOpenId(expanded ? null : m.id)}
                              className="flex min-h-11 items-center gap-2 rounded-lg px-1 text-left font-semibold hover:text-academy-accent"
                            >
                              <Avatar emoji={m.avatar} photoUrl={m.photoUrl} size={28} />
                              <span>
                                {m.name}
                                {m.leader && <span className="ml-1.5 text-xs font-normal text-academy-fg/60">(team)</span>}
                              </span>
                              <ChevronDown size={14} className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                            </button>
                          </th>
                          {schedule.map((s) => (
                            <td key={s.slug} className="px-3 py-1 whitespace-nowrap">
                              <StatusCell status={s} />
                            </td>
                          ))}
                          <td className="px-3 py-1">{change === null ? <span className="text-academy-fg/50">—</span> : <Change delta={change} />}</td>
                        </tr>
                        {expanded && (
                          <tr className="border-b border-academy-fg/10">
                            <td colSpan={TABLE_COLS} className="pb-5 pt-2">
                              <p className="mb-3 text-sm text-academy-fg/75">
                                <a href={`mailto:${m.email}`} className="text-academy-accent underline underline-offset-4">{m.email}</a>
                                {" · "}joined {formatSurveyDate(m.joinedAt)}
                              </p>
                              <div className={`grid gap-4 ${SURVEY_COLS[SURVEYS.length] ?? "lg:grid-cols-3"}`}>
                                {SURVEYS.map((s) => {
                                  const r = bySlug[s.slug];
                                  return (
                                    <div key={s.slug} className="rounded-xl border border-academy-fg/10 bg-academy-bg/20 p-4">
                                      <h3 className="font-heading font-bold">{s.title}</h3>
                                      {r ? (
                                        <>
                                          <p className="mb-3 text-xs text-academy-fg/60">Sent {formatSurveyDate(r.submitted_at)}</p>
                                          <SurveyAnswersView answers={readAnswers(r.answers)} compareTo={s.slug === FIRST_SLUG ? null : start} />
                                          <button
                                            type="button"
                                            onClick={() => remove(r, m.name)}
                                            disabled={busyId === r.id}
                                            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs text-academy-fg/60 hover:bg-academy-fg/10 hover:text-red-400 disabled:opacity-50"
                                          >
                                            {busyId === r.id ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Trash2 size={14} aria-hidden />}
                                            Remove this response
                                          </button>
                                        </>
                                      ) : (
                                        <p className="mt-1 text-sm text-academy-fg/60">Not sent yet.</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
