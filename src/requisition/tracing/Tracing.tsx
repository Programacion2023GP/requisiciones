import React from "react";
import ModalComponent from "../../components/modal/Modal";
import Observable from "../../extras/observable";
import { PdfRequisitionType } from "../details/DetailsRequisition";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";

const timelineIcons = {
  Captura: <FaCheckCircle className="text-blue-500 w-6 h-6" />,
  Autorización: <FaClock className="text-green-500 w-6 h-6" />,
  Asignación: <FaCheckCircle className="text-purple-500 w-6 h-6" />,
  Cotización: <FaCheckCircle className="text-orange-500 w-6 h-6" />,
  "Orden de compra": <FaCheckCircle className="text-teal-500 w-6 h-6" />,
};

export type Requisition = {
  IDRequisicion:number,
  UsuarioCaptura: string | null;
  FechaCaptura: string | null;
  UsuarioAU: string | null;
  FechaAutorizacion: string | null;
  UsuarioAS: string | null;
  FechaAsignacion: string | null;
  UsuarioCO: string | null;
  FechaCotizacion: string | null;
  UsuarioOC: string | null;
  FechaOrdenCompra: string | null;
  Status: string | null;
  Motivo_Cancelacion?:string,
};

type DataT = {
  data: Requisition;
};

type DataTracing = {
  data: DataT;
};

type LineTime = {
  title: string;
  date: string ;
  autor: string | null;
};

const LineTimeComponent: React.FC<LineTime> = ({ title, autor, date }) => {
//   const icon = timelineIcons[title] || <FaCheckCircle className="text-gray-400 w-6 h-6" />;
const d = new Date(date).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
  return (
    <div className="flex items-start space-x-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 shadow">
        {/* {icon} */}
      </div>
      <div className="bg-white rounded-lg shadow p-4 w-full border-l-4 border-blue-500">
        <p className="text-lg font-bold text-gray-800 mb-2">{title}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Fecha:</span> {  d || "Sin fecha"}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Autor:</span> {autor || "Desconocido"}
        </p>
      </div>
    </div>
  );
};

const TracingComponent: React.FC<PdfRequisitionType> = ({ open, setOpen }) => {
  const item = Observable().ObservableGet("tracingRequisition") as DataTracing;
  const { data } = item;

  const timeline = [
    { title: "Captura", autor: data.data.UsuarioCaptura, date: data.data.FechaCaptura },
    { title: "Autorización", autor: data.data.UsuarioAU, date: data.data.FechaAutorizacion },
    { title: "Asignación", autor: data.data.UsuarioAS, date: data.data.FechaAsignacion },
    { title: "Cotización", autor: data.data.UsuarioCO, date: data.data.FechaCotizacion },
    { title: "Orden de compra", autor: data.data.UsuarioOC, date: data.data.FechaOrdenCompra },
    { title: "Motivo de cancelacion", autor: "", date: data.data.Motivo_Cancelacion },

  ];

  return (
    <ModalComponent open={open} setOpen={setOpen} title="Seguimiento de Requisición">
      <div className="p-6 space-y-6">
        {timeline.map((item, index) => {
            if (item.autor ==null &&item.date == null) {
                return null;
            }
            else if (item.date){
                return (

                    <LineTimeComponent key={index} title={item.title} autor={item.autor} date={item.date} />
                  )
            }
        })}
      </div>
    </ModalComponent>
  );
};

export default TracingComponent;
