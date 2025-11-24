import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f3f7ff",
          100: "#dfe9ff",
          200: "#bed3ff",
          300: "#8fb3ff",
          400: "#5f8dff",
          500: "#3b5fff",
          600: "#2b45db",
          700: "#2135ac",
          800: "#1e2e86",
          900: "#1b2b6b"
        }
      }
    }
  },
  plugins: []
};

export default config;

