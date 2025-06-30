import { JSX } from "react";

export interface Data {
  name: string;
  value?: number;
  children?: Data[];
}

export interface DataNode {
  label: string;
  data?: number;
  parentIndex: number;
}

export interface ChartTitleConfig {
  text: string;
  align?: "center" | "start" | "end";
  fontSize?: number;
  color?: string;
}

export interface ChartLabelConfig {
  enabled: boolean;
  fontSize?: number;
  color?: string;
  showValues?: boolean;
  valuesOnly?: boolean;
}

export interface ChartTooltipConfig {
  enabled: boolean;
  custom?: (props: any) => JSX.Element;
  customOffsetX?: number;
  customOffsetY?: number;
}

export interface ChartConfig {
  colors: string[];
  title: ChartTitleConfig;
  labels: ChartLabelConfig;
  tooltip: ChartTooltipConfig;
  onArcClick?: ({}: any) => void;
  cutout?: string;
}

export interface TooltipProps {
  label: string;
  value: number;
  parentValue: number;
  color?: string;
}

export interface ChartData {
  datasets: any[];
}

export interface ConfigurationState {
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
