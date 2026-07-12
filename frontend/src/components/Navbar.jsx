import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Navbar({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load logged-in user. Wrapped in useCallback so it can be reused
  // both on mount and whenever auth state might have changed elsewhere.
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setUser(data);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // Re-check auth on mount AND whenever the route changes.
  // Fixes the bug where logging in on /login left the navbar stuck
  // showing "Login" until a hard refresh, because the old effect
  // only ran once ever (empty dependency array).
  useEffect(() => {
    loadUser();
  }, [location.pathname, loadUser]);

  // Also re-sync if the token changes in another tab, or if some
  // other component dispatches a manual "auth-changed" event
  // (fire this after your login call: window.dispatchEvent(new Event("auth-changed")))
  useEffect(() => {
    const handleAuthChange = () => loadUser();

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [loadUser]);

  // Close profile popup on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);
    setOpen(false);

    window.dispatchEvent(new Event("auth-changed"));

    navigate("/login");
  };

  const displayName = user?.fullName || user?.email || "Guest";

  const linkClass = (path) =>
    `hover:text-blue-400 transition ${
      location.pathname === path ? "text-blue-400 font-semibold" : ""
    }`;

  return (
    <nav className="bg-slate-900 dark:bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-blue-400">
          🏡 AI Review Analyzer
        </h1>

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

          {user ? (
            // Was previously a <Link to="/login"> with onClick preventDefault —
            // a real button is the correct element for an action, not navigation.
            <button
              onClick={handleLogout}
              className="hover:text-blue-400"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={linkClass("/login")}>
              Login
            </Link>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl hover:scale-110 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <div className="relative" ref={profileRef}>
            <span
              className="text-2xl cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
              role="button"
              tabIndex={0}
              aria-label="Open profile menu"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setProfileOpen(!profileOpen);
              }}
            >
              👤
            </span>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 p-4">

                {user ? (
                  <>
                    <p className="text-xs text-slate-400 mb-1">
                      Logged in as
                    </p>

                    <p className="font-semibold break-words">
                      {displayName}
                    </p>

                    <p className="text-xs text-slate-500 break-words">
                      {user.email}
                    </p>

                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="block mt-4 text-blue-500 hover:text-blue-600"
                    >
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block mt-3 text-red-500 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-500 mb-3">
                      Not logged in
                    </p>

                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="text-blue-500"
                    >
                      Log in / Create account
                    </Link>
                  </>
                )}

              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

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

          {user ? (
            <>
              {/* Settings link was missing from the mobile menu */}
              <Link to="/settings" onClick={() => setOpen(false)} className={linkClass("/settings")}>
                Settings
              </Link>

              <button onClick={handleLogout} className="text-left">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className={linkClass("/login")}>
              Login
            </Link>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-left"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <div className="border-t border-slate-700 pt-3">
            {user ? (
              <>
                <p className="text-xs text-slate-400">
                  Logged in as
                </p>

                <p>{displayName}</p>

                <p className="text-xs text-slate-400">
                  {user.email}
                </p>
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