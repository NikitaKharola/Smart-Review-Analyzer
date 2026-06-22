import { useState } from "react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

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

        {/* FORM */}
        <form className="space-y-4">
          {!isLogin && (
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="Full Name"
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
            className="
            w-full py-3 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            shadow-lg transition
            "
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* TOGGLE */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-slate-300">
          {isLogin ? (
            <>
              New here?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Create account
              </span>
            </>
          ) : (
            <>
              Already have account?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
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