import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';

// Lazily constructed: Next.js imports every route module during
// "Collecting page data" at build time regardless of `dynamic = 'force-dynamic'`,
// so a top-level createClient() call would run (and throw on missing env vars)
// even before Supabase credentials are configured.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      // Explicit WebSocket implementation: Node < 22 has no native WebSocket,
      // and supabase-js's realtime client (initialized even though we never
      // use realtime features) requires one to be available.
      realtime: { transport: ws as unknown as typeof WebSocket },
      // Next.js caches fetch() answers by default, and kept serving old rows even on
      // "force-dynamic" pages. Always ask the database: an edit (or switching something
      // to private) must take effect at once.
      global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
    });
  }
  return client;
}
