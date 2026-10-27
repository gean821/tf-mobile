import type { EChartsOption } from "echarts";
import { useMemo } from "react";

import { EChart, echarts } from "@/src/components/graficos/EChart";
import { CORES_GRAFICO, FONTE_GRAFICO } from "@/src/components/graficos/tema";
import { RelatorioMotoristaMesDto } from "@/src/Dtos/Motorista/relatorioMotoristaDto";

interface BarrasMensaisProps {
  meses: RelatorioMotoristaMesDto[];
}

export function BarrasMensais({ meses }: BarrasMensaisProps) {
  const option = useMemo<EChartsOption>(() => {
    const ultimo = meses.length - 1;

    return {
      textStyle: FONTE_GRAFICO,
      animationDuration: 800,
      animationEasing: "cubicOut",
      grid: { left: 0, right: 0, top: 26, bottom: 26 },
      xAxis: {
        type: "category",
        data: meses.map((m) => m.rotulo),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: CORES_GRAFICO.textoSuave,
          fontSize: 12,
          margin: 10,
          formatter: (valor: string, indice: number) =>
            indice === ultimo ? `{atual|${valor}}` : valor,
          rich: {
            atual: {
              color: CORES_GRAFICO.texto,
              fontWeight: "bold",
              fontSize: 12,
            },
          },
        },
      },
      yAxis: { type: "value", show: false, minInterval: 1 },
      series: [
        {
          type: "bar",
          barWidth: "54%",
          showBackground: true,
          backgroundStyle: { color: CORES_GRAFICO.trilho, borderRadius: 10 },
          label: {
            show: true,
            position: "top",
            fontSize: 12,
            fontWeight: "bold",
            color: "#475569",
            formatter: (p: any) => (p.value > 0 ? String(p.value) : ""),
          },
          data: meses.map((m, i) => ({
            value: m.entregas,
            label: i === ultimo ? { color: CORES_GRAFICO.primaria } : undefined,
            itemStyle: {
              borderRadius: [10, 10, 4, 4],
              color:
                i === ultimo
                  ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: CORES_GRAFICO.primariaClara },
                      { offset: 1, color: CORES_GRAFICO.primaria },
                    ])
                  : CORES_GRAFICO.barraInativa,
            },
          })),
        },
      ],
    };
  }, [meses]);

  return <EChart option={option} height={190} />;
}
