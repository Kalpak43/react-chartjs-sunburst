"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import SunburstChart from "../sunburst-chart";

interface ChartDisplayProps {
  data: Data;
  chartConfig: ChartConfig;
  searchTerm: string;
  onSearch: (term: string) => void;
  onReset: () => void;
}

export default function ChartDisplay({
  data,
  chartConfig,
  searchTerm,
  onSearch,
  onReset,
}: ChartDisplayProps) {
  return (
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
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
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
          className="drop-shadow-lg border-2 p-4 rounded-md"
          height={500}
          width={500}
        />
      </CardContent>
    </Card>
  );
}
