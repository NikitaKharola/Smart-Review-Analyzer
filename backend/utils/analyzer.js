/**
 * Rule-based sentiment + theme analyzer.
 *
 * Two signals are combined:
 * 1. An explicit rating, if the review text itself contains one
 *    (e.g. "Great app (5)", "Slow loading. 2/5", "★★★★★"). This is
 *    ground truth when present, so it takes priority.
 * 2. A keyword-based score across a broad, general-purpose vocabulary
 *    (not limited to one domain), used whenever no explicit rating
 *    is found, or to help pick a theme either way.
 *
 * Why rule-based and not a paid AI API?
 * - Works completely offline, no API key, no billing, no rate limits.
 * - Good enough for an internship MVP to demonstrate the *pipeline*
 *   (text in -> sentiment/theme/confidence out) end-to-end.
 * - Easy to swap later: replace analyzeText() internals with a call to
 *   OpenAI/HuggingFace/Gemini etc. without touching any other file,
 *   since every caller only depends on this function's return shape.
 */

const POSITIVE_WORDS = [
  // general / product feedback
  "amazing", "great", "good", "excellent", "love", "loved", "best",
  "wonderful", "awesome", "perfect", "nice", "beautiful", "fantastic",
  "happy", "enjoyed", "outstanding", "impressive", "flawless", "smooth",
  "seamless", "reliable", "intuitive", "easy", "fast", "quick", "simple",
  "recommend", "recommended", "worth", "satisfied", "satisfying",
  "premium", "solid", "polished", "responsive", "efficient", "helpful",
  "convenient", "delightful", "superb", "top-notch", "excellent",
  // homestay-specific (kept for that use case too)
  "clean", "friendly", "comfortable", "delicious", "cozy", "peaceful",
  "affordable", "value",
];

const NEGATIVE_WORDS = [
  // general / product feedback
  "bad", "poor", "worst", "terrible", "horrible", "awful", "disappointing",
  "disappointed", "broken", "buggy", "bug", "bugs", "crash", "crashing",
  "crashes", "freeze", "freezes", "freezing", "glitch", "glitches", "lag",
  "laggy", "slow", "unusable", "useless", "confusing", "outdated",
  "frustrating", "annoying", "unreliable", "fail", "failed", "failing",
  "locked", "expensive", "overpriced", "waste", "issue", "issues",
  "problem", "problems", "complaint", "complaints", "never", "lost",
  "stuck", "error", "errors", "unresponsive",
  // homestay-specific (kept for that use case too)
  "dirty", "rude", "noisy", "smell", "smelly", "cold", "late",
  "uncomfortable", "unhelpful", "unclean",
];

const THEMES = {
  "🛏️ Room Quality": ["room", "bed", "mattress", "pillow", "pillows", "furniture", "spacious", "cramped"],
  "🧹 Cleanliness": ["clean", "dirty", "housekeeping", "hygiene", "insects", "smell", "smelly", "unclean", "dust", "cockroach"],
  "👨‍💼 Staff Behaviour": ["staff", "receptionist", "host", "manager", "concierge", "hospitality", "welcoming"],
  "🍽️ Food": ["breakfast", "lunch", "dinner", "buffet", "restaurant", "coffee", "drinks", "food", "meal", "kitchen", "taste", "delicious"],
  "📍 Location": ["location", "nearby", "beach", "mountain", "city center", "attractions", "distance", "surroundings"],
  "💰 Value for Money": ["price", "expensive", "cheap", "worth it", "hidden charges", "affordable", "value", "overpriced", "cost"],
  "🏊 Amenities": ["pool", "gym", "spa", "garden", "play area", "netflix", "amenities", "facilities"],
  "🌐 Wi-Fi": ["wi-fi", "wifi", "internet", "network", "connection"],
  "🚗 Parking": ["parking", "valet", "vehicle", "car park"],
  "🔇 Noise": ["noisy", "quiet", "disturbance", "traffic", "loud", "noise"],
  "🚿 Bathroom": ["bathroom", "shower", "toilet", "hot water", "towels", "washroom"],
  "❄️ Room Facilities": ["ac", "air conditioner", "air conditioning", "tv", "refrigerator", "fridge", "kettle", "sockets", "heater"],
  "🛎️ Check-in / Check-out": ["check-in", "check in", "checkout", "check-out", "early check-in", "late checkout"],
  "🔒 Safety & Security": ["safe", "security", "cctv", "neighborhood", "locker", "unsafe"],
  "⚡ Maintenance": ["broken", "damaged", "repair", "plumbing", "leak", "leaking", "not working"],
  "👨‍👩‍👧 Family Experience": ["kids", "family", "child-friendly", "children", "playground"],
  "❤️ Couple Experience": ["honeymoon", "romantic", "couples", "couple"],
  "💼 Business Stay": ["workspace", "conference room", "business center", "meeting room", "work trip"],
  "♿ Accessibility": ["wheelchair", "elevator", "accessibility", "disabled access", "accessible"],
  "🐶 Pet Friendly": ["pets", "pet policy", "pet-friendly", "dog", "cat", "dogs", "cats"],
  "🌿 Environment": ["peaceful", "greenery", "ambience", "atmosphere", "scenic", "nature"],
  "🎉 Events & Activities": ["events", "entertainment", "activities", "live music"],
  "🚕 Transportation": ["airport shuttle", "taxi", "metro", "transport", "shuttle", "cab"],
  "🏖️ View & Surroundings": ["sea view", "mountain view", "sunset", "balcony", "scenic view"],
  "📱 Booking Experience": ["reservation", "booking", "cancellation", "refund", "booked"],
  "😊 Overall Experience": ["overall", "experience", "recommend", "revisit", "stay", "trip", "vacation", "memorable"],
};

