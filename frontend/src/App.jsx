import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen flex flex-col bg-slate-50">

        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating AI Assistant */}
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