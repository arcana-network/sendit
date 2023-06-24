/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  theme: {
    fontFamily: {
      onest: ["Onest", "sans-serif"],
    },
    extend: {
      colors: {
        "eerie-black": "#1F1F1F",
        "philippine-gray": "#8D8D8D",
        "dark-liver": "#4D4D4D",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: false,
    base: false,
    utils: false,
  },
};
