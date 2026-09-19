//==============================================================================
// Certifier — third-party verifiable credential for certified members
//==============================================================================
// Issues one credential per certified member and stores the public
// verification URL on the top badge row (me_awards.credential_url).
// Disabled per brand via academyConfig.ranks.certifierEnabled.
// Server only. Idempotent: returns the stored URL if one exists; issues once
// otherwise. A failed/unconfigured issuance returns null and is retried on the
// next call — the member still gets the badge + printable certificate.
//
// Env: CERTIFIER_TOKEN (API access token), CERTIFIER_GROUP_ID (credential
// template id). API docs: https://developers.certifier.io
//==============================================================================

import { db, getUserById } from "./academy-db";
import { TOP_BADGE_SLUG } from "@/content/academy/badges";
import { academyConfig } from "@/content/academy.config";

const BADGE = TOP_BADGE_SLUG;
const API = "https://api.certifier.io/v1/credentials/create-issue-send";
const VERIFY_BASE = "https://credsverse.com/credentials/";
/** Placeholder (`pending:<epoch ms>`) written while an issuance is in flight so
 *  concurrent requests (certification + certificate pages loading together)
 *  can't double-issue. Claims older than STALE_MS are retried — covers a
 *  function that died between claiming and writing the result. */
const PENDING_PREFIX = "pending:";
const STALE_MS = 5 * 60_000;

function isStalePending(value: string): boolean {
  return Date.now() - Number(value.slice(PENDING_PREFIX.length)) > STALE_MS;
}

function setCredentialUrl(userId: string, value: string | null) {
  return db()
    .from("me_awards")
    .update({ credential_url: value })
    .eq("user_id", userId)
    .eq("badge_slug", BADGE);
}

/** Public verification URL for the member's credential, issuing it if needed. */
export async function ensureCredential(userId: string): Promise<string | null> {
  if (!academyConfig.ranks.certifierEnabled) return null;
  const { data: award } = await db()
    .from("me_awards")
    .select("credential_url")
    .eq("user_id", userId)
    .eq("badge_slug", BADGE)
    .maybeSingle();
  if (!award) return null;
  const stored = award.credential_url as string | null;
  if (stored && !stored.startsWith(PENDING_PREFIX)) return stored;
  if (stored && !isStalePending(stored)) return null;

  const token = process.env.CERTIFIER_TOKEN;
  const groupId = process.env.CERTIFIER_GROUP_ID;
  const user = await getUserById(userId);
  if (!token || !groupId || !user) return null;

  // Compare-and-swap claim: only the request that flips the exact value we
  // read (null or a stale pending) does the issuing.
  const claim = setCredentialUrl(userId, PENDING_PREFIX + Date.now());
  const { data: claimed } = await (stored
    ? claim.eq("credential_url", stored)
    : claim.is("credential_url", null)
  ).select("user_id");
  if (!claimed?.length) return null;

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Certifier-Version": "2022-10-26",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId,
        recipient: { name: user.name, email: user.email },
      }),
    });
    if (!res.ok) {
      console.error("Certifier issue failed", res.status, await res.text());
      await setCredentialUrl(userId, null);
      return null;
    }
    const { publicId } = (await res.json()) as { publicId?: string };
    if (!publicId) {
      await setCredentialUrl(userId, null);
      return null;
    }

    const url = VERIFY_BASE + publicId;
    await setCredentialUrl(userId, url);
    return url;
  } catch (err) {
    console.error("Certifier issue error", err);
    await setCredentialUrl(userId, null);
    return null;
  }
}
