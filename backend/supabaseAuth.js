const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// This client is ONLY used to verify who a request is coming from
// (by checking their Supabase Auth access token). It does NOT touch
// the reviews table — Prisma does that. Uses the anon key, same as
// the frontend, because we're just validating a token here, not
// bypassing security.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing SUPABASE_URL / SUPABASE_ANON_KEY in backend/.env — auth-protected routes will fail."
  );
}

const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabaseAuth;
