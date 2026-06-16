import SentimentChart from "../components/SentimentChart";
import ThemeChart from "../components/ThemeChart";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">

      <div className="max-w-7xl mx-auto py-16 px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 text-slate-900">
            Analytics Dashboard
          </h1>

          <p className="text-slate-600 text-lg">
            Future analytics and review insights will appear here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">📊</div>
            <h2 className="text-3xl font-bold text-slate-900">60</h2>
            <p className="text-slate-600">Total Reviews</p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">🟢</div>
            <h2 className="text-3xl font-bold text-green-600">42</h2>
            <p className="text-slate-600">Positive</p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">🟡</div>
            <h2 className="text-3xl font-bold text-yellow-500">10</h2>
            <p className="text-slate-600">Neutral</p>
          </div>

          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-3xl mb-2">🔴</div>
            <h2 className="text-3xl font-bold text-red-500">8</h2>
            <p className="text-slate-600">Negative</p>
          </div>

        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">

          <button className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-blue-600 hover:shadow-md transition">
            📄 Export PDF
          </button>

          <button className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-sm hover:bg-green-600 hover:shadow-md transition">
            📥 Download CSV
          </button>

        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-sm p-6">
            <SentimentChart />
          </div>

          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-sm p-6">
            <ThemeChart />
          </div>

        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Top Themes */}
          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              Top Themes
            </h2>

            <ul className="space-y-3 text-lg text-slate-700">
              <li>🏨 Cleanliness</li>
              <li>🍽 Food</li>
              <li>😊 Host Behaviour</li>
              <li>📍 Location</li>
              <li>💰 Value For Money</li>
              <li>🌄 Experience</li>
            </ul>

          </div>

          {/* Recent Activity */}
          <div className="bg-white/50 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              Recent Activity
            </h2>

            <ul className="space-y-4 text-slate-700">

              <li className="border-b pb-2">
                🔵 Review #001 → Positive → Cleanliness
              </li>

              <li className="border-b pb-2">
                🟠 Review #002 → Neutral → Food
              </li>

              <li className="border-b pb-2">
                🔴 Review #003 → Negative → Accessibility
              </li>

              <li>
                🔵 Review #004 → Positive → Host Behaviour
              </li>

            </ul>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;