"use client";

import { createElement, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export function useChartTooltip(config: ChartConfig) {
  const tooltipRootRef = useRef<any>(null);

  useEffect(() => {
    // Create tooltip container if it doesn't exist
    let tooltipContainer = document.getElementById("chartjs-tooltip");
    if (!tooltipContainer) {
      tooltipContainer = document.createElement("div");
      tooltipContainer.id = "chartjs-tooltip";
      document.body.appendChild(tooltipContainer);
    }

    // Initialize tooltip root
    tooltipRootRef.current = createRoot(tooltipContainer);

    // Cleanup
    return () => {
      tooltipRootRef.current?.unmount();
      tooltipContainer?.remove();
    };
  }, []);

  const renderTooltip = (props: TooltipProps) => {
    if (!config.tooltip.custom || !tooltipRootRef.current) return;

    const CustomTooltip = config.tooltip.custom;

    if (tooltipRootRef.current) {
      tooltipRootRef.current.render(createElement(CustomTooltip, props));
    }
  };

  return { renderTooltip };
}
