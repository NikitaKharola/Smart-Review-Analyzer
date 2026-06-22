import Hero from "../components/Hero";
import Card from "../components/Card";
import SentimentChart from "../components/SentimentChart";
import ThemeChart from "../components/ThemeChart";
import VoiceAssistant from "../components/VoiceAssistant";
import { Button } from "../components/ui";
function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 transition-colors duration-300">

      <Hero />

      {/* Statistics */}
      <section className="max-w-7xl mx-auto py-20 px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {[
            { icon: "📊", value: "60+", label: "Reviews Analyzed", color: "text-blue-600" },
            { icon: "🎯", value: "95%", label: "Accuracy", color: "text-green-600" },
            { icon: "🏷️", value: "6", label: "Theme Categories", color: "text-purple-600" },
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
          />

          <Card
            title="Theme Detection"
            description="Detect key themes like Food, Host, Cleanliness, Value."
            image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            action="Explore"
          />

          <Card
            title="AI Responses"
            description="Generate smart replies automatically."
            image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            action="Explore"
          />

          <Card
            title="Insight Reports"
            description="Find patterns and recurring issues instantly."
            image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
            action="Explore"
          />

        </div>

      </section>

      {/* Charts */}
      <section className="max-w-7xl mx-auto px-6 py-20">

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
            <SentimentChart />
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition">
            <ThemeChart />
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
        <VoiceAssistant />
      </section>

      {/* Review Preview */}
<section className="bg-slate-50 dark:bg-slate-900 py-24 transition-colors duration-300">

  <div className="max-w-5xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-10 text-slate-900 dark:text-white">
      Try Review Analyzer
    </h2>

    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-gray-100 dark:border-slate-700 rounded-2xl p-8 shadow-xl">

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
        placeholder="Paste guest reviews here..."
      />

    <Button
  text="Analyze Reviews"
  className="
    mt-5
    bg-blue-600
    hover:bg-blue-700
    px-6
    py-3
    rounded-xl
    shadow-md
    transition
  "
  onClick={() => console.log("Analyze Reviews")}
/>

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
          Example Result
        </h3>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">

          <p><strong>Sentiment:</strong> Positive</p>
          <p><strong>Theme:</strong> Cleanliness</p>
          <p><strong>Confidence:</strong> 92%</p>
          <p><strong>Response:</strong> Thank you for your valuable feedback.</p>

        </div>

      </div>

    </div>

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