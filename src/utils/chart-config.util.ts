import type {
  TitleOptions,
  TooltipOptions,
  ChartTypeRegistry,
  ChartEvent,
  ActiveElement,
} from "chart.js";
import type { Options as DataLabelsOptions } from "chartjs-plugin-datalabels/types/options";

export function createTitleConfig(
  title: ChartConfig["title"]
): Partial<TitleOptions> {
  return {
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
}

export function createTooltipConfig(
  tooltip: ChartConfig["tooltip"],
  chartData: ChartData,
  arcLabels: string[],
  renderTooltip: (props: any) => void
): Partial<TooltipOptions<keyof ChartTypeRegistry>> {
  return {
    enabled: tooltip.custom ? false : tooltip.enabled,
    external: (context) => {
      if (!tooltip.enabled || !tooltip.custom) return;

      const tooltipEl = document.getElementById("chartjs-tooltip");
      if (!tooltipEl) return;

      const tooltipModel = context.tooltip;
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = "0";
        return;
      }

      // Set position
      const position = context.chart.canvas.getBoundingClientRect();
      tooltipEl.style.position = "absolute";
      tooltipEl.style.left = position.left + tooltipModel.caretX + "px";
      tooltipEl.style.top = position.top + tooltipModel.caretY + "px";
      tooltipEl.style.transform = `translate(${tooltip.customOffsetX ?? 0}%, ${
        tooltip.customOffsetY ?? 0
      }%)`;
      tooltipEl.style.pointerEvents = "none";

      // Get data
      const datasetIndex = tooltipModel.dataPoints[0].datasetIndex;
      const dataIndex = tooltipModel.dataPoints[0].dataIndex;
      const flatIndex = getFlatIndex(datasetIndex, dataIndex, chartData);
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
        tooltipEl.style.opacity = "0";
        return;
      }

      renderTooltip({ label, value, parentValue });
      tooltipEl.style.opacity = "1";
    },
  };
}

export function createDataLabelsConfig(
  labels: boolean,
  arcLabels: string[]
): Partial<DataLabelsOptions> {
  const labelOccurrences = new Map<string, number[]>();

  return {
    color: "#000000",
    font: {
      size: 11,
    },
    formatter: (value: number, context: any) => {
      const { datasetIndex, dataIndex } = context;
      const flatIndex = getFlatIndex(
        datasetIndex,
        dataIndex,
        context.chart.data
      );
      const label = arcLabels[flatIndex];

      // Don't show labels for dummy arcs
      const dataset = context.dataset as any;
      const isDummy = dataset.custom?.[dataIndex]?.isDummy;
      if (isDummy) return "";

      // Track occurrences of each label with their flatIndices
      if (!labelOccurrences.has(label)) {
        labelOccurrences.set(label, [flatIndex]);
      } else {
        const indices = labelOccurrences.get(label)!;
        if (!indices.includes(flatIndex)) {
          indices.push(flatIndex);
        }
      }

      // Only add numbering if this label appears multiple times
      const indices = labelOccurrences.get(label)!;
      if (indices.length > 1) {
        const position = indices.indexOf(flatIndex) + 1;
        return `${label} (${position})`;
      }

      return label;
    },
    align: "center",
    anchor: "center",
    display: (context: any) => {
      if (!labels) return false;

      // Hide labels for arcs that are too small
      const value = context.dataset.data[context.dataIndex];
      const total = context.dataset.data.reduce(
        (a: number, b: number) => a + b,
        0
      );
      return value / total > 0.05;
    },
  };
}

export function getFlatIndex(
  datasetIndex: number,
  dataIndex: number,
  chartData: ChartData
): number {
  const data = chartData.datasets;
  let index = 0;
  for (let i = 0; i < datasetIndex; i++) {
    index += data[i].data.length;
  }
  return index + dataIndex;
}

export function createClickHandler(
  onArcClick: ChartConfig["onArcClick"],
  chartData: ChartData,
  arcLabels: string[]
) {
  return (event: ChartEvent, elements: ActiveElement[]) => {
    if (!elements.length || !onArcClick) return;

    const element = elements[0];
    const { datasetIndex, index } = element;

    // Get the clicked arc's data
    const flatIndex = getFlatIndex(datasetIndex, index, chartData);
    const label = arcLabels[flatIndex];
    const value = chartData.datasets[datasetIndex].data[index];

    // Check if it's not a dummy arc
    const isDummy = chartData.datasets[datasetIndex].custom[index].isDummy;
    if (!isDummy) {
      onArcClick(label, value);
    }
  };
}
