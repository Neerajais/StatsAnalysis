'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DashboardData, calculateESCounts, CHART_COLORS } from '@/lib/calculations';

interface ESChartProps {
  data: DashboardData[];
}

export default function ESChart({ data }: ESChartProps) {
  const chartData = useMemo(() => {
    const counts = calculateESCounts(data);
    return counts.map(item => ({
      name: item.name,
      value: item.value,
      percentage: item.percentage,
    }));
  }, [data]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold"
        fontSize={14}
      >
        {value}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="font-medium text-foreground">{data.value}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: <span className="font-medium text-accent">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">ES by Owner</h3>
        <p className="text-xs text-muted-foreground mt-1">Count of ES</p>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  label={renderCustomLabel}
                >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  paddingTop: '20px',
                }}
                formatter={(value, entry) => {
                  const data = entry.payload;
                  return `${value} (${data.percentage}%)`;
                }}
              />
            </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Table */}
          <div className="w-full bg-secondary/50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold text-foreground">ES</th>
                  <th className="text-right p-3 font-semibold text-foreground">Count</th>
                  <th className="text-right p-3 font-semibold text-foreground">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-b-0">
                    <td className="p-3">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                      />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </td>
                    <td className="text-right p-3 text-foreground">{item.value}</td>
                    <td className="text-right p-3 text-accent font-medium">
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="w-full text-center pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Total Records: <span className="font-bold text-foreground">{total}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data to display</p>
        </div>
      )}
    </div>
  );
}
