/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-red-500', // Asegúrate de incluir clases dinámicas
  ],
  theme: {
    extend: {
      colors:{
        "presidencia":"#4B0000",
      }
    },
  },
  plugins: [],
  
};
