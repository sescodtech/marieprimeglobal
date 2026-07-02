import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep green — primary brand, pulled from the MariePrime mark
        forest: {
          950: "#0B1E17",
          900: "#0F2A20",
          800: "#14352A",
          700: "#1B4332",
          600: "#235441",
          500: "#2D6A4F",
          400: "#3F8265",
        },
        // Champagne gold — premium accent
        gold: {
          200: "#F1E7D2",
          300: "#E3D2B0",
          400: "#D3BB86",
          500: "#C9A876",
          600: "#B08F5C",
        },
        // Warm neutrals
        cream: {
          50: "#FBF9F5",
          100: "#FAF7F2",
          200: "#F3EEE4",
        },
        ink: {
          900: "#16211C",
          700: "#33403A",
          500: "#5C6B63",
          300: "#8C978F",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "route-line":
          "repeating-linear-gradient(90deg, currentColor 0, currentColor 6px, transparent 6px, transparent 14px)",
      },
      borderRadius: {
        stub: "4px",
      },
      boxShadow: {
        stub: "0 12px 32px -12px rgba(15, 42, 32, 0.25)",
        card: "0 8px 24px -10px rgba(15, 42, 32, 0.18)",
      },
      keyframes: {
        stamp: {
          "0%": { transform: "scale(1.6) rotate(-8deg)", opacity: "0" },
          "60%": { transform: "scale(0.95) rotate(-8deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(-8deg)", opacity: "1" },
        },
      },
      animation: {
        stamp: "stamp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
