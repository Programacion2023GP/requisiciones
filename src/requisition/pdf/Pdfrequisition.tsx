import React, { useEffect, useRef, useState } from "react";
import ModalComponent from "../../components/modal/Modal";
import {
   Document,
   Page,
   Text,
   View,
   PDFViewer,
   StyleSheet,
   Image,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import Observable from "../../extras/observable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PdfLeft from "./PdfLeft";
import PdfHeader from "./PdfHeader";
import { PdfRight } from "./PdfRight";
import PdfFooter from "./PdfFooter";
import Spinner from "../../loading/Loading";
type PdfRequisitionType = {
   open: boolean;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
   filePath?: string;
   children?: React.ReactNode;
   watermarkText?: string;
};
const tw = createTw({});

const PdfRequisition: React.FC<PdfRequisitionType> = ({
   open,
   setOpen,
   filePath,
   children,
   watermarkText = "RECHAZADA",
}) => {
   const data = Observable().ObservableGet("PdfRequisicion") as any;
   const [myData, setData] = useState<Array<Record<string, any>>>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [totalPorProveedor, setTotalPorProveedor] = useState<
      Array<{ opcion: number; proveedor: string; totalNeto: number }>
   >([]);
   const groupArrays = (
      array: Array<Record<string, any>>,
      length: number,
   ): Array<Array<Record<string, any>>> => {
      const resultado: Array<Array<Record<string, any>>> = [];
      for (let i = 0; i < array.length; i += length) {
         resultado.push(array.slice(i, i + length));
      }
      setLoading(false);
      return resultado;
   };

   const calculateTotalPerSupplier = (
      products: Array<Record<string, any>> = [],
   ): Array<{ opcion: number; proveedor: string; totalNeto: number }> => {
      // Calculo todos los totalNeto individuales
      const totals: Array<{
         opcion: number;
         proveedor: string;
         totalNeto: number;
      }> = [];

      [1, 2, 3].forEach((i) => {
         products.forEach((producto) => {
            const proveedor = producto[`Proveedor${i}`] ?? "";
            const cantidad = Number(producto?.Cantidad || 0);

            const precioSinIva = Number(
               producto?.[`PrecioUnitarioSinIva${i}`] || 0,
            );
            const ivaPct = Number(producto?.[`PorcentajeIVA${i}`] || 0);
            const retenciones = Number(producto?.[`Retenciones${i}`] || 0);
            // const retPct = Number(producto?.[`Retenciones${i}`] || 0);

            const subtotal = precioSinIva * cantidad;
            const ivaCalculado = subtotal * (ivaPct / 100);
            const totalConIva = subtotal + ivaCalculado;
            // const retencionCalculada = totalConIva * (retPct / 100);
            const totalNeto = totalConIva - retenciones;

            totals.push({ opcion: i, proveedor, totalNeto });
         });
      });

      // Agrupo por proveedor y opcion sumando totalNeto
      const acumulador = new Map<
         number,
         { opcion: number; proveedor: string; totalNeto: number }
      >();
      totals.forEach(({ opcion, proveedor, totalNeto }) => {
         const proveedorKey = `${opcion}__${proveedor || "__SIN_PROVEEDOR__"}`;
         if (acumulador.has(opcion)) {
            const prev = acumulador.get(opcion)!;
            acumulador.set(opcion, {
               ...prev,
               totalNeto: prev.totalNeto + totalNeto,
            });
         } else {
            acumulador.set(opcion, {
               opcion,
               proveedor: proveedor || "",
               totalNeto,
            });
         }
      });

      // Devuelvo array con { opcion, proveedor, totalNeto }
      return Array.from(acumulador.values());
   };

   useEffect(() => {
      const products = data?.data?.products ?? [];
      setTotalPorProveedor(calculateTotalPerSupplier(products));
      setData(groupArrays(products, 2));
   }, []);

   const styles = StyleSheet.create({
      watermark: {
         position: "absolute",
         fontSize: 120,
         fontWeight: "bold",
         color: "rgba(0, 0, 0, 0.1)",
         transform: "rotate(-45deg)",
         // centrar en la página
         top: "135%",
         left: "8%",
         transformOriginX: "-50%",
         transformOriginY: "-150%",
         // el `fixed` del View asegurará que se repita
         textAlign: "center",
         originX: "center",
         originY: "center",
      },
   });

   return (
      <ModalComponent
         title="Requisición"
         open={open}
         setOpen={setOpen}
         fullScreen>
         {loading && <Spinner />}
         <PDFViewer width="100%" height="100%">
            <Document>
               {myData.map((item: any, indexData) => (
                  <Page size="LETTER" orientation="landscape">
                     {/* {watermarkText && (
                        <View fixed style={{ width: "100%", height: "100%" }}>
                           <Text style={styles.watermark}>{watermarkText}</Text>
                        </View>
                     )} */}
                     <View style={tw("p-4")}>
                        {watermarkText && (
                           <View
                              fixed
                              style={{
                                 position: "absolute",
                                 width: "100%",
                                 height: "100%",
                              }}>
                              <Text style={styles.watermark}>
                                 {watermarkText}
                              </Text>
                           </View>
                        )}

                        <PdfHeader />

                        <View
                           style={tw(
                              "border-2 rounded-xl border-black flex flex-row w-full h-full text-black",
                           )}>
                           <PdfLeft
                              products={item}
                              pdfData={data?.data?.pdfData}
                           />

                           {[
                              "SISTEMAS",
                              "DIRECTORCOMPRAS",
                              "AUTORIZADOR",
                              "REQUISITOR",
                           ].includes(localStorage.getItem("role") ?? "") && (
                              <PdfRight
                                 products={item}
                                 pdfData={data?.data?.pdfData}
                                 totalPorProveedor={totalPorProveedor}
                                 isLastChunk={indexData === myData.length - 1}
                              />
                           )}
                        </View>

                        <PdfFooter data={data} />
                     </View>
                  </Page>
               ))}
            </Document>
         </PDFViewer>
         {children}
      </ModalComponent>
   );
};

export default PdfRequisition;
