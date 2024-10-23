const Header: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white h-16 flex items-center justify-between px-8 shadow-xl mb-6">
        <div className="flex items-center">
          <nav className="ml-8">
            {/* Aquí puedes añadir los enlaces de navegación si es necesario */}
          </nav>
        </div>
        <div className="flex items-center">
          {/* Botón de configuración */}
          <button className="text-white hover:text-gray-300 transition duration-300 ease-in-out">
            <i className="ri-settings-3-line ri-xl"></i>
          </button>
        </div>
      </div>
    </>
  );
};
export default Header;
