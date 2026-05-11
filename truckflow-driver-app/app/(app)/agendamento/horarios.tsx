import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import IAgendamentoResponseDto from "@/src/Dtos/Agendamento/IAgendamentoResponseDto";
import { useAgendamento } from "@/src/hooks/useAgendamento";
import { useVagasDisponiveisQuery } from "@/src/queries/agendamento.queries";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useNotaFiscalStore } from "@/src/stores/useNotaFiscalStore";
import { format, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

export default function Horarios() {
  const router = useRouter();
  const nota = useNotaFiscalStore((state) => state.notaEmConferencia);
  const { placaVeiculo, tipoVeiculo } = useNotaFiscalStore();
  const authStore = useAuthStore();

  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<IAgendamentoResponseDto | null>(null);

  const hoje = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const { data: agendamentosDisponiveis = [], isLoading } =
    useVagasDisponiveisQuery({
      chaveAcesso: nota?.chaveAcesso ?? "",
      data: hoje,
    });

  const { reservar, isReserving } = useAgendamento();

  useEffect(() => {
    if (!nota) {
      router.replace("/agendamento/agendar");
      return;
    }

    if (!nota.chaveAcesso) {
      Alert.alert(
        "Erro",
        "Nota fiscal sem chave de acesso. Tente enviar a nota novamente.",
      );
      router.back();
      return;
    }
  }, [nota]);

  const handleConfirmar = async () => {
    if (!agendamentoSelecionado || !nota) {
      return;
    }

    try {
      await reservar({
        agendamentoId: agendamentoSelecionado.id,
        notaFiscalChaveAcesso: nota.chaveAcesso,
        placaVeiculo: placaVeiculo,
        tipoVeiculo: tipoVeiculo,
      });

      Alert.alert("Sucesso!", "Agendamento confirmado.", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/agendamento/ticketAgendamento",
              params: { agendamentoId: agendamentoSelecionado.id },
            }),
        },
      ]);
    } catch {}
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#195FA0] pt-12 pb-6 px-6 rounded-b-[30px]">
        <Text className="text-white font-bold text-xl">Escolha um Horário</Text>
        <Text className="text-blue-100 text-sm mt-1">
          Vagas compatíveis com os produtos da sua nota
        </Text>
        {nota?.fornecedor && (
          <Text className="text-blue-200 text-xs mt-1">
            Fornecedor da nota: {nota.fornecedor}
          </Text>
        )}
      </View>

      <ScrollView className="flex-1 px-6 mt-4">
        {isLoading ? (
          <ActivityIndicator size="large" color="#195FA0" className="mt-10" />
        ) : agendamentosDisponiveis.length === 0 ? (
          <View className="items-center mt-10">
            <Text className="text-gray-500 text-center">
              Nenhum horário disponível para hoje.{"\n"}Tente outro dia.
            </Text>
          </View>
        ) : (
          <VStack space="md" className="pb-24">
            {agendamentosDisponiveis.map((vaga) => {
              const isSelected = agendamentoSelecionado?.id === vaga.id;

              return (
                <Pressable
                  key={vaga.id}
                  onPress={() => setAgendamentoSelecionado(vaga)}
                  className={`p-4 rounded-xl border-2 ${
                    isSelected
                      ? "bg-blue-50 border-[#195FA0]"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-bold text-lg text-gray-800">
                        {format(parseISO(vaga.horarioInicio), "HH:mm")}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {vaga.unidadeDescarga}
                      </Text>
                    </View>

                    {isSelected && (
                      <View className="bg-[#195FA0] px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">
                          Selecionado
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </VStack>
        )}
      </ScrollView>

      {agendamentoSelecionado && (
        <View className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full">
          <Button
            className="bg-[#195FA0] h-12 rounded-xl"
            onPress={handleConfirmar}
            isDisabled={isReserving}
          >
            {isReserving ? (
              <ButtonSpinner color="#fff" />
            ) : (
              <ButtonText className="font-bold text-white">
                Confirmar Reserva
              </ButtonText>
            )}
          </Button>
        </View>
      )}
    </View>
  );
}
