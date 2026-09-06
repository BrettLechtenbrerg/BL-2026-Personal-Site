"use client";

//==============================================================================
// Academy — events: month calendar + upcoming list (join link, add-to-Google-
// Calendar) + past calls with recordings. Admins get an inline create form,
// a "recording link" field on past events, and delete.
// All times are stored UTC and shown in the member's local timezone.
//==============================================================================

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Loader2, Plus, Trash2, Video } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";

interface AcademyEvent {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  link: string | null;
  recording_url: string | null;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

/** Google Calendar "add event" deep link — no dependency, works everywhere. */
function gcalUrl(e: AcademyEvent): string {
  const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.starts_at)}/${stamp(e.ends_at)}`,
    details: [e.description, e.link].filter(Boolean).join("\n\n"),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export default function EventsPage() {
  const { user, loading } = useAcademyUser();
  const isAdmin = user?.role === "admin";
  const [events, setEvents] = useState<AcademyEvent[]>([]);
  const [ready, setReady] = useState(false);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch("/api/academy/events")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setEvents(json.events ?? []);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);
  useEffect(load, [load]);

  const call = async (method: string, body: object) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/academy/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setError((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
        return false;
      }
      load();
      return true;
    } finally {
      setBusy(false);
    }
  };

  if (loading || !ready || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.ends_at).getTime() >= now);
  const past = events.filter((e) => new Date(e.ends_at).getTime() < now).reverse();

  // Calendar grid for the visible month.
  const first = month;
  const gridStart = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { d, events: events.filter((e) => sameDay(new Date(e.starts_at), d)) };
  });
  const today = new Date();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-heading text-3xl font-bold">
            <CalendarDays className="text-gold" /> Events
          </h1>
          <p className="text-white/60">
            Office hours and live calls. Times shown in your timezone (
            {Intl.DateTimeFormat().resolvedOptions().timeZone}).
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-cranberry px-4 font-heading font-bold text-white hover:bg-cranberry-dark"
          >
            <Plus size={16} /> Event
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {isAdmin && showForm && (
        <EventForm
          busy={busy}
          onSubmit={async (body) => {
            if (await call("POST", body)) setShowForm(false);
          }}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">
              {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                aria-label="Previous month"
                className="flex min-h-9 min-w-9 items-center justify-center rounded-lg hover:bg-white/10"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
                className="min-h-9 rounded-lg px-3 text-sm hover:bg-white/10"
              >
                Today
              </button>
              <button
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                aria-label="Next month"
                className="flex min-h-9 min-w-9 items-center justify-center rounded-lg hover:bg-white/10"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 text-xs">
            {DAYS.map((d) => (
              <div key={d} className="bg-black/40 py-1.5 text-center font-semibold text-white/50">
                {d}
              </div>
            ))}
            {cells.map(({ d, events: dayEvents }) => {
              const inMonth = d.getMonth() === month.getMonth();
              const isToday = sameDay(d, today);
              return (
                <div
                  key={d.toISOString()}
                  className={`min-h-[64px] bg-black/30 p-1 sm:min-h-[80px] ${inMonth ? "" : "opacity-30"} ${
                    isToday ? "ring-1 ring-inset ring-gold" : ""
                  }`}
                >
                  <span className={`text-[11px] ${isToday ? "font-bold text-gold" : "text-white/50"}`}>
                    {d.getDate()}
                  </span>
                  {dayEvents.map((e) => (
                    <a
                      key={e.id}
                      href={`#event-${e.id}`}
                      title={e.title}
                      className="mt-0.5 block truncate rounded bg-cranberry/80 px-1 py-0.5 text-[11px] text-white hover:bg-cranberry"
                    >
                      {fmtTime(e.starts_at)} {e.title}
                    </a>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        {/* Upcoming */}
        <aside className="space-y-3">
          <h2 className="font-heading text-lg font-bold">Upcoming</h2>
          {upcoming.length === 0 && (
            <p className="text-sm text-white/50">Nothing scheduled yet. Check back soon.</p>
          )}
          {upcoming.map((e) => (
            <EventCard key={e.id} event={e} isAdmin={isAdmin} busy={busy} call={call} />
          ))}
        </aside>
      </div>

      {/* Past + recordings */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold">
            <Video size={18} className="text-gold" /> Past calls & recordings
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e} isAdmin={isAdmin} busy={busy} call={call} past />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EventCard({
  event: e,
  isAdmin,
  busy,
  call,
  past = false,
}: {
  event: AcademyEvent;
  isAdmin: boolean;
  busy: boolean;
  call: (method: string, body: object) => Promise<boolean>;
  past?: boolean;
}) {
  const [rec, setRec] = useState(e.recording_url ?? "");
  const start = new Date(e.starts_at);
  return (
    <article
      id={`event-${e.id}`}
      className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-black/40">
          <span className="font-heading text-lg font-bold leading-none text-gold">{start.getDate()}</span>
          <span className="text-[10px] uppercase text-white/50">
            {start.toLocaleDateString(undefined, { month: "short" })}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold leading-tight">{e.title}</h3>
          <p className="text-xs text-white/50">
            {fmtDate(e.starts_at)} · {fmtTime(e.starts_at)}–{fmtTime(e.ends_at)}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (confirm(`Delete "${e.title}"?`)) call("DELETE", { id: e.id });
            }}
            disabled={busy}
            aria-label="Delete event"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {e.description && (
        <p className="mt-2 whitespace-pre-wrap text-sm text-white/75">{e.description}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {!past && e.link && (
          <a
            href={e.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-9 items-center rounded-lg bg-cranberry px-3 font-semibold text-white hover:bg-cranberry-dark"
          >
            Join call
          </a>
        )}
        {!past && (
          <a
            href={gcalUrl(e)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-9 items-center rounded-lg border border-white/15 px-3 text-white/80 hover:bg-white/10"
          >
            Add to calendar
          </a>
        )}
        {past && e.recording_url && (
          <a
            href={e.recording_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-9 items-center gap-1.5 rounded-lg bg-cranberry px-3 font-semibold text-white hover:bg-cranberry-dark"
          >
            <Video size={14} /> Watch recording
          </a>
        )}
      </div>
      {past && isAdmin && (
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            call("PATCH", { id: e.id, recordingUrl: rec });
          }}
          className="mt-3 flex gap-2"
        >
          <input
            type="url"
            value={rec}
            onChange={(ev) => setRec(ev.target.value)}
            placeholder="Recording URL"
            className="min-h-9 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={busy}
            className="min-h-9 rounded-lg border border-white/15 px-3 text-sm hover:bg-white/10 disabled:opacity-50"
          >
            Save
          </button>
        </form>
      )}
    </article>
  );
}

function EventForm({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (body: object) => Promise<void>;
}) {
  const [title, setTitle] = useState("Office Hours");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [link, setLink] = useState("");

  const field =
    "min-h-11 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-base text-white placeholder-white/40 outline-none focus:border-gold";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // datetime-local values are local wall-clock; Date() converts to UTC.
        onSubmit({
          title,
          description,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
          link,
        });
      }}
      className="mb-6 grid gap-3 rounded-2xl border border-gold/30 bg-white/5 p-4 sm:grid-cols-2"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        required
        placeholder="Title"
        className={`${field} sm:col-span-2`}
      />
      <label className="text-sm text-white/60">
        Starts
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
          className={`${field} mt-1`}
        />
      </label>
      <label className="text-sm text-white/60">
        Ends
        <input
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          required
          className={`${field} mt-1`}
        />
      </label>
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Zoom / meeting link (https://…)"
        className={`${field} sm:col-span-2`}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={2000}
        rows={2}
        placeholder="What we'll cover (optional)"
        className={`${field} resize-none py-2 sm:col-span-2`}
      />
      <button
        type="submit"
        disabled={busy || !title || !startsAt || !endsAt}
        className="min-h-11 rounded-lg bg-cranberry font-heading font-bold text-white hover:bg-cranberry-dark disabled:opacity-50 sm:col-span-2"
      >
        Create event
      </button>
    </form>
  );
}
