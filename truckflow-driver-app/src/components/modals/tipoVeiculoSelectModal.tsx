import { Modal, ScrollView, View, TouchableWithoutFeedback } from 'react-native';import { TipoVeiculo } from "@/src/enums/TipoVeiculo";
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Check, Truck, X } from 'lucide-react-native';

export const TipoVeiculoLabels: Record<number, string> = {
    [TipoVeiculo.CarretaDoisEixos]: "Carreta 2 Eixos",
    [TipoVeiculo.Ls]: "LS (Cavalo Mecânico)",
    [TipoVeiculo.CarretaCavaloTrucado]: "Carreta Cavalo Trucado",
    [TipoVeiculo.BiTrem]: "Bitrem",
    [TipoVeiculo.TriTrem]: "Tritrem",
    [TipoVeiculo.RodoTrem]: "Rodotrem",
    [TipoVeiculo.CarretaBau]: "Carreta Baú",
    [TipoVeiculo.CarretaSider]: "Carreta Sider",
    [TipoVeiculo.Vanderleia]: "Vanderléia",
    [TipoVeiculo.BauFrigorifico]: "Baú Frigorífico"
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (tipo: TipoVeiculo) => void;
    selectedType?: TipoVeiculo;
}


export const TipoVeiculoSelectModal = ({ isOpen, onClose, onSelect, selectedType }: Props) => {
    const opcoes = Object.keys(TipoVeiculoLabels).map(key => Number(key));

    const handleSelect = (tipo: number) => {
        onSelect(tipo as TipoVeiculo);
        onClose();
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >

            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/60 justify-end">

                    <TouchableWithoutFeedback>
                        <View className="bg-white w-full rounded-t-[30px] max-h-[80%]">

                            <View className="p-6 border-b border-gray-100 flex-row justify-between items-center">
                                <View>
                                    <Text className="text-xl font-bold text-gray-800">Tipo de Veículo</Text>
                                    <Text className="text-xs text-gray-500">Selecione a carroceria utilizada</Text>
                                </View>
                                <Pressable onPress={onClose} className="bg-gray-100 p-2 rounded-full">
                                    <Icon as={X} size="sm" className="text-gray-500" />
                                </Pressable>
                            </View>

                            <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
                                {opcoes.map((key) => {
                                    const isSelected = selectedType === key;

                                    return (
                                        <Pressable
                                            key={key}
                                            onPress={() => handleSelect(key)}
                                            className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${isSelected
                                                    ? 'bg-blue-50 border-[#195FA0]'
                                                    : 'bg-white border-gray-100'
                                                }`}
                                        >
                                            <View className="flex-row items-center gap-3">
                                                <View className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                                                    <Icon
                                                        as={Truck}
                                                        size="sm"
                                                        className={isSelected ? 'text-[#195FA0]' : 'text-gray-400'}
                                                    />
                                                </View>
                                                <Text className={`text-base ${isSelected ? 'font-bold text-[#195FA0]' : 'font-medium text-gray-700'}`}>
                                                    {TipoVeiculoLabels[key]}
                                                </Text>
                                            </View>

                                            {isSelected && (
                                                <Icon as={Check} size="sm" className="text-[#195FA0]" />
                                            )}
                                        </Pressable>
                                    );
                                })}
                                <View className="h-10" />
                            </ScrollView>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

}