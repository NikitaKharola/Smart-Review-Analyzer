/**
 * Turns a raw list of analyzed reviews into a report-ready summary:
 * overall stats, which themes come up most in positive vs negative
 * reviews, and a few real example quotes for each side.
 */
function buildReportData(reviews) {
  const total = reviews.length;

  const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
  const positiveThemeCounts = {};
  const negativeThemeCounts = {};
  const positiveExamples = [];
  const negativeExamples = [];

  reviews.forEach((r) => {
    if (r.sentiment) sentimentCounts[r.sentiment] = (sentimentCounts[r.sentiment] || 0) + 1;

    if (r.sentiment === "Positive" && r.theme) {
      positiveThemeCounts[r.theme] = (positiveThemeCounts[r.theme] || 0) + 1;
      if (positiveExamples.length < 5) {
        positiveExamples.push({ username: r.username, review: r.reviewText, theme: r.theme });
      }
    }

    if (r.sentiment === "Negative" && r.theme) {
      negativeThemeCounts[r.theme] = (negativeThemeCounts[r.theme] || 0) + 1;
      if (negativeExamples.length < 5) {
        negativeExamples.push({ username: r.username, review: r.reviewText, theme: r.theme });
      }
    }
  });

  const sortThemes = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([theme, count]) => ({ theme, count }));

  const avgRating = total
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(1)
    : "N/A";

  const positivePct = total ? Math.round((sentimentCounts.Positive / total) * 100) : 0;
  const negativePct = total ? Math.round((sentimentCounts.Negative / total) * 100) : 0;

  return {
    total,
    avgRating,
    sentimentCounts,
    positivePct,
    negativePct,
    topPositiveThemes: sortThemes(positiveThemeCounts).slice(0, 5),
    topNegativeThemes: sortThemes(negativeThemeCounts).slice(0, 5),
    positiveExamples,
    negativeExamples,
  };
}

module.exports = { buildReportData };
