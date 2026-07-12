const express = require("express");
const router = express.Router();

const prisma = require("../prismaClient");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// DELETE the logged-in owner's account entirely:
// 1. delete all their reviews (so we don't leave orphaned data)
// 2. delete their User row itself
router.delete("/", async (req, res) => {
  try {
    await prisma.review.deleteMany({ where: { userId: req.userId } });

    await prisma.user.delete({ where: { id: req.userId } });

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not delete account." });
  }
});

module.exports = router;
