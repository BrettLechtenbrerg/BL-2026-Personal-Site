"use client";

//==============================================================================
// Academy — community feed (posts, comments, reactions). Plain-text rendering
// only — user content is never interpreted as HTML.
//==============================================================================

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  body: string;
  created_at: string;
  me_users: Author | Author[] | null;
}

interface Comment {
  id: string;
  post_id: string;
  body: string;
  created_at: string;
  me_users: Author | Author[] | null;
}

interface Reaction {
  post_id: string;
  user_id: string;
  emoji: string;
}

const REACTION_EMOJI = ["👊", "🔥", "💡", "👏"];

function author(a: Author | Author[] | null): Author {
  if (Array.isArray(a)) return a[0] ?? { id: "", name: "Member", avatar: "🥋" };
  return a ?? { id: "", name: "Member", avatar: "🥋" };
}

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function CommunityPage() {
  const { user, loading } = useAcademyUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch("/api/academy/community")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setPosts(json.posts ?? []);
          setComments(json.comments ?? []);
          setReactions(json.reactions ?? []);
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  useEffect(load, [load]);

  const act = async (body: object) => {
    setBusy(true);
    try {
      await fetch("/api/academy/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      load();
    } finally {
      setBusy(false);
    }
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    await act({ action: "post", body: draft.trim() });
    setDraft("");
  };

  const submitComment = async (postId: string) => {
    const body = (commentDrafts[postId] ?? "").trim();
    if (!body) return;
    await act({ action: "comment", postId, body });
    setCommentDrafts((d) => ({ ...d, [postId]: "" }));
  };

  if (loading || !ready || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-heading text-3xl font-bold">Community</h1>
      <p className="mb-6 text-white/60">Wins, questions, accountability. Members only.</p>

      {/* Composer */}
      <form
        onSubmit={submitPost}
        className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Share a win, ask a question…"
          className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-base text-white placeholder-white/40 outline-none focus:border-gold"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-white/40">{draft.length}/2000</span>
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-cranberry px-5 py-2 font-heading font-bold text-white hover:bg-cranberry-dark disabled:opacity-50"
          >
            <Send size={16} /> Post <span className="text-xs font-normal text-white/70">+10 XP</span>
          </button>
        </div>
      </form>

      {/* Feed */}
      {posts.length === 0 ? (
        <p className="text-center text-white/50">No posts yet. Be the first to step up. 👊</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => {
            const a = author(post.me_users);
            const postComments = comments.filter((c) => c.post_id === post.id);
            const postReactions = reactions.filter((r) => r.post_id === post.id);
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{a.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold">{a.name}</p>
                    <p className="text-xs text-white/40">{timeAgo(post.created_at)}</p>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
                  {post.body}
                </p>

                {/* Reactions + comment toggle */}
                <div className="mt-3 flex items-center gap-1.5">
                  {REACTION_EMOJI.map((emoji) => {
                    const count = postReactions.filter((r) => r.emoji === emoji).length;
                    const mine = postReactions.some(
                      (r) => r.emoji === emoji && r.user_id === user.id
                    );
                    return (
                      <button
                        key={emoji}
                        onClick={() => act({ action: "react", postId: post.id, emoji })}
                        disabled={busy}
                        className={`flex min-h-9 items-center gap-1 rounded-full border px-2.5 py-1 text-sm transition-colors ${
                          mine
                            ? "border-gold/60 bg-gold/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {emoji} {count > 0 && <span className="text-xs">{count}</span>}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setOpenComments((o) => ({ ...o, [post.id]: !o[post.id] }))
                    }
                    className="ml-auto flex min-h-9 items-center gap-1.5 rounded-full px-2.5 py-1 text-sm text-white/60 hover:text-white"
                  >
                    <MessageCircle size={16} /> {postComments.length}
                  </button>
                </div>

                {/* Comments */}
                {openComments[post.id] && (
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    {postComments.map((c) => {
                      const ca = author(c.me_users);
                      return (
                        <div key={c.id} className="flex gap-2 text-sm">
                          <span className="text-lg">{ca.avatar}</span>
                          <div>
                            <span className="font-semibold">{ca.name}</span>{" "}
                            <span className="text-xs text-white/40">{timeAgo(c.created_at)}</span>
                            <p className="whitespace-pre-wrap text-white/80">{c.body}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentDrafts[post.id] ?? ""}
                        onChange={(e) =>
                          setCommentDrafts((d) => ({ ...d, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitComment(post.id);
                        }}
                        maxLength={2000}
                        placeholder="Reply… (+5 XP)"
                        className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 text-base text-white placeholder-white/40 outline-none focus:border-gold"
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        disabled={busy}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-cranberry text-white hover:bg-cranberry-dark disabled:opacity-50"
                        aria-label="Send reply"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
