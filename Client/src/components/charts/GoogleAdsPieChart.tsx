import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type Datum = { name: string; value: number };

export interface GoogleAdsPieChartProps {
  data: Datum[];
  activeKey?: string;                  // שם הפרוסה להדגשה (אופציונלי)
  colorsMap?: Record<string, string>;  // מיפוי פלטפורמה->צבע
  innerRadius?: number;
  outerRadius?: number;
}

const DEFAULT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8b5cf6", "#14b8a6"];

const GoogleAdsPieChart: React.FC<GoogleAdsPieChartProps> = ({
  data,
  activeKey,
  colorsMap,
  innerRadius = 60,
  outerRadius = 90,
}) => {
  const colorFor = (name: string, idx: number) =>
    colorsMap?.[name] ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          isAnimationActive={false}
        >
          {data.map((entry, idx) => {
            const isActive = activeKey ? entry.name === activeKey : false;
            return (
              <Cell
                key={`cell-${entry.name}-${idx}`}
                fill={colorFor(entry.name, idx)}
                stroke={isActive ? "#111827" : "#ffffff"}
                strokeWidth={isActive ? 3 : 1}
                opacity={activeKey && !isActive ? 0.45 : 1}
              />
            );
          })}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GoogleAdsPieChart;


