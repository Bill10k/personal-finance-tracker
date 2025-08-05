import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ Import Framer Motion
import manImage from '../assets/man.jpg';


const Login = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    onLoginSuccess();
    navigate('/');
  };

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

  const text = 'Welcome'.split('');

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 max-w-xl mx-auto">
        
        {/* ✅ Animated Heading */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex">
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
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>

          <Link
            to="/forgot-password"
            className="text-right text-sm text-violet-600 hover:underline cursor-pointer block"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-3 rounded-md hover:bg-violet-700 transition"
          >
            Log In
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or continue with</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition">
            <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" />
          </button>
          <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition">
            <img src="https://img.icons8.com/ios-filled/24/000000/mac-os.png" alt="Apple" />
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
  Don't have an account?{' '}
  <Link to="/signup" className="text-violet-600 hover:underline">
    Sign up
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

export default Login;
