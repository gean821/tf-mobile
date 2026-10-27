import type { EChartsOption } from "echarts";
import { Target } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EChart } from "@/src/components/graficos/EChart";
import { CORES_GRAFICO } from "@/src/components/graficos/tema";
import { formatarPercentual } from "@/src/utils/relatorio";

const TAMANHO = 112;

interface MedidorComparecimentoProps {
  percentual: number | null;
  compareceu: number;
  total: number;
}

const corDoPercentual = (pct: number) =>
  pct >= 90
    ? CORES_GRAFICO.sucesso
    : pct >= 70
      ? CORES_GRAFICO.alerta
      : CORES_GRAFICO.perigo;

const mensagem = (pct: number) =>
  pct >= 90
    ? "Excelente! Você quase não perde horário."
    : pct >= 70
      ? "Bom, mas dá para melhorar."
      : "Atenção aos seus horários.";

export function MedidorComparecimento({
  percentual,
  compareceu,
  total,
}: MedidorComparecimentoProps) {
  const valor = percentual ?? 0;
  const cor =
    percentual === null ? CORES_GRAFICO.textoSuave : corDoPercentual(valor);

  const option = useMemo<EChartsOption>(
    () => ({
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 100,
          radius: "92%",
          pointer: { show: false },
          progress: {
            show: true,
            roundCap: true,
            width: 12,
            itemStyle: { color: cor },
          },
          axisLine: {
            lineStyle: { width: 12, color: [[1, CORES_GRAFICO.trilho]] },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          detail: { show: false },
          title: { show: false },
          animationDuration: 1000,
          animationEasing: "cubicOut",
          data: [{ value: valor }],
        },
      ],
    }),
    [valor, cor],
  );

  return (
    <View className="bg-white rounded-3xl p-5 border border-gray-100">
      <HStack className="items-center" space="lg">
        <View style={{ width: TAMANHO, height: TAMANHO }}>
          <EChart option={option} width={TAMANHO} height={TAMANHO} />
          <View
            className="absolute inset-0 items-center justify-center"
            pointerEvents="none"
          >
            <Text className="font-bold text-xl" style={{ color: cor }}>
              {percentual === null ? "—" : formatarPercentual(valor)}
            </Text>
          </View>
        </View>

        <VStack className="flex-1" space="xs">
          <HStack className="items-center" space="xs">
            <Icon as={Target} size="sm" className="text-gray-500" />
            <Text className="text-gray-500 text-xs font-semibold">
              Comparecimento
            </Text>
          </HStack>
          {percentual === null ? (
            <Text className="text-gray-800 font-bold text-base">
              Sem horários encerrados ainda
            </Text>
          ) : (
            <>
              <Text className="text-gray-900 font-bold text-base">
                {compareceu} de {total} horários
              </Text>
              <Text className="text-gray-400 text-xs">{mensagem(valor)}</Text>
            </>
          )}
        </VStack>
      </HStack>
    </View>
  );
}
