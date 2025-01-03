import React from "react";
import { Bar } from "react-chartjs-2";
import ChartJS from "../utils/chartConfig";

const TopArtistsChart = ({ data }) => {
  const artistCounts = data.reduce((acc, track) => {
    acc[track.artist_name] =
      (acc[track.artist_name] || 0) + parseInt(track.play_count || 0, 10);
    return acc;
  }, {});

  const sortedArtists = Object.entries(artistCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const topArtists = sortedArtists.slice(0, 10);

  const chartData = {
    labels: topArtists.map(([name]) =>
      name.length > 15 ? name.slice(0, 15) + "..." : name
    ),
    datasets: [
      {
        label: "Play Count",
        data: topArtists.map(([_, count]) => count),
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2
        className="text-2xl font-bold text-center mb-6"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Top Artists
      </h2>
      <div className="relative" style={{ height: "400px", width: "100%" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
              legend: {
                display: false,
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
              y: {
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: {
                  color: "#ffffff",
                  font: {
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

export default TopArtistsChart;
