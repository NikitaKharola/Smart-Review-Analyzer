function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-auto">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h3 className="text-xl font-bold mb-3">
          AI Review Analyzer
        </h3>

        <div className="flex justify-center gap-6 mb-4">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Dashboard</a>
          <a href="#">Login</a>
        </div>

        <div className="flex justify-center gap-4 mb-4 text-2xl">
          <span>📘</span>
          <span>📸</span>
          <span>🐦</span>
        </div>

        <p>
          © 2026 AI Review Analyzer
        </p>

      </div>
    </footer>
  );
}

export default Footer;