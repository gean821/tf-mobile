import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Trash2, X } from "lucide-react-native";
import { ActivityIndicator, Modal, View } from "react-native";

interface Props {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExcluirContaModal({ visible, loading, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "rgba(0,0,0,0.4)", flex: 1 }} />
        <View className="bg-white rounded-t-3xl overflow-hidden">
          <View className="bg-red-500 px-5 py-4 flex-row items-center justify-between">
            <HStack space="sm" className="items-center">
              <Icon as={Trash2} size="sm" className="text-white" />
              <Text className="text-white font-bold text-base">Excluir minha conta</Text>
            </HStack>
            <Pressable onPress={onClose} disabled={loading} accessibilityLabel="Fechar" accessibilityRole="button">
              <Icon as={X} size="sm" className="text-white" />
            </Pressable>
          </View>

          <VStack space="md" className="px-5 py-6">
            <Text className="text-gray-700 text-sm">
              Seu nome, telefone, e-mail e veículos serão apagados e você não poderá mais entrar com esta conta.
            </Text>
            <Text className="text-gray-500 text-xs">
              Agendamentos e notas fiscais já registrados ficam com a fábrica por obrigação legal, sem vínculo com seus
              dados pessoais. Essa ação não pode ser desfeita.
            </Text>

            <Pressable
              onPress={onConfirm}
              disabled={loading}
              className="bg-red-500 rounded-xl py-3.5 items-center active:opacity-80"
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white font-bold">Excluir definitivamente</Text>
              )}
            </Pressable>
            <Pressable onPress={onClose} disabled={loading} className="py-3 items-center">
              <Text className="text-gray-500 font-semibold">Cancelar</Text>
            </Pressable>
          </VStack>
        </View>
      </View>
    </Modal>
  );
}
