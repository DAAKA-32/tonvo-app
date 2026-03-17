import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  supabaseAdmin = new Proxy({} as SupabaseClient, {
    get() {
      throw new Error("Supabase admin not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
    },
  });
}

export { supabaseAdmin };
