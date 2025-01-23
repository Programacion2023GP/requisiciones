import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { createPortal } from "react-dom";
type  Props = {
    children: React.ReactNode
}
const DropdownComponent: React.FC<Props> = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", closeDropdown);
    } else {
      document.removeEventListener("click", closeDropdown);
    }

    return () => document.removeEventListener("click", closeDropdown);
  }, [isOpen]);

  const dropdownContent = isOpen && (
    <div
      className="absolute z-50 w-fit px-2 bg-neutral-200 border border-gray-200 rounded-lg shadow-lg"
      style={{ top: position.top, left: position.left }}
    >
      <div className="py-1 flex flex-row gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        className="flex items-center justify-center w-10 h-10 p-1 rounded-full cursor-pointer bg-white hover:bg-gray-300"
        onClick={(e) => {
          e.stopPropagation(); // Previene que el evento cierre el dropdown
          toggleDropdown();
        }}
      >
        <FiMoreVertical className="text-gray-600 w-6 h-6" />
      </button>
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default DropdownComponent;
