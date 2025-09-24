/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   safelist: [
      "bg-red-500", // Asegúrate de incluir clases dinámicas
   ],
   theme: {
      extend: {
         colors: {
            presidencia: "#651D32", //"#4B0000",
            "presidencia-claro": "#9B2242",
            "gris-cool": "#474C55",
            gris: "#727372",
            "gris-claro": "#B8B6AF",
            negro: "#130D0E",
         },
      },
   },
   plugins: [],
};
