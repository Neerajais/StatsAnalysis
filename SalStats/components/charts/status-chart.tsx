'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Label,
} from 'recharts';
import { DashboardData, calculateStatusCounts, CHART_COLORS } from '@/lib/calculations';

interface StatusChartProps {
  data: DashboardData[];
}

export default function StatusChart({ data }: StatusChartProps) {
  const chartData = useMemo(() => {
    const counts = calculateStatusCounts(data);
    return counts.map(item => ({
      name: item.name,
      value: item.value,
      percentage: item.percentage,
    }));
  }, [data]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

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
        <h3 className="text-lg font-bold text-foreground">Status by Owner</h3>
        <p className="text-xs text-muted-foreground mt-1">Count of Status</p>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="flex flex-col gap-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
                label={{
                  position: 'top',
                  fill: 'hsl(var(--foreground))',
                  fontSize: 12,
                  fontWeight: 600,
                  offset: 5,
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Stats Table */}
          <div className="bg-secondary/50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold text-foreground">Status</th>
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
                        className="inline-block w-3 h-3 rounded mr-2"
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
          <div className="text-center pt-2 border-t border-border">
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
