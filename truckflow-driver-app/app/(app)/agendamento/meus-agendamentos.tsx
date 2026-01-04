import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AgendamentoCard } from "@/src/components/cards/agendamentoCard";
import { StatusAgendamento } from "@/src/enums/AgendamentoStatus";
import { useAgendamentoStore } from "@/src/stores/useAgendamentoStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
export default function MeusAgendamentos() {
    const router = useRouter();
    const { meusAgendamentos, fetchMeusAgendamentos, isLoading } = useAgendamentoStore();
    const [activeTab, setActiveTab] = useState<'proximos' | 'historico'>('proximos');

    // ID Mockado por enquanto (depois virá do AuthContext que vou fazer no backend jaja)
    const motoristaId = "8DEE9B88-0EC9-4124-A006-6AAED9DA9AED";

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = () => {
        fetchMeusAgendamentos(motoristaId);
    };

    
    const isStatus = (statusApi: string, statusEnum: StatusAgendamento) => {
        return statusApi?.toLowerCase() === StatusAgendamento[statusEnum]?.toLowerCase();
    };

    // Lógica de Filtragem (Client-Side)
    // Isso é super rápido e evita chamadas extras ao backend
    const listaProximos = meusAgendamentos.filter(a =>
        a.status === StatusAgendamento.Agendado.toString() ||
        a.status === StatusAgendamento.EmAndamento.toString() ||
        a.status === StatusAgendamento.Finalizado.toString()
    );

    const listaHistorico = meusAgendamentos.filter(a => 
        a.status === 'Concluido' || 
        a.status === 'Finalizado' || 
        a.status === 'Cancelado'
    );

    const listaExibida = activeTab === 'proximos' ? listaProximos : listaHistorico;

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header Moderno */}
            <View className="bg-[#195FA0] pt-12 pb-4 px-6 rounded-b-[30px] shadow-sm">
                <Text className="text-white font-bold text-2xl">Minhas Viagens</Text>
                <Text className="text-blue-100 text-sm mt-1">
                    Acompanhe seus agendamentos
                </Text>
            </View>

            {/* Componente de Abas (Tabs) */}
            <View className="flex-row px-6 mt-4 mb-2">
                <Pressable
                    onPress={() => setActiveTab('proximos')}
                    className={`flex-1 pb-3 border-b-2 items-center ${activeTab === 'proximos' ? 'border-[#195FA0]' : 'border-transparent'}`}
                >
                    <Text className={`font-bold text-sm ${activeTab === 'proximos' ? 'text-[#195FA0]' : 'text-gray-400'}`}>
                        Próximos ({listaProximos.length})
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setActiveTab('historico')}
                    className={`flex-1 pb-3 border-b-2 items-center ${activeTab === 'historico' ? 'border-[#195FA0]' : 'border-transparent'}`}
                >
                    <Text className={`font-bold text-sm ${activeTab === 'historico' ? 'text-[#195FA0]' : 'text-gray-400'}`}>
                        Histórico
                    </Text>
                </Pressable>
            </View>

            {/* Lista de Cards */}
            <ScrollView
                className="flex-1 px-4 pt-2"
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={carregarDados} colors={["#195FA0"]} />
                }
            >
                {isLoading && !meusAgendamentos.length ? (
                    <ActivityIndicator size="large" color="#195FA0" className="mt-10" />
                ) : listaExibida.length === 0 ? (
                    <VStack className="items-center justify-center mt-20 opacity-50 space-y-2">
                        <Text className="text-4xl">🚚</Text>
                        <Text className="text-gray-500 font-bold">Nada por aqui</Text>
                        <Text className="text-gray-400 text-xs text-center px-10">
                            {activeTab === 'proximos'
                                ? "Você não tem agendamentos futuros."
                                : "Nenhum histórico de viagens encontrado."}
                        </Text>
                    </VStack>
                ) : (
                    <View className="pb-10">
                        {/* Renderiza a lista filtrada */}
                        {listaExibida.map((item) => (
                            <AgendamentoCard
                                key={item.id}
                                data={item}
                                isHistory={activeTab === 'historico'}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}