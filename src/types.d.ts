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

interface ChartTitleConfig {
  text: string;
  align?: "center" | "start" | "end";
  fontSize?: number;
  color?: string;
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
  title: ChartTitleConfig;
  labels: ChartLabelConfig;
  tooltip: ChartTooltipConfig;
  onArcClick?: ({}: any) => void;
  cutout?: string;
}

interface TooltipProps {
  label: string;
  value: number;
  parentValue: number;
  color?: string;
}

interface ChartData {
  datasets: any[];
}

interface ConfigurationState {
  cutout: number;
  selectedColorPreset: number;
  titleText: string;
  titleAlign: "start" | "center" | "end";
  titleFontSize: number;
  titleColor: string;
  labelsEnabled: boolean;
  showValues: boolean;
  valuesOnly: boolean;
  labelsFontSize: number;
  labelsColor: string;
  tooltipEnabled: boolean;
  customTooltip: boolean;
  tooltipOffsetX: number;
  tooltipOffsetY: number;
}
