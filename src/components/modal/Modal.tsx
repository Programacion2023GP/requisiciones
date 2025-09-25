import React, { memo, useEffect, ReactNode, useState } from "react";
import { InterfaceModal } from "./InterfaceModal"; // Asegúrate de que la ruta sea correcta
import ReactDOM from "react-dom";
import { FaExpandArrowsAlt } from "react-icons/fa";
import Tooltip from "../toltip/Toltip";
import { LiaWindowMaximize, LiaWindowMinimize } from "react-icons/lia";
import { TbWindowMaximize, TbWindowMinimize } from "react-icons/tb";

interface ModalProps extends InterfaceModal {
   children: ReactNode;
   position?: "top" | "left" | "bottom" | "right" | "center";
   fullScreen?: boolean;
}

export const ModalComponent: React.FC<ModalProps> = memo(
   ({
      open,
      setOpen,
      title,
      children,
      position = "center",
      fullScreen = false,
   }) => {
      useEffect(() => {
         // Puedes manejar aquí otros efectos si es necesario
      }, [title, children, fullScreen]);
      const [fullScreenDialog, setFullScreenDialog] = useState(fullScreen);

      if (!open) return null; // No renderizar nada si el modal no está abierto

      return ReactDOM.createPortal(
         <div
            className={`fixed inset-0 flex items-center justify-center z-[300] bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-out w-full h-full   ${
               open
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
            } ${position === "center" ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" : ""} ${
               position === "top" ? "top-0 left-0" : ""
            } ${position === "left" ? "top-0 left-0" : ""} ${
               position === "right" ? "top-0 right-0" : ""
            } ${position === "bottom" ? "bottom-0 left-0" : ""}`}
            style={{ transition: "opacity 0.3s" }}>
            <div
               className={`relative w-full  sm:w-4/5 md:w-3/4 lg:w-3/4 xl:w-full max-w-5xl mx-auto rounded-2xl shadow-xl bg-white transform transition-transform duration-300 ease-out ${open ? "scale-105" : "scale-95"}`}>
               <div className="flex items-center justify-between p-5 text-white shadow-lg bg-gradient-to-r bg-presidencia rounded-t-2xl">
                  <p className="text-xl font-semibold sm:text-2xl">{title}</p>
                  <div className="flex items-center justify-center">
                     {/* <Tooltip
                        content={
                           fullScreenDialog
                              ? `Minimizar ventana`
                              : `Maximizar ventana`
                        }>
                        <button
                           color="inherit"
                           onClick={() =>
                              setFullScreenDialog(!fullScreenDialog)
                           }
                           className="mt-1 mr-4 rounded-full btn btn-ghost btn-sm hover:bg-slate-500/50">
                           {fullScreenDialog ? (
                              <TbWindowMinimize size={20} />
                           ) : (
                              <TbWindowMaximize size={20} />
                           )}
                        </button>
                     </Tooltip> */}
                     <svg
                        onClick={() => setOpen(false)}
                        className="w-6 h-6 mr-2 transition duration-200 cursor-pointer hover:text-gray-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth="2"
                           d="M6 18L18 6M6 6l12 12"></path>
                     </svg>
                     {/* <FaExpandArrowsAlt
                onClick={() => setOpen(true)}
                className="w-6 h-6 transition duration-200 cursor-pointer hover:text-gray-100"
              /> */}
                  </div>
               </div>

               <div className="px-6 py-4">
                  <div
                     className="overflow-y-auto overflow-x-hidden max-h-[80vh] custom-scrollbar"
                     style={{
                        maxHeight: "calc(80vh - 60px)",
                     }}>
                     <div
                        className={`text-gray-800  h-[40rem]`}>
                        {children}
                     </div>
                  </div>
               </div>
            </div>
         </div>,
         document.body, // Renderiza el modal en el DOM de la página principal
      );
   },
);

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
