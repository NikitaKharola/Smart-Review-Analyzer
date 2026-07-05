import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Navbar({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Close the profile dropdown if you click anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email || "Guest";

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

          <div className="relative" ref={profileRef}>
            <span
              className="text-2xl cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              👤
            </span>

            {profileOpen && (
              <div
                className="
                absolute right-0 mt-3 w-56
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                rounded-xl shadow-xl
                border border-gray-100 dark:border-slate-700
                p-4 z-50
                "
              >
                {user ? (
                  <>
                    <p className="text-xs text-slate-400 mb-1">Logged in as</p>
                    <p className="font-semibold break-words">{displayName}</p>
                    {user?.user_metadata?.full_name && (
                      <p className="text-xs text-slate-400 mt-1 break-words">{user.email}</p>
                    )}
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full text-left text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-500 mb-2">Not logged in</p>
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="text-sm text-blue-500 font-medium"
                    >
                      Log in / Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
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

          <div className="text-base border-t border-slate-700 pt-3">
            {user ? (
              <>
                <p className="text-xs text-slate-400">Logged in as</p>
                <p className="font-semibold break-words">👤 {displayName}</p>
              </>
            ) : (
              <p>👤 Not logged in</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;