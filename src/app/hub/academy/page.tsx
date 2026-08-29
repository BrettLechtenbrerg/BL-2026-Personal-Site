"use client";

//==============================================================================
// Comms Hub — Academy admin: member list + submission review (approve/revise).
// Gated by the existing hub session; unauthenticated visits bounce to /hub.
//==============================================================================

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, FileEdit, Loader2, Users } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  created_at: string;
}

interface Submission {
  id: string;
  user_id: string;
  kind: "project" | "exam";
  body: string | null;
  link: string | null;
  status: "pending" | "approved" | "revise";
  feedback: string | null;
  created_at: string;
  me_users: { name: string; email: string; avatar: string } | null;
}

interface ProgressRow {
  user_id: string;
  module_slug: string;
  passed: boolean;
}

export default function HubAcademyPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [awards, setAwards] = useState<{ user_id: string; badge_slug: string }[]>([]);
  const [moduleCount, setModuleCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/hub/academy")
      .then(async (res) => {
        if (res.status === 401 || res.status === 503) {
          router.replace("/hub");
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        setMembers(json.members ?? []);
        setSubmissions(json.submissions ?? []);
        setProgress(json.progress ?? []);
        setAwards(json.awards ?? []);
        setModuleCount(json.moduleCount ?? 0);
        setReady(true);
      })
      .catch(() => {});
  }, [router]);

  useEffect(load, [load]);

  const review = async (submissionId: string, status: "approved" | "revise") => {
    setBusy(submissionId);
    try {
      await fetch("/api/hub/academy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          status,
          feedback: feedbackDrafts[submissionId] ?? "",
        }),
      });
      load();
    } finally {
      setBusy(null);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-950">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 font-heading text-2xl font-bold">Academy Admin</h1>
        <p className="mb-8 text-sm text-white/60">
          {members.length} member{members.length === 1 ? "" : "s"} · {pending.length} submission
          {pending.length === 1 ? "" : "s"} awaiting review
        </p>

        {/* Pending submissions */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-gold">
            <Clock size={18} /> Awaiting Review
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-white/50">Nothing to review. 🎉</p>
          ) : (
            <div className="space-y-4">
              {pending.map((s) => (
                <div key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold">
                      {s.me_users?.avatar} {s.me_users?.name}{" "}
                      <span className="text-xs text-white/50">({s.me_users?.email})</span>
                    </p>
                    <span className="rounded-full bg-cranberry/30 px-3 py-1 text-xs font-semibold uppercase text-gold">
                      {s.kind}
                    </span>
                  </div>
                  {s.body && (
                    <p className="mb-2 whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-sm text-white/80">
                      {s.body}
                    </p>
                  )}
                  {s.link && (
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-2 block break-all text-sm text-gold underline"
                    >
                      {s.link}
                    </a>
                  )}
                  <textarea
                    value={feedbackDrafts[s.id] ?? ""}
                    onChange={(e) =>
                      setFeedbackDrafts((d) => ({ ...d, [s.id]: e.target.value }))
                    }
                    rows={2}
                    maxLength={2000}
                    placeholder="Feedback for the member (required for 'revise')…"
                    className="mb-3 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => review(s.id, "approved")}
                      disabled={busy === s.id}
                      className="flex min-h-10 items-center gap-1.5 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold hover:bg-green-600 disabled:opacity-50"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button
                      onClick={() => review(s.id, "revise")}
                      disabled={busy === s.id || !(feedbackDrafts[s.id] ?? "").trim()}
                      className="flex min-h-10 items-center gap-1.5 rounded-lg bg-cranberry px-4 py-2 text-sm font-semibold hover:bg-cranberry-dark disabled:opacity-50"
                    >
                      <FileEdit size={16} /> Request Revision
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Members */}
        <section className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-gold">
            <Users size={18} /> Members
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Modules</th>
                  <th className="px-4 py-3">XP</th>
                  <th className="px-4 py-3">Certified</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const passedCount = progress.filter(
                    (p) => p.user_id === m.id && p.passed
                  ).length;
                  const certified = awards.some(
                    (a) => a.user_id === m.id && a.badge_slug === "certified-masters-edge"
                  );
                  return (
                    <tr key={m.id} className="border-t border-white/10">
                      <td className="px-4 py-3">
                        {m.avatar} {m.name}
                        <span className="block text-xs text-white/40">{m.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        {passedCount}/{moduleCount}
                      </td>
                      <td className="px-4 py-3 text-gold">{m.xp.toLocaleString()}</td>
                      <td className="px-4 py-3">{certified ? "🏆" : "—"}</td>
                      <td className="px-4 py-3 text-white/50">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reviewed history */}
        {reviewed.length > 0 && (
          <section>
            <h2 className="mb-3 font-heading text-lg font-bold text-white/70">Review History</h2>
            <div className="space-y-2">
              {reviewed.slice(0, 20).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm"
                >
                  <span>
                    {s.me_users?.avatar} {s.me_users?.name} · {s.kind}
                  </span>
                  <span
                    className={
                      s.status === "approved" ? "text-green-400" : "text-red-300"
                    }
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
