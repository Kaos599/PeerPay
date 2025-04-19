/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Scan the new index.html at the root
    "./src/**/*.{js,ts,jsx,tsx}" // Scan React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 