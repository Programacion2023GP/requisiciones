import { Link } from "@tanstack/react-router";
import { memo, useState } from "react";
import { LuUser, LuSettings, LuFileText } from "react-icons/lu";

const SidebarComponent = () => {
  console.log("SidebarComponent Component");

  return (
    <div className="w-64 shadow-xl h-screen bg-presidencia text-white p-4">
      <div className="flex items-center justify-center mb-8">
        {/* Logo Section */}
        <div className="text-3xl font-bold text-center">Logo</div>
      </div>
      
      <div className="mt-4 space-y-2">
        <Item href="usuarios" label="Usuarios" icon={<LuUser />} />
        <Dropdown label="Configuración" icon={<LuSettings />}>
          <Item href="profile" label="Perfil" icon={<LuUser />} />
          <Item href="settings" label="Ajustes" icon={<LuFileText />} />
        </Dropdown>
      </div>
    </div>
  );
};

type LinkItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const Item: React.FC<LinkItem> = ({ href, label, icon }) => {
  return (
    <Link
      href={href}
      className="flex items-center text-lg text-white hover:bg-green-700 p-3 rounded-lg transition-all duration-300 space-x-3"
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
};

// Dropdown Component
type DropdownProps = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({ label, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <div
        className="flex items-center text-lg text-white hover:bg-green-700 p-3 rounded-lg transition-all duration-300 cursor-pointer space-x-3"
        onClick={toggleDropdown}
      >
        {icon && <span className="text-2xl">{icon}</span>}
        <span>{label}</span>
        <span className="ml-auto text-xl">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="ml-6 space-y-2 mt-2">{children}</div>
      )}
    </div>
  );
};

export default memo(SidebarComponent);
