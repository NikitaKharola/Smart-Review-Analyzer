const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");
const supabaseAdmin = require("../supabaseAdmin");

const SALT_ROUNDS = 12;

router.use(requireAuth);

// PATCH the logged-in owner's profile (currently just full name)
router.patch("/profile", async (req, res) => {
  try {
    const { fullName } = req.body;

    if (typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({ message: "Full name cannot be empty." });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { fullName: fullName.trim() },
    });

    res.status(200).json({
      message: "Profile updated.",
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not update profile." });
  }
});

// PATCH the logged-in owner's password
router.patch("/password", async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existing = await prisma.user.findUnique({ where: { id: req.userId } });

    // Google-only accounts (provider !== "local") never set a password —
    // block this route for them rather than silently giving them a local
    // password that they'll never think to use.
    if (existing?.provider && existing.provider !== "local") {
      return res.status(400).json({
        message: "This account signs in with Google and doesn't use a password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not update password." });
  }
});

// DELETE the logged-in owner's account entirely:
// 1. delete all their reviews (so we don't leave orphaned data)
// 2. delete their User row itself
router.delete("/", async (req, res) => {
  console.log("[DELETE /api/account] req.userId from token:", req.userId);
  try {
    const deletedReviews = await prisma.review.deleteMany({ where: { userId: req.userId } });
    console.log("[DELETE /api/account] reviews removed:", deletedReviews.count);

    const deletedUser = await prisma.user.delete({ where: { id: req.userId } });
    console.log("[DELETE /api/account] user row deleted:", deletedUser.id, deletedUser.email);

    // Belt-and-suspenders: confirm the row is actually gone before
    // telling the frontend it succeeded.
    const stillThere = await prisma.user.findUnique({ where: { id: req.userId } });
    if (stillThere) {
      console.error("[DELETE /api/account] WARNING: user still present after delete!", stillThere);
      return res.status(500).json({ message: "Account was not fully deleted. Please try again." });
    }

    // Best-effort cleanup: some accounts predate the move away from
    // Supabase Auth and still have a matching row in auth.users. New
    // accounts (created via /api/auth/register or Google login) never
    // get one, so this is expected to no-op ("User not found") for
    // most users — that's fine, it's just legacy cleanup, not a
    // requirement for the deletion to count as successful.
    try {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(req.userId);
      if (authDeleteError) {
        console.warn(
          "[DELETE /api/account] no matching auth.users row (expected for most accounts):",
          authDeleteError.message
        );
      } else {
        console.log("[DELETE /api/account] legacy auth.users row also removed:", req.userId);
      }
    } catch (authErr) {
      console.warn("[DELETE /api/account] auth.users cleanup skipped:", authErr.message);
    }

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("[DELETE /api/account] error:", err);
    res.status(500).json({ message: err.message || "Could not delete account." });
  }
});

module.exports = router;