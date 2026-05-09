import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from '@/components/ui/pressable';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ProdutoSelectModal } from "@/src/components/modals/produtoSelectModal";
import { TipoVeiculoLabels, TipoVeiculoSelectModal } from "@/src/components/modals/tipoVeiculoSelectModal";
import { TipoVeiculo } from "@/src/enums/TipoVeiculo";
import { useNotaFiscal } from "@/src/hooks/useNotaFiscal";
import { useNotaFiscalStore } from '@/src/stores/useNotaFiscalStore';
import { useRouter } from "expo-router";
import { AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from "react-native";

export default function ConferenciaNota() {
    const router = useRouter();
    const nota = useNotaFiscalStore(state => state.notaEmConferencia);
    const vincularProduto = useNotaFiscalStore(state => state.vincularProdutoItem);
    const { salvarNota, isSaving } = useNotaFiscal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [placa, setPlaca] = useState('');
    const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo>();
    const [showTipoModal, setShowTipoModal] = useState(false);
    const setDadosVeiculo = useNotaFiscalStore(state => state.setDadosVeiculo);
    

    useEffect(() => {
        if (!nota) {
            router.replace("/agendamento/agendar");
        }

    }, [nota]);

    if (!nota) {
        return null;
    }

    const handleOpenModal = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    const handleSelectProduct = (id: string, nome: string) => {
        if (selectedIndex !== null) {

            // Atualiza a Store (Amarelo -> Verde instantaneamente)
            vincularProduto(selectedIndex, id, nome);
        }
        setIsModalOpen(false);
        setSelectedIndex(null);
    };

    const handleConfirmarTudo = async () => {
        const itensPendentes = nota.itens.filter(i => !i.produtoSistemaId);

        if (itensPendentes.length > 0) {
            Alert.alert(
                "Itens Pendentes",
                "Existem itens amarelos sem vínculo. Vincule todos aos produtos do sistema antes de continuar."
            );
            return;
        }
        
        let notaParaSalvar = nota;

        if (!nota.placaVeiculo) {
            if (!placa || !tipoVeiculo) {
                Alert.alert("Atenção", "Informe a placa e o tipo do veículo.");
                return;
            }

            setDadosVeiculo(placa, tipoVeiculo);
            notaParaSalvar = { ...nota, placaVeiculo: placa };
        }

        await salvarNota(notaParaSalvar);
        console.log("Dados da Nota:", nota);
        router.push('/(app)/agendamento/horarios');
    };

    return (
        <ScrollView className="flex-1 bg-gray-50"
            contentContainerStyle={{ paddingBottom: 100 }}>
            <View className="bg-white p-6 border-b border-gray-200">
                <Text className="text-gray-500 text-xs font-bold uppercase">Nota Fiscal</Text>
                <Text className="text-xl font-bold text-gray-800">{nota.numero} - {nota.serie}</Text>
                <Text className="text-gray-600">{nota.emitenteNome}</Text>
            </View>

            {!nota.placaVeiculo && (
                <View className="bg-white p-4 mt-2 border-y border-gray-200">
                    <Text className="text-gray-500 text-xs font-bold uppercase mb-3">
                        Dados do Veículo
                    </Text>

                    <VStack space="md">
                        {/* Placa */}
                        <View>
                            <Text className="text-xs text-gray-400 mb-1">Placa do Cavalo/Veículo</Text>
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
                            <Text className="text-xs text-gray-400 mb-1">Tipo de Carroceria</Text>
                            <Pressable
                                onPress={() => setShowTipoModal(true)}
                                className="h-12 bg-gray-50 border border-gray-300 rounded-lg justify-center px-3"
                            >
                                <HStack className="justify-between items-center">
                                    <Text className="text-gray-800">
                                        {tipoVeiculo ? TipoVeiculoLabels[tipoVeiculo] : "Selecione o tipo..."}
                                    </Text>
                                    <Icon as={ChevronDown} size="sm" className="text-gray-400" />
                                </HStack>
                            </Pressable>
                        </View>
                    </VStack>
                </View>
            )}

            <VStack space="md" className="p-4">
                <Text className="font-bold text-gray-700 ml-1">Itens da Nota ({nota.itens.length})</Text>

                {nota.itens.map((item, index) => {
                    const isMatch = !!item.produtoSistemaId; // Cenário A (Verde) vs B (Amarelo)

                    return (
                        <View
                            key={index}
                            className={`p-4 rounded-xl border ${isMatch ? 'bg-white border-green-200' : 'bg-yellow-50 border-yellow-200'}`}
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
                                        Qtd: {item.quantidade} {item.unidade} | EAN: {item.ean || "S/N"}
                                    </Text>
                                </VStack>

                                {isMatch ? (
                                    <Icon as={CheckCircle2} className="text-green-600 mt-1" />
                                ) : (
                                    <Icon as={AlertTriangle} className="text-yellow-600 mt-1" />
                                )}
                            </HStack>

                            {/* Área de Vínculo */}
                            <View className="mt-3 pt-3 border-t border-gray-100/50">
                                <Text className="text-xs text-gray-400 font-bold uppercase mb-1">
                                    Vínculo no Sistema
                                </Text>

                                <Pressable
                                    onPress={() => handleOpenModal(index)}
                                    className={`flex-row items-center justify-between p-3 rounded-lg border ${isMatch ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-300'}`}
                                >
                                    <Text className={isMatch ? "text-gray-800 font-medium" : "text-gray-400 italic"}>
                                        {isMatch ? item.produtoSistemaNome : "Toque para selecionar produto..."}
                                    </Text>
                                    <Icon as={ChevronDown} size="xs" className="text-gray-400" />
                                </Pressable>
                            </View>
                        </View>
                    );
                })}
            </VStack>

            <View className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full">
                <Button
                    className="bg-[#195FA0] h-12 rounded-xl"
                    onPress={handleConfirmarTudo}
                    isDisabled={isSaving}
                >
                    {isSaving ? (
                        <ButtonSpinner color="#fff" />
                    ) : (
                        <ButtonText className="font-bold">Confirmar Itens</ButtonText>
                    )}
                </Button>
            </View>

            <ProdutoSelectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectProduct}
            />

            <TipoVeiculoSelectModal
                isOpen={showTipoModal}
                onClose={() => setShowTipoModal(false)}
                onSelect={setTipoVeiculo}
                selectedType={tipoVeiculo}
            />

        </ScrollView>
    );
}