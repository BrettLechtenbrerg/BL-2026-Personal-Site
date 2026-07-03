/**
 * Merge-tag renderer for Comms Hub messaging.
 *
 * Trimmed from PMMA's lib/messaging-render.ts: this site has no parent/child
 * roster, so only the universal recipient tags remain. Tag syntax is
 * `{{snake_case}}` — double braces, matching the chips in the compose UI.
 *
 * Unknown or empty tags render as '' so a half-filled contact never leaks a
 * literal `{{...}}` into a real person's text/email.
 */

export interface MessageMergeVars {
  first_name?: string | null;
  last_name?: string | null;
}

/** The merge tags offered in the compose UI (chips) and resolved here. */
export const MESSAGE_MERGE_TAGS: ReadonlyArray<{ tag: string; describes: string }> = [
  { tag: "first_name", describes: "The recipient's first name" },
  { tag: "last_name", describes: "The recipient's last name" },
];

const KNOWN_TAGS = new Set(MESSAGE_MERGE_TAGS.map((t) => t.tag));

/**
 * Replace every `{{tag}}` in the body with its value from `vars`. Whitespace
 * inside the braces is tolerated (`{{ first_name }}`). Unknown tags and
 * null/empty values collapse to an empty string.
 */
export function renderMessage(body: string, vars: MessageMergeVars): string {
  if (!body) return "";
  return body.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_match, tag: string) => {
    if (!KNOWN_TAGS.has(tag)) return "";
    const value = (vars as Record<string, unknown>)[tag];
    return value === undefined || value === null ? "" : String(value);
  });
}

/** Build the merge vars for a GHL lead. */
export function mergeVarsForLead(lead: {
  first_name?: string | null;
  last_name?: string | null;
}): MessageMergeVars {
  return {
    first_name: lead.first_name ?? "",
    last_name: lead.last_name ?? "",
  };
}

/**
 * Minimal, safe HTML wrapper for an email body composed as plain text with
 * merge tags. Escapes HTML special chars then converts newlines to <br> so
 * what you typed is what the recipient sees. GHL expects `html` for email.
 */
export function textToEmailHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\r?\n/g, "<br>\n");
}
