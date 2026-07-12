const rateLimit = require("express-rate-limit");

// Max 5 attempts per 15 minutes per IP on login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = authLimiter;
