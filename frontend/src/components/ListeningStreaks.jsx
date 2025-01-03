import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ListeningStreaks = ({ data }) => {
  const uniqueDates = Array.from(
    new Set(data.map((track) => track.playedAt.split("T")[0]))
  ).sort();

  const streaks = [];
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);

    if ((currDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
      currentStreak += 1;
    } else {
      streaks.push({
        day: uniqueDates[i - 1],
        streak: currentStreak,
      });
      currentStreak = 1;
    }
  }

  streaks.push({
    day: uniqueDates[uniqueDates.length - 1],
    streak: currentStreak,
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2
        className="text-2xl font-bold text-center mb-6 text-white"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Listening Streaks
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={streaks}
          margin={{ top: 20, right: 30, bottom: 50, left: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="day"
            tick={{
              fill: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            tickMargin={10}
            interval="preserveStartEnd"
            angle={-45}
            height={60}
          />
          <YAxis
            tick={{
              fill: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: 12,
            }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            width={40}
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
            cursor={{ stroke: "#4CAF50", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="streak"
            stroke="#4CAF50"
            strokeWidth={3}
            dot={{ stroke: "#4CAF50", strokeWidth: 3, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ListeningStreaks;
