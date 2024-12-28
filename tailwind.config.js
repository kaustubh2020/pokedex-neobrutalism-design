/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neo-black": "#000000",
        "neo-white": "#FFFFFF",
        "neo-yellow": "#FFE600",
        "neo-pink": "#FF69B4",
        "neo-blue": "#4299E1",
      },
      boxShadow: {
        neo: "4px 4px 0 0 #000000",
        "neo-lg": "8px 8px 0 0 #000000",
      },
    },
  },
  plugins: [],
};
