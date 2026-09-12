/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090A0F",
        surface: "#11141E",
        "surface-raised": "#171B29",
        "surface-border": "#1E2436",
        accent: {
          cyan: "#00F2FE",
          blue: "#4FACFE",
          emerald: "#10B981",
          purple: "#8B5CF6",
          amber: "#F59E0B",
          rose: "#F43F5E",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-fade": "glowFade 4s ease-in-out infinite alternate",
      },
      keyframes: {
        glowFade: {
          "0%": { opacity: "0.4", filter: "blur(20px)" },
          "100%": { opacity: "0.8", filter: "blur(28px)" },
        }
      }
    },
  },
  plugins: [],
}
