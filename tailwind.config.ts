import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "15rem",
        "2xl": "22rem",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A0F1F",
          50: "#0F1629",
          100: "#1A2438",
          200: "#253247",
        },
        accent: {
          DEFAULT: "#3A64F4",
          50: "#4B75F5",
          100: "#5C86F6",
          200: "#6D97F7",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.1)",
          light: "rgba(255,255,255,0.15)",
          dark: "rgba(255,255,255,0.05)",
        },
        ios: {
          dark: "#000000",
          light: "#FFFFFF",
          gray: "#8E8E93",
          blue: "#007AFF",
          purple: "#AF52DE",
          pink: "#FF2D55",
          red: "#FF3B30",
          orange: "#FF9500",
          yellow: "#FFCC00",
          green: "#34C759",
          mint: "#00C7BE",
          teal: "#30B0C7",
          cyan: "#32D2FF",
          indigo: "#5856D6",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "ios-liquid": "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.05), rgba(0,0,0,0.3)), url('/img/noise.png')",
      },
      backdropBlur: {
        "3xl": "64px",
        "4xl": "80px",
      },
      borderRadius: {
        "ios": "20px",
        "ios-lg": "28px",
        "ios-xl": "36px",
      },
      boxShadow: {
        "ios": "0 4px 30px rgba(0, 0, 0, 0.1)",
        "ios-lg": "0 10px 60px rgba(0, 0, 0, 0.2)",
        "ios-xl": "0 20px 80px rgba(0, 0, 0, 0.3)",
        "ios-glow": "0 0 25px rgba(255,255,255,0.6)",
        "ios-glow-sm": "0 0 15px rgba(255,255,255,0.4)",
      },
      animation: {
        "ios-fade": "ios-fade 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        "ios-scale": "ios-scale 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        "ios-bounce": "ios-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "ios-fade": {
          "0%": { opacity: "0", filter: "blur(4px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
        "ios-scale": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "ios-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      spacing: {
        "ios": "20px",
        "ios-lg": "28px",
        "ios-xl": "36px",
      },
    },
  },
  plugins: [],
};
export default config;
