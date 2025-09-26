import { Image, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import React from "react";
import { styles } from "../../constants";
const tw = createTw({});

type DataPdf = {
   products: Array<Record<string, any>>;
   pdfData: Record<string, any>;
};
const PdfLeft: React.FC<DataPdf> = ({ products, pdfData }) => {
   return (
      <View style={tw("w-1/2 border-r h-full py-2 relative")}>
         <Text
            style={tw(`${styles.pdf.subtitle} font-bold w-full text-center`)}>
            Requisición de compra
         </Text>
         {/* DATOS DE REQUISICION */}
         <View style={tw("px-2 gap-1")}>
            <View style={tw("flex flex-row w-full bg-presidencia-500")}>
               {/* Fecha Impresion */}
               <View style={tw("flex flex-row w-2/3")}>
                  <View style={tw(`${styles.pdf.box} `)}>
                     <Text style={tw(`${styles.pdf.textKey}`)}>
                        Fecha Impresión
                     </Text>
                  </View>
                  <View
                     style={tw(
                        "ml-2 text-wrap flex  items-center justify-center",
                     )}>
                     <Text style={tw(`${styles.pdf.textVal} text-wrap`)}>
                        {new Date(pdfData?.FechaCaptura).toLocaleDateString(
                           "es-ES",
                           {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                           },
                        )}
                     </Text>
                  </View>
               </View>
               {/* Key Fecha Asignación */}
               <View style={tw("flex flex-row w-1/3")}>
                  <View style={tw(`${styles.pdf.box} w-full`)}>
                     <Text style={tw(`${styles.pdf.textKey}`)}>
                        Fecha Asignación
                     </Text>
                  </View>
               </View>
            </View>

            <View style={tw("flex flex-row w-full")}>
               {/* IDRequisicion */}
               <View style={tw("flex flex-row w-2/3")}>
                  <View style={tw(`${styles.pdf.box} `)}>
                     <Text style={tw(`${styles.pdf.textKey}`)}>
                        ID Requisición
                     </Text>
                  </View>
                  <View
                     style={tw(
                        "ml-2 text-wrap flex  items-center justify-center",
                     )}>
                     <Text style={tw(`${styles.pdf.textVal} text-wrap`)}>
                        {pdfData?.IDRequisicion}
                     </Text>
                  </View>
               </View>
               {/* Valor Fecha Adquisición */}
               <View style={tw("flex flex-row w-1/3")}>
                  <View
                     style={tw(
                        "text-wrap flex w-full items-center justify-center",
                     )}>
                     <Text style={tw(`${styles.pdf.textVal} text-wrap`)}>
                        {pdfData?.FechaCaptura
                           ? `${new Date(
                                pdfData.FechaCaptura,
                             ).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                             })}`
                           : ""}
                     </Text>
                  </View>
               </View>
            </View>

            <View style={tw("flex flex-row w-full")}>
               {/* C. Costos */}
               <View style={tw("flex flex-row w-2/3")}>
                  <View style={tw(`${styles.pdf.box} text-wrap`)}>
                     <Text style={tw(`${styles.pdf.textKey} `)}>C. Costos</Text>
                  </View>
                  <View
                     style={tw("ml-2 text-wrap flex justify-center w-[85%]")}>
                     <Text style={tw(`${styles.pdf.textVal}`)}>
                        {`${pdfData?.Nombre_CC}`}
                     </Text>
                  </View>
               </View>
               {/* Key Fecha Asignación */}
               <View style={tw("flex flex-row w-1/3")}>
                  <View style={tw(`${styles.pdf.box} w-full`)}>
                     <Text style={tw(`${styles.pdf.textKey} text-wrap`)}>
                        Aplicación: {pdfData?.Descripcion}
                     </Text>
                  </View>
               </View>
            </View>
         </View>
         {/* DATOS DE REQUISICION */}

         {/* TABLE PRODUCTS */}
         <View style={tw("mx-3 mb-2")}>
            <View
               style={tw(
                  `${styles.pdf.box} flex-row mt-4 w-full justify-between`,
               )}>
               <Text style={tw(`${styles.pdf.subtitle} text-center`)}>
                  Cantidad
               </Text>
               <Text style={tw(`${styles.pdf.subtitle} text-center`)}>
                  Descripción
               </Text>
               <Text style={tw(`${styles.pdf.subtitle} text-center`)}></Text>
            </View>
         </View>
         {products &&
            products.map((producto, index) => (
               <View
                  key={index}
                  style={tw(
                     `flex flex-row h-20 w-full justify-between text-wrap`,
                  )}>
                  <Text
                     style={tw(
                        `w-1/5 ${styles.pdf.text} text-center text-wrap`,
                     )}>
                     {producto.Cantidad}
                  </Text>
                  <Text
                     style={tw(`w-4/5 ${styles.pdf.text} text-end text-wrap`)}>
                     {producto.Descripcion}
                  </Text>
                  {/* <Text
                            style={tw("w-1/4 text-sm text-gray-800 text-center text-right")}
                          >
                            {producto.ClavePresupestal}
                          </Text> */}
               </View>
            ))}

         {/* DESCRIPCIÓN */}
         <View
            style={tw(
               `${styles.pdf.box} mt-auto mx-3 mb-20 pt-2 justify-start text-wrap`,
            )}>
            <Text style={tw(`text-sm font-bold`)}>Descripción:</Text>
            <Text style={tw(`text-sm`)}>{pdfData?.Observaciones}</Text>
         </View>

         {/* FIRMA */}
         <View style={tw(styles.pdf.firmContainer)}>
            {pdfData?.UsuarioAU && (
               <Image
                  style={tw(styles.pdf.firma)}
                  src={`${pdfData?.Firma_Director}`}
               />
            )}
         </View>
      </View>
   );
};
export default PdfLeft;
