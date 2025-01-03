const express = require("express");
const {
  ensureAuthenticated,
  ensureApiKey,
} = require("../middleware/authMiddleware");
const trackController = require("../controllers/trackController");
const { getFullHistory } = require("../controllers/extractController");

const router = express.Router();

router.get("/recent", ensureAuthenticated, trackController.getUserRecentTracks);
router.post(
  "/fetch-recent-tracks",
  ensureApiKey,
  trackController.fetchRecentTracksForUsers
);
router.get("/full_history", ensureAuthenticated, getFullHistory);

module.exports = router;
