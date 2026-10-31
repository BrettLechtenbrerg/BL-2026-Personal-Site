"use client";

// "Copy" button for the bios and introductions: copies the text and says "Copied!" for two seconds.
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, what }: { text: string; what: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy-btn"
      aria-label={copied ? `${what} copied` : `Copy the ${what}`}
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
