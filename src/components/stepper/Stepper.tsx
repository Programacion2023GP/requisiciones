import { ReactNode, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "../typografy/Typografy";

interface PageTransitionProps {
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

export default function PageTransition({
  children,
  variant = "fadeInOut", // Por defecto el efecto es fadeInOut
  renderButtons,
}: PageTransitionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const childRefs = useRef<(HTMLDivElement | null)[]>([]); // Para almacenar referencias de cada child

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

    // Se observa cada child referenciado
    childRefs.current.forEach((child) => {
      if (child) resizeObserver.observe(child);
    });

    // Cleanup observer
    return () => {
      resizeObserver.disconnect();
    };
  }, [currentPage]);

  const variants = {
    slide: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    flip: {
      initial: { rotateY: 90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: -90, opacity: 0 },
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    zoom: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    push: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    curtain: {
      initial: { width: "0%" },
      animate: { width: "100%" },
      exit: { width: "0%" },
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    bounce: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
      transition: { duration: 0.8, bounce: 0.4 },
    },
    rotate: {
      initial: { rotate: 90, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      exit: { rotate: -90, opacity: 0 },
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    scale: {
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.5, opacity: 0 },
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    fadeInOut: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 1 },
    },
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
              {/* Envuelve el child en un div para calcular su altura */}
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
                <div className=" flex justify-end mr-2">
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
