const express = require("express");
const router = express.Router();

const reviews = require("../data/reviews");

// GET all reviews
router.get("/", (req, res) => {
    res.json(reviews);
});
// SEARCH reviews
router.get("/search", (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({
            message: "Please provide a search query."
        });
    }

    const result = reviews.filter(review =>
        review.review.toLowerCase().includes(query.toLowerCase()) ||
        review.username.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json(result);
});
// GET review by ID
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const review = reviews.find(r => r.id === id);

    if (!review) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    res.status(200).json(review);
});
// POST a new review
router.post("/", (req, res) => {
    const { username, review, rating } = req.body;

    // Check if all fields are provided
    if (!username || !review || !rating) {
        return res.status(400).json({
            message: "Please provide username, review and rating"
        });
    }

    const newReview = {
        id: reviews.length + 1,
        username,
        review,
        rating
    };

    reviews.push(newReview);

    res.status(201).json(newReview);
});
// PUT - Update a review
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const review = reviews.find(r => r.id === id);

    if (!review) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    const { username, review: reviewText, rating } = req.body;

    if (username) review.username = username;
    if (reviewText) review.review = reviewText;
    if (rating) review.rating = rating;

    res.status(200).json(review);
});

// DELETE a review
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = reviews.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    reviews.splice(index, 1);

    res.status(200).json({
        message: "Review deleted successfully"
    });
});
module.exports = router;