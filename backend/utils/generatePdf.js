const PDFDocument = require("pdfkit");

/**
 * Streams a formatted PDF report directly to the HTTP response.
 * ownerLabel is a friendly name for whoever is generating this
 * (their name/email), shown at the top of the report.
 */
function generateReportPdf(res, reportData, ownerLabel) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=guest-review-report.pdf");
  doc.pipe(res);

  const {
    total, avgRating, sentimentCounts, positivePct, negativePct,
    topPositiveThemes, topNegativeThemes, positiveExamples, negativeExamples,
  } = reportData;

  // Header
  doc.fontSize(22).fillColor("#1e293b").text("Guest Review Report", { align: "left" });
  doc.fontSize(10).fillColor("#64748b").text(`Prepared for: ${ownerLabel}`);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`);
  doc.moveDown(1.5);

  // Summary
  doc.fontSize(14).fillColor("#1e293b").text("Summary", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#334155");
  doc.text(`Total reviews analyzed: ${total}`);
  doc.text(`Average rating: ${avgRating} / 5`);
  doc.text(`Positive: ${sentimentCounts.Positive} (${positivePct}%)   Neutral: ${sentimentCounts.Neutral}   Negative: ${sentimentCounts.Negative} (${negativePct}%)`);
  doc.moveDown(1.5);

  // What's working well
  doc.fontSize(14).fillColor("#16a34a").text("What's Working Well", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#334155");
  if (topPositiveThemes.length === 0) {
    doc.text("Not enough positive reviews yet to identify strong themes.");
  } else {
    topPositiveThemes.forEach((t) => {
      doc.text(`•  ${t.theme} — mentioned positively in ${t.count} review(s)`);
    });
  }
  doc.moveDown(0.8);

  if (positiveExamples.length > 0) {
    doc.fontSize(11).fillColor("#1e293b").text("Example feedback:", { italic: true });
    doc.moveDown(0.3);
    positiveExamples.forEach((ex) => {
      doc.fontSize(10).fillColor("#475569").text(`"${ex.review}"`, { indent: 15 });
      doc.fontSize(9).fillColor("#94a3b8").text(`— ${ex.username}, theme: ${ex.theme}`, { indent: 15 });
      doc.moveDown(0.4);
    });
  }
  doc.moveDown(1);

  // Areas to improve
  doc.fontSize(14).fillColor("#dc2626").text("Areas to Improve", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor("#334155");
  if (topNegativeThemes.length === 0) {
    doc.text("No recurring negative themes found — nice work!");
  } else {
    topNegativeThemes.forEach((t) => {
      doc.text(`•  ${t.theme} — flagged negatively in ${t.count} review(s)`);
    });
  }
  doc.moveDown(0.8);

  if (negativeExamples.length > 0) {
    doc.fontSize(11).fillColor("#1e293b").text("Example feedback:", { italic: true });
    doc.moveDown(0.3);
    negativeExamples.forEach((ex) => {
      doc.fontSize(10).fillColor("#475569").text(`"${ex.review}"`, { indent: 15 });
      doc.fontSize(9).fillColor("#94a3b8").text(`— ${ex.username}, theme: ${ex.theme}`, { indent: 15 });
      doc.moveDown(0.4);
    });
  }

  doc.moveDown(1.5);
  doc.fontSize(9).fillColor("#94a3b8").text(
    "Generated automatically by Smart Review Analyzer based on your submitted guest reviews.",
    { align: "left" }
  );

  doc.end();
}

module.exports = { generateReportPdf };
