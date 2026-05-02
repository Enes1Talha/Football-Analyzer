import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#39FF14",
          cyan: "#00FFFF",
          yellow: "#FFE600",
          red: "#FF0044",
        },
        pitch: {
          black: "#050505",
          dark: "#0D0D0D",
          card: "#111111",
          border: "#1E1E1E",
          muted: "#2A2A2A",
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "film-grain": "filmGrain 0.15s steps(1) infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        filmGrain: {
          "0%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-1%, -1%)" },
          "20%": { transform: "translate(1%, 1%)" },
          "30%": { transform: "translate(-1%, 1%)" },
          "40%": { transform: "translate(1%, -1%)" },
          "50%": { transform: "translate(0, 0)" },
          "60%": { transform: "translate(-1%, 0)" },
          "70%": { transform: "translate(1%, 0)" },
          "80%": { transform: "translate(0, 1%)" },
          "90%": { transform: "translate(0, -1%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
