import { useContext, useEffect, useState } from "react";
import { ListComponent } from "../../components/list/ListComponent";
import { InputComponent } from "../../components/input/InputComponent";
import Tooltip from "../../components/toltip/Toltip";
import { ContextUsers } from "..";
import { SwitchComponent } from "../../components/switch/Switch";
import { AxiosGet } from "../../axios/axios";

interface Sections {
  permission: boolean;
  section: number;
}

interface ChecboxProps {
  id?: number;
  section: number;
  userPermission: Array<UserPermission>;
  sections: Array<Sections>;
}
interface UserPermission {
  id: number; // ID de la permission
  id_user: number; // ID del usuario asociado
  id_menu: number; // ID del menú asociado
  read: boolean; // Permiso de lectura
  write: boolean; // Permiso de escritura
  edit: boolean; // Permiso de edición
  delete: boolean; // Permiso de eliminación
}

const CheckboxGroup: React.FC<ChecboxProps> = ({
  id,
  userPermission = [],
  section,
  sections,
}) => {
  const context = useContext(ContextUsers);
  if (!context) {
    throw new Error(
      "SomeChildComponent must be used within a ContextUsers.Provider"
    );
  }
  const [permissions, setPermissions] = useState<
    Record<string, boolean | number>
  >({
    read: false,
    add: false,
    modify: false,
    delete: false,
  });
  useEffect(() => {
    if (userPermission.length > 0) {
      const item = userPermission.find((item) => item.id_menu == id);
      if (item) {
        setPermissions({
          read: item.read,
          add: item.write,
          modify: item.edit,
          delete: item.delete,
        });
      } else {
        setPermissions({
          read: false,
          add: false,
          modify: false,
          delete: false,
        });
      }
    } else {
      setPermissions({ read: false, add: false, modify: false, delete: false });
    }
  }, [userPermission]);

  useEffect(() => {
    if (sections && sections.length > 0) {
      const item = sections.find((item) => item.section == section);
      if (item) {
        setPermissions({
          read: item.permission,
          add: item.permission,
          modify: item.permission,
          delete: item.permission,
        });
      }
    }
  }, [sections]);

  useEffect(() => {
    // console.log("id",permissions)
  }, [permissions]);

  const handleCheckboxChange =
    (name: keyof typeof permissions) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPermissions((prev) => ({
        ...prev,
        [name]: event.target.checked,
      }));
    };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setPermissions({
      read: isChecked,
      add: isChecked,
      modify: isChecked,
      delete: isChecked,
    });
  };

  const permissionsList = [
    {
      iconClass: "ri-eye-fill",
      name: "read",
      classChecked: "bg-green-500",
      toltip: "Leer",
    },
    {
      iconClass: "ri-add-fill",
      name: "add",
      classChecked: "bg-blue-500",
      toltip: "Agregar",
    },
    {
      iconClass: "ri-pencil-fill",
      name: "modify",
      classChecked: "bg-yellow-500",
      toltip: "Editar",
    },
    {
      iconClass: "ri-delete-bin-5-fill",
      name: "delete",
      classChecked: "bg-red-500",
      toltip: "Eliminar",
    },
  ];

  return (
    <div className="flex items-center">
      {/* Uncomment this line if you want to include the Select All switch */}
      <SwitchComponent
        iconClass="ri-check-double-fill" // Icono para "Todos"
        classChecked="bg-purple-500" // Color para "Todos"
        checked={Object.values(permissions).every(Boolean)} // Marca "Todos" si todos están seleccionados
        onChange={handleSelectAllChange}
      />
      {permissionsList.map((perm, index) => (
        <Tooltip key={index} content={perm.toltip}>
          <SwitchComponent
            iconClass={perm.iconClass}
            classChecked={perm.classChecked}
            checked={!!permissions[perm.name]} // Asegúrate de convertir a booleano
            onChange={handleCheckboxChange(perm.name)}
          />
        </Tooltip>
      ))}
    </div>
  );
};

