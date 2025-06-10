"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Settings, Palette, Type, Info } from "lucide-react";
import SunburstChart from "./sunburst-chart";
import CustomTooltip from "./custom-tooltip";
import { cn } from "@/lib/utils";
import type { JSX } from "react";
import { applianceData } from "@/static/data";
import { colorPresets } from "@/static/presets";

interface Data {
  name: string;
  value?: number;
  children?: Data[];
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
  onArcClick?: (data: any) => void;
  cutout?: string;
}

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
  const [cutout, setCutout] = useState(10);
  const [selectedColorPreset, setSelectedColorPreset] = useState(0);
  const [titleText, setTitleText] = useState(applianceData.name);
  const [titleAlign, setTitleAlign] = useState<"start" | "center" | "end">(
    "start"
  );
  const [titleFontSize, setTitleFontSize] = useState(20);
  const [titleColor, setTitleColor] = useState("#000000");
  const [labelsEnabled, setLabelsEnabled] = useState(true);
  const [showValues, setShowValues] = useState(true);
  const [valuesOnly, setValuesOnly] = useState(false);
  const [labelsFontSize, setLabelsFontSize] = useState(8);
  const [labelsColor, setLabelsColor] = useState("#ffffff");
  const [tooltipEnabled, setTooltipEnabled] = useState(true);
  const [customTooltip, setCustomTooltip] = useState<boolean>(true);
  const [tooltipOffsetX, setTooltipOffsetX] = useState(-50);
  const [tooltipOffsetY, setTooltipOffsetY] = useState(-100);

  function handleArcClick(data: any) {
    const { label } = data;
    const filtered = filterByName(applianceData, label);
    if (filtered) {
      setData(filtered);
      setTitleText(filtered.name);
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
        setTitleText(applianceData.name);
      } else {
        const filtered = filterWithPath(applianceData, keyword);
        if (filtered) {
          setData(filtered);
          setTitleText(`Search: ${keyword}`);
        } else {
          setData(applianceData);
          setTitleText(applianceData.name);
        }
      }
    }, 300);

    setSearchTimer(timer);
  }

  function resetChart() {
    setData(applianceData);
    setTitleText(applianceData.name);
    setSearchTerm("");
  }

  const chartConfig: ChartConfig = {
    cutout: `${cutout}%`,
    colors: colorPresets[selectedColorPreset].colors,
    title: {
      text: titleText,
      align: titleAlign,
      fontSize: titleFontSize,
      color: titleColor,
    },
    labels: {
      enabled: labelsEnabled,
      showValues: showValues,
      valuesOnly: valuesOnly,
      fontSize: labelsFontSize,
      color: labelsColor,
    },
    tooltip: {
      enabled: tooltipEnabled,
      custom: customTooltip ? CustomTooltip : undefined,
      customOffsetX: tooltipOffsetX,
      customOffsetY: tooltipOffsetY,
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
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    Chart Visualization
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Interactive
                  </Badge>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search nodes..."
                    value={searchTerm}
                    onChange={(e) => searchByKeyword(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetChart}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex justify-center items-center min-h-[500px] rounded-lg">
                <SunburstChart
                  data={data}
                  config={chartConfig}
                  className="drop-shadow-lg border-2  p-4 rounded-md"
                  height={500}
                  width={500}
                />
              </CardContent>
            </Card>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-4">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Configuration
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="general" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      General
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="text-xs">
                      <Palette className="w-3 h-3 mr-1" />
                      Colors
                    </TabsTrigger>
                    <TabsTrigger value="text" className="text-xs">
                      <Type className="w-3 h-3 mr-1" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="tooltip" className="text-xs">
                      <Info className="w-3 h-3 mr-1" />
                      Tooltip
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Inner Cutout: {cutout}%
                      </Label>
                      <Slider
                        value={[cutout]}
                        onValueChange={(value) => setCutout(value[0])}
                        max={80}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-slate-500">
                        Controls the size of the inner circle (donut hole)
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Color Preset
                      </Label>
                      <div className="grid grid-cols-1 gap-2">
                        {colorPresets.map((preset, index) => (
                          <div
                            key={index}
                            className={cn(
                              "p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                              selectedColorPreset === index
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            )}
                            onClick={() => setSelectedColorPreset(index)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {preset.name}
                              </span>
                              {selectedColorPreset === index && (
                                <Badge variant="default" className="text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {preset.colors.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="w-4 h-4 rounded-full border border-slate-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-4">
                      {/* Title Configuration */}
                      <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Type className="w-4 h-4" />
                          Title Configuration
                        </h4>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Title Text
                          </Label>
                          <Input
                            value={titleText}
                            onChange={(e) => setTitleText(e.target.value)}
                            className="text-sm"
                            placeholder="Enter chart title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Title Alignment
                          </Label>
                          <Select
                            value={titleAlign}
                            onValueChange={(x) => {
                              setTitleAlign(x as "start" | "center" | "end");
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="start">
                                Start (Left)
                              </SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="end">End (Right)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Title Font Size: {titleFontSize}px
                          </Label>
                          <Slider
                            value={[titleFontSize]}
                            onValueChange={(value) =>
                              setTitleFontSize(value[0])
                            }
                            max={32}
                            min={12}
                            step={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Title Color
                          </Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="color"
                              value={titleColor}
                              onChange={(e) => setTitleColor(e.target.value)}
                              className="h-10 w-16"
                            />
                            <Input
                              type="text"
                              value={titleColor}
                              onChange={(e) => setTitleColor(e.target.value)}
                              className="text-sm font-mono"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Labels Configuration */}
                      <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Badge className="w-4 h-4" />
                          Labels Configuration
                        </h4>

                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Enable Labels
                          </Label>
                          <Switch
                            checked={labelsEnabled}
                            onCheckedChange={setLabelsEnabled}
                          />
                        </div>

                        {labelsEnabled && (
                          <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                  Show Values
                                </Label>
                                <p className="text-xs text-slate-500">
                                  Display numeric values on labels
                                </p>
                              </div>
                              <Switch
                                checked={showValues}
                                onCheckedChange={setShowValues}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="text-sm font-medium">
                                  Values Only
                                </Label>
                                <p className="text-xs text-slate-500">
                                  Show only values, hide label text
                                </p>
                              </div>
                              <Switch
                                checked={valuesOnly}
                                onCheckedChange={setValuesOnly}
                                disabled={!showValues}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Labels Font Size: {labelsFontSize}px
                              </Label>
                              <Slider
                                value={[labelsFontSize]}
                                onValueChange={(value) =>
                                  setLabelsFontSize(value[0])
                                }
                                max={16}
                                min={6}
                                step={1}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Labels Color
                              </Label>
                              <div className="flex gap-2 items-center">
                                <Input
                                  type="color"
                                  value={labelsColor}
                                  onChange={(e) =>
                                    setLabelsColor(e.target.value)
                                  }
                                  className="h-10 w-16"
                                />
                                <Input
                                  type="text"
                                  value={labelsColor}
                                  onChange={(e) =>
                                    setLabelsColor(e.target.value)
                                  }
                                  className="text-sm font-mono"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tooltip" className="space-y-4">
                    <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Tooltip Configuration
                      </h4>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">
                            Enable Tooltip
                          </Label>
                          <p className="text-xs text-slate-500">
                            Show tooltip on hover
                          </p>
                        </div>
                        <Switch
                          checked={tooltipEnabled}
                          onCheckedChange={setTooltipEnabled}
                        />
                      </div>

                      {tooltipEnabled && (
                        <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              Use Custom Tooltip
                            </Label>
                            <Switch
                              checked={customTooltip}
                              onCheckedChange={setCustomTooltip}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Horizontal Offset: {tooltipOffsetX}px
                            </Label>
                            <Slider
                              value={[tooltipOffsetX]}
                              onValueChange={(value) =>
                                setTooltipOffsetX(value[0])
                              }
                              max={100}
                              min={-100}
                              step={5}
                              disabled={!customTooltip}
                            />
                            <p className="text-xs text-slate-500">
                              Positive values move tooltip right, negative
                              values move left
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Vertical Offset: {tooltipOffsetY}px
                            </Label>
                            <Slider
                              value={[tooltipOffsetY]}
                              onValueChange={(value) =>
                                setTooltipOffsetY(value[0])
                              }
                              max={100}
                              min={-100}
                              step={5}
                              disabled={!customTooltip}
                            />
                            <p className="text-xs text-slate-500">
                              Positive values move tooltip down, negative values
                              move up
                            </p>
                          </div>

                          {customTooltip && (
                            <div className="p-2 bg-white rounded border">
                              <p className="text-xs text-slate-600 mb-1">
                                Preview:
                              </p>
                              <CustomTooltip
                                label="Sample Node"
                                value={123}
                                parentValue={45}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Configuration Summary */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Configuration Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="font-medium">Cutout:</span> {cutout}%
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="font-medium">Colors:</span>{" "}
                    {colorPresets[selectedColorPreset].name}
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="font-medium">Title:</span> {titleAlign}
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="font-medium">Labels:</span>{" "}
                    {labelsEnabled
                      ? valuesOnly
                        ? "Values Only"
                        : "Enabled"
                      : "Disabled"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={resetChart}
                  variant="outline"
                  className="w-full text-sm"
                  disabled={data === applianceData && !searchTerm}
                >
                  Reset to Root
                </Button>
                <Button
                  onClick={() => {
                    setCutout(10);
                    setSelectedColorPreset(0);
                    setTitleAlign("start");
                    setTitleFontSize(20);
                    setTitleColor("#000000");
                    setLabelsEnabled(true);
                    setShowValues(true);
                    setValuesOnly(false);
                    setLabelsFontSize(8);
                    setLabelsColor("#ffffff");
                    setTooltipEnabled(true);
                    setTooltipOffsetX(-50);
                    setTooltipOffsetY(-100);
                  }}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Reset Config
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
