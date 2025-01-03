import React from "react";
import { Bar } from "react-chartjs-2";
import ChartJS from "../utils/chartConfig";

const ListeningTrendsChart = ({ data }) => {
  const groupedData = data.reduce((acc, track) => {
    const month = new Date(track.first_played_at).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + parseInt(track.play_count || 0, 10);
    return acc;
  }, {});

  const sortedMonths = Object.keys(groupedData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const sortedPlayCounts = sortedMonths.map((month) => groupedData[month]);

  const chartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Monthly Play Count",
        data: sortedPlayCounts,
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2
        className="text-2xl font-bold text-center mb-6"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Listening Trends
      </h2>
      <div className="relative" style={{ height: "400px", width: "100%" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  color: "#ffffff",
                  font: {
                    family: "'Poppins', sans-serif",
                  },
                },
              },
            },
            scales: {
              x: {
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: {
                  color: "#ffffff",
                  font: {
                    family: "'Poppins', sans-serif",
                  },
                },
                title: {
                  display: true,
                  text: "Month",
                  color: "#ffffff",
                  font: {
                    size: 14,
                    family: "'Poppins', sans-serif",
                  },
                },
              },
              y: {
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: {
                  color: "#ffffff",
                  font: {
                    family: "'Poppins', sans-serif",
                  },
                  callback: function (value) {
                    return value.toLocaleString();
                  },
                },
                title: {
                  display: true,
                  text: "Play Count",
                  color: "#ffffff",
                  font: {
                    size: 14,
                    family: "'Poppins', sans-serif",
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ListeningTrendsChart;
