const express = require("express");
const uploadController = require("../controllers/uploadController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", ensureAuthenticated, uploadController.uploadFiles);

module.exports = router;
