/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Manrope", "sans-serif"],
        heading: ["Sora", "sans-serif"],
        serif: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
