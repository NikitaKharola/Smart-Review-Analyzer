const supabaseAuth = require("../supabaseAuth");

/**
 * Every request that touches review data must prove who they are.
 * The frontend sends: Authorization: Bearer <supabase-access-token>
 * We verify that token with Supabase, then attach req.userId so
 * every route below can filter data to that owner only.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not logged in. Please log in to continue." });
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }

  req.userId = data.user.id;
  req.userEmail = data.user.email;
  req.userFullName = data.user.user_metadata?.full_name;
  next();
}

module.exports = { requireAuth };
