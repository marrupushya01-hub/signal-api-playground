/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        signal: {
          bg: "#0a0e1a",
          panel: "#0f1524",
          border: "#1e293b",
          muted: "#64748b",
          accent: "#00d4ff",
        },
        light: {
          bg: "#f4f6fb",
          panel: "#ffffff",
          border: "#e2e8f0",
          muted: "#94a3b8",
        },
      },
      keyframes: {
        scan: {
          "0%": { left: "-33%" },
          "100%": { left: "100%" },
        },
      },
      animation: {
        scan: "scan 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
