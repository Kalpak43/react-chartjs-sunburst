# Sunburst Chart Component

A React component for creating interactive, multi-level sunburst charts using Chart.js.

## Installation

```bash
npm i react-chartjs-sunburst
```

## Usage

```tsx
import { SunburstChart } from "react-chartjs-sunburst";

const data = {
  name: "Root",
  children: [
    {
      name: "Category A",
      children: [
        { name: "Sub A1", value: 100 },
        { name: "Sub A2", value: 50 },
      ],
    },
    {
      name: "Category B",
      value: 75,
    },
  ],
};

const config = {
  colors: ["#FF6384", "#36A2EB", "#FFCE56"],
  title: {
    text: "My Sunburst Chart",
    align: "center",
    fontSize: 20,
    color: "#000000",
  },
  labels: {
    enabled: true,
    showValues: true,
    fontSize: 12,
    color: "#FFFFFF",
  },
  tooltip: {
    enabled: true,
  },
  cutout: "10%",
};

function App() {
  return <SunburstChart data={data} config={config} />;
}
```

## API Reference

### Props

The `SunburstChart` component accepts two props:

#### `data: Data`

The hierarchical data structure that defines the chart:

```typescript
interface Data {
  name: string;
  value?: number;
  children?: Data[];
}
```

- `name`: Label for the segment
- `value`: (Optional) Numeric value for the segment
- `children`: (Optional) Array of child segments

If a node has both a value and children, the value will be computed as the sum of its children's values.

#### `config: ChartConfig`

Configuration object for customizing the chart:

```typescript
interface ChartConfig {
  colors: string[]; // Array of colors for the chart segments
  title: {
    text: string; // Chart title
    align?: "center" | "start" | "end";
    fontSize?: number;
    color?: string;
  };
  labels: {
    enabled: boolean; // Enable/disable labels
    fontSize?: number;
    color?: string;
    showValues?: boolean; // Show numeric values in labels
    valuesOnly?: boolean; // Show only values (no labels)
  };
  tooltip: {
    enabled: boolean; // Enable/disable tooltips
    custom?: (props: TooltipProps) => JSX.Element; // Custom tooltip component
    customOffsetX?: number; // Horizontal offset for custom tooltip
    customOffsetY?: number; // Vertical offset for custom tooltip
  };
  onArcClick?: (data: { label: string }) => void; // Click handler for segments
  cutout?: string; // Center cutout size (e.g., "10%")
}
```

### Tooltip Customization

You can provide a custom tooltip component through the `tooltip.custom` property. The component will receive the following props:

```typescript
interface TooltipProps {
  label: string; // Segment label
  value: number; // Segment value
  parentValue: number; // Parent segment value
  color?: string; // Segment color
}
```

Example custom tooltip:

```tsx
const CustomTooltip = ({ label, value, parentValue, color }: TooltipProps) => {
  const percentage = ((value / parentValue) * 100).toFixed(1);
  return (
    <div className="tooltip">
      <div>{label}</div>
      <div>Value: {value}</div>
      <div>Percentage: {percentage}%</div>
    </div>
  );
};
```

## Features

- 🎨 Customizable colors, labels, and tooltips
- 📊 Multi-level data visualization
- 🖱️ Interactive segments with click handling
- 📏 Responsive design
- 💡 Smart label positioning
- 🔄 Smooth animations
- 📱 Mobile-friendly
- 🎯 Percentage and value display

## Dependencies

- React 18.0+
- Chart.js 4.4+
- chartjs-plugin-datalabels 2.2+
- Tailwind CSS v4
- Other utility libraries (clsx, tailwind-merge, class-variance-authority)

## License

MIT
