"use client";

//==============================================================================
// Academy — light/dark switch. Toggles `.academy-light` on #academy-root
// (styles in globals.css) and remembers the choice in localStorage. The
// academy layout applies the saved choice before first paint on full loads.
//==============================================================================

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { LIGHT_CLASS, THEME_STORAGE_KEY as STORAGE_KEY, shouldUseLight } from "@/lib/academy-theme";

// The `.academy-light` class on #academy-root is the single source of truth; the switch
// just reflects it.
const root = () => document.getElementById("academy-root");
function subscribe(onChange: () => void) {
  const el = root();
  if (!el) return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const isLight = () => root()?.classList.contains(LIGHT_CLASS) ?? false;

export default function ThemeToggle() {
  const light = useSyncExternalStore(subscribe, isLight, () => false);

  // Re-apply the saved choice (else the brand default) whenever the Academy mounts.
  // Needed because clicking into the Academy from the main site is a client-side
  // navigation, and React never runs the layout's inline pre-paint script then, so the
  // Academy used to open in dark mode. Layout effect = before paint, so no dark flash.
  useLayoutEffect(() => {
    root()?.classList.toggle(LIGHT_CLASS, shouldUseLight());
  }, []);

  const toggle = () => {
    const next = !light;
    root()?.classList.toggle(LIGHT_CLASS, next);
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
      className="relative flex h-7 w-12 shrink-0 items-center rounded-full border border-academy-fg/20 bg-academy-fg/10 transition-colors hover:bg-academy-fg/20"
    >
      <span
        className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-academy-accent text-academy-bg transition-transform ${
          light ? "translate-x-6" : "translate-x-1"
        }`}
      >
        {light ? <Sun size={12} /> : <Moon size={12} />}
      </span>
    </button>
  );
}
