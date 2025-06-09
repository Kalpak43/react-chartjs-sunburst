interface Data {
  name: string;
  value?: number;
  children?: Data[];
}

interface DataNode {
  label: string;
  data?: number;
  parentIndex: number;
}

interface ChartLabelConfig {
  enabled: boolean;
  fontSize?: number;
  color?: string;
  showValues?: boolean;
  valuesOnly?: boolean;
}

interface ChartTooltipConfig {
  enabled: boolean;
  custom?: (props: any) => JSX.Element;
  customOffsetX?: number;
  customOffsetY?: number;
}

interface TooltipProps {
  label: string;
  value: number;
  parentValue: number;
  color?: string;
}

interface ChartConfig {
  colors: string[];
  title: {
    text: string;
    align?: "center" | "start" | "end";
    fontSize?: number;
    color?: string;
  };
  labels: ChartLabelConfig;
  tooltip: ChartTooltipConfig;
  onArcClick?: ({}: any) => void;
  cutout?: string;
}

interface ChartData {
  datasets: any[];
}
