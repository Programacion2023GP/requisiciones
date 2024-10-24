import React, { useEffect, useMemo, useState } from "react";
import { ListInterface, ItemInterface } from "./ListInterface"; // Asegúrate de que la ruta sea correcta
import { InputComponent } from "../input/InputComponent";

export const ListComponent = ({
  title,
  button,
  filter,
  data = [],
  buttons,
  reload,
  addIcon,
  loading = false,
  iconItem,
  subtitleItem,
  titleItem,
  otherItems = [],
  selected="",
}: ListInterface) => {
  useEffect(()=>{
    console.log("aquiiiiiii",selected)
  },[selected])
  const [value, setvalue] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 5;
  useEffect(() => {}, [data]);
  const options = useMemo(() => {
    const normalizedSearchTerm = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    const containsNormalizedTerm = (prop: any) => {
      if (typeof prop === "object" && prop !== null) {
        return Object.values(prop).some(containsNormalizedTerm);
      } else {
        const normalizedProp = String(prop)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "")
          .toLowerCase();

        return normalizedProp.includes(normalizedSearchTerm);
      }
    };

    return data.filter((item) => {
      return Object.values(item).some(containsNormalizedTerm);
    });
  }, [value, data]);

  // Calcular los elementos que deben mostrarse en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = options.slice(indexOfFirstItem, indexOfLastItem);

  // Total de páginas
  const totalPages = Math.ceil(options.length / itemsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
              {reload && (
                <button className="mr-4">
                  <i className="ri-restart-line ri-2x"></i>
                </button>
              )}
              <div className="flex-1">
                <InputComponent
                  label="buscador"
                  value={value}
                  setValue={setvalue}
                />
              </div>
              <div className="flex-2">{addIcon}</div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <div className="flex max-h-[400px] w-full flex-col overflow-y-auto">
            {loading && <>cargandooooooooooo .....................</>}

            {currentItems.map((item, index) => (
              <ItemComponent
                otherItems={otherItems}
                key={index}
                item={item}
                titleItem={titleItem}
                iconItem={iconItem}
                subtitleItem={subtitleItem}
                buttons={buttons}
                selected={selected}
              />
            ))}
          </div>
        </div>

        {/* Paginación */}
        {data.length > itemsPerPage && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:border-gray-100 disabled:text-gray-300"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 rounded-full border transition-all duration-200 ${
                  currentPage === i + 1
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-3 py-1 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:border-gray-100 disabled:text-gray-300"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente ItemComponent
export const ItemComponent: React.FC<ItemInterface> = ({
  buttons,
  iconItem,
  id,
  loading,
  subtitleItem,
  titleItem,
  item,
  otherItems = [],
  selected="",

}) => {
  const getNestedValue = (
    obj: Record<string, any>,
    key: string
  ): string | null => {
    const value = key.split(".").reduce((o, k) => (o || {})[k], obj);
    return value !== undefined && value !== null ? String(value) : null; // Retorna null si el valor no es válido
  };
useEffect(()=>{
  console.log("s",selected)
},[selected])
  return (
    <div className={`group flex items-center gap-x-5 rounded-md px-2.5 py-2 transition-all duration-75 ${selected ===getNestedValue(item, titleItem) && 'bg-cyan-100'}`}>
      {iconItem && (
        <div className="flex h-12 w-12 items-center rounded-lg bg-gray-200 text-black group-hover:bg-green-200">
          <span className="tag w-full text-center text-2xl font-medium text-gray-700 group-hover:text-green-900">
            {item.iconItem}
          </span>
        </div>
      )}
      <div className="flex flex-col items-start justify-between font-light text-gray-600">
        <p className="text-[15px] ">{getNestedValue(item, titleItem)}</p>

        {subtitleItem && (
          <span className="text-sm font-light text-gray-400">
            {getNestedValue(item, subtitleItem)}
          </span>
        )}
        <div className="flex flex-col space-y-2">
          {" "}
          {/* Contenedor Flexbox */}
          {otherItems.map((otherItem, index) => (
            <div
              key={index}
              className="text-xs font-light text-gray-400 flex items-center"
            >
              {" "}
              {/* Flex para cada item */}
              {getNestedValue(item, otherItem)}
            </div>
          ))}
        </div>
      </div>
      <div className="ml-auto flex gap-x-2">{buttons && buttons(item)} </div>
    </div>
  );
};
