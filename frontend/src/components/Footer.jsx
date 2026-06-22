function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white py-8 mt-auto transition-colors duration-300">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h3 className="text-xl font-bold mb-3">
          AI Review Analyzer
        </h3>

        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-blue-400">Home</a>
          <a href="#" className="hover:text-blue-400">About</a>
          <a href="#" className="hover:text-blue-400">Dashboard</a>
          <a href="#" className="hover:text-blue-400">Login</a>
        </div>

        <div className="flex justify-center gap-4 mb-4 text-2xl">
          <span>📘</span>
          <span>📸</span>
          <span>🐦</span>
        </div>

        <p className="text-slate-300">
          © 2026 AI Review Analyzer
        </p>

      </div>
    </footer>
  );
}

export default Footer;