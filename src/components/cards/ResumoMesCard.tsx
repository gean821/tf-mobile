import { ChartColumnBig, ChevronRight } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { VariacaoBadge } from "@/src/components/relatorio/VariacaoBadge";
import { PRIMARY_500 } from "@/src/constants/colors";
import { useRelatorioMotorista } from "@/src/hooks/useRelatorioMotorista";
import { formatarPercentual, formatarPeso } from "@/src/utils/relatorio";

interface ResumoMesCardProps {
  onPress: () => void;
}

function Numero({ valor, unidade, rotulo }: { valor: string; unidade?: string; rotulo: string }) {
  return (
    <VStack className="flex-1">
      <HStack className="items-end" space="xs">
        <Text className="text-gray-900 font-bold text-2xl">{valor}</Text>
        {unidade ? <Text className="text-gray-400 font-semibold text-sm mb-0.5">{unidade}</Text> : null}
      </HStack>
      <Text className="text-gray-400 text-[11px] font-medium">{rotulo}</Text>
    </VStack>
  );
}

export function ResumoMesCard({ onPress }: ResumoMesCardProps) {
  const { relatorio, carregando } = useRelatorioMotorista("mes");
  const atual = relatorio?.atual;
  const peso = formatarPeso(atual?.pesoKg ?? 0);

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]" accessibilityLabel="Abrir meu desempenho">
      <View className="bg-white rounded-3xl p-5 border border-gray-100">
        <HStack className="items-center justify-between mb-4">
          <HStack className="items-center" space="sm">
            <View className="bg-emerald-50 p-2.5 rounded-xl">
              <Icon as={ChartColumnBig} size="md" className="text-emerald-600" />
            </View>
            <VStack>
              <Text className="text-gray-900 font-bold text-base">Seu mês</Text>
              <Text className="text-gray-400 text-xs">Meu desempenho</Text>
            </VStack>
          </HStack>
          <HStack className="items-center" space="xs">
            <VariacaoBadge valor={relatorio?.variacaoEntregasPct ?? null} />
            <Icon as={ChevronRight} size="sm" className="text-gray-300" />
          </HStack>
        </HStack>

        {carregando || !atual ? (
          <ActivityIndicator color={PRIMARY_500} />
        ) : (
          <HStack space="md">
            <Numero valor={String(atual.concluidas)} rotulo={atual.concluidas === 1 ? "entrega" : "entregas"} />
            <Numero valor={peso.valor} unidade={peso.unidade} rotulo="descarregadas" />
            <Numero
              valor={atual.comparecimentoPct === null ? "—" : formatarPercentual(atual.comparecimentoPct)}
              rotulo="comparecimento"
            />
          </HStack>
        )}
      </View>
    </Pressable>
  );
}
