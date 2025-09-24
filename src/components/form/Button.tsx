import React, { memo, forwardRef } from "react";

type ButtonProps = {
  id?:string
  color:
    | "blue"
    | "green"
    | "red"
    | "yellow"
    | "purple"
    | "pink"
    | "indigo"
    | "teal" 
    |'orange'
    | "presidencia";
  variant: "solid" | "outline" | "ghost" | "link" | "text" | "light";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  type?: "button" | "submit" | "reset"; // Sólo valores válidos para el atributo type de un botón
  onClick?: () => void; // Callback opcional
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color, variant, size = "medium", children, onClick, type = "button",id }, ref) => {
    // Clases de color según el color seleccionado
    const colorClasses = {
      orange: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500",
      blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      green: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      red: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      yellow: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
      purple: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500",
      pink: "bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500",
      indigo: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
      teal: "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
      presidencia: "bg-presidencia text-white hover:bg-presidencia focus:ring-presidencia",
    };

    // Clases para cada variante
    const variantClasses = {
      solid: `${colorClasses[color]} px-6 py-2 rounded-xl shadow-md hover:shadow-lg focus:ring-4`,
      outline: `border-2 border-${color} text-${color}-600 hover:bg-${color}-50 focus:ring-${color}-500 px-6 py-2 rounded-xl`,
      ghost: `text-${color}-600 bg-transparent hover:bg-${color}-100 focus:ring-${color}-500 px-6 py-2 rounded-xl`,
      link: `text-${color}-600 hover:text-${color}-700 focus:ring-${color}-500 px-6 py-2`,
      text: `text-${color}-600 hover:text-${color}-700 focus:ring-${color}-500 px-6 py-2`,
      light: `${colorClasses[color]} bg-opacity-20 hover:bg-opacity-30 focus:ring-opacity-60 px-6 py-2 rounded-xl`,
    };

    // Clases de tamaño del botón
    const sizeClasses = {
      small: "text-sm py-2 px-4",
      medium: "text-base py-3 px-6",
      large: "text-lg py-4 px-8",
    };

    return (
      <button
        id={id}
        ref={ref}
        onClick={onClick}
        type={type} // Usamos directamente el valor de 'type'
        className={`w-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2  ${variantClasses[variant]} ${sizeClasses[size]} cursor-pointer`}
      >
        {children}
      </button>
    );
  }
);

export default memo(Button);
