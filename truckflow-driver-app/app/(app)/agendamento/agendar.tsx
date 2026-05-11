import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  FileUp,
  Keyboard,
  Lightbulb,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { OptionCard } from "@/src/components/cards/optionCard";
import Scanner from "@/src/components/cards/scanner";
import { toast } from "@/src/components/feedback/toast";
import { KeyInputModal } from "@/src/components/modals/keyInputModal";
import { useNotaFiscal } from "@/src/hooks/useNotaFiscal";

export default function Agendar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isUploading, uploadXml, buscarNota, isSearching } = useNotaFiscal();
  const [isScanning, setIsScanning] = useState(false);

  const handleUploadFile = async () => {
    if (isUploading) {
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/xml", "text/xml"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const xmlUpload = await uploadXml(result.assets[0].uri);

      if (xmlUpload) {
        router.push("/(app)/agendamento/conferencia");
      }
    } catch (err) {
      console.error("Erro no picker:", err);
      toast.error(
        "Falha ao selecionar arquivo",
        "Não foi possível abrir o seletor de arquivos.",
      );
    }
  };

  const handleTypeKey = () => {
    setIsOpen(true);
  };

  const onConfirmKey = async (chave: string) => {
    await buscarNota(chave);
    setIsOpen(false);
    router.push("/(app)/agendamento/conferencia");
  };

  const handleScanBarcode = () => {
    setIsScanning(true);
  };

  const onScannedCode = async (chave: string) => {
    await onConfirmKey(chave);
    setIsScanning(false);
  };

  if (isScanning) {
    return (
      <Scanner onScanned={onScannedCode} onClose={() => setIsScanning(false)} />
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <KeyInputModal
        isLoading={isSearching}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onConfirmKey}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-[#195FA0] pt-12 pb-12 px-5 rounded-b-[32px] overflow-hidden relative">
          <View
            className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-white/5"
            pointerEvents="none"
          />
          <View
            className="absolute bottom-0 -left-10 w-32 h-32 rounded-full bg-white/5"
            pointerEvents="none"
          />

          <HStack className="items-center justify-between mb-5">
            <Pressable
              onPress={() => router.back()}
              className="bg-white/15 p-2.5 rounded-xl active:opacity-70"
            >
              <Icon as={ArrowLeft} color="white" size="md" />
            </Pressable>

            <View className="bg-white/15 px-3 py-1.5 rounded-full">
              <Text className="text-white text-[11px] font-semibold">
                Passo 1 de 3
              </Text>
            </View>
          </HStack>

          <Text className="text-blue-100 text-xs font-medium uppercase tracking-wide">
            Iniciar agendamento
          </Text>
          <Text className="text-white font-bold text-2xl mt-1">
            Nova Carga
          </Text>
          <Text className="text-blue-100 text-xs mt-1.5 opacity-90 leading-5">
            Escolha como deseja informar os dados da nota fiscal.
          </Text>
        </View>

        <VStack className="px-5 -mt-6" space="md">
          <View
            className="bg-white rounded-2xl p-4 border border-gray-100"
            style={{
              shadowColor: "#0f172a",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <HStack className="items-center justify-between">
              <View>
                <Text className="text-gray-900 font-bold text-base">
                  Métodos disponíveis
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Selecione a opção mais prática para você
                </Text>
              </View>
              <View className="bg-blue-50 px-2.5 py-1 rounded-full">
                <Text className="text-[#195FA0] text-[10px] font-bold">
                  3 opções
                </Text>
              </View>
            </HStack>
          </View>

          <OptionCard
            icon={Camera}
            title="Ler Código de Barras"
            subtitle="Aponte a câmera para o código da DANFE"
            badge="Recomendado"
            onPress={handleScanBarcode}
            isPrimary={true}
          />

          <OptionCard
            icon={FileUp}
            title="Carregar Nota Fiscal"
            subtitle="Use um arquivo XML salvo no seu celular"
            onPress={handleUploadFile}
            disabled={isUploading}
            loading={isUploading}
          />

          <OptionCard
            icon={Keyboard}
            title="Digitar Chave"
            subtitle="Insira os 44 dígitos da chave de acesso"
            onPress={handleTypeKey}
          />

          <View className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <HStack space="sm" className="items-start">
              <View className="bg-amber-100 p-2 rounded-xl">
                <Icon as={Lightbulb} size="sm" className="text-amber-600" />
              </View>
              <View className="flex-1">
                <Text className="text-amber-900 font-bold text-sm">
                  Dica rápida
                </Text>
                <Text className="text-amber-800 text-xs mt-1 leading-5">
                  A leitura por câmera é a forma mais rápida e evita erros de
                  digitação. Posicione bem o código de barras da DANFE.
                </Text>
              </View>
            </HStack>
          </View>
        </VStack>
      </ScrollView>
    </View>
  );
}
