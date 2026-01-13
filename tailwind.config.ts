import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tattoo: {
          primary: "#be9d88", // Main taupe/beige - rgb(190, 157, 136)
          secondary: "#ddccbd", // Light beige - rgb(221, 204, 189)
          light: "#f0f0f0", // Light grey background - rgb(240, 240, 240)
          grey: "#cdcdcd", // Medium grey - rgb(205, 205, 205)
          white: "#FFFFFF",
          black: "#0A0A0A",
          greyScale: {
            50: "#f0f0f0",
            100: "#e5e5e5",
            200: "#cdcdcd",
            300: "#b5b5b5",
            400: "#9e9e9e",
            500: "#868686",
            600: "#6e6e6e",
            700: "#565656",
            800: "#3e3e3e",
            900: "#262626",
          },
        },
        // Keep barber as alias for backward compatibility during transition
        barber: {
          red: "#be9d88",
          darkRed: "#ddccbd",
          white: "#FFFFFF",
          cream: "#f0f0f0",
          gold: "#be9d88",
          black: "#0A0A0A",
          grey: {
            50: "#f0f0f0",
            100: "#e5e5e5",
            200: "#cdcdcd",
            300: "#b5b5b5",
            400: "#9e9e9e",
            500: "#868686",
            600: "#6e6e6e",
            700: "#565656",
            800: "#3e3e3e",
            900: "#262626",
          },
        },
      },
      backgroundImage: {
        "barber-stripes":
          "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(190, 157, 136, 0.03) 10px, rgba(190, 157, 136, 0.03) 20px)",
        "tattoo-subtle":
          "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(190, 157, 136, 0.03) 10px, rgba(190, 157, 136, 0.03) 20px)",
      },
      animation: {
        "float-slow": "float 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;
