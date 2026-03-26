/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af', 
        secondary: '#64748b',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
        dark: '#0f172a',
      }
    },
  },
  plugins: [],
}
