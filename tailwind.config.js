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
        "dark-charcoal": "#313131",
        "vivid-vermilion": "#E76124",
        jet: "#363636",
        "chinese-black": "#171717",
        "cornflower-blue": "#659CFF",
        "feep-koamaru": "#293C5F",
      },
      padding: {
        7.5: "30px",
        2.5: "10px",
      },
      fontSize: {
        "3.5xl": "32px",
        "4.5xl": "48px",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
};
