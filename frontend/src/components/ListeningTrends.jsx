import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ListeningTrends = ({ data }) => {
  const trends = data.reduce((acc, track) => {
    const date = track.playedAt.split("T")[0];
    acc[date] = (acc[date] || 0) + track.durationMs / 60000;
    return acc;
  }, {});

  const chartData = Object.entries(trends).map(([date, minutes]) => ({
    date,
    minutes: parseFloat(minutes.toFixed(2)),
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2
        className="text-2xl font-bold text-center mb-6 text-white"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Listening Trends
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, bottom: 50, left: 10 }}
        >
          <XAxis
            dataKey="date"
            tick={{
              fill: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 10,
            }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickMargin={20}
            interval="preserveStartEnd"
            angle={-45}
            height={60}
          />
          <YAxis
            tick={{ fill: "#fff", fontFamily: "'Poppins', sans-serif" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontFamily: "'Poppins', sans-serif",
            }}
            itemStyle={{ color: "#4CAF50" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="#4CAF50"
            strokeWidth={3}
            dot={{ stroke: "#4CAF50", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningTrends;
