import Typography from "../components/typografy/Typografy";

type ReactPermissionsMenu = {
  children: React.ReactNode;
  IdMenu: string | Array<string>;
};

interface ReactPermissions {
  Menu: string;
  MenuPadre: number | null;
  Icon: string;
  Id: number;
  EstadoPermiso: boolean;
  IdMenu: string;
  children?: ReactPermissionsMenu[]; // Este es el componente que se mostrará en caso de que tenga permisos hijo, en este caso, puede ser otro menu o un componente que muestre permisos específicos.
}
export const PermissionMenu: React.FC<ReactPermissionsMenu> = ({
  children,
  IdMenu,
}) => {
  const permisos = JSON.parse(
    localStorage.getItem("menuPermiso") ?? "[]"
  ) as Array<ReactPermissions>;
  // Verifica si existe un permiso con el IdMenu correspondiente
  const hasPermission = Array.isArray(IdMenu)
    ? permisos.some(
        (permiso) => IdMenu.includes(permiso.IdMenu) && permiso.EstadoPermiso
      )
    : permisos.some(
        (permiso) => permiso.IdMenu === IdMenu && permiso.EstadoPermiso
      );
    
  return (
    <>
      {hasPermission && children}
      {Array.isArray(IdMenu) && !hasPermission && (
        <div className="w-full text-center-4 p-4 mt-2  bg-yellow-300 text-yellow-800 rounded-md">
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M4.93 4.93a10 10 0 1114.14 14.14A10 10 0 014.93 4.93z"
              />
            </svg>
            <span className="ml-2 text-lg font-semibold">
              No cuentas con los permisos comunicate con el administrador del sistema
            </span>
          </div>
        </div>
      )}
    </>
  );
};
