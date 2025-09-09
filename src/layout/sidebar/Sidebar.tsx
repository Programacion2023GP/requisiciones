import React, { useState, useEffect } from "react";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import { FaFolder, FaFolderOpen, FaSpinner } from "react-icons/fa6";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import Logo from "../../assets/logo-gpd.png";
import { AxiosRequest, GetAxios } from "../../axios/Axios";
import { showToast } from "../../sweetalert/Sweetalert";

const IconLibraries = {
  ...AiIcons,
  ...FaIcons,
  ...BiIcons,
  ...MdIcons,
  ...FiIcons,
  ...GiIcons,
  ...RiIcons,
};

// Rest of the code remains the same as in the previous artifact
export interface MenuItem {
  Id: number;
  IdMenu: string;
  Menu: string;
  MenuPadre: number | null;
  children?: MenuItem[];
  EstadoPermiso: boolean;
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
    localStorage.clear();
    window.location.href = "/";
    mutation.mutate({
      method: "POST",
      url: "/auth/logout",
    });
  };

  return (
    <div className="relative h-full w-72   shadow-2xl overflow-hidden">
      {/* Glowing Logo Container */}
      <div className="relative p-6 border-b border-gray-700/30">
        <div className="absolute inset-0 bg-presidencia/10 blur-2xl -z-10"></div>
        <img
          src={Logo}
          alt="Logo"
          className="w-40 mx-auto transform transition-all hover:scale-105 hover:rotate-3 hover:shadow-lg"
        />
      </div>

      {/* Menu Container with Elegant Scroll */}
      <nav className="py-4 space-y-2 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {menuItems.map((menu) => {
          const IconComponent = menu.Icon
            ? IconLibraries[menu.Icon as keyof typeof IconLibraries]
            : null;

          if (menu.IdMenu === "MnuCatalogos" && menu.children?.length) {
            const activeChildren = menu.children.filter(
              (child) => child.EstadoPermiso 
            );

            if (!activeChildren.length) return null; // No hay hijos activos, no renderizamos nada

            return (
              <Dropdown key={menu.Id} label={menu.Menu}>
                {activeChildren.map((child) => {
                  const ChildIcon = child.Icon
                    ? IconLibraries[child.Icon as keyof typeof IconLibraries]
                    : null;

                  return (
                    <Item
                      key={child.IdMenu}
                      href={child.IdMenu}
                      label={child.Menu}
                      icon={ChildIcon ? <ChildIcon size={24} /> : null}
                    />
                  );
                })}
              </Dropdown>
            );
          }

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
          <div className="w-full flex justify-center items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-400" />
          </div>
        )}
      </nav>

      {/* Logout Section with Hover Effects */}
      {/* {menus.status === "success" && ( */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/30">
          <button
            onClick={logout}
            className="
              w-full 
              flex items-center 
              justify-center 
              gap-3 
              py-3 
              rounded-lg 
              text-blue-900 
              bg-gradient-to-r 
              from-black-500/20 
              to-black-600/20 
              hover:from-black-500/40 
              hover:to-black-600/40 
              transition-all 
              duration-300 
              group
            "
            >
            <CiLogout className="text-xl  group-hover:rotate-12 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
        {/* )} */}
    </div>
  );
};

const Item: React.FC<{
  label: string;
  href?: string;
  icon: React.ReactNode;
}> = ({ href, label, icon }) => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLocation(location.pathname.split("/")[1]);
    }, 100);
    return () => clearTimeout(timer);
  }, [location]);

  const isActive = currentLocation === href;

  return (
    <Link
      to={href || "#"}
      className={`
        px-4 
        py-3 
        flex 
        items-center 
        gap-3 
        text-blue/80 
        hover:bg-white/5 
        rounded-lg 
        transition-all 
        duration-300
        ${isActive ? "bg-blue-500/20" : ""}
      `}
    >
      {icon && <span className="text-blue-400">{icon}</span>}
      <span
        className={`text-sm ${isActive ? "text-blue-400 font-semibold" : "group-hover:text-white"}`}
      >
        {label}
      </span>
    </Link>
  );
};

const Dropdown: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="px-4">
      <div
        onClick={toggleDropdown}
        className="
          flex 
          items-center 
          justify-between 
          px-4 
          py-3 
          rounded-lg 
          text-blue/80 
          hover:bg-white/5 
          cursor-pointer 
          transition-all 
          duration-300
          group
        "
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <FaFolderOpen className="text-blue-400" />
          ) : (
            <FaFolder className="text-blue-400" />
          )}
          <span className="text-sm font-medium group-hover:text-blue-500">
            {label}
          </span>
        </div>
        <span>{isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}</span>
      </div>

      {isOpen && (
        <div className="ml-6 mt-2 space-y-2 border-l border-gray-700/30">
          {children}
        </div>
      )}
    </div>
  );
};

export default SidebarComponent;
