import { useMutation, useQueries } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { memo, useEffect, useState } from "react";
import { LuUser, LuSettings, LuFileText } from "react-icons/lu";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { FaFolder, FaFolderOpen } from "react-icons/fa6";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { showToast } from "../../sweetalert/Sweetalert";
import { customLog } from "../../extras/consoles";

const IconLibraries = {
  ...AiIcons,
  ...FaIcons,
  ...BiIcons,
  ...MdIcons,
  ...FiIcons,
  ...GiIcons,
  ...RiIcons,
};

export interface MenuItem {
  Id: number;
  IdMenu: string;
  Menu: string;
  MenuPadre: number | null;
  children?: MenuItem[];
  EstadoPermiso?: boolean;
  Icon?: string;
}

const SidebarComponent = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const mutation = useMutation({
    mutationFn: ({
      url,
      method,
      data,
    }: {
      url: string;
      method: "POST" | "PUT" | "DELETE";
      data?: any;
    }) => AxiosRequest(url, method, data),
    onSuccess: (data) => {
      showToast(data.message, data.status);
      localStorage.clear();
      window.location.href = "/";
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });

  const queries = useQueries({
    queries: [
      {
        queryKey: ["menuuserlayout/index"],
        queryFn: () => GetAxios(`menuuser/index`),
        refetchOnWindowFocus: true,
      },
    ],
  });

  const addSectionMenu = (array: Array<MenuItem>): boolean => {
    return array.some((item) => item.EstadoPermiso);
  };

  const groupMenuByParent = (data: any[]): MenuItem[] => {
    const menuMap: { [key: string]: any } = {};

    data.forEach((item) => {
      menuMap[item.Id] = { ...item, children: [] };
    });

    const result: any[] = [];

    data.forEach((item) => {
      if (item.MenuPadre && menuMap[item.MenuPadre]) {
        menuMap[item.MenuPadre].children.push(menuMap[item.Id]);
      } else if (!item.MenuPadre) {
        result.push(menuMap[item.Id]);
      }
    });
    return result;
  };

  const [menus] = queries;

  useEffect(() => {
    if (menus.isSuccess) {
      const transformedMenus = groupMenuByParent(menus.data.data);
      setMenuItems(transformedMenus);
    }
  }, [menus.isSuccess]);

  const logout = () => {
    mutation.mutate({
      method: "POST",
      url: "/auth/logout",
    });
  };

  return (
    <div className="w-64 shadow-lg h-screen overflow-auto bg-presidencia text-white p-4 transition-all ease-in-out duration-300">
      <div className="flex items-center justify-center mb-8">
        {/* Logo Section */}
        <div className="text-3xl font-bold text-center text-white hover:text-green-500 transition-all duration-300">
          Logo
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {menuItems.map((menu) => {
          // Asegúrate de que `IconLibraries` y `menu.Icon` existan y sean válidos
          const IconComponent = menu.Icon
            ? IconLibraries[menu.Icon as keyof typeof IconLibraries]
            : null;

          return (
            <div key={menu.Id}>
              {Array.isArray(menu.children) &&
              menu.children.length > 0 &&
              addSectionMenu(menu.children) ? (
                <Item
                  key={menu.IdMenu}
                  href={menu.IdMenu}
                  label={menu.Menu}
                  icon={IconComponent ? <IconComponent size={24} /> : null}
                />
              ) : null}
            </div>
          );
        })}

        {menus.status === "pending" && (
          <div className="w-full h-full flex justify-center items-center">
            <FaIcons.FaSpinner className="animate-spin text-6xl mb-4" />
          </div>
        )}

        {menus.status === "success" && (
          <div
            onClick={logout}
            className="cursor-pointer flex items-center text-lg text-white hover:bg-green-700 p-3 rounded-lg transition-all duration-300 space-x-3 mt-4"
          >
            <CiLogout className="text-2xl" />
            <span className="text-lg">Cerrar sesión</span>
          </div>
        )}
      </div>
    </div>
  );
};

type LinkItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
};

const Item: React.FC<LinkItem> = ({ href, label, icon }) => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  // Retraso en la actualización de la ubicación para animación más fluida
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLocation(location.pathname.split('/')[1]);
    }, 100); // Retraso de 100ms
    return () => clearTimeout(timer); // Limpieza del temporizador
  }, [location]);

  const isActive = currentLocation === href;

  return (
    <Link
      to={href || "#"}
      className={`
        flex items-center text-lg text-white 
        ${isActive ? "bg-green-600" : "bg-transparent"} 
        hover:bg-green-700 p-3 rounded-lg transition-all duration-500 space-x-3 ease-in-out
      `}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-md">{label}</span>
    </Link>
  );
};

// Dropdown Component
type DropdownProps = {
  label: string;
  children: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <div
        className="flex items-center text-lg text-white hover:bg-green-700 p-2 rounded-lg transition-all duration-300 cursor-pointer space-x-3"
        onClick={toggleDropdown}
      >
        <span className="text-md">
          {isOpen ? <FaFolderOpen /> : <FaFolder />}
        </span>
        <span className="text-md">{label}</span>
        <span className="ml-auto text-md">
          {isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </span>
      </div>
      {isOpen && <div className="ml-6 space-y-2 mt-2">{children}</div>}
    </div>
  );
};

export default memo(SidebarComponent);
