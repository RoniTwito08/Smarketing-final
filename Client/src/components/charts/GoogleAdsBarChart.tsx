import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  date: string;
}

interface Props {
  data: CampaignMetrics[];
}

const GoogleAdsBarChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map((metric) => ({
    date: metric.date,
    clicks: metric.clicks,
    cost: parseFloat(metric.cost.toFixed(2)),
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="date" tick={{ dy: 12 }} label={{ value: '', dy: 16 }} />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ dx: -6, dy: 6 }} label={{ value: '', dy: 16 }} />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ dx: 6, dy: 6 }} label={{ value: '', dy: 16 }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="clicks" fill="#8884d8" name="קליקים" barSize={24} radius={[8, 8, 0, 0]} style={{ marginBottom: 12 }} />
          <Bar yAxisId="right" dataKey="cost" fill="#82ca9d" name="עלות לקליק" barSize={24} radius={[8, 8, 0, 0]} style={{ marginBottom: 12 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoogleAdsBarChart;
