import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import * as Linking from "expo-linking";
import { Navigation } from "lucide-react-native";
import { Platform } from "react-native";

interface AbrirNoMapsButtonProps {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
}

export function AbrirNoMapsButton({
  lat,
  lng,
  label = "Abrir no mapa",
  className,
}: AbrirNoMapsButtonProps) {
  const webFallback = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const handlePress = async () => {
    const nativeUrl = Platform.select({
      ios: `maps://?daddr=${lat},${lng}&dirflg=d`,
      android: `google.navigation:q=${lat},${lng}`,
    });

    if (nativeUrl) {
      try {
        await Linking.openURL(nativeUrl);
        return;
      } catch {}
    }

    try {
      await Linking.openURL(webFallback);
    } catch (error) {
      console.warn("[AbrirNoMapsButton] falha ao abrir Maps", error);
    }
  };

  return (
    <Button variant="link" onPress={handlePress} className={className}>
      <Icon as={Navigation} size="sm" className="text-blue-200 mr-2" />
      <ButtonText className="text-blue-200">{label}</ButtonText>
    </Button>
  );
}