/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#041D62",        // KifTari2 navy (mobile)
      primaryDark: "#03154A",
      primaryLight: "#E6EBF5",
      surface: "#F8FAFC",
    },
  },
},

  plugins: [],
};
