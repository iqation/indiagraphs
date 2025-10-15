/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    colors: {
      indigoDeep: "#3B5BDB",
      goldAccent: "#F4B400",
      cardWhite: "rgba(255, 255, 255, 0.7)",
      glowBlue: "#4F46E5",
    },
    boxShadow: {
      soft: "0 8px 30px rgba(31, 38, 135, 0.12)",
      glow: "0 0 20px rgba(59, 91, 219, 0.3)",
    },
    backdropBlur: {
      xs: "2px",
    },
  },
},
  plugins: [],
};