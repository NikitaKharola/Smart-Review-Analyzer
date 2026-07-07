import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Card from "../components/Card";
import SentimentChart from "../components/SentimentChart";
import ThemeChart from "../components/ThemeChart";
import VoiceAssistant from "../components/VoiceAssistant";
import { Button } from "../components/ui";
import { supabase } from "../supabaseClient";
import {
  isLoggedIn,
  fetchReviews,
  fetchStats,
  saveReview,
  saveBulkReviews,
  updateReview,
  deleteReview,
} from "../api";
function Home() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [analysis, setAnalysis] = useState(null);
  const [batchResult, setBatchResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [stats, setStats] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null); 
  const [editingId, setEditingId] = useState(null);
const [editReview, setEditReview] = useState("");
const [editUsername, setEditUsername] = useState("");
const [editRating, setEditRating] = useState(5);// null = still checking

useEffect(() => {
  isLoggedIn().then((yes) => {
    setLoggedIn(yes);
    if (!yes) return;

    fetchReviews().then(setReviews).catch((err) => console.error(err));
    fetchStats().then(setStats).catch((err) => console.error(err));
  });
}, []);

  const sentimentChartData = stats
    ? Object.entries(stats.sentimentCounts).map(([name, value]) => ({ name, value }))
    : null;

  const themeChartData = stats
    ? Object.entries(stats.themeCounts).map(([theme, count]) => ({ theme, count }))
    : null;

  const handleAnalyze = async () => {
    if (!reviewText.trim()) {
      setAnalyzeError("Please paste one or more reviews before analyzing.");
      return;
    }
    if (!reviewerName.trim()) {
      setAnalyzeError("Please enter a name.");
      return;
    }
    setAnalyzeError("");
    setAnalyzing(true);
    setAnalysis(null);
    setBatchResult(null);

    // Split on blank lines first (paragraph-style paste). If that only
    // finds one block, fall back to splitting on single newlines
    // (one short review per line).
    let blocks = reviewText.split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);
    if (blocks.length === 1) {
      const lines = reviewText.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length > 1) blocks = lines;
    }

    try {
      if (blocks.length > 1) {
        const data = await saveBulkReviews({ username: reviewerName, reviews: blocks });
        setBatchResult(data);
        setReviews((prev) => [
          ...data.reviews.map((r) => ({ id: r.id, username: r.username, review: r.review, rating: r.rating })),
          ...prev,
        ]);
      } else {
        const data = await saveReview({
          username: reviewerName,
          review: blocks[0],
          rating,
        });

        setAnalysis({
          sentiment: data.sentiment,
          theme: data.theme,
          confidence: data.confidence,
          response: data.response,
        });

        setReviews((prev) => [
          { id: data.id, username: data.username, review: data.review, rating: data.rating },
          ...prev,
        ]);
      }

      setReviewText("");
    } catch (err) {
      console.error(err);
      setAnalyzeError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };
  const handleDelete = async (id) => {
  if (!window.confirm("Delete this review?")) return;

  try {
    await deleteReview(id);

    setReviews((prev) => prev.filter((r) => r.id !== id));

    const updatedStats = await fetchStats();
    setStats(updatedStats);
  } catch (err) {
    alert(err.message);
  }
};
const handleUpdate = async () => {
  try {
    const updated = await updateReview(editingId, {
      username: editUsername,
      review: editReview,
      rating: editRating,
    });

    setReviews((prev) =>
      prev.map((r) => (r.id === editingId ? updated : r))
    );

    setEditingId(null);

    const updatedStats = await fetchStats();
    setStats(updatedStats);
  } catch (err) {
    alert(err.message);
  }
};
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 transition-colors duration-300">

      <Hero
        onAnalyzeClick={() =>
          document.getElementById("try-review-analyzer")?.scrollIntoView({ behavior: "smooth" })
        }
        onDemoClick={() =>
          document.getElementById("analytics-preview")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* Statistics */}
      <section className="max-w-7xl mx-auto py-20 px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {[
            { icon: "📊", value: "100+", label: "Reviews Analyzed", color: "text-blue-600" },
            { icon: "🎯", value: "95%", label: "Accuracy", color: "text-green-600" },
            { icon: "🏷️", value: "30+", label: "Theme Categories", color: "text-purple-600" },
            { icon: "⚡", value: "24/7", label: "Insights Ready", color: "text-orange-500" },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white/60 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <h2 className={`text-3xl font-bold ${item.color}`}>
                {item.value}
              </h2>
              <p className="text-gray-600 mt-1">{item.label}</p>
            </div>
          ))}

        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold tracking-widest">
            FEATURES
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-slate-900">
            AI Powered Review Intelligence
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Everything you need to understand guest feedback with clarity and precision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <Card
            title="Sentiment Analysis"
            description="Classify reviews into Positive, Neutral and Negative."
            image="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            action="Explore"
            onAction={() =>
              document.getElementById("try-review-analyzer")?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <Card
            title="Theme Detection"
            description="Detect key themes like Food, Host, Cleanliness, Value."
            image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            action="Explore"
            onAction={() =>
              document.getElementById("try-review-analyzer")?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <Card
            title="AI Responses"
            description="Generate smart replies automatically."
            image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            action="Explore"
            onAction={() =>
              document.getElementById("try-review-analyzer")?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <Card
            title="Insight Reports"
            description="Find patterns and recurring issues instantly."
            image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
            action="Explore"
            onAction={() => navigate("/dashboard")}
          />

        </div>

      </section>

      {/* Charts */}
      <section id="analytics-preview" className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-900">
            Analytics Preview
          </h2>
          <p className="text-gray-500 mt-2">
            Real-time insights powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <SentimentChart data={sentimentChartData} />
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <ThemeChart data={themeChartData} />
          </div>

        </div>

      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-14">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            {[
              ["📝", "Paste Reviews"],
              ["🤖", "AI Analysis"],
              ["🏷️", "Theme Detection"],
              ["📊", "Insights Generated"],
            ].map((step, i) => (
              <div key={i} className="hover:scale-105 transition">
                <div className="text-5xl mb-4">{step[0]}</div>
                <h3 className="font-semibold">{step[1]}</h3>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Voice Assistant */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <VoiceAssistant
          onTranscript={(text) => {
            setReviewText(text);
            document.getElementById("try-review-analyzer")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      {/* Review Preview */}
<section id="try-review-analyzer" className="bg-slate-50 dark:bg-slate-900 py-24 transition-colors duration-300">

  <div className="max-w-5xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white">
      Try Review Analyzer
    </h2>

    {loggedIn === false && (
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-100 dark:border-slate-700 rounded-2xl p-10 shadow-xl text-center">
        <p className="text-lg text-slate-700 dark:text-slate-200 mb-4">
          This is a private tool for property owners — log in to paste and analyze your own guest reviews.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Log in / Create account
        </Link>
      </div>
    )}

    {loggedIn && (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-100 dark:border-slate-700 rounded-2xl p-8 shadow-xl">

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Your name"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{"⭐".repeat(n)} ({n}/5)</option>
          ))}
        </select>
      </div>

      <textarea
        className="
        w-full
        border
        border-gray-200
        dark:border-slate-600
        bg-white
        dark:bg-slate-900
        text-slate-900
        dark:text-white
        rounded-xl
        p-4
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        "
        rows="5"
        placeholder="Paste one review, or paste several at once (separate each with a blank line) to get a combined summary..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      {analyzeError && (
        <p className="mt-2 text-sm text-red-500">{analyzeError}</p>
      )}

    <Button
  text={analyzing ? "Analyzing..." : "Analyze Reviews"}
  className="
    mt-5
    bg-blue-600
    hover:bg-blue-700
    px-6
    py-3
    rounded-xl
    shadow-md
    transition
    disabled:opacity-60
  "
  onClick={handleAnalyze}
/>

      {analysis && (
        <div
          className="
          mt-8
          bg-slate-50
          dark:bg-slate-900
          rounded-xl
          p-6
          border
          border-gray-100
          dark:border-slate-700
          "
        >

          <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">
            Analysis Result
          </h3>

          <div className="space-y-2 text-gray-700 dark:text-gray-300">

            <p><strong>Sentiment:</strong> {analysis.sentiment}</p>
            <p><strong>Theme:</strong> {analysis.theme}</p>
            <p><strong>Confidence:</strong> {analysis.confidence}%</p>
            <p><strong>Response:</strong> {analysis.response}</p>

          </div>

        </div>
      )}

      {batchResult && (
        <div
          className="
          mt-8
          bg-slate-50
          dark:bg-slate-900
          rounded-xl
          p-6
          border
          border-gray-100
          dark:border-slate-700
          "
        >
          <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">
            Combined Summary — {batchResult.count} review{batchResult.count !== 1 ? "s" : ""} analyzed
          </h3>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{batchResult.sentimentCounts.Positive}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Positive</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{batchResult.sentimentCounts.Neutral}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Neutral</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{batchResult.sentimentCounts.Negative}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Negative</p>
            </div>
          </div>

          <h4 className="font-semibold mb-2 text-slate-800 dark:text-white">Themes mentioned</h4>
          <ul className="space-y-1 mb-6 text-sm text-slate-600 dark:text-slate-300">
            {Object.entries(batchResult.themeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([theme, count]) => (
                <li key={theme} className="flex justify-between border-b border-gray-100 dark:border-slate-800 py-1">
                  <span>{theme}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
          </ul>

          <h4 className="font-semibold mb-2 text-slate-800 dark:text-white">Individual results</h4>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {batchResult.reviews.map((r) => (
              <div key={r.id} className="text-sm bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-100 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-200 mb-1">"{r.review}"</p>
                <p className="text-xs text-slate-400">
                  {r.sentiment} · {r.theme} · {r.confidence}% confidence
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Want the full picture with strengths and areas to improve? Check your{" "}
            <Link to="/dashboard" className="text-blue-500 font-medium">Dashboard</Link> and export a report there.
          </p>
        </div>
      )}

    </div>
    )}

  </div>

</section>
{/* Backend Reviews */}
<section className="max-w-7xl mx-auto px-6 py-20">

  <h2 className="text-4xl font-bold text-center mb-10">
    Your Reviews
  </h2>

  {loggedIn === false && (
    <p className="text-center text-slate-500">Log in to see your saved reviews here.</p>
  )}

  {loggedIn && reviews.length === 0 && (
    <p className="text-center text-slate-500">No reviews yet — analyze one above to get started.</p>
  )}

  <div className="grid md:grid-cols-2 gap-6">

    {reviews.map((review) => (
      <div
        key={review.id}
        className="bg-white rounded-xl shadow-md p-6 border"
      >
        {editingId === review.id ? (
  <>
    <input
      className="border p-2 w-full mb-2"
      value={editUsername}
      onChange={(e) => setEditUsername(e.target.value)}
    />

    <textarea
      className="border p-2 w-full mb-2"
      value={editReview}
      onChange={(e) => setEditReview(e.target.value)}
    />

    <select
      className="border p-2 w-full mb-3"
      value={editRating}
      onChange={(e) => setEditRating(Number(e.target.value))}
    >
      {[1,2,3,4,5].map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>

    <button
      onClick={handleUpdate}
      className="bg-green-600 text-white px-4 py-2 rounded mr-2"
    >
      Save
    </button>

    <button
      onClick={() => setEditingId(null)}
      className="bg-gray-500 text-white px-4 py-2 rounded"
    >
      Cancel
    </button>
  </>
) : (
  <>
    <h3 className="text-xl font-bold">{review.username}</h3>

    <p className="mt-3">{review.review}</p>

    <p className="mt-3 text-yellow-600">
      ⭐ Rating: {review.rating}/5
    </p>

    <div className="mt-5 flex gap-3">
      <button
        onClick={() => {
          setEditingId(review.id);
          setEditUsername(review.username);
          setEditReview(review.review);
          setEditRating(review.rating);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(review.id)}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  </>
)}
      </div>
    ))}

  </div>

</section>
      {/* Testimonials */}
      <section className="max-w-7xl mx-auto py-24 px-6">

        <h2 className="text-4xl font-bold text-center mb-14">
          What Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[
            "Reduced manual review analysis drastically.",
            "Helps identify guest issues instantly.",
            "Improves decision-making with AI insights."
          ].map((text, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition"
            >
              <p className="text-yellow-500 text-lg">★★★★★</p>
              <p className="mt-3 text-gray-700">{text}</p>
            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

export default Home;