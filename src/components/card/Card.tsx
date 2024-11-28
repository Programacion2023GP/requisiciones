import React from "react";

interface CardProps {
  // Título como render prop
  title: () => JSX.Element;
  // Contenido como render prop
  content: () => JSX.Element;
  // Pie de la tarjeta (opcional)
  footer?: () => JSX.Element;
  // Forma de la tarjeta: cuadrada, redondeada u ovalada
  shape: "square" | "rounded" | "oval";
  // Imagen de la tarjeta (opcional)
  imageSrc?: string;
  h?: string;
  w?: string;
}

const CardComponent: React.FC<CardProps> = ({
  title,
  content,
  footer,
  shape,
  imageSrc,
  h,
  w,
}) => {
  // Clases dependiendo de la forma de la tarjeta
  const shapeClasses = {
    square: "rounded-none",
    rounded: "rounded-lg",
    oval: "rounded-full",
  };

  return (
    <div
      className={`
        mx-auto mb-2 bg-white shadow-lg 
        ${shapeClasses[shape]} 
        overflow-hidden
      `}
      style={{
        width: w ? `${w}` : 'auto', // Aplicamos el ancho dinámico
        height: h ? `${h}` : 'auto', // Aplicamos la altura dinámica
      }}
    >
      {imageSrc && (
        <img src={imageSrc} alt="card image" className="w-full h-48 object-cover" />
      )}
      
      {/* Se renderiza el título usando el render prop */}
      <div className="p-4 w-full text-center">
        {title()}
        
        {/* Se renderiza el contenido usando el render prop */}
        <div className="mt-2 text-gray-600">
          {content()}
        </div>
      </div>

      {/* Si hay pie, se renderiza también */}
      {footer && (
        <div className="border-t border-gray-200 p-4">
          {footer()}
        </div>
      )}
    </div>
  );
};

export default CardComponent;
