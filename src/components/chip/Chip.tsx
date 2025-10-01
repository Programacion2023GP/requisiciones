import React, { useEffect } from "react";
import ReactDOM from "react-dom";

type ChipType = {
   message: string;
   className: string;
   open: boolean;
   setOpen(): void;
   onhandleClick?: () => void;
   children: (props: Record<string, any>) => React.ReactNode;
};

const Chip: React.FC<ChipType> = ({
   message,
   className,
   children,
   open,
   setOpen,
   onhandleClick,
}) => {
   useEffect(() => {}, [open]);
   // Creamos un nodo ref para referenciar la posición del padre
   const parentRef = React.useRef<HTMLDivElement | null>(null);

   const onHandleClick = () => {
      console.log("clickkck");
   };

   // Renderizamos el contenido del portal solo si `open` es true
   const renderPortal = () => {
      if (!open || !parentRef.current) return null;

      const parentRect = parentRef.current.getBoundingClientRect();

      return ReactDOM.createPortal(
         <div
            style={{
               position: "absolute",
               top: `${parentRect.bottom}px`,
               left: `${parentRect.left}px`,
               zIndex: 1000,
            }}
            className="bg-white border rounded-lg shadow-lg">
            {children({})}
         </div>,
         document.body,
      );
   };

   return (
      <div
         ref={parentRef}
         onClick={() => {
            open == false && setOpen();
            if (onhandleClick) onHandleClick();
         }}
         className={`mx-2 center relative inline-block select-none whitespace-nowrap rounded-lg py-2 px-2 align-baseline font-sans text-xs font-bold uppercase leading-none text-white cursor-pointer ${className}`}>
         <div>{message}</div>
         <div className="absolute">{renderPortal()}</div>
      </div>
   );
};

export default Chip;
