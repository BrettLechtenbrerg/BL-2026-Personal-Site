"use client";

//==============================================================================
// Comms Hub — Messaging
//==============================================================================
// Text or email leads without logging into Go High Level. Leads-only trim of
// PMMA's proven Power Hub Messaging Center (July 2026): this site has no
// roster, so the audience is every contact in Brett's personal GHL location
// (speaking inquiries, workbook leads, Master's Edge applications), filterable
// by GHL tag, newest first.
//
// Pick recipients, compose an SMS or email (with merge tags), preview the
// rendered message, and send through GHL's existing Twilio / email rails.
// Every attempt is logged append-only to hub_messages.
//
// Data:
//   GET  /api/hub/messaging/leads        → GHL contacts for the picker
//   POST /api/hub/messaging/send         → send + log
//   GET  /api/hub/messaging/log          → recent sends
//   GET  /api/hub/messaging/inbox        → recent GHL conversations
//   GET/POST …/inbox/[conversationId]    → thread + reply
//
// Gated by the HMAC session cookie — every /api/hub/* route verifies it
// server-side; this page just redirects to /hub when the check fails.
//==============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Mail,
  MessageSquare,
  Loader2,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  ListChecks,
  Eye,
  History,
  Megaphone,
  Tag,
  Inbox,
  RefreshCw,
  CornerDownLeft,
  LogOut,
  UserPlus,
  Trash2,
} from "lucide-react";

interface Lead {
  contact_id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  date_added: string | null;
}

interface SendResultRow {
  contact_id: string;
  recipient_name: string;
  status: "sent" | "skipped" | "failed";
  skip_reason?: string;
  ghl_message_id?: string;
  error?: string;
}

interface LogRow {
  id: string;
  recipient_name: string | null;
  channel: "sms" | "email";
  to_value: string | null;
  subject: string | null;
  body: string | null;
  status: "sent" | "skipped" | "failed";
  skip_reason: string | null;
  error: string | null;
  sent_by: string | null;
  created_at: string;
}

type Channel = "sms" | "email";
type Tab = "compose" | "inbox" | "log";

interface Conversation {
  conversation_id: string;
  contact_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  last_message_body: string;
  last_message_at: string | null;
  last_message_channel: "sms" | "email" | "other";
  last_message_direction: "inbound" | "outbound" | "unknown";
  unread_count: number;
}

interface ThreadMessage {
  id: string;
  direction: "inbound" | "outbound";
  channel: "sms" | "email" | "other";
  body: string;
  date_added: string | null;
  status: string | null;
}

const MERGE_TAGS = ["first_name", "last_name"] as const;

const STATUS_BADGE: Record<string, string> = {
  sent: "bg-emerald-100 text-emerald-700",
  skipped: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
};

const CRANBERRY = "#9B1B30";
const CRANBERRY_DARK = "#7A1526";

