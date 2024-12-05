import { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai"; // Importa los iconos de react-icons

const CollapseComponent: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full border-2 border-gray-300 rounded-lg  shadow-md">
      <div className="flex justify-between items-center p-1 bg-gray-100 hover:bg-gray-200 transition-all duration-300">
        <p className="ml-2 text-md font-semibold text-gray-700 w-full">{title}</p>
        <button
          onClick={toggleCollapse}
          className="text-gray-600 p-2 rounded-md hover:text-gray-900 focus:outline-none transition-all duration-300"
        >
          {isOpen ? (
            <AiOutlineUp size={20} />
          ) : (
            <AiOutlineDown size={20} />
          )}
        </button>
      </div>

      <div
        className={`transition-all duration-500 overflow-hidden mt-2 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-gray-50 rounded-lg h-40 overflow-auto py-2">{children}</div>
      </div>
    </div>
  );
};

export default CollapseComponent;
