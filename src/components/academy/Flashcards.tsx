"use client";

//==============================================================================
// Academy — flashcard deck: tap/space to flip, arrows to move, shuffle.
// Pure client state; nothing is persisted (study aid, not graded).
//==============================================================================

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);

  if (!card) return null;

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-gold">
          <Layers size={18} /> Flashcards
        </h2>
        <span className="text-xs text-white/50">
          {pos + 1} / {cards.length}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? "Showing answer. Tap to see question." : "Showing question. Tap to reveal answer."}
        className={`flex min-h-[180px] w-full items-center justify-center rounded-xl border p-6 text-center transition-colors ${
          flipped ? "border-gold/50 bg-gold/10" : "border-white/15 bg-black/30 hover:bg-black/40"
        }`}
      >
        <span className="whitespace-pre-wrap text-base leading-relaxed text-white/90">
          {flipped ? card.back : card.front}
        </span>
      </button>
      <p className="mt-2 text-center text-xs text-white/40">
        {flipped ? "Answer" : "Tap the card to reveal the answer"}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous card"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/15 hover:bg-white/10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={shuffle}
          className="flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm hover:bg-white/10"
        >
          <Shuffle size={14} /> Shuffle
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next card"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/15 hover:bg-white/10"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
