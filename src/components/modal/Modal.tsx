import React, { memo, useEffect, ReactNode } from "react";
import { InterfaceModal } from "./InterfaceModal"; // Asegúrate de que la ruta sea correcta
import ReactDOM from 'react-dom';

interface ModalProps extends InterfaceModal {
  children: ReactNode;
}

export const ModalComponent: React.FC<ModalProps> = memo(({
  open,
  setOpen,
  title,
  children,
}) => {
  useEffect(() => {
    // Puedes manejar aquí otros efectos si es necesario
  }, [title, children]);

  if (!open) return null; // No renderizar nada si el modal no está abierto

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 flex items-center justify-center z-[300] bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{ transition: 'opacity 0.3s' }}
    >
      <div
        className={`relative w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-full max-w-5xl mx-auto rounded-2xl shadow-xl bg-white transform transition-transform duration-300 ease-out ${open ? 'scale-105' : 'scale-95'}`}
      >
        <div className="flex justify-between items-center p-5 bg-gradient-to-r bg-presidencia rounded-t-2xl text-white shadow-lg">
          <p className="text-xl sm:text-2xl font-semibold">{title}</p>
          <svg
            onClick={() => setOpen(false)}
            className="w-6 h-6 cursor-pointer hover:text-gray-100 transition duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>

        <div className="px-6 py-4">
          <div
            className="overflow-y-auto overflow-x-hidden max-h-[80vh] custom-scrollbar"
            style={{
              maxHeight: "calc(80vh - 60px)", // Ajusta la altura máxima del contenido del modal (80% de la pantalla)
            }}
          >
            <div className="text-gray-800 ">{children}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body // Renderiza el modal en el DOM de la página principal
  );
});

// Agregar CSS para estilizar el scroll
const style = document.createElement("style");
style.innerHTML = `
  /* Estilizar el contenedor del scroll */
  .custom-scrollbar::-webkit-scrollbar {
    width: 10px; /* Ancho del scrollbar */
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1); /* Fondo del track */
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #0072ff, #00c6ff); /* Fondo del thumb con gradiente */
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.1); /* Borde alrededor del thumb */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra para un efecto flotante */
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #00c6ff, #0072ff); /* Efecto hover */
  }

  /* Estilo cuando el scroll está en uso */
  .custom-scrollbar::-webkit-scrollbar:vertical {
    transition: all 0.3s ease; /* Transición suave */
  }
`;

document.head.appendChild(style);

export default ModalComponent;
