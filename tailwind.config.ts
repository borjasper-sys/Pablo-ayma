import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        graphite: "#242424",
        ash: "#737373",
        court: "#f7f7f4",
        line: "#e7e5df"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
