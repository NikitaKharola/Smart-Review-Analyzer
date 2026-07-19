const express = require("express");
const router = express.Router();

const prisma = require("../prismaClient");
const { extractRatingFromText } = require("../utils/analyzer");
const { analyzeTextAI } = require("../utils/aiAnalyzer");
const { requireAuth } = require("../middleware/auth");
const { buildReportData } = require("../utils/report");
const { generateReportPdf } = require("../utils/generatePdf");

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
router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Please provide review text to analyze." });
  }

  try {
    const result = await analyzeTextAI(text);
    res.status(200).json(result);
  } catch (err) {
    // analyzeTextAI already falls back internally on AI failure, so
    // reaching here means something unexpected happened.
    res.status(500).json({ message: "Could not analyze this text. Please try again." });
  }
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

// POST multiple reviews at once (pasted together), analyze + save each,
// and return an aggregate summary of the whole batch.
router.post("/bulk", async (req, res) => {
  const { username, reviews } = req.body;

  if (!username || !Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({
      message: "Please provide a name and at least one review.",
    });
  }

  try {
    const saved = [];
    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const themeCounts = {};

    for (const text of reviews) {
      const trimmed = (text || "").trim();
      if (!trimmed) continue;

      const analysis = await analyzeTextAI(trimmed);
      const { rating: extractedRating, cleanText } = extractRatingFromText(trimmed);
      // Prefer a real rating found in the text itself; only guess from
      // sentiment as a last resort when no rating was written at all.
      const finalRating =
        extractedRating ??
        (analysis.sentiment === "Positive" ? 5 : analysis.sentiment === "Negative" ? 1 : 3);

      const row = await prisma.review.create({
        data: {
          username,
          reviewText: cleanText,
          rating: finalRating,
          sentiment: analysis.sentiment,
          theme: analysis.theme,
          confidence: analysis.confidence,
          suggestedReply: analysis.response,
          userId: req.userId,
        },
      });

      sentimentCounts[analysis.sentiment] = (sentimentCounts[analysis.sentiment] || 0) + 1;
      themeCounts[analysis.theme] = (themeCounts[analysis.theme] || 0) + 1;
      saved.push(serializeReview(row));
    }

    res.status(201).json({
      count: saved.length,
      sentimentCounts,
      themeCounts,
      reviews: saved,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not process reviews." });
  }
});

// GET a downloadable PDF report: what's working well, what needs improvement
router.get("/report", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    const reportData = buildReportData(reviews);
    const ownerLabel = req.userFullName || req.userEmail || "Property Owner";

    generateReportPdf(res, reportData, ownerLabel);
  } catch (err) {
    res.status(500).json({ message: err.message || "Could not generate report." });
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

  const analysis = await analyzeTextAI(review);

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
    const analysis = await analyzeTextAI(reviewText);
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