// Expiring links to the private Cloudflare R2 bucket that holds the academy lesson media.
// Plain Node crypto (AWS Signature V4, query-string form), so no storage SDK is installed.
import { createHash, createHmac } from "node:crypto";

export const R2_BUCKET = "bl-academy-media";

// The only files that live on R2: public/academy/<slug>/<file> with one of these endings.
// The upload script, the build step, the rewrite in next.config.ts and the gate all use these.
export const MEDIA_EXTENSIONS = { mp4: "video/mp4", m4a: "audio/mp4", mp3: "audio/mpeg", mov: "video/quicktime", webm: "video/webm", wav: "audio/wav" };
export const MEDIA_SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
export const MEDIA_FILE_RE = new RegExp(`^[a-z0-9][a-z0-9-]*\\.(${Object.keys(MEDIA_EXTENSIONS).join("|")})$`);
export const mediaKey = (slug, file) => `academy/${slug}/${file}`;
export const mediaType = (file) => MEDIA_EXTENSIONS[file.split(".").pop()] || "application/octet-stream";

export function r2Config(env = /** @type {Record<string, string | undefined>} */ (process.env)) {
  const accountId = (env.R2_ACCOUNT_ID || "").trim();
  const accessKeyId = (env.R2_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = (env.R2_SECRET_ACCESS_KEY || "").trim();
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
  return {
    accessKeyId,
    secretAccessKey,
    host: `${accountId}.r2.cloudflarestorage.com`,
    bucket: (env.R2_BUCKET || R2_BUCKET).trim(),
    region: "auto",
  };
}

const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
const hmac = (key, data) => createHmac("sha256", key).update(data).digest();
const sha256Hex = (data) => createHash("sha256").update(data).digest("hex");

// headers: extra request headers that must be sent exactly as given (they are part of the signature).
export function presignUrl({ config, method = "GET", key = "", query = {}, headers = {}, expiresSeconds = 3600, now = new Date() }) {
  if (!config) throw new Error("R2 is not configured (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)");
  if (!(expiresSeconds >= 1 && expiresSeconds <= 604800)) throw new Error("expiresSeconds must be 1 to 604800 (7 days)");
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const day = amzDate.slice(0, 8);
  const scope = `${day}/${config.region}/s3/aws4_request`;
  const path = "/" + [config.bucket, ...key.split("/")].filter((p) => p !== "").map(enc).join("/");

  const signed = { host: config.host };
  for (const [k, v] of Object.entries(headers)) signed[k.toLowerCase()] = String(v).trim();
  const signedNames = Object.keys(signed).sort();

  const params = {
    ...query,
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${config.accessKeyId}/${scope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresSeconds),
    "X-Amz-SignedHeaders": signedNames.join(";"),
  };
  const canonicalQuery = Object.keys(params).map((k) => [enc(k), enc(String(params[k]))])
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).map(([k, v]) => `${k}=${v}`).join("&");
  const canonicalRequest = [
    method.toUpperCase(), path, canonicalQuery,
    signedNames.map((n) => `${n}:${signed[n]}\n`).join(""),
    signedNames.join(";"), "UNSIGNED-PAYLOAD",
  ].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256Hex(canonicalRequest)].join("\n");
  const signingKey = ["s3", "aws4_request"].reduce(hmac, hmac(hmac("AWS4" + config.secretAccessKey, day), config.region));
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  return `https://${config.host}${path}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}
