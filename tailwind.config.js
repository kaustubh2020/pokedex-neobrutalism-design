/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neo-black": "#16161A",
        "neo-white": "#FFFFFF",
        "neo-cream": "#FFF8E7",
        "neo-yellow": "#FFDE00",
        "neo-pink": "#FF6EB4",
        "neo-blue": "#3B6EF0",
        "neo-red": "#EE1515",
        "neo-green": "#3DDC84",
      },
      fontFamily: {
        display: ['"Bungee"', "cursive"],
        body: ['"Archivo"', "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
      },
      boxShadow: {
        "neo-sm": "2px 2px 0 0 #16161A",
        neo: "4px 4px 0 0 #16161A",
        "neo-lg": "8px 8px 0 0 #16161A",
        "neo-xl": "12px 12px 0 0 #16161A",
        "neo-white": "4px 4px 0 0 #FFFFFF",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 6s linear infinite",
        wiggle: "wiggle 0.4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
