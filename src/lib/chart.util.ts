import { Data, DataNode } from "../types";
import { colorWithOpacity } from "./color.util";

// computes the value of each node
export function computeValues(node: Data): number {
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

// converts the tree structure to array format
export function flatten(root: Data): DataNode[][] {
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

// convert the array format data from flatten stage to Chart.js compatible strucrture
export function convertToChartLayers(data: DataNode[][], colors: string[]) {
  const label = data[0][0].label;
  if (data.length > 1) data = data.slice(1);
  const datasets: any[] = [];

  let previousLevelColorRefs: string[] = [];

  data.forEach((level, levelIndex) => {
    const dataset = {
      data: [] as number[],
      backgroundColor: [] as string[],
      borderColor: [] as string[],
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
      const opacity = isDummy ? 0 : Math.min(0.9, 1 - levelIndex * 0.2);

      dataset.data.push(node.data ?? 0);
      isDummy
        ? dataset.borderColor.push(`rgba(255, 255, 255, 0`)
        : dataset.borderColor.push(`rgba(255, 255, 255, 1`);

      dataset.backgroundColor.push(colorWithOpacity(baseColor, opacity));
      dataset.hoverBackgroundColor.push(
        colorWithOpacity(baseColor, isDummy ? 0 : 1)
      );
      dataset.hoverBorderColor.push(
        colorWithOpacity(baseColor, isDummy ? 0 : 0.5)
      );
      dataset.custom.push({ isDummy });
    });

    previousLevelColorRefs = currentLevelColorRefs;
    datasets.push(dataset);
  });

  // Reverse final datasets so inner ring (deepest level) is drawn last
  return { label, datasets: datasets.reverse() };
}

// extracts all the labels into 1D array
export function extractArcLabels(data: DataNode[][]): string[] {
  return data
    .slice() 
    .reverse() 
    .flatMap((level) =>
      level.map((node) => (node.label === "Dummy" ? "" : node.label))
    );
}

// processes the original data and utilizes the above functions to prepare it for plotting
export function processChartData(data: Data, colors: string[]) {
  computeValues(data);
  const flattenedDataset = flatten(data);
  const chartData = convertToChartLayers(flattenedDataset, colors);
  const arcLabels = extractArcLabels(flattenedDataset);

  return {
    chartData,
    arcLabels,
    flattenedDataset,
  };
}
