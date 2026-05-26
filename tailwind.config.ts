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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1a2754",
          light: "#2b3b75",
          dark: "#0f1733",
        },
        accent: {
          DEFAULT: "#ff7a30",
          light: "#ff955c",
          dark: "#e05c14",
        },
        customBg: "#f8f9fc",
      },
    },
  },
  plugins: [],
};
export default config;
