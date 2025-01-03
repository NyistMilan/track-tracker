import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopArtists = ({ data }) => {
  const artistCounts = data.reduce((acc, track) => {
    acc[track.artistName] = (acc[track.artistName] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(artistCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2
        className="text-2xl font-bold text-center mb-6 text-white"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Top Artists
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, bottom: 50, left: 10 }}
        >
          <XAxis
            dataKey="name"
            tick={{
              fill: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            interval={0}
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
          <Bar dataKey="count" fill="#4CAF50" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopArtists;
