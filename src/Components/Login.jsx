import React, { useState } from "react";

function LoginForm({ onForgot }) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
      {/* Header Titles */}
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-semibold text-center">
          {isLoginMode ? "Welcome" : "Sign Up"}
        </h2>
      </div>

      {/* Tab Controls */}
      <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden bg-white">
        {/* Login Tab */}
        <button
          className={`w-1/2 text-lg font-medium z-10 transition-all duration-300 ${
            isLoginMode ? "bg-black text-white" : "bg-transparent text-black"
          }`}
          onClick={() => setIsLoginMode(true)}
        >
          Login
        </button>

        {/* Signup Tab */}
        <button
          className={`w-1/2 text-lg font-medium z-10 transition-all duration-300 ${
            !isLoginMode ? "bg-black text-white" : "bg-transparent text-black"
          }`}
          onClick={() => setIsLoginMode(false)}
        >
          Signup
        </button>
      </div>

      {/* Form Section */}
      <form className="space-y-4">
        {/* Signup-only Field */}
        {!isLoginMode && (
          <input
            type="text"
            placeholder="Name"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
          />
        )}

        {/* Shared Fields */}
        <input
          type="email"
          placeholder="Email Address"
          required
          className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
        />

        {/* Signup-only Field */}
        {!isLoginMode && (
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
          />
        )}

        {/* Forgot Password (Only for Login) */}
        {isLoginMode && (
          <div className="text-right">
            <button
              type="button"
              onClick={onForgot}
              className="text-cyan-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button className="w-full p-3 bg-black text-white rounded-full text-lg font-medium hover:opacity-90 transition">
          {isLoginMode ? "Login" : "Signup"}
        </button>

        {/* Switch Mode Link */}
        <p className="text-center text-gray-600">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsLoginMode(!isLoginMode);
            }}
            className="text-cyan-600 hover:underline"
          >
            {isLoginMode ? "Signup now" : "Login"}
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
