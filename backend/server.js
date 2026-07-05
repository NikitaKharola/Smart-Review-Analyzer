const express = require("express");
const cors = require("cors");
require("dotenv").config();

const reviewRoutes = require("./routes/reviewRoutes");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/reviews", reviewRoutes);
app.use("/api/account", accountRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({ message: "Smart Review Analyzer API is running!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});