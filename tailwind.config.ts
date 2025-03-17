
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        notable: ['Notable', 'sans-serif'],
        syncopate: ['Syncopate', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
      colors: {
        konform: {
          bg: "#0D1117",
          surface: "#1E2329",
          accent: "#0EA5E9",
          border: "#2D3748",
          red: "#FF0000",
          neon: {
            blue: "#00F0FF",
            orange: "#FF7B00",
            "blue-glow": "#00F0FF20",
            "orange-glow": "#FF7B0020",
          },
          button: {
            primary: {
              default: "#0EA5E9",
              hover: "#00F0FF",
              active: "#0284C7",
              disabled: "#1E2329"
            },
            secondary: {
              default: "#2D3748",
              hover: "#4A5568",
              active: "#1A202C",
              disabled: "#1E2329"
            }
          }
        },
        dreamaker: {
          bg: "#0D0D0D",
          purple: "#9747FF",
          "purple-light": "#B47EFF",
          gray: "#1E1E1E",
          "purple-dark": "#3e3055",
          button: {
            primary: {
              default: "#9747FF",
              hover: "#B47EFF",
              active: "#7B3FD5",
              disabled: "#3e3055"
            },
            secondary: {
              default: "#1E1E1E",
              hover: "#2D2D2D",
              active: "#0D0D0D",
              disabled: "#1A1A1A"
            }
          }
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "gradient-shift": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px #00F0FF40" },
          "50%": { boxShadow: "0 0 20px #00F0FF80" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