/**
 * Looks for an explicit rating already present in the text, e.g.
 * "Great app (5)", "Terrible. 2/5", "Rating: 4 stars". Returns the
 * rating (1-5) and the text with that fragment stripped out, or
 * { rating: null, cleanText: original text } if nothing is found.
 */
function extractRatingFromText(rawText) {
  const patterns = [
    /\((\d)\)\s*$/,                 // "...text (5)" at the end
    /\b(\d)\s*\/\s*5\b/,             // "4/5"
    /\brating[:\s]+(\d)\b/i,         // "Rating: 4"
    /\b(\d)\s*stars?\b/i,            // "4 stars"
  ];

  for (const pattern of patterns) {
    const match = rawText.match(pattern);
    if (match) {
      const rating = parseInt(match[1], 10);
      if (rating >= 1 && rating <= 5) {
        return {
          rating,
          cleanText: rawText.replace(pattern, "").trim(),
        };
      }
    }
  }

  return { rating: null, cleanText: rawText };
}

function detectTheme(text) {
  let bestTheme = "Other";
  let bestHits = 0;
  for (const [theme, keywords] of Object.entries(THEMES)) {
    const hits = keywords.filter((k) => text.includes(k)).length;
    if (hits > bestHits) {
      bestHits = hits;
      bestTheme = theme;
    }
  }
  return bestTheme;
}

function keywordSentimentScore(rawText) {
  const text = rawText.toLowerCase();
  const words = text.match(/[a-z']+/g) || [];

  let posScore = 0;
  let negScore = 0;

  const NEGATORS = ["not", "no", "never", "n't", "hardly", "barely"];

  words.forEach((w, i) => {
    const window = words.slice(Math.max(0, i - 2), i);
    const negated = window.some((wPrev) => NEGATORS.includes(wPrev));

    if (POSITIVE_WORDS.includes(w)) {
      if (negated) negScore++;
      else posScore++;
    }
    if (NEGATIVE_WORDS.includes(w)) {
      if (negated) posScore++;
      else negScore++;
    }
  });

  const NEGATIVE_PHRASES = [
    "not up to the mark", "not upto the mark", "not good enough",
    "could be better", "needs improvement", "not worth it", "not great",
    "not clean", "not friendly", "not helpful", "waste of money",
  ];
  NEGATIVE_PHRASES.forEach((phrase) => {
    if (text.includes(phrase)) negScore += 1.5;
  });

  return { posScore, negScore };
}

function analyzeText(rawTextInput = "") {
  const { rating: explicitRating, cleanText } = extractRatingFromText(rawTextInput);
  const text = cleanText.toLowerCase();

  const { posScore, negScore } = keywordSentimentScore(cleanText);
  const theme = detectTheme(text);

  let sentiment;
  let confidence;

  if (explicitRating !== null) {
    // An explicit rating is ground truth - trust it over word-guessing.
    if (explicitRating >= 4) sentiment = "Positive";
    else if (explicitRating === 3) sentiment = "Neutral";
    else sentiment = "Negative";

    // High confidence since this came from a real rating, not a guess.
    confidence = 90 + Math.min(8, Math.abs(posScore - negScore));
  } else {
    // No explicit rating found - fall back to keyword scoring.
    if (posScore > negScore) sentiment = "Positive";
    else if (negScore > posScore) sentiment = "Negative";
    else sentiment = "Neutral";

    const totalSignal = posScore + negScore;
    if (totalSignal === 0) {
      confidence = 55;
    } else {
      const dominance = Math.abs(posScore - negScore) / totalSignal;
      confidence = Math.round(60 + dominance * 38);
    }
  }

  const responses = {
    Positive: "Thank you so much for the kind words! We're glad you had a great experience.",
    Neutral: "Thanks for your feedback — we'll keep working to make things even better.",
    Negative: "We're sorry to hear this. Thank you for flagging it, we'll address it right away.",
  };

  return {
    sentiment,
    theme,
    confidence,
    response: responses[sentiment],
  };
}

function analyzeAll(reviews) {
  const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
  const themeCounts = {};
  const analyzed = reviews.map((r, idx) => {
    const result = analyzeText(r.review || "");
    sentimentCounts[result.sentiment]++;
    themeCounts[result.theme] = (themeCounts[result.theme] || 0) + 1;
    return {
      id: r.id ?? idx + 1,
      username: r.username,
      review: r.review,
      rating: r.rating,
      ...result,
    };
  });

  return {
    total: reviews.length,
    sentimentCounts,
    themeCounts,
    analyzed,
  };
}

module.exports = { analyzeText, analyzeAll, extractRatingFromText };
