import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true, // Ensures tokens are refreshed automatically
        persistSession: true, // Persists session in local storage
        detectSessionInUrl: true,
      },
    }
  );
