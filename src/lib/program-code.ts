// Program-code matching for Academy signup.
//
// The code is shared with a whole cohort (it is a speed bump, not a secret), so
// matching forgives the slips real people make when typing or pasting it:
// capital letters, spaces or dashes ("LOVE 2026"), invisible characters copied
// out of an email, full-width phone keyboards, and the letter O typed for zero
// ("L0VE2026", "LOVE2O26"). Anything else still has to match exactly.
export function normalizeProgramCode(raw: string): string {
  return raw
    .normalize("NFKC")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/O/g, "0");
}

export function programCodeMatches(entered: string, expected: string): boolean {
  const a = normalizeProgramCode(entered);
  const b = normalizeProgramCode(expected);
  return a.length > 0 && a === b;
}
