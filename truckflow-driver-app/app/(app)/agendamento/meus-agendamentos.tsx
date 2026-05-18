import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AgendamentoCard } from "@/src/components/cards/agendamentoCard";
import { StatusAgendamento } from "@/src/enums/AgendamentoStatus";
import { useMeusAgendamentosQuery } from "@/src/queries/agendamento.queries";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
export default function MeusAgendamentos() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"proximos" | "historico">(
    "proximos",
  );
  const authStore = useAuthStore();

  const isLogged = !!authStore.token;

  const {
    data: meusAgendamentos = [],
    isLoading,
    isFetching,
    refetch,
  } = useMeusAgendamentosQuery(isLogged);

  const carregarDados = () => {
    refetch();
  };

  const listaProximos = meusAgendamentos.filter(
    (a) =>
      a.status === StatusAgendamento.Agendado.toString() ||
      a.status === StatusAgendamento.EmAndamento.toString(),
  );

  const listaHistorico = meusAgendamentos.filter(
    (a) =>
      a.status === StatusAgendamento.Finalizado.toString() ||
      a.status === StatusAgendamento.Cancelado.toString() ||
      a.status === StatusAgendamento.Expirado.toString(),
  );

  const listaExibida =
    activeTab === "proximos" ? listaProximos : listaHistorico;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#195FA0] pt-12 pb-4 px-6 rounded-b-[30px] shadow-sm">
        <Text className="text-white font-bold text-2xl">Minhas Viagens</Text>
        <Text className="text-blue-100 text-sm mt-1">
          Acompanhe seus agendamentos
        </Text>
      </View>

      <View className="flex-row px-6 mt-4 mb-2">
        <Pressable
          onPress={() => setActiveTab("proximos")}
          className={`flex-1 pb-3 border-b-2 items-center ${activeTab === "proximos" ? "border-[#195FA0]" : "border-transparent"}`}
        >
          <Text
            className={`font-bold text-sm ${activeTab === "proximos" ? "text-[#195FA0]" : "text-gray-400"}`}
          >
            Próximos ({listaProximos.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("historico")}
          className={`flex-1 pb-3 border-b-2 items-center ${activeTab === "historico" ? "border-[#195FA0]" : "border-transparent"}`}
        >
          <Text
            className={`font-bold text-sm ${activeTab === "historico" ? "text-[#195FA0]" : "text-gray-400"}`}
          >
            Histórico ({listaHistorico.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={carregarDados}
            colors={["#195FA0"]}
          />
        }
      >
        {isLoading && !meusAgendamentos.length ? (
          <ActivityIndicator size="large" color="#195FA0" className="mt-10" />
        ) : listaExibida.length === 0 ? (
          <VStack className="items-center justify-center mt-20 opacity-50 space-y-2">
            <Text className="text-4xl">🚚</Text>
            <Text className="text-gray-500 font-bold">Nada por aqui</Text>
            <Text className="text-gray-400 text-xs text-center px-10">
              {activeTab === "proximos"
                ? "Você não tem agendamentos futuros."
                : "Nenhum histórico de viagens encontrado."}
            </Text>
          </VStack>
        ) : (
          <View className="pb-10">
            {listaExibida.map((item) => (
              <AgendamentoCard
                key={item.id}
                data={item}
                isHistory={activeTab === "historico"}
                onPress={() =>
                  router.push({
                    pathname: "/agendamento/ticketAgendamento",
                    params: { agendamentoId: item.id },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
