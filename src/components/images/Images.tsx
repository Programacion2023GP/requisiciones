import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { IoIosClose } from 'react-icons/io'; // React Icons para el ícono de cerrar

// Tipado para las props del componente
interface PhotoZoomProps {
  src: string;
  alt: string;
  description?: string;
  title?: string; // Nueva prop title
}

// Componente PhotoZoom
const PhotoZoom: React.FC<PhotoZoomProps> = ({ src, alt, description, title }) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  // Toggle para abrir y cerrar el zoom
  const toggleZoom = () => setIsZoomed((prev) => !prev);

  // Función para cerrar el zoom solo cuando se haga clic en el ícono de la X
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el clic se propague al contenedor de zoom
    setIsZoomed(false);
  };

  return (
    <div className="relative inline-block cursor-zoom-in">
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-lg transition-transform transform hover:scale-105"
        onClick={toggleZoom}
      />
      {description && <p className="mt-3 text-sm text-gray-600 text-center">{description}</p>}

      {isZoomed &&
        ReactDOM.createPortal(
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm"
            onClick={toggleZoom} // Cierra el zoom al hacer clic en el fondo
          >
            <div className="relative">
              {/* Ícono de cerrar mejorado */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg transition-all transform hover:scale-125 hover:bg-gray-300 focus:outline-none cursor-pointer"
              >
                <IoIosClose size={32} color="black" />
              </button>

              {/* Título sobre la imagen */}
              {title && (
                <h2 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl font-semibold z-10">
                  {title}
                </h2>
              )}

              {/* Contenedor de la imagen aumentada con animación y borde */}
              <div
                className="bg-contain bg-no-repeat bg-center border-4 border-white rounded-lg shadow-2xl transition-transform transform hover:scale-105"
                style={{
                  backgroundImage: `url(${src})`,
                  width: '90vw',
                  height: '90vh',
                  backgroundSize: 'contain',
                }}
              />
            </div>
          </div>,
          document.body // Renderiza el portal en el body
        )}
    </div>
  );
};

export default PhotoZoom;
