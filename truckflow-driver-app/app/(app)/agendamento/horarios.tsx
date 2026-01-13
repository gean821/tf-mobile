import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import IAgendamentoResponseDto from "@/src/Dtos/Agendamento/IAgendamentoResponseDto";
import AgendamentoService from "@/src/services/AgendamentoService";
import { useAgendamentoStore } from "@/src/stores/useAgendamentoStore";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useNotaFiscalStore } from "@/src/stores/useNotaFiscalStore";
import { format, parseISO } from 'date-fns';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

export default function Horarios() {
    const [horarioEscolhido, setHorarioEscolhido] = useState('');
    const router = useRouter();
    const nota = useNotaFiscalStore(state => state.notaEmConferencia);
    const [vagas, setVagas] = useState<IAgendamentoResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { placaVeiculo, tipoVeiculo } = useNotaFiscalStore();
    const [confirming, setConfirming] = useState(false);
    const {
        agendamentosDisponiveis,
        carregarVagas,
        isLoading,
        selecionarVaga,
        agendamentoSelecionado,
        reservarVaga
    } = useAgendamentoStore();
    
    const authStore = useAuthStore();


    useEffect(() => {
        if (!nota) {
            router.replace('/agendamento/agendar');
            return;
        }


        if (!nota.fornecedorId || nota.fornecedorId === '00000000-0000-0000-0000-000000000000') {
            Alert.alert("Erro", "Fornecedor não identificado. Tente enviar a nota novamente.");
            router.back();
            return;
        }

        const hoje = format(new Date(), 'yyyy-MM-dd');
        carregarVagas(nota.fornecedorId, hoje);

    }, [nota]);

    const vagasFiltradas = agendamentosDisponiveis;

    const handleConfirmar = async () => {
        if (!agendamentoSelecionado || !nota) {
            return;
        }

        try {
            setConfirming(true);

            await AgendamentoService.BookApointment({
                agendamentoId: agendamentoSelecionado.id,
                notaFiscalChaveAcesso: nota.chaveAcesso,
                usuarioId: authStore.user!.UserId,
                placaVeiculo: placaVeiculo,
                tipoVeiculo: tipoVeiculo
            });

            Alert.alert("Sucesso!", "Agendamento confirmado.", [
                { text: "OK", onPress: () => router.push('/agendamento/ticketAgendamento') }
            ]);

        } catch (error: any) {
            Alert.alert("Erro", error.response?.data?.message || "Falha ao reservar.");

        } finally {
            setConfirming(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-[#195FA0] pt-12 pb-6 px-6 rounded-b-[30px]">
                <Text className="text-white font-bold text-xl">Escolha um Horário</Text>
                <Text className="text-blue-100 text-sm mt-1">
                    Disponível para {nota?.fornecedor}
                </Text>
            </View>

            <ScrollView className="flex-1 px-6 mt-4">
                {isLoading ? (
                    <ActivityIndicator size="large" color="#195FA0" className="mt-10" />
                ) : vagasFiltradas.length === 0 ? (
                    <View className="items-center mt-10">
                        <Text className="text-gray-500 text-center">
                            Nenhum horário disponível para hoje.{'\n'}Tente outro dia.
                        </Text>
                    </View>
                ) : (
                    <VStack space="md" className="pb-24">
                        {vagasFiltradas.map((vaga) => {
                            const isSelected = agendamentoSelecionado?.id === vaga.id;

                            return (
                                <Pressable
                                    key={vaga.id}
                                    onPress={() => selecionarVaga(vaga)} // Usa action da store
                                    className={`p-4 rounded-xl border-2 ${isSelected
                                        ? 'bg-blue-50 border-[#195FA0]'
                                        : 'bg-white border-gray-100'
                                        }`}
                                >
                                    <View className="flex-row justify-between items-center">
                                        <View>
                                            <Text className="font-bold text-lg text-gray-800">
                                                {format(parseISO(vaga.horarioInicio), 'HH:mm')}
                                            </Text>
                                            <Text className="text-gray-500 text-xs">
                                                {vaga.unidadeDescarga}
                                            </Text>
                                        </View>

                                        {isSelected && (
                                            <View className="bg-[#195FA0] px-3 py-1 rounded-full">
                                                <Text className="text-white text-xs font-bold">Selecionado</Text>
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </VStack>
                )}
            </ScrollView>

            {/* Botão Flutuante */}
            {agendamentoSelecionado && (
                <View className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full">
                    <Button
                        className="bg-[#195FA0] h-12 rounded-xl"
                        onPress={handleConfirmar}
                        isDisabled={confirming}
                    >
                        {confirming ? (
                            <ButtonSpinner color="#fff" />
                        ) : (
                            <ButtonText className="font-bold text-white">Confirmar Reserva</ButtonText>
                        )}
                    </Button>
                </View>
            )}
        </View>
    );
}