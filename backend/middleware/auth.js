const jwt = require("jsonwebtoken");

/**
 * Every request that touches review data must prove who they are.
 * The frontend sends: Authorization: Bearer <our-own-jwt>
 * We verify that token ourselves (signed with JWT_SECRET at login/register),
 * then attach req.userId so every route below can filter data to that owner only.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not logged in. Please log in to continue." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userFullName = decoded.fullName;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Your session has expired. Please log in again." });
  }
}

module.exports = { requireAuth };
