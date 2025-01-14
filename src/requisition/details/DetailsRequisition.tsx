import React from "react";
import ModalComponent from "../../components/modal/Modal";
import Observable from "../../extras/observable";

type PdfRequisitionType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Requisition = {
  requisicion: Record<string, any>;
  details: Array<Record<string, any>>;
};

type ResponseData = {
  data: {
    data: Requisition;
  };
};

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const formattedDate = new Date(date).toLocaleDateString("es-ES", options);
  return formattedDate;
};

const DetailsRequisition: React.FC<PdfRequisitionType> = ({ open, setOpen }) => {
  const data = Observable().ObservableGet("IdRequisicion") as ResponseData;
  const requisition = data?.data?.data.requisicion;
  const products = data?.data?.data.details;

  return (
    <ModalComponent open={open} setOpen={setOpen} title="Detalles de Requisición">
      <div className="space-y-6 p-6 bg-gray-50 rounded-lg shadow-lg">
        {requisition ? (
          <>
            {/* Sección de la requisición */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-800 text-white p-6 rounded-lg mb-6 shadow-xl">
              <h3 className="text-3xl font-bold">{`Requisición #${requisition.IDRequisicion}`}</h3>
              <span className="text-xl font-medium opacity-80">{`Ejercicio: ${requisition.Ejercicio}`}</span>
            </div>

            {/* Detalles de la requisición */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 shadow-lg p-2 border-2 border-gray-300 border-r-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Solicitante</span>
                <span className="text-lg font-medium text-gray-800">{requisition.Solicitante}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Departamento</span>
                <span className="text-lg font-medium text-gray-800">{requisition.Nombre_Departamento}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Fecha Captura</span>
                <span className="text-lg font-medium text-gray-800">{formatDate(requisition.FechaCaptura)}</span>
              </div>
          
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Proveedor Seleccionado</span>
                <span className="text-lg font-medium text-gray-800">{requisition.proveedorSel || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Responsable de Compras</span>
                <span className="text-lg font-medium text-gray-800">{requisition.Responsable_Compras}</span>
              </div>
            </div>

            {/* Productos y detalles */}
            <div className="space-y-6 mt-6">
              <h4 className="text-xl font-semibold text-gray-700">Productos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
                  >
                    <h5 className="text-lg font-semibold text-gray-800">{item.Descripcion}</h5>
                    <p className="text-sm text-gray-600">{`Cantidad: ${item.Cantidad}`}</p>
                   
                  </div>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800">Observaciones</h4>
              <p className="text-base text-gray-600">
                {requisition.Observaciones || "No hay observaciones para esta requisición."}
              </p>
            </div>

            {/* Otros Proveedores */}
          
          </>
        ) : (
          <div className="text-center text-gray-600 text-xl">
            No se encontraron detalles de la requisición.
          </div>
        )}
      </div>
    </ModalComponent>
  );
};

export default DetailsRequisition;
