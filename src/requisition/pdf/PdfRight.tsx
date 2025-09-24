import { Image, Text, View } from "@react-pdf/renderer";
import React from "react";
import { createTw } from "react-pdf-tailwind";
import { images, styles } from "../../constants";
import { formatCurrency } from "../../utils/functions";

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
      <View
         style={tw(
            `text-sm text-wrap px-1 w-1/3 max-w-1/3 ${producto.Proveedor != null && producto.Proveedor == producto?.[`Proveedor${index}`] && "bg-slate-400 rounded-md"} `,
         )}>
         <Text style={tw("text-wrap h-16 overflow-hidden")}>
            {producto?.[`Proveedor${index}`] || ""}
         </Text>
         <View style={tw("w-full flex flex-row -mt-1.5 gap-1 mb-2")}>
            <View style={tw(`${styles.pdf.box} w-1/2`)}>
               <Text>Unitario</Text>
            </View>
            <View style={tw(`${styles.pdf.box} w-1/2`)}>
               <Text>Importe</Text>
            </View>
         </View>
         <View style={tw("w-full flex flex-row")}>
            <View style={tw("flex flex-col w-1/2")}>
               <Text style={tw(styles.pdf.textKey)}>Precio</Text>
               <Text style={tw(styles.pdf.textKey)}>I.V.A.</Text>
               <Text style={tw(styles.pdf.textKey)}>Total C/IVA</Text>
               <Text style={tw(styles.pdf.textKey)}>Retenciones</Text>
            </View>
            <View style={tw("flex flex-col w-1/2 text-start ml-2")}>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(
                     producto?.[`PrecioUnitarioSinIva${index}`],
                     true,
                     false,
                  ) || ""}
               </Text>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(
                     producto?.[`ImporteIva${index}`],
                     true,
                     false,
                  ) || ""}
               </Text>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(
                     producto?.[`PrecioUnitarioConIva${index}`],
                     true,
                     false,
                  ) || ""}
               </Text>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(
                     producto?.[`Retenciones${index}`],
                     true,
                     false,
                  ) || ""}
               </Text>
            </View>
         </View>
      </View>
   );
};

export const PdfRight: React.FC<DataPdf> = ({ pdfData, products }) => {
   const observaciones = pdfData?.ObservacionesCot || "";

   return (
      <View style={tw("w-1/2 max-w-1/2")}>
         {["Uso Exclusivo de Compras", "Provedores"].map((title, idx) => (
            <View key={idx} style={tw("mx-3")}>
               <View style={tw(`${styles.pdf.box} flex-row mt-1 w-full`)}>
                  <Text style={tw(`${styles.pdf.text}`)}>{title}</Text>
               </View>
            </View>
         ))}

         <View
            wrap
            style={tw("flex flex-wrap w-full max-w-full overflow-auto px-2")}>
            {products.map((producto, idx) => (
               <View
                  key={idx}
                  style={tw(
                     "w-full flex flex-row mb-4 border-b-2 border-dashed border-black pb-1",
                  )}>
                  {[1, 2, 3].map((index) => (
                     <ProvedorInfo
                        key={index}
                        producto={producto}
                        index={index}
                     />
                  ))}
               </View>
            ))}
            <View style={tw("w-full flex flex-row -mt-1.5 gap-1 mb-2")}>
               {[1, 2, 3].map((i) => (
                  <>
                     <View style={tw(`w-1/2`)}>
                        <Text
                           style={tw(
                              `${styles.pdf.textKey} text-wrap max-w-full`,
                           )}>
                           T. Prov{i}:
                        </Text>
                     </View>
                     <View style={tw(`w-1/2`)}>
                        <Text
                           style={tw(
                              `${styles.pdf.textVal} text-wrap max-w-full`,
                           )}>
                           {formatCurrency(
                              products.reduce((total, producto) => {
                                 return (
                                    total +
                                    (Number(
                                       producto?.[`PrecioUnitarioConIva${i}`],
                                    ) || 0)
                                 );
                              }, 0),
                              true,
                              false,
                           ) || ""}
                        </Text>
                     </View>
                  </>
               ))}
            </View>
         </View>

         <View
            style={tw(
               `${styles.pdf.box} mt-auto mx-3 mb-20 pt-2 justify-start text-wrap`,
            )}>
            <Text style={tw("text-sm font-bold")}>Observaciones:</Text>
            <Text style={tw("text-sm text-wrap")}>{observaciones}</Text>
         </View>

         {/* FIRMA */}
         <View style={tw(styles.pdf.firmContainer)}>
            <Image
               style={tw(styles.pdf.firma)}
               src={images.firmaDirectorCompras}
            />
         </View>
      </View>
   );
};
