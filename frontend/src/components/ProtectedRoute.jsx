import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../api";

// Wrap any route that should require login:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "authed" | "guest"

  useEffect(() => {
    isLoggedIn().then((ok) => setStatus(ok ? "authed" : "guest"));
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 dark:text-slate-300">
        Checking your session...
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
