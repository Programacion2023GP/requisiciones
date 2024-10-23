import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";



const SidebarItem: React.FC<{
  icon: string;
  label: string;
  isOpen: boolean;
  href: string;
}> = ({ icon, label, isOpen, href }) => {
  const location = useLocation(); // Hook para obtener la ruta actual
  
  useEffect(() => {
    console.log('Ruta actual:', location.pathname);
  }, [location.pathname]); // Monitorea los cambios de ruta

  return (
    <li>
      <Link
        to={href}
        className={`flex items-center text-white px-6 py-3 hover:bg-cyan-600 rounded-md transition duration-300 ease-in-out ${location.pathname === href ? 'bg-cyan-600' : ''}`}
      >
        <i className={`${icon} ri-lg`}></i>
        {isOpen && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  );
};

export default SidebarItem;

 

 


// Componente dropdown


const Dropdown: React.FC<{
  isOpen: boolean;
  label: string;
  items: { label: string; href: string; icon: string }[];
}> = ({ isOpen, label, items }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center text-white px-6 py-3 hover:bg-cyan-600 rounded-md transition duration-300 ease-in-out w-full text-left"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-controls="dropdown-list"
      >
        <i className="ri-folder-line ri-lg"></i>
        {isOpen && <span className="ml-3">{label}</span>}
        <i
          className={`ri-arrow-${isDropdownOpen ? 'up' : 'down'}-line ml-auto`}
        ></i>
      </button>
      {isDropdownOpen && (
        <ul
          id="dropdown-list"
          className="pl-4 space-y-2"
          aria-hidden={!isDropdownOpen}
        >
          {items.map((item, index) => (
            <li key={index}>
              <SidebarItem href={item.href} icon={item.icon} label={item.label} isOpen/>
              {/* <Link
                to={item.href}
                className="flex items-center text-white hover:bg-cyan-600 rounded-md py-2 px-4 transition duration-300 ease-in-out"
              >
                <i className={`${item.icon} ri-lg`}></i>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



// Componente Sidebar
const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`bg-gradient-to-b from-cyan-500 to-cyan-600 h-screen ${
        isOpen ? "w-64" : "w-14"
      } transition-width duration-300 flex flex-col`}
    >
      <div className="flex justify-end p-4">
        <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
          <i className="ri-menu-line"></i>
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">{children}</ul>
      </nav>
    </aside>
  );
};

export { Sidebar, Dropdown, SidebarItem };
