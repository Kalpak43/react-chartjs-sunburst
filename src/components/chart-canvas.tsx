import { forwardRef } from "react";
import cn from "../utils/cn.util";

interface ChartCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export const ChartCanvas = forwardRef<HTMLCanvasElement, ChartCanvasProps>(
  ({ width = 400, height = 300, className = "" }, ref) => {
    return (
      <div className={cn("max-w-[300px] md:max-w-[500px]", className)}>
        <canvas height={height} width={width} ref={ref} />
      </div>
    );
  }
);

ChartCanvas.displayName = "ChartCanvas";
