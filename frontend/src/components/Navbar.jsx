import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Navbar({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/login");
  };

  const linkClass = (path) =>
    `hover:text-blue-400 transition ${
      location.pathname === path ? "text-blue-400 font-semibold" : ""
    }`;

  return (
    <nav className="bg-slate-900 dark:bg-black text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
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

          <Link
            to="/login"
            onClick={handleLogout}
            className="hover:text-blue-400 transition"
          >
            Logout
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="
            text-xl
            hover:scale-110
            transition-transform
            duration-200
            "
            title="Toggle Theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

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
        <div className="md:hidden bg-slate-800 dark:bg-slate-950 px-6 pb-4 flex flex-col gap-4">

          <Link
            to="/"
            onClick={() => setOpen(false)}
            className={linkClass("/")}
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className={linkClass("/about")}
          >
            About
          </Link>

          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={linkClass("/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="hover:text-blue-400 transition"
          >
            Login
          </Link>

          {/* Mobile Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-left hover:text-blue-400"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <div className="text-2xl">👤 Profile</div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;