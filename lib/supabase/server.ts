import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the public (publishable) key.
 *
 * Returns `null` when the environment variables are not set yet, so the app can
 * render a friendly "not configured" state before Supabase is wired up. This
 * keeps `next build` working locally even before any keys exist.
 *
 * In M3 (auth) this gets upgraded to a cookie-aware `@supabase/ssr` client.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return createClient(url, publishableKey, {
    auth: { persistSession: false },
  });
}
