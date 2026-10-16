//==============================================================================
// Academy light/dark theme — shared by the pre-paint script in
// app/academy/layout.tsx (full page loads) and ThemeToggle (client-side
// navigation, where React does not run that inline script).
//==============================================================================

import { academyConfig } from "@/content/academy.config";

// Per brand (profile academy.themeStorageKey). Bumping it, e.g. to "academy-theme-v2",
// clears every saved choice once. Checked so only a safe literal reaches the inline script.
export const THEME_STORAGE_KEY = /^[a-z0-9-]{1,40}$/.test(academyConfig.academy.themeStorageKey ?? "")
  ? academyConfig.academy.themeStorageKey!
  : "academy-theme";
export const LIGHT_CLASS = "academy-light";

// Validated so only a known literal is ever written into the inline script.
export const DEFAULT_THEME =
  (["light", "dark", "system"] as const).find((t) => t === academyConfig.academy.defaultTheme) ?? "system";

/** The member's saved choice, else the brand default. */
export function shouldUseLight(): boolean {
  let theme: string = DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") theme = saved;
  } catch {
    // Storage blocked — fall back to the brand default.
  }
  return theme === "light" || (theme === "system" && matchMedia("(prefers-color-scheme: light)").matches);
}

export const THEME_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t!=='light'&&t!=='dark')t=${JSON.stringify(DEFAULT_THEME)};if(t==='light'||(t==='system'&&matchMedia('(prefers-color-scheme: light)').matches))document.currentScript.parentElement.classList.add(${JSON.stringify(LIGHT_CLASS)})}catch(e){}`;
