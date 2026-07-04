import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SentimentChart from "../components/SentimentChart";
import ThemeChart from "../components/ThemeChart";
import { isLoggedIn, fetchStats } from "../api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn().then((yes) => {
      if (!yes) {
        navigate("/login");
        return;
      }
      setCheckingAuth(false);
      fetchStats()
        .then(setStats)
        .catch((err) => {
          console.error(err);
          setError(err.message || "Could not load dashboard data.");
        });
    });
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Checking your session...</p>
      </div>
    );
  }

  const sentimentChartData = stats
    ? Object.entries(stats.sentimentCounts).map(([name, value]) => ({ name, value }))
    : null;

  const themeChartData = stats
    ? Object.entries(stats.themeCounts)
        .map(([theme, count]) => ({ theme, count }))
        .sort((a, b) => b.count - a.count)
    : null;

  const topThemes = themeChartData ? themeChartData.slice(0, 6) : [];
  const recentActivity = stats ? [...stats.analyzed].reverse().slice(0, 4) : [];
  const emojiForSentiment = { Positive: "🔵", Neutral: "🟠", Negative: "🔴" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">

      <div className="max-w-7xl mx-auto py-16 px-6">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 text-slate-900 dark:text-white">
            Analytics Dashboard
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Live analytics computed from your guest reviews only.
          </p>

          {error && <p className="text-red-500 mt-3">{error}</p>}
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">📊</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats ? stats.total : "—"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">Total Reviews</p>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">🟢</div>
            <h2 className="text-3xl font-bold text-green-600">
              {stats ? stats.sentimentCounts.Positive : "—"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">Positive</p>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">🟡</div>
            <h2 className="text-3xl font-bold text-yellow-500">
              {stats ? stats.sentimentCounts.Neutral : "—"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">Neutral</p>
          </div>

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">🔴</div>
            <h2 className="text-3xl font-bold text-red-500">
              {stats ? stats.sentimentCounts.Negative : "—"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300">Negative</p>
          </div>

        </div>

        <div className="flex flex-wrap gap-4 mb-10">

          <button
            onClick={() => window.print()}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-blue-600 hover:shadow-md transition"
          >
            📄 Export PDF
          </button>

          <button
            onClick={() => {
              if (!stats) return;
              const rows = [
                ["Username", "Review", "Rating", "Sentiment", "Theme", "Confidence"],
                ...stats.analyzed.map((r) => [
                  r.username, r.review, r.rating, r.sentiment, r.theme, r.confidence,
                ]),
              ];
              const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "reviews-export.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-green-600 hover:shadow-md transition"
          >
            📥 Download CSV
          </button>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-6">
            <SentimentChart data={sentimentChartData} />
          </div>

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-6">
            <ThemeChart data={themeChartData} />
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Top Themes
            </h2>

            <ul className="space-y-3 text-lg text-slate-700 dark:text-slate-300">
              {topThemes.length === 0 && <li className="text-slate-400">No data yet.</li>}
              {topThemes.map((t) => (
                <li key={t.theme} className="flex justify-between">
                  <span>{t.theme}</span>
                  <span className="font-semibold">{t.count}</span>
                </li>
              ))}
            </ul>

          </div>

          <div className="bg-white/50 dark:bg-slate-800/60 backdrop-blur-lg border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Recent Activity
            </h2>

            <ul className="space-y-4 text-slate-700 dark:text-slate-300">
              {recentActivity.length === 0 && <li className="text-slate-400">No data yet.</li>}
              {recentActivity.map((r) => (
                <li key={r.id} className="border-b dark:border-slate-700 pb-2">
                  {emojiForSentiment[r.sentiment]} Review #{String(r.id).padStart(3, "0")} → {r.sentiment} → {r.theme}
                </li>
              ))}
            </ul>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
