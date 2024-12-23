import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import ModalComponent from "../../components/modal/Modal";
import Observable from "../../extras/observable";
import Typography from "../../components/typografy/Typografy";
import InputComponent from "../../components/form/Input";
import { customLog } from "../../extras/consoles";
import { AxiosRequest } from "../../axios/Axios";
import { showToast } from "../../sweetalert/Sweetalert";
import { useMutation } from "@tanstack/react-query";

type AutorizedType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setReloadTable: Dispatch<SetStateAction<boolean>>;

};

const AutorizedComponent: React.FC<AutorizedType> = ({ open, setOpen,setReloadTable }) => {
  const data = Observable().ObservableGet("autorizadoresSelect");
  const idRequisition = Observable().ObservableGet("IdRequisicion") as { id: number};
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
    onMutate(variables) {
      setReloadTable(false);
    },
    onSuccess: (data) => {
      setReloadTable(true);
  
      showToast(data.message, data.status);
      setOpen(false);

    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Error al realizar la acción",
        "error"
      );
    },
  });
  // Estado para el texto de búsqueda
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Array<Record<string, any>>>([]);

  const SelectRequisitor = (item: Record<string, any>) => {
    mutation.mutate({
      url: "/requisiciones/asignedAutorized",
      method: "POST",
      data: {
        id: idRequisition.id,
        Usuario: item.Usuario,
      },
    });
  };

  const filteredAutorizadores = (text: string = ""): Array<Record<string, any>> => {
    if (
      typeof data === "object" &&
      data !== null &&
      "autorizadores" in data &&
      Array.isArray(data.autorizadores)
    ) {
      return data.autorizadores.filter((item: any) =>
        item.NombreCompleto.toLowerCase().includes(text.toLowerCase())
      );
    }
    return [];
  };

  // Efecto para actualizar la lista filtrada cuando el texto de búsqueda cambie
  useEffect(() => {
    setFilteredData(filteredAutorizadores(searchText));
  }, [searchText, data]);

  return (
    <ModalComponent
      title="Asignacion de autorizador"
      open={open}
      setOpen={setOpen}
    >
     

      {/* Input para buscar */}
      <div className="mt-4 pt-4 pr-4 overflow-y-auto ">
      <InputComponent
      
        label="Buscador"
        name="Buscador"
        value={searchText}
        suscribeValue={(searchText: string) => {
          setSearchText(searchText);  // Actualiza el estado con el texto de búsqueda
        }}
      />

      {/* Lista filtrada de autorizadores */}
      <ul className="space-y-2">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <li
              className="w-full bg-white p-4 shadow-md rounded-lg flex items-center gap-3 transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-blue-50 cursor-pointer"
              key={index}
              onClick={() => {
                SelectRequisitor(item);
              }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {item.NombreCompleto[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-semibold text-lg">
                  {item.NombreCompleto}
                </p>
                <p className="text-gray-500 text-sm">
                  Seleccionar como autorizador
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="w-full text-center text-gray-500">No se encontraron resultados.</li>
        )}
      </ul>
      </div>
    </ModalComponent>
  );
};

export default AutorizedComponent;
