import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ✅ correct plugin
import tailwindcss from '@tailwindcss/vite' // ✅ optional but valid if installed

export default defineConfig({
  plugins: [
    react(),         // ✅ properly imported and used
    tailwindcss(),   // ✅ if you're using Tailwind via its Vite plugin
  ],
})
