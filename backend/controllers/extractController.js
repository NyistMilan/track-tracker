const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.getFullHistory = async (req, res) => {
  const userId = req.session.spotifyId;

  try {
    const query = `
    WITH track_stats AS (
      SELECT
        track_id,
        MIN(played_at) AS first_played_at,
        MAX(played_at) AS last_played_at,
        COUNT(*) AS play_count,
        SUM(duration_ms) AS total_listening_time
      FROM raw.spotify_tracks
      WHERE user_id = $1
      GROUP BY track_id
    ),
    deduped_tracks AS (
      SELECT DISTINCT ON (track_id)
        track_id,
        track_name,
        artist_name,
        album_name
      FROM raw.spotify_tracks
      WHERE user_id = $1
      ORDER BY track_id, played_at DESC
    )
    SELECT
      ts.track_id,
      ts.first_played_at,
      ts.last_played_at,
      ts.play_count,
      ts.total_listening_time,
      dt.track_name,
      dt.artist_name,
      dt.album_name,
      to_char(ts.first_played_at, 'YYYY-MM') AS played_month
    FROM track_stats ts
    JOIN deduped_tracks dt ON ts.track_id = dt.track_id
    ORDER BY ts.play_count DESC;
    `;

    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching full history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
