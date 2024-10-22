import React, { useEffect } from "react";
import { InterfaceModal } from "./InterfaceModal"; // Asegúrate de que la ruta sea correcta

export const ModalComponent: React.FC<InterfaceModal> = ({
  open,
  setOpen,
  title,
  children,
  messageButton,
  handleButton,
}) => {
  useEffect(() => {
    setOpen(open);
  }, [open]);
  useEffect(() => {
  }, [title, children, handleButton]);

  return (
    <>
{open &&(      <div className="fixed inset-0 flex items-center justify-center z-30 bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-out">
        <div className="relative w-11/12 sm:w-5/6 lg:w-1/2 max-w-4xl mx-auto rounded-xl shadow-2xl bg-white transform transition-transform duration-300 ease-out scale-100">
          <div className="flex justify-between items-center p-6 bg-white border-b border-gray-100 rounded-t-xl">
            <p className="text-lg font-semibold text-gray-800">{title}</p>
            <svg
              onClick={() => setOpen(false)}
              className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-800 transition duration-200"
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

          <div className="px-6 py-2 bg-white">{children}</div>
        </div>
      </div>)}
    </>
  );
};
