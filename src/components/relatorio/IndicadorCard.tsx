import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type CorIndicador = "blue" | "green" | "orange" | "red" | "purple";

const CORES: Record<CorIndicador, { fundo: string; icone: string }> = {
  blue: { fundo: "bg-blue-50", icone: "text-primary-500" },
  green: { fundo: "bg-emerald-50", icone: "text-emerald-600" },
  orange: { fundo: "bg-orange-50", icone: "text-orange-500" },
  red: { fundo: "bg-rose-50", icone: "text-rose-500" },
  purple: { fundo: "bg-violet-50", icone: "text-violet-600" },
};

interface IndicadorCardProps {
  icone: any;
  rotulo: string;
  valor: string;
  detalhe?: string;
  cor?: CorIndicador;
}

export function IndicadorCard({ icone, rotulo, valor, detalhe, cor = "blue" }: IndicadorCardProps) {
  const estilo = CORES[cor];

  return (
    <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
      <View className={`${estilo.fundo} self-start p-2 rounded-xl mb-3`}>
        <Icon as={icone} size="sm" className={estilo.icone} />
      </View>
      <Text className="text-gray-900 font-bold text-2xl">{valor}</Text>
      <Text className="text-gray-500 text-xs font-medium mt-0.5">{rotulo}</Text>
      {detalhe ? <Text className="text-gray-400 text-[11px] mt-1">{detalhe}</Text> : null}
    </View>
  );
}
