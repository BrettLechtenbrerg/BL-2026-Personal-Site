//==============================================================================
// Certifier — third-party verifiable credential for certified members
//==============================================================================
// Issues one "Master's Edge Certified" credential per member and stores the
// public verification URL on the Black Belt badge row (me_awards.credential_url).
// Server only. Idempotent: returns the stored URL if one exists; issues once
// otherwise. A failed/unconfigured issuance returns null and is retried on the
// next call — the member still gets the badge + printable certificate.
//
// Env: CERTIFIER_TOKEN (API access token), CERTIFIER_GROUP_ID (credential
// template id). API docs: https://developers.certifier.io
//==============================================================================

import { db, getUserById } from "./academy-db";

const BADGE = "certified-masters-edge";
const API = "https://api.certifier.io/v1/credentials/create-issue-send";
const VERIFY_BASE = "https://credsverse.com/credentials/";
/** Placeholder written while an issuance is in flight so concurrent requests
 *  (certification page + certificate page loading together) can't double-issue. */
const PENDING = "pending";

function setCredentialUrl(userId: string, value: string | null) {
  return db()
    .from("me_awards")
    .update({ credential_url: value })
    .eq("user_id", userId)
    .eq("badge_slug", BADGE);
}

/** Public verification URL for the member's credential, issuing it if needed. */
export async function ensureCredential(userId: string): Promise<string | null> {
  const { data: award } = await db()
    .from("me_awards")
    .select("credential_url")
    .eq("user_id", userId)
    .eq("badge_slug", BADGE)
    .maybeSingle();
  if (!award) return null;
  const stored = award.credential_url as string | null;
  if (stored) return stored === PENDING ? null : stored;

  const token = process.env.CERTIFIER_TOKEN;
  const groupId = process.env.CERTIFIER_GROUP_ID;
  const user = await getUserById(userId);
  if (!token || !groupId || !user) return null;

  // Claim the slot atomically; whoever flips null → pending does the issuing.
  const { data: claimed } = await setCredentialUrl(userId, PENDING)
    .is("credential_url", null)
    .select("user_id");
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
