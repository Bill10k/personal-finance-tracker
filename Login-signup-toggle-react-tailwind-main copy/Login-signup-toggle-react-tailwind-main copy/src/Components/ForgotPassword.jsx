import React from 'react';

function ForgotPassword({ onBack }) {
  return (
    <div
      className="grid w-full h-screen place-items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/background.png')" }}
    >
      <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold">Forgot Password</h2>
          <p className="text-gray-700 mt-2 text-sm">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-black placeholder-gray-400"
          />

          <button className="w-full p-3 bg-black text-white rounded-full text-lg font-medium hover:opacity-90 transition">
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={onBack}
            className="text-black hover:underline text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
