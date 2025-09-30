import React, { memo, ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import { TbWindowMaximize, TbWindowMinimize } from "react-icons/tb";

interface ModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  position?: "top" | "left" | "bottom" | "right" | "center";
  fullScreen?: boolean;
}

export const ModalComponent: React.FC<ModalProps> = memo(
  ({ open, setOpen, title, children, position = "center", fullScreen = true }) => {
    const [fullScreenDialog, setFullScreenDialog] = useState(fullScreen);

    if (!open) return null;

    return ReactDOM.createPortal(
      <div
        className={`fixed inset-0 flex items-center justify-center z-[300] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out`}
      >
        <div
          className={`relative bg-white rounded-2xl shadow-xl transform transition-all duration-300 ease-out ${
            fullScreenDialog
              ? "w-full h-full m-0 rounded-none"
              : "w-full sm:w-4/5 md:w-3/4 lg:w-3/4 xl:w-full max-w-5xl mx-auto my-10"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 text-white bg-gradient-to-r bg-presidencia rounded-t-2xl">
            <p className="text-xl font-semibold sm:text-2xl">{title}</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFullScreenDialog(!fullScreenDialog)}
                className="p-1 rounded hover:bg-white/20"
                title={fullScreenDialog ? "Minimizar ventana" : "Maximizar ventana"}
              >
                {fullScreenDialog ? <TbWindowMinimize size={20} /> : <TbWindowMaximize size={20} />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-white/20"
                title="Cerrar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className={`overflow-y-auto p-6 ${
              fullScreenDialog ? "h-full" : "max-h-[80vh]"
            } custom-scrollbar`}
          >
            {children}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

export default ModalComponent;
