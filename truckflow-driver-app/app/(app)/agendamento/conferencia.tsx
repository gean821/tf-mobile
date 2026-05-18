import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { toast } from "@/src/components/feedback/toast";
import {
    TipoVeiculoLabels,
    TipoVeiculoSelectModal,
} from "@/src/components/modals/tipoVeiculoSelectModal";
import { TipoVeiculo } from "@/src/enums/TipoVeiculo";
import { useNotaFiscal } from "@/src/hooks/useNotaFiscal";
import { useNotaFiscalStore } from "@/src/stores/useNotaFiscalStore";
import { useRouter } from "expo-router";
import { CheckCircle2, ChevronDown, Clock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function ConferenciaNota() {
  const router = useRouter();
  const nota = useNotaFiscalStore((state) => state.notaEmConferencia);
  const { salvarNota, isSaving } = useNotaFiscal();
  const [placa, setPlaca] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo>();
  const [showTipoModal, setShowTipoModal] = useState(false);
  const setDadosVeiculo = useNotaFiscalStore((state) => state.setDadosVeiculo);

  useEffect(() => {
    if (!nota) {
      router.replace("/agendamento/agendar");
    }
  }, [nota]);

  if (!nota) {
    return null;
  }

  const totalItens = nota.itens.length;
  const pendentesCount = nota.itens.filter(
    (i) => i.status !== "Matched" && !i.produtoSistemaId,
  ).length;

  const handleConfirmar = async () => {
    let notaParaSalvar = nota;

    if (!nota.placaVeiculo) {
      if (!placa || !tipoVeiculo) {
        toast.warning(
          "Dados do veículo",
          "Informe a placa e o tipo do veículo.",
        );
        return;
      }

      setDadosVeiculo(placa, tipoVeiculo);
      notaParaSalvar = { ...nota, placaVeiculo: placa };
    }

    await salvarNota(notaParaSalvar);
    router.push("/(app)/agendamento/horarios");
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="bg-white p-6 border-b border-gray-200">
        <Text className="text-gray-500 text-xs font-bold uppercase">
          Nota Fiscal
        </Text>
        <Text className="text-xl font-bold text-gray-800">
          {nota.numero} - {nota.serie}
        </Text>
        <Text className="text-gray-600">{nota.emitenteNome}</Text>
      </View>

      {pendentesCount > 0 && (
        <View className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <HStack space="sm" className="items-start">
            <Icon as={Clock} className="text-blue-700 mt-0.5" size="sm" />
            <VStack className="flex-1">
              <Text className="text-blue-900 font-bold text-sm">
                {pendentesCount} item(ns) aguardando confirmação
              </Text>
              <Text className="text-blue-700 text-xs mt-0.5">
                O conferente da unidade vai confirmar esses itens na portaria.
                Você pode prosseguir normalmente.
              </Text>
            </VStack>
          </HStack>
        </View>
      )}

      {!nota.placaVeiculo && (
        <View className="bg-white p-4 mt-2 border-y border-gray-200">
          <Text className="text-gray-500 text-xs font-bold uppercase mb-3">
            Dados do Veículo
          </Text>

          <VStack space="md">
            <View>
              <Text className="text-xs text-gray-400 mb-1">
                Placa do Cavalo/Veículo
              </Text>
              <Input className="border-gray-300 rounded-lg bg-gray-50 h-12">
                <InputField
                  placeholder="AAA-0000"
                  value={placa}
                  onChangeText={setPlaca}
                  autoCapitalize="characters"
                />
              </Input>
            </View>

            <View>
              <Text className="text-xs text-gray-400 mb-1">
                Tipo de Carroceria
              </Text>
              <Pressable
                onPress={() => setShowTipoModal(true)}
                className="h-12 bg-gray-50 border border-gray-300 rounded-lg justify-center px-3"
              >
                <HStack className="justify-between items-center">
                  <Text className="text-gray-800">
                    {tipoVeiculo
                      ? TipoVeiculoLabels[tipoVeiculo]
                      : "Selecione o tipo..."}
                  </Text>
                  <Icon as={ChevronDown} size="sm" className="text-gray-400" />
                </HStack>
              </Pressable>
            </View>
          </VStack>
        </View>
      )}

      <VStack space="md" className="p-4">
        <Text className="font-bold text-gray-700 ml-1">
          Itens da Nota ({totalItens})
        </Text>

        {nota.itens.map((item, index) => {
          const matched = item.status === "Matched" || !!item.produtoSistemaId;

          return (
            <View
              key={index}
              className={`p-4 rounded-xl border ${matched ? "bg-white border-green-200" : "bg-blue-50/40 border-blue-200"}`}
            >
              <HStack className="justify-between items-start">
                <VStack className="flex-1 mr-2">
                  <Text className="text-xs text-gray-400 font-bold uppercase mb-1">
                    Item Nota
                  </Text>
                  <Text className="font-bold text-gray-800" numberOfLines={2}>
                    {item.descricao}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    Qtd: {item.quantidade} {item.unidade} | EAN:{" "}
                    {item.ean || "S/N"}
                  </Text>
                </VStack>

                {matched ? (
                  <Icon as={CheckCircle2} className="text-green-600 mt-1" />
                ) : (
                  <Icon as={Clock} className="text-blue-600 mt-1" />
                )}
              </HStack>

              <View className="mt-3 pt-3 border-t border-gray-100/50">
                <Text className="text-xs text-gray-400 font-bold uppercase mb-1">
                  Vínculo no Sistema
                </Text>

                {matched ? (
                  <View className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <Text className="text-gray-800 font-medium">
                      {item.produtoSistemaNome || "Produto vinculado"}
                    </Text>
                  </View>
                ) : (
                  <View className="p-3 rounded-lg bg-white border border-blue-200">
                    <Text className="text-blue-700 text-sm italic">
                      Aguardando confirmação da unidade
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </VStack>

      <View className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full">
        <Button
          className="bg-[#195FA0] h-12 rounded-xl"
          onPress={handleConfirmar}
          isDisabled={isSaving}
        >
          {isSaving ? (
            <ButtonSpinner color="#fff" />
          ) : (
            <ButtonText className="font-bold">Confirmar e Continuar</ButtonText>
          )}
        </Button>
      </View>

      <TipoVeiculoSelectModal
        isOpen={showTipoModal}
        onClose={() => setShowTipoModal(false)}
        onSelect={setTipoVeiculo}
        selectedType={tipoVeiculo}
      />
    </ScrollView>
  );
}
