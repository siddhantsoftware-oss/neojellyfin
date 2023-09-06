/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        text: "#ffffff",
        primary: "#0584ff",
        accent: "#1c1c1e",
        secondary: "#9898a0",
      },
    },
  },
  plugins: [],
};
