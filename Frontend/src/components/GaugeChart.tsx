import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface GaugeChartProps {
  value: number;
  max: number;
  title: string;
  unit: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ value, max, title, unit }) => {
  // Calculate the percentage and ensure it's valid
  const percentage = isNaN(value) ? 0 : (value / max) * 100;  // Check if `value` is NaN
  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ];

  // Function to determine color based on the percentage
  const getColor = (percent: number) => {
    if (percent <= 60) return '#22c55e';  // Green
    if (percent <= 80) return '#eab308';  // Yellow
    return '#ef4444';  // Red
  };

  return (
    <div className="relative flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <div className="relative w-48 h-24">
        <PieChart width={192} height={96}>
          <Pie
            data={data}
            cx={96}
            cy={96}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={getColor(percentage)} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[-100%] text-center">
          <span className="text-2xl font-bold text-black dark:text-black">
            {isNaN(value) ? '0' : value} {/* Handle NaN gracefully */}
          </span>
          <span className="text-sm ml-1 text-gray-700 dark:text-gray-700">{unit}</span>
        </div>
      </div>
    </div>
  );
};
