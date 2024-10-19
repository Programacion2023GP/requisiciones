import { useState } from "react";

const Sidebar :React.FC=()=>{
    const [isOpen, setIsOpen] = useState(true); // Estado para colapsar o expandir el sidebar

    return (
      <aside className={`bg-cyan-500 h-screen ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300 ease-in-out flex flex-col`}>
        {/* Botón para colapsar/expandir el sidebar */}
        <div className="flex justify-end p-4">
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`ri-${isOpen ? 'menu-fold-line' : 'menu-unfold-line'} ri-xl`}></i>
          </button>
        </div>
  
        {/* Logo */}
        <div className={`mb-8 ${isOpen ? 'px-6' : 'px-2'} transition-all duration-300`}>
          <h2 className={`text-white font-bold text-2xl tracking-wide ${!isOpen && 'opacity-0'} transition-opacity duration-300`}>
            Mi App
          </h2>
        </div>
  
        {/* Navegación */}
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <a href="#" className="flex items-center text-white px-6 py-3 hover:bg-cyan-600 rounded-md transition duration-300 ease-in-out">
                <i className="ri-home-2-line ri-lg"></i>
                {isOpen && <span className="ml-3">Inicio</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-white px-6 py-3 hover:bg-cyan-600 rounded-md transition duration-300 ease-in-out">
                <i className="ri-user-line ri-lg"></i>
                {isOpen && <span className="ml-3">Usuarios</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-white px-6 py-3 hover:bg-cyan-600 rounded-md transition duration-300 ease-in-out">
                <i className="ri-file-list-line ri-lg"></i>
                {isOpen && <span className="ml-3">Reportes</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-white px-6 py-3 hover:bg-cyan-600 rounded-md transition duration-300 ease-in-out">
                <i className="ri-settings-3-line ri-lg"></i>
                {isOpen && <span className="ml-3">Configuración</span>}
              </a>
            </li>
          </ul>
        </nav>
  
        {/* Footer */}
        <div className="px-6 py-4 text-sm text-gray-300">
          {/* <p className={`${isOpen ? '' : 'hidden'}`}>© 2024 Mi App</p> */}
        </div>
      </aside>
    );
}
export default Sidebar;