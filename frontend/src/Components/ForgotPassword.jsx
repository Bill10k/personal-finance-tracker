import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ Import Framer Motion
import manImage from '../assets/man.jpg'; // Same image as login for consistency

const ForgotPassword = () => {
  // ✅ Animation Variants for the heading
  const letterAnimation = {
    hidden: { y: -50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

  const text = 'Forgot Password'.split('');

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left: Forgot Password Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 max-w-xl mx-auto">
        
        {/* ✅ Animated Heading */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800 flex">
          {text.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={letterAnimation}
              className="inline-block"
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </h1>

        <p className="text-gray-500 mb-6 text-sm">
          Enter your email address and we'll send you a reset link.
        </p>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-3 rounded-md hover:bg-violet-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password?{' '}
          <Link to="/login" className="text-violet-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img src={manImage} alt="Finance Illustration" className="w-4/5 h-auto object-contain" />
      </div>
    </div>
  );
};

export default ForgotPassword;
