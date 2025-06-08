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
} from "chart.js";
import { useEffect, useRef } from "react";
import DataLabelsPlugin from "chartjs-plugin-datalabels";

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
]);

function computeValues(node: Data): number {
  if (node.value !== undefined) {
    return node.value;
  }

  if (node.children && node.children.length > 0) {
    const total = node.children.reduce((sum, child) => {
      return sum + computeValues(child);
    }, 0);

    node.value = total;
    return total;
  }

  // Fallback: node has no value and no children
  node.value = 0;
  return 0;
}

function flatten(root: Data): DataNode[][] {
  const result: DataNode[][] = [];
  let currentLevel: Data[] = [root];
  let parentIndices: number[] = [-1]; // root has no parent

  while (currentLevel.length > 0) {
    const levelNodes: DataNode[] = [];
    const nextLevel: Data[] = [];
    const nextParentIndices: number[] = [];

    // Check if any node in this level has children
    const anyHasChildren = currentLevel.some(
      (node) => node.children && node.children.length > 0
    );

    currentLevel.forEach((node, index) => {
      const parentIndex = parentIndices[index];
      const currentNodeIndex = levelNodes.length;

      levelNodes.push({
        label: node.name,
        ...(node.value !== undefined ? { data: node.value } : {}),
        parentIndex,
      } as DataNode);

      if (node.children && node.children.length > 0) {
        for (let child of node.children) {
          nextLevel.push(child);
          nextParentIndices.push(currentNodeIndex);
        }
      } else if (anyHasChildren) {
        // No children, but siblings have -> insert dummy
        nextLevel.push({
          name: "Dummy",
          value: node.value ?? 0, // default to 0 if value is missing
        });
        nextParentIndices.push(currentNodeIndex);
      }
    });

    result.push(levelNodes);
    currentLevel = nextLevel;
    parentIndices = nextParentIndices;
  }

  return result;
}

function convertToChartLayers(data: DataNode[][], colors: string[]) {
  const label = data[0][0].label;
  data = data.slice(1);
  const datasets: any[] = [];

  let previousLevelColorRefs: string[] = [];

  const totalLevels = data.length;

  data.forEach((level, levelIndex) => {
    const dataset = {
      data: [] as number[],
      backgroundColor: [] as string[],
      borderColor: ["rgba(255, 255, 255, 1)"],
      hoverBackgroundColor: [] as string[],
      hoverBorderColor: [] as string[],
      borderWidth: 1,
      custom: [] as { isDummy: boolean }[],
    };

    dataset["custom"] = level.map((node) => ({
      isDummy: node.label === "Dummy",
    }));

    const currentLevelColorRefs: string[] = [];

    level.forEach((node, index) => {
      const isDummy = node.label === "Dummy";

      // Determine baseColor
      let baseColor: string;
      if (levelIndex === 0 || node.parentIndex === -1) {
        // Root node or top-level nodes get unique colors
        baseColor = colors[index % colors.length];
      } else {
        // Inherit color from parent node in previous level
        baseColor = previousLevelColorRefs[node.parentIndex];
      }

      currentLevelColorRefs.push(baseColor);

      // Calculate opacity based on depth
      const opacity = isDummy
        ? 0
        : Math.min(1, 0.2 + (totalLevels - levelIndex - 1) * 0.2);

      dataset.data.push(node.data ?? 0);
      dataset.backgroundColor.push(`${baseColor}, ${opacity})`);
      dataset.hoverBackgroundColor.push(`${baseColor}, ${isDummy ? 0 : 1})`);
      dataset.hoverBorderColor.push(`${baseColor}, ${isDummy ? 0 : 1})`);

      dataset.custom.push({ isDummy });
    });

    previousLevelColorRefs = currentLevelColorRefs;
    datasets.push(dataset);
  });

  // Reverse final datasets so inner ring (deepest level) is drawn last
  return { label, datasets: datasets.reverse() };
}

function extractArcLabels(data: DataNode[][]): string[] {
  // Flatten Node[][] to a single array following dataset structure
  return data
    .slice() // avoid mutating original
    .reverse() // match convertToChartLayers
    .flatMap((level) =>
      level.map((node) => (node.label === "Dummy" ? "" : node.label))
    );
}

function SunburstChart({ data, colors }: { data: Data; colors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  computeValues(data);
  const flattenedDataset = flatten(data);
  const chartData = convertToChartLayers(flattenedDataset, colors);
  const arcLabels = extractArcLabels(flattenedDataset);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      // Configuration options
      const chartConfig: ChartConfiguration = {
        type: "doughnut", // Type of chart
        data: chartData,
        options: {
          // @ts-ignore
          cutout: "0%",
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "black",
              },
            },
            tooltip: {
              enabled: false, // Disable the built-in tooltip
              external: function (context) {
                // Get tooltip element
                const tooltipEl = document.getElementById("chartjs-tooltip");

                // Create element on first render
                if (!tooltipEl) {
                  const div = document.createElement("div");
                  div.id = "chartjs-tooltip";
                  document.body.appendChild(div);
                }

                // Hide if no tooltip
                const tooltipModel = context.tooltip;
                if (tooltipModel.opacity === 0) {
                  tooltipEl!.style.opacity = "0";
                  return;
                }

                // Set position
                const position = context.chart.canvas.getBoundingClientRect();
                tooltipEl!.style.position = "absolute";
                tooltipEl!.style.left =
                  position.left + tooltipModel.caretX + "px";
                tooltipEl!.style.top =
                  position.top + tooltipModel.caretY + "px";
                tooltipEl!.style.transform = "translate(-50%, -100%)";
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

                // Render tooltip
                const root = createRoot(tooltipEl!);
                root.render(
                  <CustomTooltip
                    label={label}
                    value={value}
                    parentValue={parentValue}
                  />
                );

                tooltipEl!.style.opacity = "1";
              },
            },

            datalabels: {
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
              display: function (context: any) {
                // Hide labels for arcs that are too small
                const value = context.dataset.data[context.dataIndex];
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return value / total > 0.05; // Only show if arc is > 5% of total
              },
            },
          },
          onClick: (event, elements) => {
            if (!elements.length) return;

            const element = elements[0];
            const { datasetIndex, index } = element;

            // Get the clicked arc's data
            const flatIndex = getFlatIndex(datasetIndex, index);
            const label = arcLabels[flatIndex];
            const value = chartData.datasets[datasetIndex].data[index];

            // Check if it's not a dummy arc
            const isDummy =
              chartData.datasets[datasetIndex].custom[index].isDummy;
            if (!isDummy) {
              // onArcClick(label, value);
              alert(`${label} - ${value}`);
            }
          },
        },
      };

      // Create chart instance
      const myChart = new Chart(ctx as any, chartConfig);

      // Clean-up function to destroy the chart when the component unmounts
      return () => {
        myChart.destroy();
      };
    }
  }, []);

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
      <div className="max-w-[500px]">
        <canvas height={300} width={400} ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default SunburstChart;

interface CustomTooltipProps {
  label: string;
  value: number;
  parentValue?: number;
}

const CustomTooltip = ({ label, value, parentValue }: CustomTooltipProps) => {
  const percentage = parentValue
    ? ((value / parentValue) * 100).toFixed(1)
    : null;

  return (
    <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
      <div className="font-semibold">{label}</div>
      <div>Value: {value.toLocaleString()}</div>
      {percentage && <div>Percentage: {percentage}%</div>}
    </div>
  );
};
