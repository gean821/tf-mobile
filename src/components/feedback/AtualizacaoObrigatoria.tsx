import { Linking, Pressable, Text, View } from "react-native";
import { PRIMARY_500 } from "@/src/constants/colors";

export function AtualizacaoObrigatoria({ urlLoja }: { urlLoja: string | null }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a", textAlign: "center" }}>
        Atualize o TruckFlow Motorista
      </Text>
      <Text style={{ fontSize: 15, color: "#475569", textAlign: "center", marginTop: 12, lineHeight: 22 }}>
        Esta versão do app não é mais suportada. Baixe a versão mais nova na loja para continuar agendando suas descargas.
      </Text>
      {urlLoja ? (
        <Pressable
          onPress={() => Linking.openURL(urlLoja)}
          style={{ marginTop: 28, backgroundColor: PRIMARY_500, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Atualizar agora</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
