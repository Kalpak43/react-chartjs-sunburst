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

interface ChartConfig {
  colors: string[];
  title: {
    text: string;
    align?: "center" | "start" | "end";
    fontSize?: number;
  };
  labels: ChartLabelConfig;
  tooltip: ChartTooltipConfig;
  onArcClick?: (label: string, value?: string) => void;
}

interface ChartData {
  datasets: any[];
}
