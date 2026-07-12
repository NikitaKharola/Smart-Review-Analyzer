const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");
const authLimiter = require("../middleware/rateLimiter");
const { validateRegister, validateLogin } = require("../utils/validators.js");
const passport = require("../config/passport"); // registers the Google strategy

const SALT_ROUNDS = 12;

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", authLimiter, validateRegister, async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, fullName: fullname },
    });

    res.status(201).json({ message: "Account created! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not create account." });
  }
});

// POST /api/auth/login
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      // !user.password covers Google-only accounts trying to password-login
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);

    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not log in." });
  }
});

// GET /api/auth/me — lets the frontend check "am I still logged in?" on load
router.get("/me", requireAuth, (req, res) => {
  res.status(200).json({
    id: req.userId,
    email: req.userEmail,
    fullName: req.userFullName,
  });
});

// --- Google OAuth ---
// This is a browser redirect flow, not a fetch call: the frontend sends the
// user's browser to this URL directly (e.g. window.location.href = ...),
// Google handles the login/consent screen, then redirects back to our
// callback below.

// GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// GET /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    // req.user was set by the Google strategy in config/passport.js
    const token = signToken(req.user);

    // Hand off to the frontend the same way password login does — a JWT —
    // just via a redirect URL instead of a JSON response, since this
    // request came from the browser navigating, not from fetch().
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
  }
);

module.exports = router;