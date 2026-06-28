const express = require("express");
const cors = require("cors");
require("dotenv").config();

const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ message: "Smart Review Analyzer API is running!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});