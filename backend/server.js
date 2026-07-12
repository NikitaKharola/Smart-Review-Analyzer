const express = require("express");
const cors = require("cors");
require("dotenv").config();

const passport = require("./config/passport");

const reviewRoutes = require("./routes/reviewRoutes");
const accountRoutes = require("./routes/accountRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(passport.initialize()); // no sessions — passport.initialize() alone is enough for our JWT-based flow

app.use("/api/reviews", reviewRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ message: "Smart Review Analyzer API is running!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});