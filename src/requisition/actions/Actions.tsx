import React, { useEffect, useState } from "react";
import Button from "../../components/form/Button";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { MdCancel } from "react-icons/md";
import Tooltip from "../../components/toltip/Toltip";

const Actions: React.FC<{ data: Record<string, any> }> = ({ data }) => {
  const permisosString = localStorage.getItem("permisos") ?? "{}"; // Valor predeterminado: objeto vacío
  const permisos = JSON.parse(permisosString); // Convertir el string a un objeto
  const [autorized, SetAutorized] = useState(false);

  const newStatus = (status: string): string => {
    let state = "";
    switch (status) {
      case "CA":
        state = "AU";
        break;
      case "AU":
        state = "AS";
        break;
      case "AS":
        state = "CO";
        break;
      case "CO":
        state = "OC";
        break;
      case "OC":
        state = "SU";
        break;
    }
    return state;
  };
  const Autorized = (permission: string): boolean => {
    const depencePermissions: { [key: string]: string } = {
      Permiso_Autorizar: "AU",
      Permiso_Asignar: "AS",
      Permiso_Cotizar: "CO",
      Permiso_Orden_Compra: "OC",
      Permiso_Surtir: "SU",
    };
    
    return Object.entries(depencePermissions).some(
      ([key, value]) => value === permission && permisos[key] === 1
    );
  };
  useEffect(() => {
    SetAutorized(Autorized(newStatus(data.Status)));
  }, [data]);
  return (
    <div className="flex flex-row gap-1">
      {newStatus(data.Status) !== "CA" &&
        newStatus(data.Status) !== "SU" &&
        autorized && (
          <Tooltip
            content={`Cambiar status de ${data.Status} a ${newStatus(data.Status)}`}
          >
            <div
              onClick={() => {
                alert(newStatus(data.Status));
              }}
              className="w-fit flex flex-row gap-2 items-center shadow-md  bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500  rounded-xl  hover:shadow-lg focus:ring-4 text-sm py-2 px-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2  "
            >
              <span>{data.Status}</span>
              <LiaExchangeAltSolid className="text-whitecursor-pointer" />
              <span>{newStatus(data.Status)}</span>
            </div>
          </Tooltip>
        )}
      {data.Status !== "SU" && (
        <div className="w-fit">
          <Tooltip content="Cancelar">
            <Button color="red" variant="solid" size="small">
              <MdCancel />
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default Actions;
