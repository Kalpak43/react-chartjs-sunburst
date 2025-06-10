"use client";

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
import { Settings, Palette, Type, Info } from "lucide-react";
import CustomTooltip from "../custom-tooltip";
import { cn } from "@/lib/utils";
import { colorPresets } from "@/static/presets";

interface ConfigurationPanelProps {
  config: ConfigurationState;
  onConfigChange: (updates: Partial<ConfigurationState>) => void;
  onResetConfig: () => void;
  onResetChart: () => void;
  isChartAtRoot: boolean;
  hasSearchTerm: boolean;
}

export default function ConfigurationPanel({
  config,
  onConfigChange,
  onResetConfig,
  onResetChart,
  isChartAtRoot,
  hasSearchTerm,
}: ConfigurationPanelProps) {
  return (
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
                  Inner Cutout: {config.cutout}%
                </Label>
                <Slider
                  value={[config.cutout]}
                  onValueChange={(value) =>
                    onConfigChange({ cutout: value[0] })
                  }
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
                <Label className="text-sm font-medium">Color Preset</Label>
                <div className="grid grid-cols-1 gap-2">
                  {colorPresets.map((preset, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                        config.selectedColorPreset === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                      onClick={() =>
                        onConfigChange({ selectedColorPreset: index })
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {preset.name}
                        </span>
                        {config.selectedColorPreset === index && (
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
                    <Label className="text-sm font-medium">Title Text</Label>
                    <Input
                      value={config.titleText}
                      onChange={(e) =>
                        onConfigChange({ titleText: e.target.value })
                      }
                      className="text-sm"
                      placeholder="Enter chart title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Title Alignment
                    </Label>
                    <Select
                      value={config.titleAlign}
                      onValueChange={(value) =>
                        onConfigChange({
                          titleAlign: value as "start" | "center" | "end",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="start">Start (Left)</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="end">End (Right)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Title Font Size: {config.titleFontSize}px
                    </Label>
                    <Slider
                      value={[config.titleFontSize]}
                      onValueChange={(value) =>
                        onConfigChange({ titleFontSize: value[0] })
                      }
                      max={32}
                      min={12}
                      step={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Title Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="color"
                        value={config.titleColor}
                        onChange={(e) =>
                          onConfigChange({ titleColor: e.target.value })
                        }
                        className="h-10 w-16"
                      />
                      <Input
                        type="text"
                        value={config.titleColor}
                        onChange={(e) =>
                          onConfigChange({ titleColor: e.target.value })
                        }
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
                    <Label className="text-sm font-medium">Enable Labels</Label>
                    <Switch
                      checked={config.labelsEnabled}
                      onCheckedChange={(checked) =>
                        onConfigChange({ labelsEnabled: checked })
                      }
                    />
                  </div>

                  {config.labelsEnabled && (
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
                          checked={config.showValues}
                          onCheckedChange={(checked) =>
                            onConfigChange({ showValues: checked })
                          }
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
                          checked={config.valuesOnly}
                          onCheckedChange={(checked) =>
                            onConfigChange({ valuesOnly: checked })
                          }
                          disabled={!config.showValues}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Labels Font Size: {config.labelsFontSize}px
                        </Label>
                        <Slider
                          value={[config.labelsFontSize]}
                          onValueChange={(value) =>
                            onConfigChange({ labelsFontSize: value[0] })
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
                            value={config.labelsColor}
                            onChange={(e) =>
                              onConfigChange({ labelsColor: e.target.value })
                            }
                            className="h-10 w-16"
                          />
                          <Input
                            type="text"
                            value={config.labelsColor}
                            onChange={(e) =>
                              onConfigChange({ labelsColor: e.target.value })
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
                    checked={config.tooltipEnabled}
                    onCheckedChange={(checked) =>
                      onConfigChange({ tooltipEnabled: checked })
                    }
                  />
                </div>

                {config.tooltipEnabled && (
                  <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Use Custom Tooltip
                      </Label>
                      <Switch
                        checked={config.customTooltip}
                        onCheckedChange={(checked) =>
                          onConfigChange({ customTooltip: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Horizontal Offset: {config.tooltipOffsetX}px
                      </Label>
                      <Slider
                        value={[config.tooltipOffsetX]}
                        onValueChange={(value) =>
                          onConfigChange({ tooltipOffsetX: value[0] })
                        }
                        max={100}
                        min={-100}
                        step={5}
                        disabled={!config.customTooltip}
                      />
                      <p className="text-xs text-slate-500">
                        Positive values move tooltip right, negative values move
                        left
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Vertical Offset: {config.tooltipOffsetY}px
                      </Label>
                      <Slider
                        value={[config.tooltipOffsetY]}
                        onValueChange={(value) =>
                          onConfigChange({ tooltipOffsetY: value[0] })
                        }
                        max={100}
                        min={-100}
                        step={5}
                        disabled={!config.customTooltip}
                      />
                      <p className="text-xs text-slate-500">
                        Positive values move tooltip down, negative values move
                        up
                      </p>
                    </div>

                    {config.customTooltip && (
                      <div className="p-2 bg-white rounded border">
                        <p className="text-xs text-slate-600 mb-1">Preview:</p>
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
              <span className="font-medium">Cutout:</span> {config.cutout}%
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <span className="font-medium">Colors:</span>{" "}
              {colorPresets[config.selectedColorPreset].name}
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <span className="font-medium">Title:</span> {config.titleAlign}
            </div>
            <div className="p-2 bg-slate-50 rounded">
              <span className="font-medium">Labels:</span>{" "}
              {config.labelsEnabled
                ? config.valuesOnly
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
            onClick={onResetChart}
            variant="outline"
            className="w-full text-sm"
            disabled={isChartAtRoot && !hasSearchTerm}
          >
            Reset to Root
          </Button>
          <Button
            onClick={onResetConfig}
            variant="outline"
            className="w-full text-sm"
          >
            Reset Config
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
