import { Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import Observable from "../../extras/observable";
const tw = createTw({});
type DataPdf = {
   data: any;
};
const PdfFooter: React.FC<DataPdf> = ({ data }) => {
   return (
      <View style={tw("flex flex-row")}>
         {[
            {
               responsable: data?.data?.pdfData?.Solicitante,
               departamento: data?.data?.pdfData?.Nombre_Departamento,
            },
            {
               responsable: data?.data?.pdfData?.Responsable_Compras,
               departamento: "RESPONSABLE DE COMPRAS",
            },
         ].map((it) => (
            <View style={tw("w-1/2 flex items-center justify-center   p-2")}>
               <Text style={tw("text-sm flex-shrink mb-1")}>
                  {it.responsable}
               </Text>
               <Text style={tw("text-sm flex-shrink")}>{it.departamento}</Text>
            </View>
         ))}
      </View>
   );
};
export default PdfFooter;
