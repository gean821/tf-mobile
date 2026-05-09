import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import IAgendamentoResponseDto from "@/src/Dtos/Agendamento/IAgendamentoResponseDto";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, MapPin, Package } from "lucide-react-native";
import { View } from "react-native";

interface CardProps {
    data: IAgendamentoResponseDto;
    isHistory?: boolean;
}

export const AgendamentoCard = ({ data, isHistory }: CardProps) => {

    const dataObj = parseISO(data.horarioInicio);
    const dia = format(dataObj, "dd 'de' MMM", { locale: ptBR });
    const hora = format(dataObj, "HH:mm");

    const getStatusStyle = (status: string) => {
        const s = status?.toString().toLowerCase() || "";

        if (s === 'confirmado' || s === 'emandamento' || s === 'agendado') {
            return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
        }
        if (s === 'concluido' || s === 'finalizado') {
            return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
        }
        if (s === 'cancelado') {
            return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
        }
        if (s === 'expirado') {
            return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
        }

        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
    };

    const style = getStatusStyle(data.status);

    const formatStatus = (status: string) => {
        if (!status) {
            return "-";
        }

        return status.replace(/([A-Z])/g, ' $1').trim();
    };

    return (
        <Pressable className={`bg-white rounded-2xl p-4 mb-4 border ${isHistory ? 'border-gray-200 opacity-90' : 'border-blue-100 shadow-sm'}`}>

            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                    <View className="bg-gray-50 p-2 rounded-lg items-center justify-center mr-3 border border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">{hora}</Text>
                        <Text className="text-[10px] text-gray-500 uppercase">{dia}</Text>
                    </View>
                    <View>
                        <Text className="font-bold text-gray-800 text-base">{data.fornecedor}</Text>
                        <View className="flex-row items-center mt-0.5">
                            <Icon as={MapPin} size="xs" className="text-gray-400 mr-1" />
                            <Text className="text-xs text-gray-500">{data.unidadeDescarga}</Text>
                        </View>
                    </View>
                </View>

                <View className={`px-2 py-1 rounded-md ${style.bg}`}>
                    <Text className={`text-[10px] font-bold uppercase ${style.text}`}>
                        {formatStatus(data.status)}
                    </Text>
                </View>
            </View>

            <View className="h-[1px] bg-gray-100 mb-3" />

            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Icon as={Package} size="xs" className="text-gray-400 mr-1.5" />
                    <Text className="text-sm font-medium text-gray-700">{data.produto}</Text>
                    {data.pesoCarga && (
                        <Text className="text-xs text-gray-400 ml-1">({data.pesoCarga} kg)</Text>
                    )}
                </View>

                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md">
                    <Icon as={FileText} size="xs" className="text-gray-400 mr-1.5" />
                    <Text className="text-xs font-bold text-gray-700">{data.notaFiscal}</Text>
                </View>
            </View>
        </Pressable>
    );
}

