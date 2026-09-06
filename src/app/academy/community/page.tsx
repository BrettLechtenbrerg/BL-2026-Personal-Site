"use client";

//==============================================================================
// Academy — community feed with channels (posts, comments, reactions).
// Plain-text rendering only — user content is never interpreted as HTML.
// Channel list lives in src/content/academy/channels.ts; the active channel
// is kept in the URL (?channel=) so links to a channel are shareable.
//==============================================================================

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MessageCircle, Pin, Send } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import { channels, channelBySlug, DEFAULT_CHANNEL } from "@/content/academy/channels";

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string | null;
  body: string;
  channel: string;
  pinned: boolean;
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
  return (
    <Suspense fallback={<Spinner />}>
      <Community />
    </Suspense>
  );
}

function Spinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="animate-spin text-gold" size={32} />
    </div>
  );
}

function Community() {
  const { user, loading } = useAcademyUser();
  const router = useRouter();
  const params = useSearchParams();
  const activeSlug = params.get("channel") ?? "";
  const active = channelBySlug(activeSlug); // undefined → "All posts"
  const isAdmin = user?.role === "admin";

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({ members: 0, posts: 0 });
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");
  const [draft, setDraft] = useState("");
  const [postTo, setPostTo] = useState(DEFAULT_CHANNEL);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Composer follows the channel you're viewing.
  useEffect(() => {
    if (active) setPostTo(active.slug);
  }, [active]);

  const load = useCallback(() => {
    fetch(`/api/academy/community?channel=${encodeURIComponent(activeSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setPosts(json.posts ?? []);
          setComments(json.comments ?? []);
          setReactions(json.reactions ?? []);
          setCounts(json.counts ?? {});
          setStats(json.stats ?? { members: 0, posts: 0 });
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, [activeSlug]);

  useEffect(load, [load]);

  const act = async (body: object) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/academy/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Something went wrong.");
        return false;
      }
      load();
      return true;
    } finally {
      setBusy(false);
    }
  };

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const ok = await act({ action: "post", body: draft.trim(), title: title.trim(), channel: postTo });
    if (ok) {
      setDraft("");
      setTitle("");
    }
  };

  const submitComment = async (postId: string) => {
    const body = (commentDrafts[postId] ?? "").trim();
    if (!body) return;
    await act({ action: "comment", postId, body });
    setCommentDrafts((d) => ({ ...d, [postId]: "" }));
  };

  const goTo = (slug: string) =>
    router.replace(slug ? `/academy/community?channel=${slug}` : "/academy/community");

  if (loading || !ready || !user) return <Spinner />;

  const postableChannels = channels.filter((c) => !c.adminOnly || isAdmin);
  const composerLocked = active?.adminOnly && !isAdmin;

  return (
    <div className="mx-auto flex max-w-5xl gap-6">
      {/* Channel sidebar — horizontal chips on mobile, column on desktop */}
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="sticky top-20 space-y-0.5">
          <ChannelLink label="All posts" emoji="🏠" activeNow={!active} onClick={() => goTo("")} />
          <div className="my-2 border-t border-white/10" />
          {channels.map((c) => (
            <ChannelLink
              key={c.slug}
              label={c.name}
              emoji={c.emoji}
              count={counts[c.slug]}
              activeNow={active?.slug === c.slug}
              onClick={() => goTo(c.slug)}
            />
          ))}

          {/* About card (GHL-style group summary) */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-heading font-bold">Master&apos;s Edge Academy</p>
            <p className="mt-1 text-xs text-white/60">
              Private group. We don&apos;t just talk about mastery — we train it, measure it, and prove it.
            </p>
            <div className="mt-3 grid grid-cols-2 divide-x divide-white/10 text-center">
              <Link href="/academy/members" className="hover:text-gold">
                <p className="font-heading text-lg font-bold">{stats.members}</p>
                <p className="text-[11px] text-white/50">Members</p>
              </Link>
              <div>
                <p className="font-heading text-lg font-bold">{stats.posts}</p>
                <p className="text-[11px] text-white/50">Posts</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-2 md:hidden">
          <Chip label="All" activeNow={!active} onClick={() => goTo("")} />
          {channels.map((c) => (
            <Chip
              key={c.slug}
              label={`${c.emoji} ${c.name}`}
              activeNow={active?.slug === c.slug}
              onClick={() => goTo(c.slug)}
            />
          ))}
        </div>

        <h1 className="mb-1 font-heading text-3xl font-bold">
          {active ? `${active.emoji} ${active.name}` : "Community"}
        </h1>
        <p className="mb-6 text-white/60">
          {active?.description ?? "Wins, questions, accountability. Members only."}
        </p>

        {/* Composer */}
        {composerLocked ? (
          <p className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            📣 Only Brett posts here. You can react and comment on any announcement.
          </p>
        ) : (
          <form
            onSubmit={submitPost}
            className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
          >
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="Title (optional)"
                className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/30 px-4 text-base font-semibold text-white placeholder-white/40 outline-none focus:border-gold"
              />
              <select
                value={postTo}
                onChange={(e) => setPostTo(e.target.value)}
                aria-label="Post to channel"
                className="min-h-11 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-gold"
              >
                {postableChannels.map((c) => (
                  <option key={c.slug} value={c.slug} className="bg-black">
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="What's on your mind?"
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
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </form>
        )}

        {/* Feed */}
        {posts.length === 0 ? (
          <p className="text-center text-white/50">No posts yet. Be the first to step up. 👊</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => {
              const a = author(post.me_users);
              const ch = channelBySlug(post.channel);
              const postComments = comments.filter((c) => c.post_id === post.id);
              const postReactions = reactions.filter((r) => r.post_id === post.id);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                  className={`rounded-2xl border bg-white/5 p-5 backdrop-blur-md ${
                    post.pinned ? "border-gold/50" : "border-white/10"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{a.avatar}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className="text-xs text-white/40">
                        {timeAgo(post.created_at)}
                        {ch && !active && (
                          <>
                            {" · "}
                            <button
                              onClick={() => goTo(ch.slug)}
                              className="text-gold/80 hover:text-gold"
                            >
                              {ch.emoji} {ch.name}
                            </button>
                          </>
                        )}
                      </p>
                    </div>
                    {post.pinned && (
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold">
                        <Pin size={12} /> Pinned
                      </span>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => act({ action: "pin", postId: post.id, pinned: !post.pinned })}
                        disabled={busy}
                        className={`${post.pinned ? "" : "ml-auto"} rounded-full p-2 text-white/40 hover:bg-white/10 hover:text-gold`}
                        aria-label={post.pinned ? "Unpin post" : "Pin post"}
                        title={post.pinned ? "Unpin" : "Pin to top"}
                      >
                        <Pin size={16} />
                      </button>
                    )}
                  </div>
                  {post.title && (
                    <h2 className="mb-1 font-heading text-lg font-bold">{post.title}</h2>
                  )}
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
    </div>
  );
}

function ChannelLink({
  label,
  emoji,
  count,
  activeNow,
  onClick,
}: {
  label: string;
  emoji: string;
  count?: number;
  activeNow: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={activeNow ? "page" : undefined}
      className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm transition-colors ${
        activeNow
          ? "bg-cranberry font-semibold text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="text-base">{emoji}</span>
      <span className="flex-1 truncate">{label}</span>
      {count ? <span className="text-xs text-white/50">{count}</span> : null}
    </button>
  );
}

function Chip({
  label,
  activeNow,
  onClick,
}: {
  label: string;
  activeNow: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={activeNow ? "page" : undefined}
      className={`min-h-9 shrink-0 whitespace-nowrap rounded-full border px-3 text-sm ${
        activeNow
          ? "border-cranberry bg-cranberry text-white"
          : "border-white/10 bg-white/5 text-white/75"
      }`}
    >
      {label}
    </button>
  );
}
