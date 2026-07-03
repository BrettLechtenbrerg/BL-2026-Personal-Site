//==============================================================================
// Server-only Supabase client (service role)
//==============================================================================
// The Comms Hub's hub_messages table is locked down (RLS on, zero policies,
// anon/authenticated revoked) so ONLY the service-role key can touch it.
// Deliberately no anon-key fallback — tighter than the PMMA original, since
// this site has no browser-side Supabase usage at all.
//
// Env (server-only — never expose the service key to the browser):
//   NEXT_PUBLIC_SUPABASE_URL   https://<project-ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service_role secret from Supabase API settings
//==============================================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel."
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
