import React, { useEffect, useState } from "react";
import TrackCard from "../components/TrackCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import ListeningTrends from "../components/ListeningTrends.jsx";
import TopArtists from "../components/TopArtists.jsx";
import ListeningByHour from "../components/ListeningByHour.jsx";
import ListeningStreaks from "../components/ListeningStreaks.jsx";
import TopSongs from "../components/TopSongs.jsx";

const CurrentHistory = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    totalListeningTime: 0,
    uniqueArtists: 0,
    uniqueTracks: 0,
    mostPlayedTrack: "",
  });

  useEffect(() => {
    fetchRecentTracks();
  }, []);

  const fetchRecentTracks = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tracks/recent`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        window.location.href = "/";
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch recent tracks");

      const data = await response.json();
      setTracks(data);
      calculateMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (data) => {
    const totalListeningTime = data.reduce(
      (sum, track) => sum + track.durationMs,
      0
    );
    const uniqueArtists = new Set(data.map((track) => track.artistName)).size;
    const uniqueTracks = new Set(data.map((track) => track.trackName)).size;

    const trackCounts = data.reduce((acc, track) => {
      acc[track.trackName] = (acc[track.trackName] || 0) + 1;
      return acc;
    }, {});
    const mostPlayedTrack = Object.keys(trackCounts).reduce((a, b) =>
      trackCounts[a] > trackCounts[b] ? a : b
    );

    setMetrics({
      totalListeningTime: (totalListeningTime / 60000).toFixed(2),
      uniqueArtists,
      uniqueTracks,
      mostPlayedTrack,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 mt-20">
      <div className="max-w-7xl mx-auto">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Total Listening Time
              </h2>
              <p className="text-2xl text-green-400">
                {metrics.totalListeningTime} min
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Unique Artists
              </h2>
              <p className="text-2xl text-green-400">{metrics.uniqueArtists}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Unique Tracks
              </h2>
              <p className="text-2xl text-green-400">{metrics.uniqueTracks}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Most Played Track
              </h2>
              <p className="text-lg text-gray-300">{metrics.mostPlayedTrack}</p>
            </div>
          </div>
        )}

        {!loading && !error && tracks.length > 0 && (
          <>
            <div className="mb-12">
              <ListeningTrends data={tracks} />
            </div>
            <div className="mb-12">
              <TopArtists data={tracks} />
            </div>
            <div className="mb-12">
              <TopSongs data={tracks} />
            </div>
            <div className="mb-12">
              <ListeningStreaks data={tracks} />
            </div>
            <div className="mb-12">
              <ListeningByHour data={tracks} />
            </div>
          </>
        )}

        {!loading && !error && tracks.length > 0 && (
          <div className="mt-10">
            <h2
              className="text-2xl font-bold text-center text-white mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Track List
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tracks.map((track, index) => (
                <TrackCard
                  key={index}
                  track={{
                    name: track.trackName,
                    artist: track.artistName,
                    albumName: track.albumName,
                    albumImage: track.albumImage,
                    playedAt: new Date(track.playedAt).toLocaleString(),
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && tracks.length === 0 && (
          <div className="text-center">
            <p className="text-lg text-gray-400">No recent tracks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentHistory;
