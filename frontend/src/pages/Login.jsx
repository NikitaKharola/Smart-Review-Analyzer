import { useState } from "react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden
      bg-gradient-to-r from-slate-100 via-blue-100 via-purple-100 to-indigo-100 animate-gradient">

      {/* 🌈 FLOATING BLOBS */}
      <div className="blob w-72 h-72 bg-blue-300 top-10 left-10"></div>

      <div className="blob w-80 h-80 bg-purple-300 bottom-10 right-10 animation-delay-2000"></div>

      <div className="blob w-64 h-64 bg-pink-300 top-1/2 left-1/3"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏨</div>

          <h1 className="text-3xl font-bold text-slate-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            {isLogin
              ? "Sign in to access your AI dashboard"
              : "Start analyzing guest reviews in seconds"}
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* TOGGLE */}
        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? (
            <>
              New here?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Create account
              </span>
            </>
          ) : (
            <>
              Already have account?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer"
                onClick={() => setIsLogin(true)}
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