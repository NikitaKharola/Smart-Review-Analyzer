const express = require("express");
const router = express.Router();

const prisma = require("../prismaClient");
const { analyzeText } = require("../utils/analyzer");
const { requireAuth } = require("../middleware/auth");

function serializeReview(r) {
  return {
    id: r.id,
    username: r.username,
    review: r.reviewText,
    rating: r.rating,
    sentiment: r.sentiment,
    theme: r.theme,
    confidence: r.confidence !== null ? Number(r.confidence) : null,
    response: r.suggestedReply,
    userId: r.userId,
    createdAt: r.createdAt,
  };
}

// Every route below requires login — reviews are private per owner.
router.use(requireAuth);

// GET all reviews belonging to the logged-in owner
router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews.map(serializeReview));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET dashboard stats scoped to the logged-in owner
router.get("/stats", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.userId },
    });

    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const themeCounts = {};

    reviews.forEach((r) => {
      if (r.sentiment) sentimentCounts[r.sentiment] = (sentimentCounts[r.sentiment] || 0) + 1;
      if (r.theme) themeCounts[r.theme] = (themeCounts[r.theme] || 0) + 1;
    });

    res.status(200).json({
      total: reviews.length,
      sentimentCounts,
      themeCounts,
      analyzed: reviews.map(serializeReview),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST analyze arbitrary text — preview only, does not save
router.post("/analyze", (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Please provide review text to analyze." });
  }

  const result = analyzeText(text);
  res.status(200).json(result);
});

// SEARCH within the logged-in owner's reviews only
router.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Please provide a search query." });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId: req.userId,
        OR: [
          { reviewText: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    res.status(200).json(reviews.map(serializeReview));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single review — only if it belongs to the logged-in owner
router.get("/:id", async (req, res) => {
  try {
    const review = await prisma.review.findFirst({
      where: { id: parseInt(req.params.id), userId: req.userId },
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(serializeReview(review));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new review — always saved against the logged-in owner
router.post("/", async (req, res) => {
  const { username, review, rating } = req.body;

  if (!username || !review || !rating) {
    return res.status(400).json({
      message: "Please provide username, review and rating",
    });
  }

  const analysis = analyzeText(review);

  try {
    const saved = await prisma.review.create({
      data: {
        username,
        reviewText: review,
        rating,
        sentiment: analysis.sentiment,
        theme: analysis.theme,
        confidence: analysis.confidence,
        suggestedReply: analysis.response,
        userId: req.userId,
      },
    });
    res.status(201).json(serializeReview(saved));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update a review — only if it belongs to the logged-in owner
router.put("/:id", async (req, res) => {
  const { username, review: reviewText, rating } = req.body;
  const data = {};
  if (username) data.username = username;
  if (rating) data.rating = rating;

  if (reviewText) {
    const analysis = analyzeText(reviewText);
    data.reviewText = reviewText;
    data.sentiment = analysis.sentiment;
    data.theme = analysis.theme;
    data.confidence = analysis.confidence;
    data.suggestedReply = analysis.response;
  }

  try {
    const result = await prisma.review.updateMany({
      where: { id: parseInt(req.params.id), userId: req.userId },
      data,
    });
    if (result.count === 0) return res.status(404).json({ message: "Review not found" });

    const updated = await prisma.review.findUnique({ where: { id: parseInt(req.params.id) } });
    res.status(200).json(serializeReview(updated));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - only if it belongs to the logged-in owner
router.delete("/:id", async (req, res) => {
  try {
    const result = await prisma.review.deleteMany({
      where: { id: parseInt(req.params.id), userId: req.userId },
    });
    if (result.count === 0) return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
