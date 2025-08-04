import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import manImage from '../assets/man.jpg';
import { Eye, EyeOff } from 'lucide-react';

const Signup = ({ onSignupSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

  const text = 'Create Account'.split('');

  const handleSignup = (e) => {
    e.preventDefault();
    // ✅ Simulate signup success (backend later)
    onSignupSuccess();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left: Signup Form */}
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
          Fill in your details to create your account.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-3 rounded-md hover:bg-violet-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>

      {/* Right: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img
          src={manImage}
          alt="Finance Illustration"
          className="w-4/5 h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Signup;
