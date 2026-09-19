"use client";

//==============================================================================
// Academy — flashcard deck: tap/space to flip, ←/→ to move (when the deck has
// focus), shuffle.
// Pure client state; nothing is persisted (study aid, not graded).
//==============================================================================

import { useState } from "react";
import { ChevronLeft, ChevronRight, Layers, Shuffle } from "lucide-react";

export interface Flashcard {
  front: string;
  back: string;
}

export default function Flashcards({ cards }: { cards: Flashcard[] }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[order[pos]];
  const go = (delta: number) => {
    setPos((p) => (p + delta + cards.length) % cards.length);
    setFlipped(false);
  };
  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setPos(0);
    setFlipped(false);
  };

  if (!card) return null;

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
      }}
      className="mb-6 rounded-2xl border border-academy-primary/40 bg-gradient-to-br from-academy-primary/15 via-academy-fg/5 to-academy-accent/10 p-6 shadow-[0_0_40px_-10px_var(--cranberry)] backdrop-blur-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-academy-accent">
          <Layers size={18} /> Flashcards
        </h2>
        <span className="text-xs text-academy-fg/50">
          Card {pos + 1} of {cards.length}
        </span>
      </div>

      {/* Progress */}
      <div
        role="progressbar"
        aria-valuenow={pos + 1}
        aria-valuemin={1}
        aria-valuemax={cards.length}
        aria-label="Deck progress"
        className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-academy-bg/40"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-academy-primary-light to-academy-accent transition-all duration-300"
          style={{ width: `${((pos + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Step instruction — changes with state so the next action is always obvious */}
      <p className="mb-3 text-center text-sm font-semibold text-academy-fg/85">
        {flipped ? (
          <>
            <span className="text-academy-accent">Step 2:</span> Got it? Hit <span className="text-academy-accent">Next card</span> →
          </>
        ) : (
          <>
            <span className="text-academy-accent">Step 1:</span> Think of your answer, then click the card to check it
          </>
        )}
      </p>

      {/* 3D flip: the button rotates on Y; each face hides its back so only one shows. */}
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? "Showing answer. Tap to see question." : "Showing question. Tap to reveal answer."}
        className="academy-brand group relative block min-h-[200px] w-full [perspective:1200px]"
      >
        <div
          className="relative h-full min-h-[200px] w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <CardFace label="Question" text={card.front} hidden={flipped} />
          <CardFace label="Answer" text={card.back} hidden={!flipped} back />
        </div>
      </button>
      <p className="mt-2 text-center text-xs text-academy-fg/40">
        {flipped ? "Click the card again to see the question" : "Click the card to check your answer"}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous card"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-academy-fg/15 hover:bg-academy-fg/10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={shuffle}
          className="flex min-h-11 items-center gap-2 rounded-lg border border-academy-fg/15 px-3 text-sm hover:bg-academy-fg/10"
        >
          <Shuffle size={14} /> <span className="hidden sm:inline">Shuffle</span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg font-heading font-bold transition-all ${
            flipped
              ? "bg-academy-accent text-academy-bg shadow-[0_0_24px_-4px_var(--academy-accent)] hover:bg-academy-accent-light motion-safe:animate-pulse"
              : "border border-academy-fg/15 text-academy-fg/80 hover:bg-academy-fg/10"
          }`}
        >
          {pos + 1 === cards.length ? "Start over" : "Next card"} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function CardFace({
  label,
  text,
  hidden,
  back = false,
}: {
  label: string;
  text: string;
  hidden: boolean;
  back?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden}
      className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 p-6 text-center [backface-visibility:hidden] ${
        back
          ? "border-academy-accent bg-gradient-to-br from-academy-accent-dark via-[#3a2a08] to-academy-bg shadow-[0_0_50px_-8px_var(--academy-accent)] [transform:rotateY(180deg)]"
          : "border-academy-accent/70 bg-gradient-to-br from-academy-primary-light via-academy-primary to-[#3a0a12] shadow-[0_0_50px_-8px_var(--cranberry-light)] transition-shadow group-hover:shadow-[0_0_60px_-4px_var(--academy-accent)]"
      }`}
    >
      {/* Ember glow in the corner */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${
          back ? "bg-academy-accent/40" : "bg-academy-accent/30"
        }`}
      />
      <span
        className={`relative mb-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] ${
          back ? "bg-academy-bg/40 text-academy-accent-light" : "bg-academy-accent text-academy-bg"
        }`}
      >
        {label}
      </span>
      <span className="relative whitespace-pre-wrap font-heading text-lg font-bold leading-snug text-academy-fg drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        {text}
      </span>
    </div>
  );
}
