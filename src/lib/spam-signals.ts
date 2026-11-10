// Signature of the random-text form spam (Nov 2026, first seen on the PMMA site): a real browser
// fills the form, so the honeypot, timing and origin checks all pass. It gives itself away by a
// Gmail address stuffed with dots and by fields typed as one mixed-case word such as
// "cveyQWXcRnQplXSeWVxDI". No imports, so node --test can load it.

const EMAIL_KEYS = ['email', 'contactEmail'];
const TEXT_KEYS = [
  'name', 'firstName', 'first_name', 'lastName', 'last_name', 'fullName', 'full_name',
  'company', 'company_name', 'business', 'organization', 'message',
];

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

// "DeLaCruz" and "TaeKwonDo" have 2 lower-to-upper jumps; random strings have more.
export function isRandomWord(word: string): boolean {
  return /^[A-Za-z]{8,}$/.test(word) && (word.match(/[a-z][A-Z]/g) || []).length >= 3;
}

// Gmail ignores dots, so spammers add them to reuse one inbox; people use 0-2.
export function hasStuffedGmailDots(email: string): boolean {
  const m = /^([^@]+)@(?:gmail|googlemail)\.com$/i.exec(email.trim());
  if (!m) return false;
  return m[1].split('+')[0].split('.').length - 1 >= 4;
}

export function spamReasonIn(body: Record<string, unknown>): string | null {
  for (const key of EMAIL_KEYS) {
    if (hasStuffedGmailDots(text(body[key]))) return 'gmail-dot-stuffing';
  }
  for (const key of TEXT_KEYS) {
    if (text(body[key]).split(/\s+/).some(isRandomWord)) return `random-text-${key}`;
  }
  return null;
}
