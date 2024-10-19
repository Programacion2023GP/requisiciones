import React, { useEffect, useMemo, useState } from "react";
import { ListInterface, ItemInterface } from "./ListInterface"; // Asegúrate de que la ruta sea correcta
import { InputComponent } from "../input/InputComponent";

export const ListComponent = ({
  title,
  button,
  filter,
  data,
  buttons,
  reload,
  addIcon,
  loading= false,
}: ListInterface) => {
  const [value, setvalue] = useState("");
  
  const options = useMemo(() => {
    const normalizedSearchTerm = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    return data.filter((item) =>
      Object.values(item).some((prop) =>
        String(prop)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "")
          .toLowerCase()
          .includes(normalizedSearchTerm)
      )
    );
  }, [value, data]);

  return (
    <div className="flex mb-2 w-full flex-col gap-y-2">
      <div className="w-full rounded-xl border border-gray-200 bg-white py-4 px-2 shadow-md shadow-gray-100">
        <div className="flex items-center justify-between px-2 text-base font-medium text-gray-700">
          <div>{title}</div>
          <div>{button}</div>
        </div>
        {filter && (
          <div className="mt-3">
            <div className="flex items-center">
              <button className="mr-4">
                <i className="ri-restart-line ri-2x"></i>
              </button>
              <div className="flex-1">
                <InputComponent
                  label="buscador"
                  value={value}
                  setValue={setvalue}
                  />
              </div>
              <div className="flex-2">

              {addIcon}
              </div>

            </div>
          </div>
        )}
        <div className="mt-4">
          <div className="flex max-h-[400px] w-full flex-col overflow-y-auto">
            {loading && <>cargandooooooooooo .....................</>}

            {options.map((item, index) => (
              <ItemComponent key={index} item={item} buttons={buttons} /> // Pasando el item
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente ItemComponent
export const ItemComponent = <T extends ItemInterface>({
  item,
  buttons,
}: {
  item: T;
  buttons?: (item: T) => React.ReactNode;
}) => {
  return (
    <div className="group flex items-center gap-x-5 rounded-md px-2.5 py-2 transition-all duration-75 hover:bg-green-100">
      <div className="flex h-12 w-12 items-center rounded-lg bg-gray-200 text-black group-hover:bg-green-200">
        <span className="tag w-full text-center text-2xl font-medium text-gray-700 group-hover:text-green-900">
          {item.Avatar}{" "}
          {/* Suponiendo que el item tiene la propiedad 'avatar' */}
        </span>
      </div>
      <div className="flex flex-col items-start justify-between font-light text-gray-600">
        <p className="text-[15px]">
          {item.Name} {/* Suponiendo que el item tiene la propiedad 'name' */}
        </p>
        <span className="text-xs font-light text-gray-400">
          {item.Departamento}{" "}
          {/* Suponiendo que el item tiene la propiedad 'departamento' */}
        </span>
      </div>
      <div className="ml-auto flex gap-x-2">
        {buttons && buttons(item)}{" "}
        {/* Usando la función para renderizar botones */}
      </div>
    </div>
  );
};
