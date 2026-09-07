"use client";

//==============================================================================
// Academy — light/dark switch. Toggles `.academy-light` on #academy-root
// (styles in globals.css) and remembers the choice in localStorage. The
// academy layout applies the saved choice before first paint.
//==============================================================================

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "academy-theme";
const LIGHT_CLASS = "academy-light";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.getElementById("academy-root")?.classList.contains(LIGHT_CLASS) ?? false);
  }, []);

  const toggle = () => {
    const next = !light;
    document.getElementById("academy-root")?.classList.toggle(LIGHT_CLASS, next);
    setLight(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "light" : "dark");
    } catch {
      // Private mode / storage blocked — preference just won't persist.
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light mode"
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggle}
      className="relative flex h-7 w-12 shrink-0 items-center rounded-full border border-white/20 bg-white/10 transition-colors hover:bg-white/20"
    >
      <span
        className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-gold text-black transition-transform ${
          light ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {light ? <Sun size={12} /> : <Moon size={12} />}
      </span>
    </button>
  );
}
