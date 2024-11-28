import React, { memo, useEffect, ReactNode } from "react";
import { InterfaceModal } from "./InterfaceModal"; // Asegúrate de que la ruta sea correcta

interface ModalProps extends InterfaceModal {
  children: ReactNode;
}

export const ModalComponent: React.FC<ModalProps> = memo(({
  open,
  setOpen,
  title,
  children,
}) => {
  // useEffect(() => {
  //   // No es necesario hacer nada aquí por ahora
  // }, [open]);

  useEffect(() => {
    // Puedes manejar aquí otros efectos si es necesario
  }, [title, children]);

  return (
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
          <div className="text-gray-800">{children}</div>
        </div>
      </div>
    </div>
  );
});
