import { Image, Text, View } from "@react-pdf/renderer";
import Logo from "../../assets/logo-gpd.png";
import { createTw } from "react-pdf-tailwind";
const tw = createTw({});

const PdfHeader = () => {
  return (
    <View style={tw(" flex flex-row")}>
      <View style={tw(" items-start")}>
        <Image src={Logo} style={tw("h-40 w-60")} />
      </View>
      <Text style={tw("text-xs font-bold text-gray-800 mt-4")}>
        R. AYUNTAMIENTO DE GOMEZ PALACIO, DGO 2025-2028
      </Text>
    </View>
  );
};
export default PdfHeader;
