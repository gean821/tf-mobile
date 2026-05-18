import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import IAgendamentoResponseDto from "@/src/Dtos/Agendamento/IAgendamentoResponseDto";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    ChevronRight,
    FileText,
    MapPin,
    Package,
    QrCode,
} from "lucide-react-native";
import { View } from "react-native";

interface CardProps {
  data: IAgendamentoResponseDto;
  isHistory?: boolean;
  onPress?: () => void;
}

export const AgendamentoCard = ({ data, isHistory, onPress }: CardProps) => {
  const dataObj = parseISO(data.horarioInicio);
  const dia = format(dataObj, "dd 'de' MMM", { locale: ptBR });
  const hora = format(dataObj, "HH:mm");

  const getStatusStyle = (status: string) => {
    const s = status?.toString().toLowerCase() || "";

    if (s === "confirmado" || s === "emandamento" || s === "agendado") {
      return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    }
    if (s === "concluido" || s === "finalizado") {
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      };
    }
    if (s === "cancelado") {
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
      };
    }
    if (s === "expirado") {
      return {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
      };
    }

    return {
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-200",
    };
  };

  const style = getStatusStyle(data.status);

  const formatStatus = (status: string) => {
    if (!status) {
      return "-";
    }

    return status.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <Pressable
      onPress={onPress}
      className={`bg-white rounded-2xl p-4 mb-4 border active:opacity-80 active:scale-[0.99] ${isHistory ? "border-gray-200 opacity-90" : "border-blue-100 shadow-sm"}`}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-gray-50 p-2 rounded-lg items-center justify-center mr-3 border border-gray-100">
            <Text className="text-lg font-bold text-gray-800">{hora}</Text>
            <Text className="text-[10px] text-gray-500 uppercase">{dia}</Text>
          </View>
          <View className="flex-1">
            <Text
              className="font-bold text-gray-800 text-base"
              numberOfLines={1}
            >
              {data.fornecedor}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <Icon as={MapPin} size="xs" className="text-gray-400 mr-1" />
              <Text className="text-xs text-gray-500" numberOfLines={1}>
                {data.unidadeEntrega}
              </Text>
            </View>
          </View>
        </View>

        <View className={`px-2 py-1 rounded-md ml-2 ${style.bg}`}>
          <Text className={`text-[10px] font-bold uppercase ${style.text}`}>
            {formatStatus(data.status)}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-gray-100 mb-3" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <Icon as={Package} size="xs" className="text-gray-400 mr-1.5" />
          <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
            {data.produto}
          </Text>
          {data.pesoCarga ? (
            <Text className="text-xs text-gray-400 ml-1">
              ({data.pesoCarga} kg)
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md ml-2">
          <Icon as={FileText} size="xs" className="text-gray-400 mr-1.5" />
          <Text className="text-xs font-bold text-gray-700">
            {data.notaFiscal}
          </Text>
        </View>
      </View>

      {!isHistory && (
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
          <View className="flex-row items-center">
            <Icon as={QrCode} size="xs" className="text-[#195FA0] mr-1.5" />
            <Text className="text-[#195FA0] text-xs font-bold">
              Ver ticket para apresentar
            </Text>
          </View>
          <Icon as={ChevronRight} size="sm" className="text-[#195FA0]" />
        </View>
      )}
    </Pressable>
  );
};
