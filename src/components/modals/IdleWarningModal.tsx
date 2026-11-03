import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Clock } from "lucide-react-native";
import { Modal, View } from "react-native";

interface Props {
  visible: boolean;
  segundos: number;
  onContinuar: () => void;
  onSair: () => void;
}

export function IdleWarningModal({ visible, segundos, onContinuar, onSair }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onContinuar}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "rgba(0,0,0,0.4)", flex: 1 }} />
        <View className="bg-white rounded-t-3xl overflow-hidden">
          <View className="bg-amber-500 px-5 py-4">
            <HStack space="sm" className="items-center">
              <Icon as={Clock} size="sm" className="text-white" />
              <Text className="text-white font-bold text-base">Sessão prestes a expirar</Text>
            </HStack>
          </View>

          <VStack space="md" className="px-5 py-6">
            <Text className="text-gray-700 text-sm">
              Por inatividade, você será desconectado em {segundos}s.
            </Text>

            <Pressable
              onPress={onContinuar}
              className="bg-primary-500 rounded-xl py-3.5 items-center active:opacity-80"
            >
              <Text className="text-white font-bold">Continuar conectado</Text>
            </Pressable>
            <Pressable onPress={onSair} className="py-3 items-center active:opacity-80">
              <Text className="text-gray-500 font-semibold">Sair agora</Text>
            </Pressable>
          </VStack>
        </View>
      </View>
    </Modal>
  );
}
