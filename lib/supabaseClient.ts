import { createBrowserClient } from '@supabase/ssr';

/**
 * AERO Supabase Client (Browser)
 * Uses @supabase/ssr for cookie-based session management.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
