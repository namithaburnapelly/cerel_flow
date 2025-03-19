/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        "dark-spring-green": "#2c6e49ff",
        "sea-green": "#4c956cff",
        "focus-ring-green": "#73B58E",
        "light-yellow": "#fefee3ff",
        melon: "#ffc9b9ff",
        "persian-orange": "#d68c45ff",
        "fire-engine-red": "#d90429ff",
        "muted-foreground": "hsl(0 0% 45.1%)",
        "border-color": "#B9BBC6",
      },
    },
  },
  plugins: [],
};
