import { useContext, useState } from "react";
import { ListComponent } from "../../components/list/ListComponent";
import { InputComponent } from "../../components/input/InputComponent";
import Tooltip from "../../components/toltip/Toltip";
import { ContextUsers } from "..";
import { SwitchComponent } from "../../components/switch/Switch";

const data = [
  { title: "catalogos", subitems: [{ Name: "Tipo" }, { Name: "Estatus" }] },
  {
    title: "usuarios",
    subitems: [{ Name: "Nombre" }, { Name: "Correo" }, { Name: "Rol" }],
  },
  {
    title: "reportes",
    subitems: [
      { Name: "Mensuales" },
      { Name: "Anuales" },
      { Name: "Personalizados" },
    ],
  },
  {
    title: "configuraciones",
    subitems: [{ Name: "General" }, { Name: "Notificaciones" }],
  },
  {
    title: "productos",
    subitems: [{ Name: "Nombre" }, { Name: "Precio" }, { Name: "Cantidad" }],
  },
  {
    title: "pedidos",
    subitems: [{ Name: "ID" }, { Name: "Cliente" }, { Name: "Estado" }],
  },
];



const CheckboxGroup: React.FC = () => {
  const [permissions, setPermissions] = useState<{
    read: boolean;
    add: boolean;
    modify: boolean;
    delete: boolean;
  }>({
    read: false,
    add: false,
    modify: false,
    delete: false,
  });

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

  const permissionsList: {
    iconClass: string;
    name: keyof typeof permissions;
    classChecked: string;
    toltip: string;
  }[] = [
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
      toltip: "agregar",
    },
    {
      iconClass: "ri-pencil-fill",
      name: "modify",
      classChecked: "bg-yellow-500",
      toltip: "editar",
    },
    {
      iconClass: "ri-delete-bin-5-fill",
      name: "delete",
      classChecked: "bg-red-500",
      toltip: "eliminar",
    },
  ];

  return (
    <div className="flex items-center">
      <SwitchComponent
        iconClass="ri-check-double-fill" // Icono para "Todos"
        classChecked="bg-purple-500" // Color para "Todos"
        checked={Object.values(permissions).every(Boolean)} // Marca "Todos" si todos están seleccionados
        onChange={handleSelectAllChange}
      />
      {permissionsList.map((perm) => (
        // <Tooltip content={perm.toltip}>
        <Tooltip content={perm.toltip}>

        <SwitchComponent
          key={perm.name}
          iconClass={perm.iconClass}
          classChecked={perm.classChecked}
          checked={permissions[perm.name]}
          onChange={handleCheckboxChange(perm.name)}
        />
        </Tooltip>
      ))}
    </div>
  );
};

export default CheckboxGroup;

export const PermissionComponent: React.FC = () => {
  const [value, setvalue] = useState<string>("");
  const context = useContext(ContextUsers);
  if (!context) {
    throw new Error(
      "SomeChildComponent must be used within a ContextUsers.Provider"
    );
  }
  const { users } = context;

  return (
    <div className="row ">
      <div className="col-12 text-center bg-gradient-to-r from-cyan-300 to-cyan-500 text-white mb-2 rounded-lg shadow-lg py-2 mx-1 px-4">
  <span className="font-semibold">NESTOR JOSUE PUENTES INCHA


</span>
</div>

      <div className="col-12 col-md-3 ">
        <ListComponent
          titleItem="fullname"
          otherItems={['departamento.group']}
          addIcon={<></>}
          title={"selecciona al usuario"}
          filter
          button
          data={users}
          loading={false}
          buttons={({}) => (
            <>
 <Tooltip content="Seleccionar">
  <button className="flex items-center bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-medium py-1 px-3 rounded-full shadow-md hover:from-cyan-500 hover:to-cyan-700 transition duration-300 ease-in-out transform hover:scale-105 text-sm">
    <i className="ri-check-fill mr-1 text-lg"></i>
  </button>
</Tooltip>




            </>
          )}
        />
      </div>

      <div className="col-12 col-md-9 overflow-auto max-h-96 bg-white p-4 rounded-lg shadow">
        {data.map((item) => (
          <ListComponent
            titleItem="Name"
            addIcon={
              <>
                <Tooltip content="Añadir todo">
                  <button className="ml-2 bg-gradient-to-r rounded-full from-cyan-500 to-cyan-500 hover:from-cyan-600 hover:to-cyan-600 text-white font-semibold  py-1 px-3 shadow-lg border-2 border-transparent hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <i className="ri-arrow-right-double-fill"></i>
                  </button>
                </Tooltip>
              </>
            }
            title={item.title}
            filter
            button
            data={item.subitems}
            loading={false}
            buttons={({}) => (
              <>
                <CheckboxGroup />
              </>
            )}
          />
        ))}
      </div>
    </div>
  );
};
