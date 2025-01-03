import React from "react";
import ChartJS from "../utils/chartConfig";

const TrackAnalyticsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h2
          className="text-2xl font-semibold text-white"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          No Data Available
        </h2>
        <p className="text-gray-300">
          Your listening history will appear here when available.
        </p>
      </div>
    );
  }

  const sortedData = [...data]
    .sort((a, b) => b.play_count - a.play_count)
    .slice(0, 100);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
      <h2
        className="text-2xl font-bold text-white mb-6 text-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Top 100 Listened Tracks
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Track Name</th>
              <th className="px-4 py-3">Artist</th>
              <th className="px-4 py-3">Album</th>
              <th className="px-4 py-3">Play Count</th>
              <th className="px-4 py-3">Listening Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((track, index) => (
              <tr
                key={track.track_id || `${track.track_name}-${index}`}
                className={`${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                } hover:bg-gray-600 transition-all duration-200`}
              >
                <td className="px-4 py-2 text-gray-300">{index + 1}</td>
                <td className="px-4 py-2 text-white">
                  {track.track_name || "Unknown"}
                </td>
                <td className="px-4 py-2 text-gray-300">
                  {track.artist_name || "Unknown"}
                </td>
                <td className="px-4 py-2 text-gray-300">
                  {track.album_name || "Unknown"}
                </td>
                <td className="px-4 py-2 text-green-400">
                  {track.play_count || 0}
                </td>
                <td className="px-4 py-2 text-gray-300">
                  {(track.total_listening_time / 3600000).toFixed(2) || 0} hrs
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackAnalyticsTable;
