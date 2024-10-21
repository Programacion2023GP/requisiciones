import { useState } from "react";
import { ListComponent } from "../../components/list/ListComponent";
import { InputComponent } from "../../components/input/InputComponent";
import Tooltip from "../../components/toltip/Toltip";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];



interface SwitchButtonProps {
  iconClass: string;
  checked: boolean;
  classChecked: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // Hacer label opcional
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  iconClass,
  checked,
  onChange,
  classChecked,
  label,
}) => (
  <label className="flex items-center cursor-pointer mx-1">
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <span
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition duration-200 
                  ${checked ? classChecked : 'bg-gray-300'}`}
    >
      <span
        className={`absolute left-1 bg-white w-4 h-4 rounded-full transition transform duration-200 
                    ${checked ? 'translate-x-full' : ''}`}
      />
      <i
        className={`absolute text-xs text-white transition duration-200 z-10`} // Añadir z-index
        style={{
          left: checked ? '0.2rem' : 'calc(100% - 1rem)', // Mover el icono al lado opuesto
          top: '50%', // Centrar verticalmente
          transform: 'translateY(-50%)', // Centrar verticalmente
        }}
      >
        <i className={iconClass}></i>
      </i>
    </span>
    {label && <span className="ml-2 text-white">{label}</span>}
  </label>
);

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

  const handleCheckboxChange = (name: keyof typeof permissions) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [name]: event.target.checked,
    }));
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setPermissions({
      read: isChecked,
      add: isChecked,
      modify: isChecked,
      delete: isChecked,
    });
  };

  const permissionsList: { iconClass: string; name: keyof typeof permissions; classChecked: string,toltip:string }[] = [
    { iconClass: 'ri-eye-fill', name: 'read', classChecked: 'bg-green-500',toltip:"Leer" },
    { iconClass: 'ri-add-fill', name: 'add', classChecked: 'bg-blue-500',toltip:"agregar" },
    { iconClass: 'ri-pencil-fill', name: 'modify', classChecked: 'bg-yellow-500',toltip:"editar" },
    { iconClass: 'ri-delete-bin-5-fill', name: 'delete', classChecked: 'bg-red-500',toltip:"eliminar" },
  ];

  return (
    <div className="flex items-center">
      <SwitchButton
        iconClass="ri-check-double-fill" // Icono para "Todos"
        classChecked="bg-purple-500" // Color para "Todos"
        checked={Object.values(permissions).every(Boolean)} // Marca "Todos" si todos están seleccionados
        onChange={handleSelectAllChange}
      />
      {permissionsList.map((perm) => (
        // <Tooltip content={perm.toltip}>

        <SwitchButton
          key={perm.name}
          iconClass={perm.iconClass}
          classChecked={perm.classChecked}
          checked={permissions[perm.name]}
          onChange={handleCheckboxChange(perm.name)}
          />
          // </Tooltip>
      ))}
    </div>
  );
};

export default CheckboxGroup;



export const PermissionComponent: React.FC = () => {
  const [value, setvalue] = useState<string>("");

  return (
    <div className="row">
      <div className="col-6 overflow-auto max-h-96 bg-white p-4 rounded-lg shadow">
      <div className="mb-2">
      <InputComponent
                  label="buscador por secciones"
                  value={value}
                  setValue={setvalue}
                  />
      </div>
        {items.map((item) => (
          <ListComponent
            addIcon={
              <>
              <Tooltip content="Añadir todo">

                <button
                  className="ml-2 bg-gradient-to-r rounded-full from-cyan-500 to-cyan-500 hover:from-cyan-600 hover:to-cyan-600 text-white font-semibold  py-1 px-3 shadow-lg border-2 border-transparent hover:border-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <i className="ri-arrow-right-double-fill"></i>
                </button>

              </Tooltip>
              </>
            }
            title="seccion 1"
            filter
            button
            data={[{ Name: "Leer" },{ Name: "Leer" },{ Name: "Leer" }]}
            loading={false}
            buttons={({}) => (
              <>
              <CheckboxGroup/>
              
              {/* <button
  onClick={handleClick}
  className="flex items-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-500 px-2 py-1 text-white transition duration-200 hover:from-cyan-600 hover:to-cyan-600 shadow-lg transform hover:scale-105"
>
  <i className="ri-arrow-right-double-fill text-xs"></i> 
</button> */}

              </>
            )}
          />
        ))}
      </div>
      <div className="col-6">
      <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="font-semibold text-gray-700">Sección 1</h3>
        <div className="flex items-center mt-2">
          <span className="mr-2 text-gray-600">Permisos:</span>
          <Tooltip content="Leer">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 transition duration-200 mr-2">
              <i className="ri-eye-fill text-white text-sm"></i>
            </div>
          </Tooltip>
          <Tooltip content="Agregar">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 transition duration-200 mr-2">
              <i className="ri-add-fill text-white text-sm"></i>
            </div>
          </Tooltip>
          <Tooltip content="Editar">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 transition duration-200 mr-2">
              <i className="ri-pencil-fill text-white text-sm"></i>
            </div>
          </Tooltip>
          <Tooltip content="Eliminar">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 transition duration-200 mr-2">
              <i className="ri-delete-bin-5-fill text-white text-sm"></i>
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="font-semibold text-gray-700">Sección 2</h3>
        <div className="flex items-center mt-2">
          <span className="mr-2 text-gray-600">Permisos:</span>
          <Tooltip content="Leer">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 transition duration-200 mr-2">
              <i className="ri-eye-fill text-white text-sm"></i>
            </div>
          </Tooltip>
          <Tooltip content="Agregar">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 transition duration-200 mr-2">
              <i className="ri-add-fill text-white text-sm"></i>
            </div>
          </Tooltip>
          <Tooltip content="Editar">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 transition duration-200 mr-2">
              <i className="ri-pencil-fill text-white text-sm"></i>
            </div>
          </Tooltip>
          <Tooltip content="Eliminar">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 transition duration-200 mr-2">
              <i className="ri-delete-bin-5-fill text-white text-sm"></i>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
</div>




    </div>
  );
};
