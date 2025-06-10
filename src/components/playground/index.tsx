import { useState } from "react";
import CustomTooltip from "../custom-tooltip";
import { applianceData } from "@/static/data";
import { colorPresets } from "@/static/presets";
import ChartDisplay from "./chart-display";
import ConfigurationPanel from "./configuration-panel";

function filterByName(data: Data, keyword: string): Data | null {
  if (data.name === keyword) {
    return data;
  }

  if (data.children) {
    for (const child of data.children) {
      const result = filterByName(child, keyword);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

function filterWithPath(data: Data, keyword: string): Data | null {
  function hasMatchingDescendant(node: Data, keyword: string): boolean {
    if (node.name.toLowerCase().includes(keyword.toLowerCase())) {
      return true;
    }
    if (node.children) {
      return node.children.some((child) =>
        hasMatchingDescendant(child, keyword)
      );
    }
    return false;
  }

  function buildFilteredTree(node: Data, keyword: string): Data | null {
    const isMatch = node.name.toLowerCase().includes(keyword.toLowerCase());
    const hasMatchingChild =
      node.children?.some((child) => hasMatchingDescendant(child, keyword)) ||
      false;

    if (isMatch || hasMatchingChild) {
      const filteredNode: Data = {
        name: node.name,
        ...(node.value !== undefined && { value: node.value }),
      };

      if (isMatch && node.children) {
        filteredNode.children = node.children;
      } else if (!isMatch && node.children) {
        const filteredChildren = node.children
          .map((child) => buildFilteredTree(child, keyword))
          .filter((child): child is Data => child !== null);

        if (filteredChildren.length > 0) {
          filteredNode.children = filteredChildren;
        }
      }

      return filteredNode;
    }

    return null;
  }

  return buildFilteredTree(data, keyword);
}

export default function Playground() {
  const [data, setData] = useState(applianceData);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout>();
  const [searchTerm, setSearchTerm] = useState("");

  // Chart configuration state
  const [config, setConfig] = useState<ConfigurationState>({
    cutout: 10,
    selectedColorPreset: 0,
    titleText: applianceData.name,
    titleAlign: "start",
    titleFontSize: 20,
    titleColor: "#000000",
    labelsEnabled: true,
    showValues: true,
    valuesOnly: false,
    labelsFontSize: 8,
    labelsColor: "#ffffff",
    tooltipEnabled: true,
    customTooltip: true,
    tooltipOffsetX: -50,
    tooltipOffsetY: -100,
  });

  function handleArcClick(data: any) {
    const { label } = data;
    const filtered = filterByName(applianceData, label);
    if (filtered) {
      setData(filtered);
      setConfig((prev) => ({ ...prev, titleText: filtered.name }));
    }
  }

  function searchByKeyword(keyword: string) {
    setSearchTerm(keyword);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timer = setTimeout(() => {
      if (keyword.trim() === "") {
        setData(applianceData);
        setConfig((prev) => ({ ...prev, titleText: applianceData.name }));
      } else {
        const filtered = filterWithPath(applianceData, keyword);
        if (filtered) {
          setData(filtered);
          setConfig((prev) => ({ ...prev, titleText: `Search: ${keyword}` }));
        } else {
          setData(applianceData);
          setConfig((prev) => ({ ...prev, titleText: applianceData.name }));
        }
      }
    }, 300);

    setSearchTimer(timer);
  }

  function resetChart() {
    setData(applianceData);
    setConfig((prev) => ({ ...prev, titleText: applianceData.name }));
    setSearchTerm("");
  }

  function resetConfig() {
    setConfig({
      cutout: 10,
      selectedColorPreset: 0,
      titleText: config.titleText, // Keep current title
      titleAlign: "start",
      titleFontSize: 20,
      titleColor: "#000000",
      labelsEnabled: true,
      showValues: true,
      valuesOnly: false,
      labelsFontSize: 8,
      labelsColor: "#ffffff",
      tooltipEnabled: true,
      customTooltip: true,
      tooltipOffsetX: -50,
      tooltipOffsetY: -100,
    });
  }

  function updateConfig(updates: Partial<ConfigurationState>) {
    setConfig((prev) => ({ ...prev, ...updates }));
  }

  const chartConfig: ChartConfig = {
    cutout: `${config.cutout}%`,
    colors: colorPresets[config.selectedColorPreset].colors,
    title: {
      text: config.titleText,
      align: config.titleAlign,
      fontSize: config.titleFontSize,
      color: config.titleColor,
    },
    labels: {
      enabled: config.labelsEnabled,
      showValues: config.showValues,
      valuesOnly: config.valuesOnly,
      fontSize: config.labelsFontSize,
      color: config.labelsColor,
    },
    tooltip: {
      enabled: config.tooltipEnabled,
      custom: config.customTooltip ? CustomTooltip : undefined,
      customOffsetX: config.tooltipOffsetX,
      customOffsetY: config.tooltipOffsetY,
    },
    onArcClick: handleArcClick,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Sunburst Chart Playground
          </h1>
          <p className="text-slate-600">
            Interactive visualization with real-time configuration
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart Display */}
          <div className="lg:col-span-2">
            <ChartDisplay
              data={data}
              chartConfig={chartConfig}
              searchTerm={searchTerm}
              onSearch={searchByKeyword}
              onReset={resetChart}
            />
          </div>

          {/* Configuration Panel */}
          <ConfigurationPanel
            config={config}
            onConfigChange={updateConfig}
            onResetConfig={resetConfig}
            onResetChart={resetChart}
            isChartAtRoot={data === applianceData}
            hasSearchTerm={!!searchTerm}
          />
        </div>
      </div>
    </div>
  );
}
