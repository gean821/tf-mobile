import type { EChartsOption } from "echarts";
import { useMemo } from "react";
import { View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EChart } from "@/src/components/graficos/EChart";
import { CORES_SERIES } from "@/src/components/graficos/tema";
import { RelatorioMotoristaFatiaDto } from "@/src/Dtos/Motorista/relatorioMotoristaDto";
import { formatarPercentual, formatarPeso, formatarPesoTexto } from "@/src/utils/relatorio";

const TAMANHO = 150;

interface RoscaProdutosProps {
  fatias: RelatorioMotoristaFatiaDto[];
}

export function RoscaProdutos({ fatias }: RoscaProdutosProps) {
  const total = formatarPeso(fatias.reduce((soma, f) => soma + f.pesoKg, 0));

  const option = useMemo<EChartsOption>(
    () => ({
      animationDuration: 900,
      animationEasing: "cubicOut",
      series: [
        {
          type: "pie",
          radius: ["66%", "94%"],
          center: ["50%", "50%"],
          padAngle: fatias.length > 1 ? 3 : 0,
          itemStyle: { borderRadius: 8 },
          label: { show: false },
          labelLine: { show: false },
          emphasis: { scale: false },
          data: fatias.map((f, i) => ({
            name: f.nome,
            value: f.percentual,
            itemStyle: { color: CORES_SERIES[i % CORES_SERIES.length] },
          })),
        },
      ],
    }),
    [fatias],
  );

  return (
    <VStack space="lg">
      <View className="items-center">
        <View style={{ width: TAMANHO, height: TAMANHO }}>
          <EChart option={option} width={TAMANHO} height={TAMANHO} />
          <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
            <Text className="text-gray-900 font-bold text-2xl">{total.valor}</Text>
            <Text className="text-gray-400 text-[11px] font-medium">{total.unidade} no total</Text>
          </View>
        </View>
      </View>

      <VStack space="md">
        {fatias.map((fatia, i) => (
          <HStack key={fatia.nome} className="items-center" space="sm">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CORES_SERIES[i % CORES_SERIES.length] }}
            />
            <VStack className="flex-1">
              <Text className="text-gray-800 text-sm font-semibold" numberOfLines={1}>
                {fatia.nome}
              </Text>
              <Text className="text-gray-400 text-[11px]">
                {formatarPesoTexto(fatia.pesoKg)} • {fatia.entregas} {fatia.entregas === 1 ? "entrega" : "entregas"}
              </Text>
            </VStack>
            <Text className="text-gray-800 text-base font-bold">{formatarPercentual(fatia.percentual)}</Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
