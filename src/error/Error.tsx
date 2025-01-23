import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-700">
      <div className="text-center text-white max-w-lg mx-auto">
        {/* Título 404 con animación */}
        <h1 className="text-9xl font-extrabold tracking-widest animate-bounce mb-6">
          404
        </h1>

        {/* Subtítulo */}
        <h2 className="text-3xl font-semibold mb-4">Página no encontrada</h2>

        {/* Descripción */}
        <p className="text-lg mb-6">
          Lo sentimos, no pudimos encontrar la página que buscas. ¿Quizás intentaste algo que no existe?
        </p>

        {/* Imagen opcional */}
        <div className="mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1126/1126982.png" // Puedes usar una ilustración personalizada
            alt="404 Illustration"
            className="w-48 mx-auto"
          />
        </div>

        {/* Botón */}
        <a
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white text-xl font-medium rounded-lg hover:scale-105 transform transition-all duration-300"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
