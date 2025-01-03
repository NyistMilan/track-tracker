const User = require("../models/User");
const spotifyService = require("../services/spotifyService");
const { refreshAccessToken } = require("./authController");
const cassandra = require("../config/cassandra");

exports.getUserRecentTracks = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = await refreshAccessToken(user, false);

    const recentTracks = await spotifyService.getRecentlyPlayedTracks(
      accessToken
    );

    const trackList = recentTracks.map((item) => ({
      spotifyId: user.spotifyId,
      playedAt: item.played_at,
      trackId: item.track?.id || "unknown",
      trackName: item.track?.name || "unknown",
      artistId: item.track?.artists?.[0]?.id || "unknown",
      artistName: item.track?.artists?.[0]?.name || "unknown",
      albumId: item.track?.album?.id || "unknown",
      albumName: item.track?.album?.name || "unknown",
      albumImage: item.track?.album?.images?.[0]?.url || "unknown",
      durationMs: item.track?.duration_ms || 0,
    }));

    res.json(trackList);
  } catch (error) {
    console.error("Error fetching recent tracks:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchRecentTracksForUsers = async (req, res) => {
  try {
    const userFilter =
      req.body.userIds && req.body.userIds.length > 0
        ? { spotifyId: { $in: req.body.userIds } }
        : {};

    const users = await User.find(userFilter);

    const results = [];
    for (const user of users) {
      try {
        const accessToken = await refreshAccessToken(user, false);
        const recentTracks = await spotifyService.getRecentlyPlayedTracks(
          accessToken
        );
        results.push({
          userId: user.spotifyId,
          success: true,
          tracks: recentTracks,
        });
      } catch (error) {
        console.error(`Error for user ${user.spotifyId}: ${error.message}`);
        results.push({
          userId: user.spotifyId,
          success: false,
          message: error.message,
        });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error("Error in /fetch-recent-tracks:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
