const User = require("../models/User");

exports.ensureAuthenticated = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId);

      if (!user) {
        console.error("Session exists, but user not found in the database.");
        req.session.destroy(() => {
          return res
            .status(403)
            .json({ success: false, message: "User no longer exists" });
        });
      } else {
        req.user = user;
        return next();
      }
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.ensureApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey === process.env.AIRFLOW_API_KEY) {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, message: "Forbidden: Invalid API Key" });
};
