/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  theme: {
    fontFamily: {
      onest: ["Onest", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
};
