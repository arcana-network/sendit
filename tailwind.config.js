/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
