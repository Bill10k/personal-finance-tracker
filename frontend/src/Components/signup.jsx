import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import manImage from '../assets/man.jpg';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from "../services/api";

const Signup = ({ onSignupSuccess }) => {
  // Controlled form state
  const [form, setForm] = useState({
    username: '',        // <-- Added username
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Animation for heading
  const letterAnimation = {
    hidden: { y: -50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.05, type: 'spring', stiffness: 100 },
    }),
  };
  const text = 'Create Account'.split('');

  // Handle field changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    // Passwords match validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // Send all required fields to FastAPI
      const payload = {
        username: form.username,
        full_name: form.full_name,
        email: form.email,
        password: form.password
      };
      const res = await registerUser(payload);

      // If backend returns access_token immediately after register, auto-login:
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }
      if (onSignupSuccess) onSignupSuccess();
      navigate('/'); // Go to dashboard
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Signup failed. Email or username may already be registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left: Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 max-w-xl mx-auto">
        {/* Animated Heading */}
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
        {/* Signup Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            minLength={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            name="full_name"
            type="text"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
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
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-3 rounded-md hover:bg-violet-700 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          {error && (
            <div className="text-red-600 text-sm mt-2">{error}</div>
          )}
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
