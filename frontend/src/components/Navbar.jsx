import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    `hover:text-blue-400 transition ${
      location.pathname === path ? "text-blue-400 font-semibold" : ""
    }`;

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold text-blue-400">
          🏡 AI Review Analyzer
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">

          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/about" className={linkClass("/about")}>
            About
          </Link>

          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>

          {/* LOGIN - NORMAL (NO SPECIAL STYLING) */}
          <Link
            to="/login"
            className="hover:text-blue-400 transition"
          >
            Login
          </Link>

          <span className="text-2xl cursor-pointer">👤</span>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-slate-800 px-6 pb-4 flex flex-col gap-4">

          <Link to="/" onClick={() => setOpen(false)} className={linkClass("/")}>
            Home
          </Link>

          <Link to="/about" onClick={() => setOpen(false)} className={linkClass("/about")}>
            About
          </Link>

          <Link to="/dashboard" onClick={() => setOpen(false)} className={linkClass("/dashboard")}>
            Dashboard
          </Link>

          {/* LOGIN - NORMAL */}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="hover:text-blue-400 transition"
          >
            Login
          </Link>

          <div className="text-2xl">👤 Profile</div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;