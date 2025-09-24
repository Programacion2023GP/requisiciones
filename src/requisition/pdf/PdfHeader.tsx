import { Image, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { images, styles } from "../../constants";
const tw = createTw({});

const PdfHeader = () => {
   return (
      <View style={tw("flex flex-row items-center justify-center mb-4")}>
         <View style={tw("flex items-center justify-center w-1/3")}>
            <Image src={images.logo} style={tw("h-[45px] object-contain")} />
         </View>
         <Text style={tw(`flex-1 ${styles.pdf.title}`)}>
            R. AYUNTAMIENTO DE GOMEZ PALACIO, DGO. 2025-2028
         </Text>
         <View style={tw("flex items-center justify-center w-1/3")}>
            <Image src={images.escudo} style={tw("h-[45px] object-contain")} />
         </View>
      </View>
   );
};
export default PdfHeader;
