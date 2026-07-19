/**
 * AI-powered review analyzer (Hugging Face Inference Providers).
 *
 * This is the Week 7 upgrade: analyzeText() in analyzer.js was rule-based
 * (keyword matching, no API, no cost, no rate limits) — good for an MVP,
 * but it can't understand tone, sarcasm, or context. This module replaces
 * it with a real LLM call, while keeping analyzer.js as a safety net:
 * if the API is unreachable, rate-limited, times out, or returns something
 * we can't parse, we fall back to the rule-based analyzer instead of
 * failing the request outright. Every caller (routes) is unaffected by
 * which path actually ran — same return shape either way:
 *   { sentiment, theme, confidence, response }
 *
 * Uses Hugging Face's OpenAI-compatible chat completions router, which
 * proxies to whichever free/paid inference provider currently hosts the
 * requested open-weight model. Free with just an HF account + token.
 */

const axios = require("axios");
const { analyzeText, THEMES } = require("./analyzer");

const HF_TOKEN = process.env.HF_API_KEY;
const HF_URL = "https://router.huggingface.co/v1/chat/completions";
// A widely-hosted instruction-following open model available on the free
// Inference Providers router — good enough for structured JSON output.
const HF_MODEL = "meta-llama/Llama-3.3-70B-Instruct";

const THEME_LIST = [...Object.keys(THEMES), "Other"];
const VALID_SENTIMENTS = ["Positive", "Neutral", "Negative"];

// See PROMPTS.md for the earlier variations tried and why this one won.
function buildPrompt(reviewText) {
  return `You are a review-analysis assistant for a hospitality/product review platform.

Read the customer review below and respond with ONLY a JSON object — no markdown fences, no explanation, no extra text — in exactly this shape:

{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "theme": one of ${JSON.stringify(THEME_LIST)} (pick the single closest match; use "Other" only if truly nothing fits),
  "confidence": a number from 0 to 100 for how confident you are in the sentiment classification,
  "response": "a short, warm, professional 1-2 sentence reply the business owner could send back to this reviewer"
}

Review: """${reviewText}"""`;
}

// Some models wrap JSON in ```json ... ``` fences despite instructions
// not to — strip those before parsing.
function extractJson(rawText) {
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

function validateShape(parsed) {
  if (!VALID_SENTIMENTS.includes(parsed.sentiment)) {
    throw new Error(`Invalid sentiment from AI: ${parsed.sentiment}`);
  }
  if (typeof parsed.confidence !== "number" || Number.isNaN(parsed.confidence)) {
    throw new Error(`Invalid confidence from AI: ${parsed.confidence}`);
  }
  if (!parsed.theme || typeof parsed.theme !== "string") {
    throw new Error(`Invalid theme from AI: ${parsed.theme}`);
  }
  if (!parsed.response || typeof parsed.response !== "string") {
    throw new Error(`Invalid response text from AI: ${parsed.response}`);
  }
}

/**
 * Analyzes a single review's text using Hugging Face's hosted chat model.
 * Falls back to the rule-based analyzer (analyzeText) on any failure —
 * missing token, network error, timeout, rate limit, or a malformed AI
 * response — so a flaky API call never breaks the user-facing feature.
 */
async function analyzeTextAI(reviewText) {
  if (!HF_TOKEN) {
    console.warn("[aiAnalyzer] HF_API_KEY not set — using rule-based analyzer instead.");
    return analyzeText(reviewText);
  }

  try {
    const response = await axios.post(
      HF_URL,
      {
        model: HF_MODEL,
        messages: [{ role: "user", content: buildPrompt(reviewText) }],
        temperature: 0.3,
      },
      {
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
        timeout: 15000,
      }
    );

    const rawText = response.data?.choices?.[0]?.message?.content;
    if (!rawText) throw new Error("Empty response from Hugging Face");

    const parsed = extractJson(rawText);
    validateShape(parsed);

    return {
      sentiment: parsed.sentiment,
      theme: THEME_LIST.includes(parsed.theme) ? parsed.theme : "Other",
      confidence: Math.max(0, Math.min(100, Math.round(parsed.confidence))),
      response: parsed.response,
    };
  } catch (err) {
    const detail = err.response?.data?.error?.message || err.message;
    console.error("[aiAnalyzer] Hugging Face call failed, falling back to rule-based analyzer:", detail);
    return analyzeText(reviewText);
  }
}

module.exports = { analyzeTextAI };