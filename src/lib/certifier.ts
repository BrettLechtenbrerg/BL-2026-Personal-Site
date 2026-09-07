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

/** Public verification URL for the member's credential, issuing it if needed. */
export async function ensureCredential(userId: string): Promise<string | null> {
  const { data: award } = await db()
    .from("me_awards")
    .select("credential_url")
    .eq("user_id", userId)
    .eq("badge_slug", BADGE)
    .maybeSingle();
  if (!award) return null;
  if (award.credential_url) return award.credential_url as string;

  const token = process.env.CERTIFIER_TOKEN;
  const groupId = process.env.CERTIFIER_GROUP_ID;
  const user = await getUserById(userId);
  if (!token || !groupId || !user) return null;

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
      return null;
    }
    const { publicId } = (await res.json()) as { publicId?: string };
    if (!publicId) return null;

    const url = VERIFY_BASE + publicId;
    await db()
      .from("me_awards")
      .update({ credential_url: url })
      .eq("user_id", userId)
      .eq("badge_slug", BADGE);
    return url;
  } catch (err) {
    console.error("Certifier issue error", err);
    return null;
  }
}
