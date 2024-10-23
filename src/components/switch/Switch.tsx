interface SwitchButtonProps {
    iconClass: string;
    checked: boolean;
    classChecked: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string; // Hacer label opcional
  }
  
  export const SwitchComponent: React.FC<SwitchButtonProps> = ({
    iconClass,
    checked,
    onChange,
    classChecked,
    label,
  }) => (
    <label className="flex items-center cursor-pointer mx-1">
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition duration-200 
                    ${checked ? classChecked : "bg-gray-300"}`}
      >
        <span
          className={`absolute left-1 bg-white w-4 h-4 rounded-full transition transform duration-200 
                      ${checked ? "translate-x-full" : ""}`}
        />
        <i
          className={`absolute text-xs text-white transition duration-200 z-10`} // Añadir z-index
          style={{
            left: checked ? "0.2rem" : "calc(100% - 1rem)", // Mover el icono al lado opuesto
            top: "50%", // Centrar verticalmente
            transform: "translateY(-50%)", // Centrar verticalmente
          }}
        >
          <i className={iconClass}></i>
        </i>
      </span>
      {label && <span className="ml-2 text-white">{label}</span>}
    </label>
  );