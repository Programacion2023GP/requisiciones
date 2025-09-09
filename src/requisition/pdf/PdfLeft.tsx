import { Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import React from "react";
const tw = createTw({});

type DataPdf = {
  products: Array<Record<string, any>>;
  pdfData: Record<string, any>;
};
const PdfLeft: React.FC<DataPdf> = ({ products, pdfData }) => {
  return (
    <View style={tw("w-1/2 border-r h-full py-2 relative")}>
      <Text style={tw("text-xs font-bold w-full text-center")}>
        Requisición de compra
      </Text>
      {[
        {
          key: "Fecha de impresión",
          value: new Date().toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        },
        {
          key: "IdRequisición",
          value: pdfData?.IDRequisicion,
        },
        {
          key: "Orden C.",
          value: pdfData?.Orden_Compra,
        },
        {
          key: "C. Costos",
          value:
            pdfData?.Nombre_CC > 0
              ? pdfData?.Nombre_CC
              : localStorage.getItem("role") == "CAPTURA"
                ? localStorage.getItem("centro_costo")
                : "",
        },
        {
          key: "Fecha de Asignación",
          value: pdfData?.FechaAsignacion
            ? `${new Date(pdfData.FechaAsignacion).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}`
            : "",
        },
        ,
        {
          key: "Aplicación",
          value: "",
        },
      ].map((it, index) => (
        <View key={index} style={tw("flex flex-row")}>
          <View
            style={tw(
              "flex items-center justify-center border-2 border-black ml-4 mt-1"
            )}
          >
            <Text style={tw("text-sm font-medium")}>{it?.key}</Text>
          </View>
          <View style={tw("ml-2 flex items-center justify-center")}>
            <Text style={tw("text-sm")}>{it?.value}</Text>
          </View>
        </View>
      ))}
      <View style={tw("mx-3")}>
        <View style={tw("flex flex-row mt-4 border-2 w-full justify-between")}>
          <Text style={tw("text-sm text-center")}>Cantidad</Text>
          <Text style={tw("text-sm text-center")}>Descripción</Text>
          <Text style={tw("text-sm text-center")}></Text>
        </View>
      </View>
      {products &&
        products.map((producto, index) => (
          <View
            key={index}
            style={tw(`flex flex-row py-3 w-full justify-between`)}
          >
            <Text
              style={tw("w-1/4 text-sm text-gray-800 text-center text-wrap")}
            >
              {producto.Cantidad}
            </Text>
            <Text style={tw("w-1/2 text-sm text-gray-800 text-end text-wrap")}>
              {producto.Descripcion}
            </Text>
            {/* <Text
                            style={tw("w-1/4 text-sm text-gray-800 text-center text-right")}
                          >
                            {producto.ClavePresupestal}
                          </Text> */}
          </View>
        ))}
      <View style={tw("mt-auto border-2 border-black mx-3 mb-20 pt-2")}>
        <Text style={tw("text-sm font-bold")}>Observaciones:</Text>
        <Text style={tw("text-sm")}>{pdfData?.Observaciones}</Text>
      </View>
      <View style={tw("mx-3 ")}>
        <Text style={tw("text-sm")}>{/* Firma */}</Text>
      </View>
    </View>
  );
};
export default PdfLeft;
