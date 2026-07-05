const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// This client uses the service_role key, which can delete users.
// It must NEVER be exposed to the frontend - only used here, server-side,
// and only after we've already verified (via requireAuth) who the request is from.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in backend/.env — account deletion will fail."
  );
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

module.exports = supabaseAdmin;
