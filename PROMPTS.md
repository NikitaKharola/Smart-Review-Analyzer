# Prompts Log — Week 7 (AI Review Analyzer)

**Feature:** Given a customer review, the AI classifies sentiment (Positive /
Neutral / Negative), detects the closest matching theme (Room Quality,
Cleanliness, Staff Behaviour, etc. — the same category list the dashboard
charts already use), assigns a confidence score, and drafts a short reply
the business owner can send back.

**Model:** Hugging Face Inference Providers — `meta-llama/Llama-3.3-70B-Instruct` (via the OpenAI-compatible chat completions router)
**Where it lives:** `backend/utils/aiAnalyzer.js`

---

## Variation 1 — Plain instruction, no format constraint

```
Analyze this review and tell me the sentiment, the main theme, and suggest
a reply: "{review}"
```

**Example input:** `"The room was clean but the AC was broken all night."`

**Output:** A paragraph of free-form text — something like *"This review is
mixed. The sentiment leans slightly negative due to the broken AC..."*

**Problem:** Not machine-parseable. The backend needs a `sentiment` string
and a `theme` string it can save to specific database columns — parsing
this reliably would need a second AI call or fragile regex. Rejected.

---

## Variation 2 — Ask for JSON, but no fixed theme list

```
Analyze this review and respond in JSON with sentiment, theme, confidence,
and a suggested reply: "{review}"
```

**Example input:** same as above.

**Output:** Valid JSON, but the model invented its own theme label each
time — `"Room & AC Issue"` one run, `"Amenities/Maintenance"` the next,
`"HVAC Problem"` another time. Since the dashboard's theme chart aggregates
by exact string match, near-duplicate labels split what should be one
theme into three, quietly wrecking the analytics.

**Problem:** Free-form theme strings don't stay consistent across calls.
Rejected.

---

## Variation 3 (final) — JSON + a closed, explicit theme list

```
You are a review-analysis assistant for a hospitality/product review platform.

Read the customer review below and respond with ONLY a JSON object — no
markdown fences, no explanation, no extra text — in exactly this shape:

{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "theme": one of [...the app's existing 25 theme categories..., "Other"]
  (pick the single closest match; use "Other" only if truly nothing fits),
  "confidence": a number from 0 to 100 for how confident you are in the
  sentiment classification,
  "response": "a short, warm, professional 1-2 sentence reply the business
  owner could send back to this reviewer"
}

Review: """{review}"""
```

**Example input:** `"The room was clean but the AC was broken all night."`

**Example output:**
```json
{
  "sentiment": "Negative",
  "theme": "❄️ Room Facilities",
  "confidence": 78,
  "response": "We're sorry the AC gave you trouble overnight — thank you for flagging it, we'll get it repaired right away."
}
```

**Why this one won:** Constraining `theme` to the exact list already used
by `THEMES` in `analyzer.js` (imported into the prompt at runtime, not
hardcoded twice) means the AI's output slots directly into the existing
dashboard charts and database schema with zero extra mapping — the same
category names, every time. The explicit JSON-only instruction also made
parsing reliable enough that a fallback (see below) only needs to trigger
on rare malformed responses, not routine formatting drift.

**System role used:** No separate system-role field — the full instruction
(role + task + format + review) is sent as a single user-turn message in
the OpenAI-compatible chat completions request, since the task is scoped
enough not to need a distinct system message.

---

## Error handling note

Every call to `analyzeTextAI()` is wrapped in a try/catch. If the Hugging
Face call fails for *any* reason — missing API token, network error,
timeout, rate limit, or a response that fails JSON parsing / shape
validation — the function silently falls back to the original rule-based
analyzer (`analyzeText()` in `analyzer.js`) instead of throwing. This
means a flaky API or exhausted free-tier quota degrades the feature's
*accuracy*, not its *availability* — the app keeps working end-to-end
either way.