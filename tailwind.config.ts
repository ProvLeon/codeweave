import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        success: "#27AE60",
        active: "#1ABC9C",
        light: {
          heading: "#2C3E50",
          text: "#34495E",
          background: "#ECF0F1",
          border: "#BDC3C7",
        },
        dark: {
          heading: "#ECF0F1",
          text: "#BDC3C7",
          background: "#2C3E50",
          border: "#34495E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