const UsersComponent: React.FC = () => {
  useEffect(() => {}, []);
  const context = useContext(ContextUsers);
  if (!context) {
    throw new Error(
      "SomeChildComponent must be used within a ContextUsers.Provider"
    );
  }
  const { users, setEditUser,edituser } = context;
  const selectedUser = (item: Record<string, any>) => {
    setEditUser(item);
  };
  return (
    <div className="col-12 col-md-3 ">
      <ListComponent
        titleItem="fullname"
        otherItems={["departamento.group"]}
        addIcon={<></>}
        title={"selecciona al usuario"}
        filter
        button
        selected={edituser?.fullname}
        data={users}
        loading={false}
        buttons={(item) => (
          <>
            <Tooltip content="Seleccionar">
              <button
                onClick={() => {
                  selectedUser(item);
                }}
                className={`flex items-center border
                ${edituser?.fullname ==item?.fullname ?'bg-cyan-500 text-white':'' }
                border-cyan-500 text-cyan-500 font-medium py-1 px-3 rounded-full shadow-md hover:bg-cyan-500 hover:text-white transition duration-300 ease-in-out transform hover:scale-105 text-sm`}
              >
                <i className="ri-check-fill mr-1 text-lg"></i>
              </button>
            </Tooltip>
          </>
        )}
      />
    </div>
  );
};

export const PermissionComponent: React.FC = () => {
  const context = useContext(ContextUsers);
  if (!context) {
    throw new Error(
      "SomeChildComponent must be used within a ContextUsers.Provider"
    );
  }
  const { menu, edituser, setEditUser } = context;
  const [userPermission, setUserPermission] = useState<Array<UserPermission>>(
    []
  );
  const [section, setSection] = useState<Sections[]>([]); // Inicializas con un array vacío
  useEffect(() => {
    const init = async () => {
      edituser?.id &&
        setUserPermission(await AxiosGet(`/usermenu/${edituser?.id}`));
    };
    init();
  }, [edituser]);
  const addSection = (menu: Record<string, any>) => {
    setSection((prevSections) => {
      const existingSection = prevSections.find(
        (section) => section.section === menu.id
      );

      if (existingSection) {
        return prevSections.map((section) =>
          section.section === menu.id
            ? { ...section, permission: !section.permission }
            : section
        );
      } else {
        return [...prevSections, { permission: true, section: menu.id }];
      }
    });
  };

  return (
    <div className="row ">
     

      <UsersComponent />
      <div className="flex-1 flex flex-col col-12 col-md-9">
        <div className=" overflow-auto max-h-96 bg-white p-4 rounded-lg shadow">
          {menu.map((menu, index) => (
            <ListComponent
              key={index}
              addIcon={
                <>
                  <Tooltip content="Añadir todo">
                    <button
                      onClick={() => {
                        addSection(menu);
                      }}
                      className={`flex ml-2 items-center border ${
                        section.find(
                          (item) =>
                            item.section === menu.id && item.permission === true
                        )
                          ? "border-red-500 text-red-500 hover:bg-red-500"
                          : "border-cyan-500 text-cyan-500 hover:bg-cyan-500"
                      } font-medium py-2 px-3 rounded-full shadow-md  hover:text-white transition duration-300 ease-in-out transform hover:scale-105 text-sm`}
                    >
                      <i
                       className={`${
                        section.find((item) => item.section === menu.id && item.permission === true)
                          ? " ri-arrow-left-double-fill"  // Icono si existe y el permiso es true
                          : "ri-arrow-right-double-fill"    // Icono si no existe o el permiso es false
                      } mr-2`}
                      
                      ></i>
                      {section.find(
                        (item) =>
                          item.section === menu.id && item.permission === true
                      )
                        ? "Eliminar Sección"
                        : "Añadir Sección"}
                    </button>
                  </Tooltip>
                </>
              }
              title={menu.name}
              filter
              button
              data={menu.submenus ?? []}
              titleItem="name"
              loading={false}
              buttons={(item) => (
                <>
                  <CheckboxGroup
                    sections={section}
                    userPermission={userPermission}
                    section={menu.id}
                    id={item.id}
                  />
                </>
              )}
            />
          ))}
        </div>
      {edituser?.fullname && (
         <button
         onClick={() => {
           // acción de confirmar
         }}
         className="mt-6 bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform 
         hover:bg-cyan-600"
       >
         <i className="ri-check-fill mr-2"></i>
         Confirmar
       </button>
      )}
      </div>
    </div>
  );
};
