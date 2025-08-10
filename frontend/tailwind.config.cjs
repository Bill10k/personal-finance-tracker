// tailwind.config.js

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'finset-primary': '#7c3aed',
        'finset-accent': '#22c55e',
        'finset-sidebar': '#22223b',
        'finset-bg': '#f6f7fb',
        'finset-card': '#fff',
        'finset-violet-50': '#f5f3ff',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-out': 'fadeOut 2s ease-out forwards',
      },
      keyframes: {
        fadeOut: {
          '0%, 70%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
