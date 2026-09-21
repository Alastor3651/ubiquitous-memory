import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY client. Uses the service role key, which bypasses Row Level
// Security, so this file must never be imported from a Client Component
// and the key must never be prefixed with NEXT_PUBLIC_.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // We don't throw at import time in dev to avoid crashing pages that don't
  // touch storage, but uploads will fail with a clear error if these are missing.
  console.warn(
    "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. File uploads will fail until these are configured."
  );
}

export const supabaseAdmin = createClient(supabaseUrl ?? "", serviceRoleKey ?? "", {
  auth: { persistSession: false },
});

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "documents";
