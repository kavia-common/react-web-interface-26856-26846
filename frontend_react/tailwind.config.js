/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#F97316", // Electric Orange
        secondary: "#10B981",
        background: "#000000",
        surface: "#1F2937",
        text: "#FFFFFF",
        muted: "rgba(255,255,255,0.7)",
        border: "rgba(255,255,255,0.08)",
      },
      boxShadow: {
        card: "0 10px 25px -10px rgba(249,115,22,0.25)",
        soft: "0 8px 20px rgba(0,0,0,0.35)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
