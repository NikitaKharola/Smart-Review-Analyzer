function About() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6
      bg-gradient-to-r from-slate-100 via-blue-100 via-purple-100 to-indigo-100 animate-gradient">

      {/* FLOATING BLOBS (same as login) */}
      <div className="absolute w-72 h-72 bg-blue-300 blur-3xl opacity-40 rounded-full top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-purple-300 blur-3xl opacity-40 rounded-full bottom-10 right-10"></div>
      <div className="absolute w-64 h-64 bg-pink-300 blur-3xl opacity-30 rounded-full top-1/2 left-1/3"></div>

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto py-24">
{/* Header */}
<div className="text-center mb-14">

  <p className="text-slate-600 font-semibold tracking-widest mb-3">
    ABOUT PROJECT
  </p>

  <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
    AI-Powered Guest Review Analysis
  </h1>

  <p className="text-lg text-slate-600 max-w-3xl mx-auto mt-6 leading-relaxed">
    AI Review Analyzer transforms guest feedback into actionable insights
    using sentiment detection and smart theme analysis.
  </p>

</div>
        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Mission */}
          <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Mission
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Improve guest satisfaction by turning raw reviews into actionable insights
              using AI-powered analysis.
            </p>
          </div>

          {/* Future */}
          <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Future Features
            </h2>
            <p className="text-slate-600 leading-relaxed">
              AI dashboards, automated response generation, real-time analytics,
              and smart reporting tools.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default About;