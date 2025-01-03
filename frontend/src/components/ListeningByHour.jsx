import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ListeningByHour = ({ data }) => {
  const hourlyCounts = data.reduce((acc, track) => {
    const hour = new Date(track.playedAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const chartData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    plays: hourlyCounts[hour] || 0,
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2
        className="text-2xl font-bold text-center mb-6 text-white"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Listening Activity by Hour
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 50, left: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="hour"
            tick={{
              fill: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickMargin={10}
          />
          <YAxis
            tick={{
              fill: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
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
          <Bar dataKey="plays" fill="#4CAF50" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningByHour;
