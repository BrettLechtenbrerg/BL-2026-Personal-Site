"use client";

//==============================================================================
// Academy — English / Español switch (from GIFT CONNECT, 6 Oct 2026).
// Shown only when the profile's academy.languages includes "es".
// Uses Google's free Website Translator (machine translation).
//
// How it works: choosing Español sets Google's `googtrans=/en/es` cookie and
// reloads; on every page load with that cookie, Google's script is fetched and
// translates the page. Nothing is requested from Google until a visitor picks
// Español (same privacy pattern as the YouTube players). Choosing English
// clears the cookie and reloads. A site may have its own copy for its public
// header (GIFT CONNECT: components/ui/LanguageToggle.tsx); both use the same
// cookie, so the choice carries across.
//==============================================================================

import { useEffect, useSyncExternalStore } from "react";
import { Languages } from "lucide-react";
import { academyConfig } from "@/content/academy.config";

const COOKIE = "googtrans";
const SPANISH = "/en/es";
const SCRIPT_ID = "google-translate-script";
const HOLDER_ID = "google_translate_element";

/** True when this academy offers the Español switch (profile academy.languages). */
export const spanishOffered = (academyConfig.academy.languages ?? ["en"]).includes("es");

function readSpanish() {
  return document.cookie
    .split(";")
    .some((c) => {
      const [name, ...rest] = c.trim().split("=");
      return name === COOKIE && decodeURIComponent(rest.join("=")) === SPANISH;
    });
}

// The cookie only changes right before a full reload, so there is nothing to subscribe to.
const subscribe = () => () => {};

/** True when the visitor has chosen Español (always false when the switch isn't offered).
 *  Use it to hand-set the few words Google gets wrong; mark those elements translate="no". */
export function useSpanish() {
  const on = useSyncExternalStore(subscribe, readSpanish, () => false);
  return spanishOffered && on;
}

function setSpanishCookie(on: boolean) {
  const host = window.location.hostname;
  if (on) {
    document.cookie = `${COOKIE}=${SPANISH}; path=/; max-age=31536000; SameSite=Lax`;
    return;
  }
  // Google may also write the cookie on the host domain; clear every variant.
  for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
    document.cookie = `${COOKIE}=; path=/; max-age=0${domain}`;
  }
}

// Google Translate swaps page text for its own <font> nodes, which makes React
// throw when it later removes or moves the original nodes. Standard workaround
// (facebook/react#11538): ignore removals/inserts of nodes React no longer owns.
// Installed only when Spanish is on.
function patchDomForTranslation() {
  const w = window as Window & { __languageTogglePatched?: boolean };
  if (w.__languageTogglePatched) return;
  w.__languageTogglePatched = true;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}

type GoogleTranslateWindow = Window & {
  googleTranslateElementInit?: () => void;
  google?: { translate?: { TranslateElement: new (options: object, id: string) => unknown } };
};

function loadTranslator() {
  if (document.getElementById(SCRIPT_ID)) return;
  patchDomForTranslation();
  const holder = document.createElement("div");
  holder.id = HOLDER_ID;
  holder.hidden = true;
  document.body.appendChild(holder);
  const w = window as GoogleTranslateWindow;
  w.googleTranslateElementInit = () => {
    const Element = w.google?.translate?.TranslateElement;
    if (Element) new Element({ pageLanguage: "en", includedLanguages: "es", autoDisplay: false }, HOLDER_ID);
  };
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

export default function LanguageToggle() {
  const spanish = useSpanish();

  useEffect(() => {
    if (spanish) loadTranslator();
  }, [spanish]);

  if (!spanishOffered) return null;

  const toggle = () => {
    setSpanishCookie(!spanish);
    window.location.reload();
  };

  const label = spanish ? "English" : "Español";
  const lang = spanish ? "en" : "es";
  const description = spanish
    ? "Back to English"
    : "Ver este sitio en español (traducción automática de Google)";

  return (
    <button
      type="button"
      onClick={toggle}
      lang={lang}
      translate="no"
      aria-label={description}
      title={description}
      className="notranslate inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-academy-fg/20 px-2.5 text-sm font-semibold text-academy-fg transition-colors hover:bg-academy-fg/10 sm:px-3"
    >
      <Languages size={18} aria-hidden="true" />
      {/* The phone header is tight: icon only there (the label stays in aria-label). */}
      <span className="hidden">{spanish ? "EN" : "ES"}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
