import React, { ReactNode, useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "../typografy/Typografy";

interface PageTransitionProps {
  restart?: boolean;
  setRestartTransition?: () => void;
  children: ReactNode[]; // Array de componentes hijos
  variant?:
    | "slide"
    | "flip"
    | "zoom"
    | "push"
    | "curtain"
    | "fade"
    | "bounce"
    | "rotate"
    | "scale"
    | "fadeInOut";
  renderButtons?: (
    handlePrevPage: () => void,
    handleNextPage: () => void,
    currentPage: number
  ) => ReactNode; // Render props para botones
}

export interface PageTransitionRef {
  reset: () => void;
}

const PageTransition = forwardRef<PageTransitionRef, PageTransitionProps>(
  (
    {
      children,
      variant = "fadeInOut", // Por defecto el efecto es fadeInOut
      renderButtons,
    }: PageTransitionProps,
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const childRefs = useRef<(HTMLDivElement | null)[]>([]); // Para almacenar referencias de cada child

    // Exponer el método reset usando useImperativeHandle
    useImperativeHandle(ref, () => ({
      reset() {
        setCurrentPage(0);
      },
    }));

    const handleNextPage = () => {
      setCurrentPage((prev) => (prev + 1) % children.length);
    };

    const handlePrevPage = () => {
      setCurrentPage((prev) => (prev - 1 + children.length) % children.length);
    };

    // Maneja el cambio de tamaño con ResizeObserver
    useEffect(() => {
      const resizeObserver = new ResizeObserver(() => {
        if (childRefs.current[currentPage]) {
          const childHeight = childRefs.current[currentPage]?.offsetHeight || 0;
          setContainerHeight(Math.min(childHeight, 800)); // Limita la altura a 800px
        }
      });

      childRefs.current.forEach((child) => {
        if (child) resizeObserver.observe(child);
      });

      return () => {
        resizeObserver.disconnect();
      };
    }, [currentPage]);

    const variants = {
      fadeInOut: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 1 },
      },
      // Otros efectos se mantienen igual...
    };

    const selectedVariant = variants[variant] || variants.fadeInOut;

    return (
      <div className="relative" style={{ height: `${containerHeight + 50}px` }}>
        <AnimatePresence initial={false}>
          {children.map((child, index) =>
            index === currentPage ? (
              <motion.div
                key={index}
                initial={selectedVariant.initial}
                animate={selectedVariant.animate}
                exit={selectedVariant.exit}
                transition={selectedVariant.transition}
                className="absolute inset-0"
              >
                <div ref={(el) => (childRefs.current[index] = el)}>
                  {child}
                  <Typography
                    className="w-full text-center mt-4 text-pretty"
                    color="gray"
                    size="sm"
                    weight="bold"
                  >
                    Paso {currentPage + 1} de {children.length}
                  </Typography>
                  <div className="flex justify-end mr-2">
                    {renderButtons ? (
                      renderButtons(handlePrevPage, handleNextPage, currentPage + 1)
                    ) : (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={handlePrevPage}
                          className="bg-gray-800 text-white px-4 py-2 rounded-md"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={handleNextPage}
                          className="bg-gray-800 text-white px-4 py-2 rounded-md"
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default PageTransition;
