import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Google OAuth is a browser redirect, not a fetch() call, so the backend
 * hands the JWT back via a query param on this page instead of a JSON
 * response. This page's only job: grab that token, store it the same way
 * password login does, tell the rest of the app auth changed (Navbar
 * listens for this), then move on to the dashboard.
 *
 * Route this at /oauth-callback in your router, matching FRONTEND_URL
 * redirects configured on the backend.
 */
function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Sign-in didn't complete. Please try again.");
      return;
    }

    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("auth-changed"));

    navigate("/dashboard", { replace: true });
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/login")}
          className="text-blue-500 hover:text-blue-600"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-slate-500">Signing you in…</p>
    </div>
  );
}

export default OAuthCallback;