import { createClient } from "@supabase/supabase-js";

// These come from your Supabase project settings (Project Settings -> API).
// Create a file called `.env` in /frontend (same folder as package.json)
// with:
//   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-public-key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);