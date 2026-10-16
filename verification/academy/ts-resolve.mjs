// Academy Forge checks — lets `node --experimental-strip-types` load the site's
// TypeScript the way Next does: "@/x" → <site>/<srcDir>/x.ts, and extensionless
// relative imports → .ts. (Plain .ts only: Node cannot strip JSX.) Used as:
//   node --experimental-strip-types --import ./verification/academy/ts-resolve.mjs <check>.mjs
import { register } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = existsSync(path.join(repo, "src", "lib")) ? path.join(repo, "src") : repo;

const hooks = `
import { statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
const SRC = ${JSON.stringify(src)};
const isFile = (f) => { try { return statSync(f).isFile(); } catch { return false; } };
const pick = (base) => [base, base + ".ts", base + "/index.ts"].find(isFile) ?? null;
export async function resolve(specifier, context, next) {
  let base = null;
  if (specifier.startsWith("@/")) base = SRC + "/" + specifier.slice(2);
  else if (/^\\.\\.?\\//.test(specifier) && context.parentURL?.startsWith("file:") && !/\\.[cm]?[jt]s$|\\.json$/.test(specifier)) {
    base = fileURLToPath(new URL(specifier, context.parentURL));
  }
  const file = base && pick(base);
  return file ? { url: pathToFileURL(file).href, shortCircuit: true } : next(specifier, context);
}
`;
register("data:text/javascript," + encodeURIComponent(hooks));
