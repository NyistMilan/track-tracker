const spotifyService = require("../services/spotifyService");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const authURL = await spotifyService.getSpotifyAuthorizationUrl(
      req.session
    );

    req.session.save(() => {
      res.redirect(authURL);
    });
  } catch (error) {
    console.error("Error generating Spotify authorization URL:", error);
    res.status(500).send("Failed to generate Spotify authorization URL");
  }
};

exports.callback = async (req, res) => {
  const { code, state } = req.query;

  if (!code || !req.session.state || state !== req.session.state) {
    console.error("State mismatch or missing code.");
    return res.status(400).send("Invalid state or missing authorization code.");
  }

  try {
    const tokens = await spotifyService.exchangeCodeForTokens(
      code,
      req.session
    );
    const { access_token, refresh_token, expires_in } = tokens;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    const userProfile = await spotifyService.getUserProfile(access_token);
    const spotifyId = userProfile.id;

    let user = await User.findOne({ spotifyId });
    if (!user) {
      user = new User({
        spotifyId,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
      });
    } else {
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      user.expiresAt = expiresAt;
    }
    await user.save();

    req.session.userId = user._id;
    req.session.spotifyId = spotifyId;

    delete req.session.state;
    delete req.session.codeVerifier;

    req.session.save(() => {
      res.redirect(`${process.env.FRONTEND_URL}/current_history`);
    });
  } catch (error) {
    console.error("Error during callback:", error.message || error);
    res.status(500).send("Failed to authenticate with Spotify.");
  }
};

exports.refreshAccessToken = async function (user, enforce_refresh = true) {
  if (!enforce_refresh) {
    if (new Date() < user.expiresAt) return user.accessToken;
  }

  console.log("Token Expired... Refreshing");

  try {
    const access_token = await spotifyService.refreshAccessToken(user);
    return access_token;
  } catch (error) {
    console.error("Failed to refresh access token:", error.message || error);
    throw error;
  }
};

exports.checkAuth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated",
    userId: req.session.userId,
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  });
};
