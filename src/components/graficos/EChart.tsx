import SvgChart, { SVGRenderer } from "@wuba/react-native-echarts/svgChart";
import type { EChartsOption } from "echarts";
import { BarChart, GaugeChart, PieChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

echarts.use([SVGRenderer, BarChart, PieChart, GaugeChart, GridComponent]);

interface EChartProps {
  option: EChartsOption;
  height: number;
  width?: number;
}

export function EChart({ option, height, width: larguraFixa }: EChartProps) {
  const svgRef = useRef<any>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const [largura, setLargura] = useState(larguraFixa ?? 0);

  const aoMedir = (e: LayoutChangeEvent) => {
    if (!larguraFixa) {
      setLargura(Math.round(e.nativeEvent.layout.width));
    }
  };

  useEffect(() => {
    if (!svgRef.current || largura === 0) {
      return;
    }

    const chart = echarts.init(svgRef.current, "light", {
      renderer: "svg",
      width: largura,
      height,
    });
    chartRef.current = chart;

    return () => {
      chart.dispose();
      chartRef.current = null;
    };
  }, [largura, height]);

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true });
  }, [option, largura, height]);

  return (
    <View onLayout={aoMedir} style={{ height, width: larguraFixa }}>
      <SvgChart ref={svgRef} useRNGH={false} />
    </View>
  );
}

export { echarts };
