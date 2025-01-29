import { Text, View } from "@react-pdf/renderer";
import React from "react";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({});

type TypeProvedor = {
  producto: Record<string, any>;
  index: number;
};

type DataPdf = {
  products: Array<Record<string, any>>;
  pdfData: Record<string, any>;

};

export const ProvedorInfo: React.FC<TypeProvedor> = ({ producto, index }) => {
  return (
    <View style={tw("text-sm text-wrap px-1  w-1/3 max-w-1/3")}>
      <Text style={tw("text-wrap h-20   overflow-hidden")}>
        {producto?.[`Proveedor${index}`] || ""}
      </Text>
      <View style={tw("w-full flex flex-row")}>
        <View style={tw("border-2 border-gray-500 w-1/2")}>
          <Text>Unitario</Text>
        </View>
        <View style={tw("border-2 border-gray-500 w-1/2")}>
          <Text>Importe</Text>
        </View>
      </View>
      <View style={tw("w-full flex flex-row")}>
        <View style={tw("flex flex-col w-1/2")}>
          <Text>Precio</Text>
          <Text>I.V.A.</Text>
          <Text>Total C/IVA</Text>
          <Text>Retenciones</Text>
        </View>
        <View style={tw("flex flex-col w-1/2 text-start ml-2")}>
          <Text style={tw("text-wrap max-w-full")}>
            {producto?.[`PrecioUnitarioSinIva${index}`] || ""}
          </Text>
          <Text style={tw("text-wrap max-w-full")}>
            {producto?.[`ImporteIva${index}`] || ""}
          </Text>
          <Text style={tw("text-wrap max-w-full")}>
            {producto?.[`PrecioUnitarioConIva${index}`] || ""}
          </Text>
          <Text style={tw("text-wrap max-w-full")}>
            {producto?.[`Retenciones${index}`] || ""}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const PdfRight: React.FC<DataPdf> = ({ pdfData,products }) => {
  const observaciones = pdfData?.ObservacionesCot || "";

  return (
    <View style={tw("w-1/2 max-w-1/2")}>
      {["Uso Exclusivo de Compras", "Provedores"].map((title, idx) => (
        <View key={idx} style={tw("mx-3")}>
          <View style={tw("flex flex-row mt-1 border-2 w-full justify-center")}>
            <Text style={tw("text-sm font-bold")}>{title}</Text>
          </View>
        </View>
      ))}

      <View wrap style={tw("flex flex-wrap w-full max-w-full overflow-auto px-2")}>
        {products.map((producto, idx) => (
      <View key={idx} style={tw("w-full flex flex-row mb-4 border-b-2 border-dashed border-black pb-1")}>
      {[1, 2, 3].map((index) => (
        <ProvedorInfo key={index} producto={producto} index={index} />
      ))}
    </View>
    
        ))}
      </View>

      <View style={tw("mt-auto border-2 border-black mx-3 mb-20 pt-2")}>
        <Text style={tw("text-sm font-bold")}>Observaciones:</Text>
        <Text style={tw("text-sm text-wrap")}>{observaciones}</Text>
      </View>
    </View>
  );
};
