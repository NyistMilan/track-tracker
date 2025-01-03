import React, { useEffect, useState } from "react";
import ListeningTrendsChart from "../components/ListeningTrendsChart.jsx";
import TopArtistsChart from "../components/TopArtistsChart.jsx";
import TrackAnalyticsTable from "../components/TrackAnalyticsTable.jsx";
import TopAlbumsChart from "../components/TopAlbumsChart.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FullHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    totalListeningTime: 0,
    totalPlayCount: 0,
    mostPlayedTrack: "N/A",
    mostPlayedArtist: "N/A",
  });

  useEffect(() => {
    fetchFullHistory();
  }, []);

  const fetchFullHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tracks/full_history`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        window.location.href = "/";
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch full history");

      const data = await response.json();
      setHistory(data);
      calculateMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data) => {
    if (!data || data.length === 0) {
      setMetrics({
        totalListeningTime: 0,
        totalPlayCount: 0,
        mostPlayedTrack: "N/A",
        mostPlayedArtist: "N/A",
      });
      return;
    }

    const totalListeningTime = data.reduce(
      (sum, track) => sum + parseInt(track.total_listening_time || 0, 10),
      0
    );
    const totalPlayCount = data.reduce(
      (sum, track) => sum + parseInt(track.play_count || 0, 10),
      0
    );

    const trackCounts = data.reduce((acc, track) => {
      acc[track.track_name] =
        (acc[track.track_name] || 0) + parseInt(track.play_count || 0, 10);
      return acc;
    }, {});

    const artistCounts = data.reduce((acc, track) => {
      acc[track.artist_name] =
        (acc[track.artist_name] || 0) + parseInt(track.play_count || 0, 10);
      return acc;
    }, {});

    const mostPlayedTrack = Object.keys(trackCounts).reduce((a, b) =>
      trackCounts[a] > trackCounts[b] ? a : b
    );

    const mostPlayedArtist = Object.keys(artistCounts).reduce((a, b) =>
      artistCounts[a] > artistCounts[b] ? a : b
    );

    setMetrics({
      totalListeningTime: (totalListeningTime / 3600000).toFixed(2) + " hours",
      totalPlayCount: totalPlayCount.toLocaleString("en-US"),
      mostPlayedTrack,
      mostPlayedArtist,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 mt-20">
      <div className="max-w-7xl mx-auto">
        {loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                >
                  <Skeleton width={150} height={20} className="mb-2" />
                  <Skeleton width={100} height={30} />
                </div>
              ))}
            </div>
            <Skeleton height={300} className="mb-12" />
            <Skeleton height={300} className="mb-12" />
            <Skeleton height={300} className="mb-12" />
          </>
        )}

        {error && (
          <div className="text-center">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h2
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Total Listening Time
                </h2>
                <p className="text-2xl text-green-400">
                  {metrics.totalListeningTime}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h2
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Total Play Count
                </h2>
                <p className="text-2xl text-green-400">
                  {metrics.totalPlayCount}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h2
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Most Played Track
                </h2>
                <p className="text-lg text-gray-300">
                  {metrics.mostPlayedTrack}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h2
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Most Played Artist
                </h2>
                <p className="text-lg text-gray-300">
                  {metrics.mostPlayedArtist}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <ListeningTrendsChart data={history} />
            </div>
            <div className="mb-12">
              <TopArtistsChart data={history} />
            </div>
            <div className="mb-12">
              <TopAlbumsChart data={history} />
            </div>
            <div className="mb-12">
              <TrackAnalyticsTable data={history} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FullHistory;
