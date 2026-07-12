import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If already logged in, skip straight to the dashboard.
  // We verify the stored token against the backend rather than trusting it blindly.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) navigate("/dashboard");
      else localStorage.removeItem("token");
    });
  }, [navigate]);

  // If the backend's OAuth callback redirected back here with an error
  // (e.g. ?error=oauth_failed), surface it the same way form errors show.
  useEffect(() => {
    if (searchParams.get("error") === "oauth_failed") {
      setError("Google sign-in didn't complete. Please try again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/dashboard");
      } else {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullname }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        setMessage("Account created! You can now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Full page navigation, not fetch — Google's consent screen needs a
    // real browser redirect, and the backend sends us back to
    // /oauth-callback with a token once it's done.
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div
      className="
      relative min-h-screen flex items-center justify-center px-4 overflow-hidden
      bg-gradient-to-r
      from-slate-100 via-blue-100 via-purple-100 to-indigo-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-800
      animate-gradient
      transition-all duration-300
      "
    >
      {/* FLOATING BLOBS */}
      <div className="blob w-72 h-72 bg-blue-300 top-10 left-10"></div>
      <div className="blob w-80 h-80 bg-purple-300 bottom-10 right-10"></div>
      <div className="blob w-64 h-64 bg-pink-300 top-1/2 left-1/3"></div>

      {/* LOGIN CARD */}
      <div
        className="
        relative z-10 w-full max-w-md
        bg-white/80 dark:bg-slate-800/80
        backdrop-blur-2xl
        border border-white/40 dark:border-slate-700
        shadow-2xl
        rounded-3xl
        p-10
        transition-all duration-300
        "
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏨</div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-sm text-gray-500 dark:text-slate-300 mt-2">
            {isLogin
              ? "Sign in to access your AI dashboard"
              : "Start analyzing guest reviews in seconds"}
          </p>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/30 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="
              w-full px-4 py-3 rounded-xl
              border border-gray-300 dark:border-slate-600
              bg-white dark:bg-slate-900
              text-black dark:text-white
              focus:ring-2 focus:ring-blue-400
              outline-none
              "
            />
          )}

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="
            w-full px-4 py-3 rounded-xl
            border border-gray-300 dark:border-slate-600
            bg-white dark:bg-slate-900
            text-black dark:text-white
            focus:ring-2 focus:ring-blue-400
            outline-none
            "
          />

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="
            w-full px-4 py-3 rounded-xl
            border border-gray-300 dark:border-slate-600
            bg-white dark:bg-slate-900
            text-black dark:text-white
            focus:ring-2 focus:ring-blue-400
            outline-none
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
            w-full py-3 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            shadow-lg transition
            disabled:opacity-60
            "
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
          <span className="text-xs text-gray-400 dark:text-slate-400">OR</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
        </div>

        {/* GOOGLE OAUTH */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="
          w-full py-3 rounded-xl
          flex items-center justify-center gap-3
          border border-gray-300 dark:border-slate-600
          bg-white dark:bg-slate-900
          text-black dark:text-white
          font-semibold
          hover:bg-gray-50 dark:hover:bg-slate-800
          transition
          "
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.91c1.7-1.57 2.69-3.88 2.69-6.64z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.91-2.27c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z" />
            <path fill="#FBBC05" d="M3.96 10.71A5.4 5.4 0 013.68 9c0-.6.1-1.18.28-1.71V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3-2.34z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3 2.34C4.67 5.16 6.66 3.58 9 3.58z" />
          </svg>
          Continue with Google
        </button>

        {/* TOGGLE */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-slate-300">
          {isLogin ? (
            <>
              New here?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
                onClick={() => { setIsLogin(false); setError(""); setMessage(""); }}
              >
                Create account
              </span>
            </>
          ) : (
            <>
              Already have account?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
                onClick={() => { setIsLogin(true); setError(""); setMessage(""); }}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;