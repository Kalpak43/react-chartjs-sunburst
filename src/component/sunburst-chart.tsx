import { useRef, useMemo, useEffect } from "react";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Tooltip,
  Title,
} from "chart.js";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import type { ChartConfiguration } from "chart.js";

import { useChartTooltip } from "../hooks/use-chart-tooltip";
import {
  createTitleConfig,
  createTooltipConfig,
  createDataLabelsConfig,
  createClickHandler,
} from "../lib/chart-config.util";
import { processChartData } from "../lib/chart.util";
import { cn } from "../lib/utils";
import { ChartConfig, Data } from "../types";

Chart.register([
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  DoughnutController,
  ArcElement,
  Tooltip,
  DataLabelsPlugin,
  Title,
]);

interface SunburstProps {
  data: Data;
  config: ChartConfig;
  height?: number;
  width?: number;
  className?: string;
}

export function SunburstChart({
  data,
  config,
  width = 400,
  height = 300,
  className = "",
}: SunburstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const animationCompleteRef = useRef(false);
  const { renderTooltip } = useChartTooltip(config);

  const { chartData, arcLabels } = useMemo(
    () => processChartData(data, config.colors),
    [data, config.colors]
  );

  // Create chart configuration
  const chartConfig: ChartConfiguration = useMemo(() => {
    return {
      type: "doughnut",
      data: chartData,
      options: {
        // ignore was added to avoid typescript error. the cutout option is available in the options but typescript is not recognizing it.
        // @ts-ignore
        cutout: config.cutout ?? "50%",
        responsive: true,
        animation: {
          onComplete: function () {
            animationCompleteRef.current = true;
            this.update();
          },
        },
        plugins: {
          title: createTitleConfig(config.title),
          tooltip: createTooltipConfig(
            config.tooltip,
            chartData,
            arcLabels,
            renderTooltip
          ),
          datalabels: {
            ...createDataLabelsConfig(config.labels, arcLabels),
            display: (context: any) => {
              if (!config.labels.enabled) return false;

              return (
                animationCompleteRef.current &&
                context.dataset.data[context.dataIndex] /
                  context.dataset.data.reduce(
                    (a: number, b: number) => a + b,
                    0
                  ) >
                  0.05
              );
            },
          },
        },
        onClick: createClickHandler(config.onArcClick, chartData, arcLabels),
      },
    };
  }, [chartData, arcLabels, config, renderTooltip]);

  useEffect(() => {
    if (!canvasRef.current) return;

    animationCompleteRef.current = false;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, config]);

  return (
    <div className={cn("max-w-[300px] md:max-w-[500px]", className)}>
      <canvas height={height} width={width} ref={canvasRef} />
    </div>
  );
}

export default SunburstChart;
