//==============================================================================
// Academy — server-only Supabase client (service role)
//==============================================================================
// Every me_* table has RLS on with zero policies and anon/authenticated
// revoked, so ONLY the service-role key can touch them. No anon fallback.
// One Supabase project per brand — set in that site's env, never shared.
//
// Env (server-only — never expose the service key to the browser):
//   NEXT_PUBLIC_SUPABASE_URL   https://<project-ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  service_role secret from Supabase API settings
//==============================================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getAcademySupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for this site."
    );
  }
  client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return client;
}
