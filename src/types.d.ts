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

interface ChartConfig {
  colors: string[];
  title: {
    text: string;
    align?: "center" | "start" | "end";
    fontSize?: number;
  };
  labels: boolean;
  tooltip: {
    enabled: boolean;
    custom?: (props: any) => JSX.Element;
    customOffsetX?: number;
    customOffsetY?: number;
  };
  onArcClick?: (label: string, value?: string) => void;
}

interface ChartData {
  datasets: any[];
}
