import { Image, Text, View } from "@react-pdf/renderer";
import Logo from "../../assets/logo-gpd.png";
import { createTw } from "react-pdf-tailwind";
const tw = createTw({});

const PdfHeader = () => {
   return (
      <View style={tw("flex flex-row items-center justify-center mb-4")}>
         <View style={tw("flex items-center justify-center w-1/3")}>
            <Image src={Logo} style={tw("h-[50px] object-contain")} />
         </View>
         <Text style={tw("flex-1 text-md font-bold text-gray-800 mt-4")}>
            R. AYUNTAMIENTO DE GOMEZ PALACIO, DGO. 2025-2028
         </Text>
         <View style={tw("flex items-center justify-center w-1/3")}>
            <Image src={Logo} style={tw("h-[50px] object-contain")} />
         </View>
      </View>
   );
};
export default PdfHeader;
