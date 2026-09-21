import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dae6ff",
          500: "#2f5ce0",
          600: "#2447b8",
          700: "#1c3890",
        },
      },
    },
  },
  plugins: [],
};

export default config;
