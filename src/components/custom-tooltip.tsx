interface CustomTooltipProps {
  label: string;
  value: number;
  parentValue?: number;
}

const CustomTooltip = ({ label, value, parentValue }: CustomTooltipProps) => {
  const percentage = parentValue
    ? ((value / parentValue) * 100).toFixed(1)
    : null;

  return (
    <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-xs">
      <div className="font-semibold">{label}</div>
      <div>Value: {value.toLocaleString()}</div>
      {percentage && <div>Percentage: {percentage}%</div>}
    </div>
  );
};

export default CustomTooltip;
