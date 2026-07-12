import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import ComponentDemo from "./pages/ComponentDemo";
import OAuthCallback from "./pages/OAuthCallback";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/components" element={<ComponentDemo />} />
          </Routes>
        </main>

        <Footer />

        <button
          className="
          fixed
          bottom-6
          right-6
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          w-16
          h-16
          rounded-full
          shadow-2xl
          text-2xl
          hover:scale-110
          transition-all
          duration-300
          z-50
          "
          title="AI Assistant"
        >
          🤖
        </button>

      </div>
    </BrowserRouter>
  );
}

export default App;