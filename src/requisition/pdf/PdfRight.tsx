import { Image, Text, View } from "@react-pdf/renderer";
import React from "react";
import { createTw } from "react-pdf-tailwind";
import { images, styles } from "../../constants";
import { formatCurrency } from "../../utils/functions";

const tw = createTw({});

type TypeProvedor = {
   idxProducto: number;
   producto: Record<string, any>;
   index: number;
};

type DataPdf = {
   products: Array<Record<string, any>>;
   pdfData: Record<string, any>;
   totalPorProveedor: Array<{
      opcion: number;
      proveedor: string;
      totalNeto: number;
   }>;
   isLastChunk?: boolean;
};

export const ProvedorInfo: React.FC<TypeProvedor> = ({
   idxProducto,
   producto,
   index,
}) => {
   const cantidad = Number(producto?.Cantidad || 0);
   const precioSinIva = Number(producto?.[`PrecioUnitarioSinIva${index}`] || 0);
   const ivaPct = Number(producto?.[`PorcentajeIVA${index}`] || 0); // nuevo campo
   // const retPct = Number(producto?.[`Retenciones${index}`] || 0); // ya no es porcentaje lo que se guarda
   const retenciones = Number(producto?.[`Retenciones${index}`] || 0); // ya no es porcentaje lo que se guarda

   // Cálculos paso a paso
   const subtotal = precioSinIva * cantidad;
   const ivaCalculado = subtotal * (ivaPct / 100);
   const totalConIva = subtotal + ivaCalculado;
   // const retencionCalculada = totalConIva * (retPct / 100); // ya no es porcentaje
   const totalNeto = totalConIva - retenciones;

   return (
      <View
         style={tw(
            `text-sm text-wrap px-1 w-1/3 max-w-1/3 ${
               producto.Proveedor != null &&
               producto.Proveedor == producto?.[`Proveedor${index}`] &&
               "bg-slate-400 rounded-md"
            } `,
         )}>
         {idxProducto === 0 && (
            <Text style={tw("text-wrap h-16 overflow-hidden")}>
               {producto?.[`Proveedor${index}`] || ""}
            </Text>
         )}
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
               <Text style={tw(styles.pdf.textKey)}>
                  {formatCurrency(precioSinIva, true, false) || 0}
               </Text>
               <Text style={tw(styles.pdf.textKey)}>I.V.A. ({ivaPct}%)</Text>
               <Text style={tw(styles.pdf.textKey)}>Total c/ IVA</Text>
               <Text style={tw(styles.pdf.textKey)}>Retenciones</Text>
               <Text style={tw(styles.pdf.textKey)}>Total Neto</Text>
            </View>
            <View style={tw("flex flex-col w-1/2 text-start ml-2")}>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(subtotal, true, false) || 0}
               </Text>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(ivaCalculado, true, false) || 0}
               </Text>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(totalConIva, true, false) || 0}
               </Text>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(retenciones, true, false) || 0}
               </Text>
               <Text style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                  {formatCurrency(totalNeto, true, false) || 0}
               </Text>
            </View>
         </View>
      </View>
   );
};

export const PdfRight: React.FC<DataPdf> = ({
   pdfData,
   products,
   totalPorProveedor,
   isLastChunk = false,
}) => {
   // console.log("🚀 ~ ProvedorInfo ~ isLastChunk:", isLastChunk);
   // console.log("🚀 ~ ProvedorInfo ~ totalPorProveedor:", totalPorProveedor);
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
                        idxProducto={idx}
                        producto={producto}
                        index={index}
                     />
                  ))}
               </View>
            ))}

            {/* TOTAL POR PROVEEDOR */}
            {isLastChunk && (
               <View style={tw("w-full flex flex-row -mt-1.5 gap-1 mb-2")}>
                  {totalPorProveedor.map((total) => (
                     <>
                        <View style={tw(`w-1/2`)}>
                           <Text
                              style={tw(
                                 `${styles.pdf.textKey} text-wrap max-w-full`,
                              )}>
                              T. Prov{total.opcion}:
                           </Text>
                        </View>
                        <View style={tw(`w-1/2`)}>
                           <Text
                              style={tw(
                                 `${styles.pdf.textVal} text-wrap max-w-full`,
                              )}>
                              {formatCurrency(total.totalNeto, true, false) ||
                                 ""}
                           </Text>
                        </View>
                     </>
                  ))}
               </View>
            )}

            {/* <View style={tw("w-full flex flex-row -mt-1.5 gap-1 mb-2")}>
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
                              products.reduce((acum, producto) => {
                                 const cantidad = Number(
                                    producto?.Cantidad || 0,
                                 );
                                 const precioSinIva = Number(
                                    producto?.[`PrecioUnitarioSinIva${i}`] || 0,
                                 );
                                 const ivaPct = Number(
                                    producto?.[`PorcentajeIVA${i}`] || 0,
                                 );
                                 const retPct = Number(
                                    producto?.[`Retenciones${i}`] || 0,
                                 );

                                 const subtotal = precioSinIva * cantidad;
                                 const ivaCalculado = subtotal * (ivaPct / 100);
                                 const totalConIva = subtotal + ivaCalculado;
                                 const retencionCalculada =
                                    totalConIva * (retPct / 100);
                                 const totalNeto =
                                    totalConIva - retencionCalculada;

                                 return acum + totalNeto;
                              }, 0),
                              true,
                              false,
                           ) || ""}
                        </Text>
                     </View>
                  </>
               ))}
            </View> */}

            {/* TOTAL DE PRODUCTOS SELECCIONADOS */}
            {/* <View style={tw(`${styles.pdf.box} w-full flex flex-row gap-1`)}>
               <>
                  <Text
                     style={tw(`${styles.pdf.textKey} text-wrap max-w-full`)}>
                     TOTAL DE PROVEEDORES SELECCIONADOS:
                  </Text>
                  <Text
                     style={tw(`${styles.pdf.textVal} text-wrap max-w-full`)}>
                     {products.map((p) => p.Proveedor)}
                  </Text>
               </>
            </View> */}
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
            {pdfData?.UsuarioOC && (
               <Image
                  style={tw(styles.pdf.firma)}
                  src={images.firmaDirectorCompras}
               />
            )}
         </View>
      </View>
   );
};
