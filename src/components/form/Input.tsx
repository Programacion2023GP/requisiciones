import React, { useState, ChangeEvent } from "react";
import { IoCloseSharp } from "react-icons/io5";

type InputWithLabelProps = {
  label: string;
  name: string;
  required?: boolean;
  suscribeValue?: (value: string) => any; // Callback para suscribir valor
  value?: string;
};

const InputComponent: React.FC<InputWithLabelProps> = ({
  label,
  name,
  required = false,
  suscribeValue,
  value,
}) => {
  const [hasText, setHasText] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<string>("");

  // Manejador de evento para actualizar el estado al escribir en el input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHasText(newValue !== "");
    setHasValue(newValue);
    if (suscribeValue) {
      suscribeValue(newValue); // Llamar a la función de render prop, si existe, con el nuevo valor
    }
  };

  // Manejador para limpiar el valor del input
  const clearInput = () => {
    setHasText(false);
    setHasValue("");
    if (suscribeValue) {
      suscribeValue(""); // Notificar que el valor está vacío
    }
  };

  // Si 'value' es recibido como prop, úsalo como valor por defecto; si no, usa 'hasValue'
  const inputValue = value !== undefined ? value : hasValue;

  return (
    <div className="relative z-0 w-full mb-5">
     
         
      <input
        value={inputValue} // Usar inputValue para controlar el valor del input
        type="text"
        name={name}
        id={name}
        placeholder=" "
        required={required}
        onChange={handleInputChange}
        className="peer pt-4 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
      />
      <label
        htmlFor={name}
        className={`absolute left-0 -top-3.5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black`}
      >
        {label}
      </label>
     {inputValue !="" && (
      <IoCloseSharp
      onClick={clearInput}
      className="absolute right-0 top-2.5 text-red-400 hover:text-gray-600 cursor-pointer"
      size={20}
    />
     )}   
   
      <span className="text-sm text-red-600 hidden" id="error">
        {label} is required
      </span>
    </div>
  );
};

export default InputComponent;
