import React from "react";
import { Pie } from "react-chartjs-2";
import ChartJS from "../utils/chartConfig";

const TopAlbumsChart = ({ data }) => {
  const albumCounts = data.reduce((acc, track) => {
    acc[track.album_name] =
      (acc[track.album_name] || 0) + parseInt(track.play_count || 0, 10);
    return acc;
  }, {});

  const sortedAlbums = Object.entries(albumCounts).sort((a, b) => b[1] - a[1]);
  const topAlbums = sortedAlbums.slice(0, 10);

  const chartData = {
    labels: topAlbums.map(([name]) =>
      name.length > 20 ? name.slice(0, 20) + "..." : name
    ),
    datasets: [
      {
        data: topAlbums.map(([_, count]) => count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9F40",
          "#9966FF",
          "#00CED1",
          "#FFD700",
          "#C71585",
          "#4682B4",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2
        className="text-2xl font-bold text-center mb-6"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Top Albums
      </h2>
      <div className="flex justify-center items-center">
        <div
          style={{
            height: "500px",
            width: "500px",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <Pie
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color: "#FFFFFF",
                    font: {
                      family: "'Poppins', sans-serif",
                      size: 14,
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopAlbumsChart;