export default function HubMessagingPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("compose");

  // Leads audience
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadTags, setLeadTags] = useState<Array<{ tag: string; count: number }>>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [leadsTruncated, setLeadsTruncated] = useState(false);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  // Compose
  const [channel, setChannel] = useState<Channel>("sms");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [staffName, setStaffName] = useState("");

  // Send flow
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [results, setResults] = useState<SendResultRow[] | null>(null);

  // Lead management (add / delete)
  const [addingLead, setAddingLead] = useState(false);
  const [newLead, setNewLead] = useState({ first_name: "", last_name: "", email: "", phone: "", tags: "" });
  const [savingLead, setSavingLead] = useState(false);
  const [addLeadError, setAddLeadError] = useState<string | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Log
  const [log, setLog] = useState<LogRow[]>([]);
  const [loadingLog, setLoadingLog] = useState(false);

  // Inbox
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [inboxError, setInboxError] = useState<string | null>(null);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [thread, setThread] = useState<ThreadMessage[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [threadNotice, setThreadNotice] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replySent, setReplySent] = useState(false);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // Land on the NEWEST message when a thread loads or a reply is appended.
  useEffect(() => {
    if (thread.length > 0) {
      threadEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [thread]);

  // Session guard for API responses — a 401 anywhere bounces to the login.
  const guard = useCallback(
    (res: Response) => {
      if (res.status === 401) {
        router.replace("/hub");
        return true;
      }
      return false;
    },
    [router]
  );

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    setLeadsError(null);
    try {
      const res = await fetch("/api/hub/messaging/leads");
      if (guard(res)) return;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load leads.");
      setLeads(json.leads ?? []);
      setLeadTags(json.tags ?? []);
      setLeadsTruncated(Boolean(json.truncated));
    } catch (err) {
      setLeadsError(err instanceof Error ? err.message : "Failed to load leads.");
    } finally {
      setLoadingLeads(false);
    }
  }, [guard]);

  const loadLog = useCallback(async () => {
    setLoadingLog(true);
    try {
      const res = await fetch("/api/hub/messaging/log");
      if (guard(res)) return;
      const json = await res.json();
      if (res.ok) setLog(json.messages ?? []);
    } finally {
      setLoadingLog(false);
    }
  }, [guard]);

  const loadInbox = useCallback(async () => {
    setLoadingInbox(true);
    setInboxError(null);
    try {
      const res = await fetch("/api/hub/messaging/inbox");
      if (guard(res)) return;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load the inbox.");
      setConversations(json.conversations ?? []);
    } catch (err) {
      setInboxError(err instanceof Error ? err.message : "Failed to load the inbox.");
    } finally {
      setLoadingInbox(false);
    }
  }, [guard]);

  const openConversation = useCallback(
    async (conv: Conversation) => {
      setActiveConv(conv);
      setThread([]);
      setThreadNotice(null);
      setReply("");
      setReplyError(null);
      setReplySent(false);
      setLoadingThread(true);
      try {
        const res = await fetch(
          `/api/hub/messaging/inbox/${encodeURIComponent(conv.conversation_id)}`
        );
        if (guard(res)) return;
        const json = await res.json();
        if (json.scope_error) {
          setThreadNotice(json.error || "Thread view needs an extra GHL scope.");
        } else if (!res.ok) {
          setThreadNotice(json.error || "Failed to load the thread.");
        } else {
          setThread(json.messages ?? []);
        }
      } catch {
        setThreadNotice("Failed to load the thread.");
      } finally {
        setLoadingThread(false);
      }
    },
    [guard]
  );

  const sendReply = useCallback(async () => {
    if (!activeConv || !reply.trim()) return;
    setSendingReply(true);
    setReplyError(null);
    setReplySent(false);
    // Reply on the channel the conversation lives on; 'other' falls back to
    // SMS when the contact has a phone, else email.
    const replyChannel: Channel =
      activeConv.last_message_channel === "email"
        ? "email"
        : activeConv.last_message_channel === "sms"
          ? "sms"
          : activeConv.phone
            ? "sms"
            : "email";
    try {
      const res = await fetch(
        `/api/hub/messaging/inbox/${encodeURIComponent(activeConv.conversation_id)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact_id: activeConv.contact_id,
            channel: replyChannel,
            body: reply,
            sent_by: staffName || undefined,
            recipient_name: activeConv.name,
            to_value: replyChannel === "sms" ? activeConv.phone : activeConv.email,
          }),
        }
      );
      if (guard(res)) return;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Reply failed.");
      setReply("");
      setReplySent(true);
      // Optimistically append to the visible thread.
      setThread((prev) => [
        ...prev,
        {
          id: json.ghl_message_id || `local-${Date.now()}`,
          direction: "outbound",
          channel: replyChannel,
          body: reply,
          date_added: new Date().toISOString(),
          status: "sent",
        },
      ]);
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Reply failed.");
    } finally {
      setSendingReply(false);
    }
  }, [activeConv, reply, staffName, guard]);

  useEffect(() => {
    loadLeads();
    const saved = localStorage.getItem("bl_hub_staff_name");
    if (saved) setStaffName(saved);
  }, [loadLeads]);

  useEffect(() => {
    if (staffName) localStorage.setItem("bl_hub_staff_name", staffName);
  }, [staffName]);

  useEffect(() => {
    if (tab === "log") loadLog();
    if (tab === "inbox") loadInbox();
  }, [tab, loadLog, loadInbox]);

  // Filtered leads (search + tag + channel reachability), newest first.
  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (tagFilter !== "all" && !l.tags.includes(tagFilter)) return false;
      if (q) {
        const hay = `${l.name} ${l.email ?? ""} ${l.phone ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (channel === "sms" && !l.phone) return false;
      if (channel === "email" && !l.email) return false;
      return true;
    });
  }, [leads, search, tagFilter, channel]);

  const selectedLeadRows = useMemo(
    () => leads.filter((l) => selectedLeads.has(l.contact_id)),
    [leads, selectedLeads]
  );

  const totalSelected = selectedLeads.size;

  const toggleLead = (id: string) =>
    setSelectedLeads((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectAllFilteredLeads = () =>
    setSelectedLeads((prev) => {
      const next = new Set(prev);
      filteredLeads.forEach((l) => next.add(l.contact_id));
      return next;
    });

  const clearSelection = () => setSelectedLeads(new Set());

  const insertTag = (tag: string) => setBody((b) => `${b}{{${tag}}}`);

  const saveNewLead = useCallback(async () => {
    setSavingLead(true);
    setAddLeadError(null);
    try {
      const res = await fetch("/api/hub/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: newLead.first_name,
          last_name: newLead.last_name,
          email: newLead.email,
          phone: newLead.phone,
          tags: newLead.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (guard(res)) return;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to add the lead.");
      setAddingLead(false);
      setNewLead({ first_name: "", last_name: "", email: "", phone: "", tags: "" });
      await loadLeads();
    } catch (err) {
      setAddLeadError(err instanceof Error ? err.message : "Failed to add the lead.");
    } finally {
      setSavingLead(false);
    }
  }, [newLead, guard, loadLeads]);

  const confirmDeleteLead = useCallback(async () => {
    if (!deletingLead) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/hub/leads/${encodeURIComponent(deletingLead.contact_id)}`, {
        method: "DELETE",
      });
      if (guard(res)) return;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete the lead.");
      setSelectedLeads((prev) => {
        const next = new Set(prev);
        next.delete(deletingLead.contact_id);
        return next;
      });
      setDeletingLead(null);
      await loadLeads();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete the lead.");
    } finally {
      setDeleteBusy(false);
    }
  }, [deletingLead, guard, loadLeads]);

  // Live preview against the first selected lead (or a sample).
  const previewVars = useMemo(() => {
    const l = selectedLeadRows[0];
    return {
      first_name: l?.first_name || (l ? "" : "Sample"),
      last_name: l?.last_name || (l ? "" : "Lead"),
    } as Record<string, string>;
  }, [selectedLeadRows]);

  const render = (text: string) =>
    text.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_m, t: string) =>
      previewVars[t] !== undefined ? previewVars[t] : ""
    );

  const canSend =
    totalSelected > 0 &&
    body.trim().length > 0 &&
    (channel === "sms" || subject.trim().length > 0);

  const doSend = useCallback(async () => {
    setSending(true);
    setSendError(null);
    setResults(null);
    try {
      const res = await fetch("/api/hub/messaging/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          leads: selectedLeadRows.map((l) => ({
            contact_id: l.contact_id,
            first_name: l.first_name,
            last_name: l.last_name,
            name: l.name,
            email: l.email,
            phone: l.phone,
          })),
          body,
          subject: channel === "email" ? subject : undefined,
          marketing,
          sent_by: staffName || undefined,
        }),
      });
      if (guard(res)) return;
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Send failed.");
      setResults(json.results ?? []);
      if (json.scope_error) {
        setSendError(
          "GHL messaging scope not enabled — add `conversations/message.write` to the PIT token. Nothing was delivered."
        );
      } else {
        // Message went out — clear the recipients so the next send doesn't
        // also re-blast the people we just messaged. Results panel stays up.
        setSelectedLeads(new Set());
      }
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setSending(false);
      setConfirming(false);
    }
  }, [channel, selectedLeadRows, body, subject, marketing, staffName, guard]);

  const logout = async () => {
    await fetch("/api/hub/auth", { method: "DELETE" }).catch(() => {});
    router.replace("/hub");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comms Hub — Messaging</h1>
            <p className="text-sm text-gray-500 mt-1">
              Text or email leads through GHL — no GHL login needed.
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mt-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setTab("compose")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              tab === "compose"
                ? "bg-[#9B1B30] text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Send className="w-4 h-4" /> Compose
          </button>
          <button
            onClick={() => setTab("inbox")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              tab === "inbox"
                ? "bg-[#9B1B30] text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Inbox className="w-4 h-4" /> Inbox
            {conversations.some((c) => c.unread_count > 0) && (
              <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5">
                {conversations.reduce((n, c) => n + c.unread_count, 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("log")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              tab === "log"
                ? "bg-[#9B1B30] text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <History className="w-4 h-4" /> Log
          </button>
        </div>

        {tab === "compose" ? (
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            {/* LEFT — recipient picker */}
            <section className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 inline-flex items-center gap-2">
                  <ListChecks className="w-4 h-4" /> Recipients
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setAddLeadError(null);
                      setAddingLead(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9B1B30] hover:underline"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add lead
                  </button>
                  <span className="text-xs text-gray-500">{totalSelected} selected</span>
                </div>
              </div>

              {/* Channel toggle */}
              <div className="flex gap-2 mb-3">
                {(["sms", "email"] as Channel[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setChannel(c)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                      channel === c
                        ? "bg-[#9B1B30] text-white"
                        : "bg-gray-50 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {c === "sms" ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    {c === "sms" ? "SMS" : "Email"}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="relative mb-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or phone"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                />
              </div>
              <div className="flex gap-2 mb-3">
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="flex-1 px-2 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                >
                  <option value="all">All tags</option>
                  {leadTags.map(({ tag, count }) => (
                    <option key={tag} value={tag}>
                      {tag} ({count})
                    </option>
                  ))}
                </select>
                <button
                  onClick={loadLeads}
                  disabled={loadingLeads}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  title="Refresh leads from GHL"
                >
                  {loadingLeads ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
                </button>
              </div>

              <div className="flex items-center justify-between mb-2 text-xs">
                <button
                  onClick={selectAllFilteredLeads}
                  className="text-[#9B1B30] font-medium hover:underline"
                >
                  Select all {filteredLeads.length}
                </button>
                {totalSelected > 0 && (
                  <button onClick={clearSelection} className="text-gray-500 hover:underline">
                    Clear
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[28rem] overflow-y-auto -mx-1 px-1 space-y-1">
                {loadingLeads ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm py-6 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading leads from GHL…
                  </div>
                ) : leadsError ? (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
                    <X className="w-4 h-4 shrink-0" /> {leadsError}
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">
                    No reachable leads for this channel + filter.
                  </p>
                ) : (
                  <>
                    {leadsTruncated && (
                      <p className="text-[11px] text-amber-600 px-1 pb-1">
                        Showing the {leads.length} most recent contacts — older ones
                        aren&apos;t listed.
                      </p>
                    )}
                    {filteredLeads.map((l) => {
                      const isSel = selectedLeads.has(l.contact_id);
                      return (
                        <label
                          key={l.contact_id}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer border ${
                            isSel
                              ? "border-[#9B1B30] bg-[#9B1B30]/5"
                              : "border-transparent hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleLead(l.contact_id)}
                            className="accent-[#9B1B30]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {l.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {channel === "sms" ? l.phone : l.email}
                              {l.date_added
                                ? ` · added ${new Date(l.date_added).toLocaleDateString()}`
                                : ""}
                            </p>
                          </div>
                          {l.tags.length > 0 && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 max-w-[10rem] truncate"
                              title={l.tags.join(", ")}
                            >
                              <Tag className="w-3 h-3 shrink-0" />
                              {l.tags[0]}
                              {l.tags.length > 1 ? ` +${l.tags.length - 1}` : ""}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteError(null);
                              setDeletingLead(l);
                            }}
                            title={`Delete ${l.name} from GHL`}
                            className="shrink-0 text-gray-300 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </label>
                      );
                    })}
                  </>
                )}
              </div>
            </section>

            {/* RIGHT — compose + preview */}
            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <h2 className="font-semibold text-gray-900 inline-flex items-center gap-2">
                <Send className="w-4 h-4" /> Compose
              </h2>

              {channel === "email" && (
                <div>
                  <label className="text-xs text-gray-600">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email subject"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-600">Message</label>
                  <div className="flex flex-wrap gap-1">
                    {MERGE_TAGS.map((t) => (
                      <button
                        key={t}
                        onClick={() => insertTag(t)}
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        {`{{${t}}}`}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  placeholder={`Hi {{first_name}}, …`}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                />
                {channel === "sms" && (
                  <p className="text-[11px] text-gray-400 mt-1">{body.length} characters</p>
                )}
              </div>

              {/* Marketing toggle (enforces SMS consent) */}
              {channel === "sms" && (
                <label className="flex items-start gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="accent-[#9B1B30] mt-0.5"
                  />
                  <Megaphone className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    This is a <strong>marketing</strong> text (only sends to contacts who
                    opted into marketing SMS). Leave off for operational messages like
                    &ldquo;here&apos;s the workbook link.&rdquo;
                  </span>
                </label>
              )}

              {/* Live preview */}
              <div>
                <p className="text-xs text-gray-600 inline-flex items-center gap-1 mb-1">
                  <Eye className="w-3.5 h-3.5" /> Preview
                  {selectedLeadRows[0] ? ` (${selectedLeadRows[0].name})` : " (sample)"}
                </p>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-900 whitespace-pre-wrap min-h-[4rem]">
                  {channel === "email" && subject && (
                    <p className="font-semibold mb-1">{render(subject)}</p>
                  )}
                  {body ? (
                    render(body)
                  ) : (
                    <span className="text-gray-400">Your message preview…</span>
                  )}
                </div>
              </div>

              {/* Sent by */}
              <div>
                <label className="text-xs text-gray-600">Sent by</label>
                <input
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Your name (stamped on each send)"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                />
              </div>

              {sendError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {sendError}
                </div>
              )}

              <button
                disabled={!canSend || sending}
                onClick={() => setConfirming(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#9B1B30] text-white text-sm font-medium hover:bg-[#7A1526] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send to {totalSelected} {totalSelected === 1 ? "recipient" : "recipients"}
              </button>

              {/* Results */}
              {results && (
                <div className="rounded-lg border border-gray-200 p-3">
                  {!sendError && results.some((r) => r.status === "sent") && (
                    <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
                      ✅ Message handed to GHL for delivery. Your selection was
                      cleared on purpose so the same people can&apos;t be
                      double-messaged — pick new recipients to send again.
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900 mb-2 inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Results
                  </p>
                  <div className="flex gap-3 text-xs mb-2">
                    <span className="text-emerald-700">
                      {results.filter((r) => r.status === "sent").length} sent
                    </span>
                    <span className="text-gray-500">
                      {results.filter((r) => r.status === "skipped").length} skipped
                    </span>
                    <span className="text-red-600">
                      {results.filter((r) => r.status === "failed").length} failed
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {results.map((r) => (
                      <div key={r.contact_id} className="flex items-center gap-2 text-xs">
                        <span className={`px-1.5 py-0.5 rounded ${STATUS_BADGE[r.status]}`}>
                          {r.status}
                        </span>
                        <span className="text-gray-700 truncate">{r.recipient_name}</span>
                        {(r.skip_reason || r.error) && (
                          <span className="text-gray-400 truncate">
                            — {r.skip_reason || r.error}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : tab === "inbox" ? (
          /* INBOX TAB */
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            {/* LEFT — conversation list */}
            <section className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 inline-flex items-center gap-2">
                  <Inbox className="w-4 h-4" /> Conversations
                </h2>
                <button
                  onClick={loadInbox}
                  disabled={loadingInbox}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingInbox ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
              <div className="max-h-[32rem] overflow-y-auto -mx-1 px-1 space-y-1">
                {loadingInbox && conversations.length === 0 ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm py-6 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading conversations…
                  </div>
                ) : inboxError ? (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {inboxError}
                  </div>
                ) : conversations.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">No conversations yet.</p>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.conversation_id}
                      onClick={() => openConversation(c)}
                      className={`w-full text-left flex items-start gap-3 px-3 py-2 rounded-lg border ${
                        activeConv?.conversation_id === c.conversation_id
                          ? "border-[#9B1B30] bg-[#9B1B30]/5"
                          : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                          {c.unread_count > 0 && (
                            <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 shrink-0">
                              {c.unread_count}
                            </span>
                          )}
                          {c.last_message_direction === "inbound" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                              needs reply
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {c.last_message_body || "—"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-gray-400">
                          {c.last_message_at
                            ? new Date(c.last_message_at).toLocaleDateString()
                            : ""}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase">
                          {c.last_message_channel}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            {/* RIGHT — thread + reply */}
            <section className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
              {!activeConv ? (
                <p className="text-sm text-gray-400 py-10 text-center">
                  Pick a conversation to read the thread and reply.
                </p>
              ) : (
                <>
                  <div className="mb-3 pb-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{activeConv.name}</p>
                    <p className="text-xs text-gray-500">
                      {activeConv.phone ?? ""}
                      {activeConv.phone && activeConv.email ? " · " : ""}
                      {activeConv.email ?? ""}
                    </p>
                  </div>

                  <div className="flex-1 min-h-[16rem] max-h-[22rem] overflow-y-auto space-y-2 pr-1">
                    {loadingThread ? (
                      <div className="flex items-center gap-2 text-gray-400 text-sm py-6 justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading thread…
                      </div>
                    ) : threadNotice ? (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 text-xs">
                        {threadNotice}
                      </div>
                    ) : thread.length === 0 ? (
                      <p className="text-sm text-gray-400 py-6 text-center">No messages loaded.</p>
                    ) : (
                      <>
                        {thread.map((m) => (
                          <div
                            key={m.id}
                            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                              m.direction === "inbound"
                                ? "bg-gray-100 text-gray-900 mr-auto"
                                : "bg-[#9B1B30] text-white ml-auto"
                            }`}
                          >
                            {m.body || <span className="opacity-60">(no text)</span>}
                            <p
                              className={`text-[10px] mt-1 ${
                                m.direction === "inbound" ? "text-gray-400" : "text-white/60"
                              }`}
                            >
                              {m.date_added ? new Date(m.date_added).toLocaleString() : ""}
                            </p>
                          </div>
                        ))}
                        <div ref={threadEndRef} />
                      </>
                    )}
                  </div>

                  {/* Reply box — works even when the thread view is scope-blocked */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {replyError && (
                      <div className="mb-2 flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {replyError}
                      </div>
                    )}
                    {replySent && (
                      <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-xs">
                        ✅ Reply handed to GHL for delivery.
                      </div>
                    )}
                    <div className="flex gap-2">
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={2}
                        placeholder={`Reply to ${activeConv.name}…`}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                      />
                      <button
                        onClick={sendReply}
                        disabled={!reply.trim() || sendingReply}
                        className="self-end inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#9B1B30] text-white text-sm font-medium hover:bg-[#7A1526] disabled:opacity-40"
                      >
                        {sendingReply ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CornerDownLeft className="w-4 h-4" />
                        )}
                        Reply
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Replies send over{" "}
                      {activeConv.last_message_channel === "email" ? "email" : "SMS"} through
                      GHL and are logged like every Comms Hub send.
                    </p>
                  </div>
                </>
              )}
            </section>
          </div>
        ) : (
          /* LOG TAB */
          <section className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loadingLog ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading log…
              </div>
            ) : log.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No messages sent yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-2">When</th>
                      <th className="text-left px-4 py-2">Recipient</th>
                      <th className="text-left px-4 py-2">Channel</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">Message</th>
                      <th className="text-left px-4 py-2">By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {log.map((m) => (
                      <tr key={m.id}>
                        <td className="px-4 py-2 text-gray-500 whitespace-nowrap">
                          {new Date(m.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-gray-900">{m.recipient_name || "—"}</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center gap-1 text-gray-600">
                            {m.channel === "sms" ? (
                              <MessageSquare className="w-3.5 h-3.5" />
                            ) : (
                              <Mail className="w-3.5 h-3.5" />
                            )}
                            {m.channel}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-xs ${STATUS_BADGE[m.status]}`}
                          >
                            {m.status}
                          </span>
                          {m.skip_reason && (
                            <span className="text-xs text-gray-400 ml-1">{m.skip_reason}</span>
                          )}
                        </td>
                        <td
                          className="px-4 py-2 text-gray-600 max-w-xs truncate"
                          title={m.body || ""}
                        >
                          {m.subject ? `${m.subject}: ` : ""}
                          {m.body || m.error || "—"}
                        </td>
                        <td className="px-4 py-2 text-gray-500">{m.sent_by || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Add-lead modal */}
      {addingLead && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4 inline-flex items-center gap-2">
              <UserPlus className="w-5 h-5" style={{ color: CRANBERRY }} /> Add lead
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">First name *</label>
                  <input
                    value={newLead.first_name}
                    onChange={(e) => setNewLead((p) => ({ ...p, first_name: e.target.value }))}
                    autoFocus
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Last name</label>
                  <input
                    value={newLead.last_name}
                    onChange={(e) => setNewLead((p) => ({ ...p, last_name: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">Cell phone</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="801-555-1234"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Email</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead((p) => ({ ...p, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                />
                <p className="text-[11px] text-gray-400 mt-1">At least one of phone or email is required.</p>
              </div>
              <div>
                <label className="text-xs text-gray-600">Tags (comma-separated)</label>
                <input
                  value={newLead.tags}
                  onChange={(e) => setNewLead((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="speaking-inquiry, hot"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900"
                />
              </div>
            </div>
            {addLeadError && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {addLeadError}
              </div>
            )}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setAddingLead(false)}
                disabled={savingLead}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveNewLead}
                disabled={savingLead || !newLead.first_name.trim() || (!newLead.phone.trim() && !newLead.email.trim())}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#9B1B30] text-white text-sm font-medium hover:bg-[#7A1526] disabled:opacity-40"
              >
                {savingLead ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Add lead
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete-lead confirm modal */}
      {deletingLead && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 inline-flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" /> Delete lead
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Permanently delete <strong>{deletingLead.name}</strong>
              {deletingLead.email ? ` (${deletingLead.email})` : deletingLead.phone ? ` (${deletingLead.phone})` : ""}{" "}
              from GHL?
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
              This removes the contact and its conversation history from Go High
              Level — not just from this list. This cannot be undone from the hub.
            </p>
            {deleteError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {deleteError}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingLead(null)}
                disabled={deleteBusy}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteLead}
                disabled={deleteBusy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm-count modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 inline-flex items-center gap-2">
              <Send className="w-5 h-5" style={{ color: CRANBERRY }} /> Confirm send
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Sending a <strong>{channel === "sms" ? "text message" : "email"}</strong> to{" "}
              <strong>{totalSelected}</strong>{" "}
              {totalSelected === 1 ? "recipient" : "recipients"}
              {marketing && channel === "sms" ? " (marketing — consent enforced)" : ""}.
            </p>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-900 whitespace-pre-wrap max-h-40 overflow-y-auto mb-4">
              {channel === "email" && subject && (
                <p className="font-semibold mb-1">{render(subject)}</p>
              )}
              {render(body)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                disabled={sending}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={doSend}
                disabled={sending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: sending ? CRANBERRY_DARK : CRANBERRY }}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
