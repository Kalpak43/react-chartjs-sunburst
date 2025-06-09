import { createRoot } from "react-dom/client";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  type ChartConfiguration,
  DoughnutController,
  ArcElement,
  Tooltip,
  type TooltipOptions,
  type ChartTypeRegistry,
  type ChartEvent,
  type ActiveElement,
  Title,
  type TitleOptions,
} from "chart.js";
import { useEffect, useRef } from "react";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import {
  computeValues,
  convertToChartLayers,
  extractArcLabels,
  flatten,
} from "../utils/chart.util";
import type { Options } from "chartjs-plugin-datalabels/types/options";

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
}

function SunburstChart({
  data,
  config: { colors, tooltip, labels, title, onArcClick },
}: SunburstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const tooltipRootRef = useRef<any>(null);

  computeValues(data);
  const flattenedDataset = flatten(data);
  const chartData = convertToChartLayers(flattenedDataset, colors);
  const arcLabels = extractArcLabels(flattenedDataset);

  const titleConfig: Partial<TitleOptions> = {
    display: !!title,
    text: title.text,
    align: title.align ?? "center",
    padding: {
      top: 5,
      bottom: 5,
    },
    font: {
      size: title.fontSize ?? 12,
    },
  };

  const tooltipConfig: Partial<TooltipOptions<keyof ChartTypeRegistry>> = {
    enabled: tooltip.custom ? false : tooltip.enabled, // Disable the built-in tooltip
    external: function (context) {
      if (!tooltip.enabled || !tooltip.custom) return;
      // Get tooltip element
      const tooltipEl = document.getElementById("chartjs-tooltip");
      if (!tooltipEl) return;

      // Hide if no tooltip
      const tooltipModel = context.tooltip;
      if (tooltipModel.opacity === 0) {
        tooltipEl!.style.opacity = "0";
        return;
      }

      // Set position
      const position = context.chart.canvas.getBoundingClientRect();
      tooltipEl!.style.position = "absolute";
      tooltipEl!.style.left = position.left + tooltipModel.caretX + "px";
      tooltipEl!.style.top = position.top + tooltipModel.caretY + "px";
      tooltipEl!.style.transform = `translate(${tooltip.customOffsetX ?? 0}%, ${
        tooltip.customOffsetY ?? 0
      }%)`;
      tooltipEl!.style.pointerEvents = "none";

      // Get data
      const datasetIndex = tooltipModel.dataPoints[0].datasetIndex;
      const dataIndex = tooltipModel.dataPoints[0].dataIndex;
      const flatIndex = getFlatIndex(datasetIndex, dataIndex);
      const label = arcLabels[flatIndex];
      const value = tooltipModel.dataPoints[0].raw as number;
      const dataset = chartData.datasets[datasetIndex];
      const parentValue = dataset.data.reduce(
        (a: number, b: number) => a + b,
        0
      );

      // Check if it's a dummy arc
      const isDummy = dataset.custom[dataIndex].isDummy;
      if (isDummy) {
        tooltipEl!.style.opacity = "0";
        return;
      }

      const CustomTooltip = tooltip.custom;

      // Safely render the tooltip
      if (tooltipRootRef.current) {
        tooltipRootRef.current.render(
          <CustomTooltip
            label={label}
            value={value}
            parentValue={parentValue}
          />
        );
      }

      tooltipEl!.style.opacity = "1";
    },
  };

  const labelConfig: Partial<Options> = {
    color: "#000000",
    font: {
      size: 11,
    },
    formatter: function (value: number, context: any) {
      const { datasetIndex, dataIndex } = context;
      const flatIndex = getFlatIndex(datasetIndex, dataIndex);
      const label = arcLabels[flatIndex];

      // Don't show labels for dummy arcs
      const dataset = context.dataset as any;
      const isDummy = dataset.custom?.[dataIndex]?.isDummy;
      if (isDummy) return "";

      // Return label and value
      return `${label}`;
    },
    align: "center",
    anchor: "center",
  };

  const handleClick = (
    event: ChartEvent,
    elements: ActiveElement[],
    chart: Chart
  ) => {
    if (!elements.length || !onArcClick) return;



    const element = elements[0];
    const { datasetIndex, index } = element;

    // Get the clicked arc's data
    const flatIndex = getFlatIndex(datasetIndex, index);
    const label = arcLabels[flatIndex];
    const value = chartData.datasets[datasetIndex].data[index];

    // Check if it's not a dummy arc
    const isDummy = chartData.datasets[datasetIndex].custom[index].isDummy;
    if (!isDummy) {
      onArcClick(label, value);
    }
  };

  useEffect(() => {
    // Create tooltip container if it doesn't exist
    let tooltipContainer = document.getElementById("chartjs-tooltip");
    if (!tooltipContainer) {
      tooltipContainer = document.createElement("div");
      tooltipContainer.id = "chartjs-tooltip";
      document.body.appendChild(tooltipContainer);
    }

    // Initialize tooltip root
    tooltipRootRef.current = createRoot(tooltipContainer);

    // Cleanup
    return () => {
      tooltipRootRef.current?.unmount();
      tooltipContainer?.remove();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext("2d");
      let animationComplete = false;

      // Configuration options
      const chartConfig: ChartConfiguration = {
        type: "doughnut", // Type of chart
        data: chartData,
        options: {
          // @ts-ignore
          cutout: "20%",
          responsive: true,
          animation: {
            onComplete: function () {
              animationComplete = true;
              this.update();
            },
          },
          plugins: {
            title: titleConfig,
            tooltip: tooltipConfig,
            datalabels: {
              ...labelConfig,
              display: function (context: any) {
                if (!animationComplete) return false;
                if (!labels) return false;
                // Hide labels for arcs that are too small
                const value = context.dataset.data[context.dataIndex];
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );

                return value / total > 0.05;
              },
            },
          },
          onClick: handleClick,
        },
      };

      chartInstanceRef.current = new Chart(ctx as any, chartConfig);

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }
  }, [data]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  function getFlatIndex(datasetIndex: number, dataIndex: number) {
    const data = chartData.datasets;
    let index = 0;
    for (let i = 0; i < datasetIndex; i++) {
      index += data[i].data.length;
    }
    return index + dataIndex;
  }

  return (
    <div className="border border-amber-600 rounded-md w-fit p-4">
      <div className="max-w-[300px] md:max-w-[500px]">
        <canvas height={300} width={400} ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default SunburstChart;
