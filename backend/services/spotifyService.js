const axios = require("axios");
const querystring = require("querystring");
const crypto = require("crypto");

const client_id = process.env.SPOTIFY_CLIENT_ID;
const secret_id = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

function generateRandomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length })
    .map(() => possible.charAt(Math.floor(Math.random() * possible.length)))
    .join("");
}

async function generateCodeChallenge(codeVerifier) {
  return crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

exports.getSpotifyAuthorizationUrl = async (session) => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  session.codeVerifier = codeVerifier;
  session.state = state;

  const scope = "user-read-private user-read-recently-played";
  return (
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      redirect_uri: redirect_uri,
      state: state,
      scope: scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    })
  );
};

exports.getUserProfile = async (accessToken) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to fetch user profile: ${
        error.response?.data?.error?.message || "Unknown error"
      }`
    );
  }
};

exports.exchangeCodeForTokens = async (code, session) => {
  const codeVerifier = session.codeVerifier;

  if (!codeVerifier) {
    throw new Error("Code verifier not found in session.");
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        code_verifier: codeVerifier,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error exchanging code for tokens:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to exchange code for tokens: ${
        error.response?.data?.error_description || "Unknown error"
      }`
    );
  }
};

exports.getRecentlyPlayedTracks = async (accessToken) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching recently played tracks:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to fetch recently played tracks: ${
        error.response?.data?.error?.message || "Unknown error"
      }`
    );
  }
};

exports.refreshAccessToken = async (user) => {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: user.refreshToken,
        client_id: client_id,
        client_secret: secret_id,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (response.status === 200) {
      const { access_token, refresh_token: newRefreshToken } = response.data;

      user.accessToken = access_token;
      user.expiresAt = new Date(Date.now() + 3600 * 1000);

      if (newRefreshToken) {
        user.refreshToken = newRefreshToken;
      }

      await user.save();
      return access_token;
    } else {
      throw new Error(`Failed to refresh access token: ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Error refreshing access token:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to refresh access token: ${
        error.response?.data?.error_description || "Unknown error"
      }`
    );
  }
};
