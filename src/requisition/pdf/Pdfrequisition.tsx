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
};
const tw = createTw({});

const PdfRequisition: React.FC<PdfRequisitionType> = ({
   open,
   setOpen,
   filePath,
   children,
}) => {
   const data = Observable().ObservableGet("PdfRequisicion") as any;
   const [myData, setData] = useState<Array<Record<string, any>>>([]);
   const [loading, setLoading] = useState<boolean>(true);
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

   useEffect(() => {
      setData(groupArrays(data?.data?.products, 2));
   }, []);

   return (
      <ModalComponent
         title="Requisición"
         open={open}
         setOpen={setOpen}
         fullScreen>
         {loading && <Spinner />}
         <PDFViewer width="100%" height="100%">
            <Document>
               {myData.map((item: any) => (
                  <Page size="A4" orientation="landscape">
                     <View style={tw("p-4")}>
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
                           ].includes(localStorage.getItem("role")) && (
                              <PdfRight
                                 products={item}
                                 pdfData={data?.data?.pdfData}
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
