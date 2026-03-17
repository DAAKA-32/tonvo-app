import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Placeholder client for build time - will be replaced at runtime with real env vars
  supabase = new Proxy({} as SupabaseClient, {
    get() {
      throw new Error("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    },
  });
}

export { supabase };
