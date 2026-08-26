/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        somy: {
          navy: "#0a0f1e",
          midnight: "#111827",
          slate: "#1e293b",
          surface: "#161d2e",
          "surface-light": "#1e2840",
          accent: "#6366f1",
          "accent-light": "#818cf8",
          "accent-dark": "#4f46e5",
          purple: "#8b5cf6",
          "purple-light": "#a78bfa",
          cyan: "#06b6d4",
          "cyan-light": "#22d3ee",
          gold: "#f59e0b",
          mint: "#10b981",
          coral: "#ef4444",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "grid-scroll": "gridScroll 20s linear infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-up-delay": "fadeInUp 0.6s ease-out 0.2s forwards",
        "fade-in-up-delay-2": "fadeInUp 0.6s ease-out 0.4s forwards",
        "shimmer": "shimmer 2s linear infinite",
        "rotate-slow": "rotateSlow 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        gridScroll: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      boxShadow: {
        "glow-accent": "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-accent-lg": "0 0 40px rgba(99, 102, 241, 0.4)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.3)",
      },
    },
  },
  plugins: [],
};
