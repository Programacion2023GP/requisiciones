import { useContext, useEffect, useState, useRef } from "react";
import { FormContext } from "../Formulario";


  

interface ValidationBoolean {
  condition: boolean;
  message: string;
}

interface Props<T = string, K = string> {
    name: string;
    label: string;
    options: Array<any>; // Update to use the new flexible Option type
    value?: K | null; // This allows value to be of the type specified in keyValue
    keyLabel?: string; // Key for the label
    keyValue?: string; // Key for the value
    disabled?: boolean;
    required?: ValidationBoolean;
  }
  

export const FSelect: React.FC<Props> = ({
  name,
  label,
  keyLabel="label",
  keyValue="value",
 
  options = [],
  value = null,
  required,
  disabled = false,
}) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FSelect debe estar dentro de un FormProvider");
  }

  const { data, setData } = context;

  const [selectedValue, setSelectedValue] = useState<string | null>(value);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar las opciones según el término de búsqueda
  const filteredOptions = options.filter((option) => {
      const labelValue = option[keyLabel];
    return typeof labelValue === "string" && labelValue.toLowerCase().includes(searchTerm.toLowerCase());
  });
  

  useEffect(() => {
    setData({ type: "initialValues", action: "add", name, value });
  }, [name, value, setData]);
 useEffect(() => {},[label]);
  useEffect(() => {
    const validationObj: Record<string, any> = {};
    if (required) {
      validationObj.required = {
        condition: required.condition,
        message: required.message,
      };
    }

    setData({
      type: "validation",
      action: "add",
      validation: { name, validations: validationObj },
    });
  }, [name, required?.condition, required?.message, setData]);

  const handleSelectChange = (option: Record<string|number,string>) => {
    setSelectedValue(option[keyValue]);
    setSearchTerm(option[keyLabel]);
    setHighlightedIndex(-1); // Resetea el índice resaltado

    // Actualizar el estado en el contexto
    setData({
      type: "initialValues",
      action: "add",
      name,
      value: option[keyValue],
    });

    setData({
      type: "errors",
      action: "add",
      name,
      value: option[keyValue],
    });

    setIsFocused(false); // Cierra la lista de opciones
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setData({
      type: "initialValues",
      action: "add",
      name,
      value: null,
    });
    setHighlightedIndex(-1); // Resetea el índice resaltado
    setIsFocused(true); // Asegúrate de que la lista se muestre al escribir
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelectChange(filteredOptions[highlightedIndex]);
      } else if (searchTerm) {
        // Permitir seleccionar el valor escrito si no hay opción resaltada
        const option = options.find(
          (opt) => opt.label.toLowerCase() === searchTerm.toLowerCase()
        );
        if (option) {
          handleSelectChange(option);
        }
      }
    } else if (e.key === "Escape") {
      setIsFocused(false); // Cierra la lista si se presiona Escape
    }
  };
  const ref = useRef<HTMLDivElement>(null); // Crear ref para el componente

  const handleOptionClick = (option:Record<string|number,string>) => {
    handleSelectChange(option);
    inputRef.current?.focus(); // Regresa el foco al input después de seleccionar
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsFocused(false); // Cierra la lista si se hace clic fuera del componente
    }
  };

  useEffect(() => {
    // Añadir el evento 'mousedown' cuando el componente se monta
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpiar el evento cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return (
    <div ref={ref} className="relative mb-6"> 
      <label
        htmlFor={name}
        className={`absolute left-3 top-2 text-sm transition-all duration-300 transform origin-[0]
          ${
            selectedValue || isFocused
              ? "-translate-y-4 scale-75"
              : "scale-100 text-gray-500"
          }
          peer-placeholder-shown:top-2 peer-focus:-translate-y-4 peer-focus:scale-75
          ${data.errors?.[name] ? "text-red-600" : ""}
          ${selectedValue && !data.errors?.[name] ? "text-teal-300" : ""}
        `}
      >
        {label}
      </label>
      <input
        type="text"
        ref={inputRef}
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          const optionExists = options.some(
            (option) => option[keyLabel].toLowerCase() === searchTerm.toLowerCase()
          );

          // Solo actualiza el estado de errores si no existe la opción
          if (!optionExists) {
            setData({
              type: "errors",
              action: "add",
              name,
              value: null, // Envía null si no hay coincidencias
            });
          }
        }}
        onKeyDown={handleKeyDown}
        className={`block w-full px-3 py-2 text-sm text-gray-900 bg-transparent border-b-2 rounded-md appearance-none focus:outline-none focus:ring-0 
        ${data.errors?.[name] ? "border-red-600" : "border-gray-300"}
          ${selectedValue && !data.errors?.[name] ? "border-teal-300" : ""}
        `}
      />
      {isFocused && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 max-h-40 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={option[keyValue]}
              onClick={() => {handleOptionClick(option)
                setIsFocused(false);
                
              }} // Utiliza la función manejadora aquí
              className={`cursor-pointer hover:bg-gray-200 px-3 py-2 ${
                index === highlightedIndex ? "bg-gray-200" : ""
              }`}
            >
              {option[keyLabel]}
            </li>
          ))}
        </ul>
      )}

      {data.errors?.[name] && (
        <p className="text-red-600 text-xs italic mt-2">
          Error: {data.errors?.[name]}
        </p>
      )}
    </div>
  );
};
