const Header:React.FC =()=>{
    return (<>
    <div className="bg-cyan-500 text-white h-16 flex items-center justify-between px-8 shadow-xl mb-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-wide">Mi App</h1>
        <nav className="ml-8">
          <ul className="flex space-x-8">
            <li>
              <a href="#" className="text-white hover:text-gray-200 transition duration-300 ease-in-out">
                Usuarios
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-gray-200 transition duration-300 ease-in-out">
                Tab 2
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-gray-200 transition duration-300 ease-in-out">
                Tab 3
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center">
        {/* Botón de configuración */}
        <button className="text-white hover:text-gray-300 transition duration-300 ease-in-out">
          <i className="ri-settings-3-line ri-xl"></i>
        </button>
      </div>
    </div>
    </>)
}
export default Header