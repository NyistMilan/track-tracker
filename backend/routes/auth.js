const express = require("express");
const authController = require("../controllers/authController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/login", authController.login);
router.get("/callback", authController.callback);
router.get("/check", ensureAuthenticated, authController.checkAuth);
router.post("/logout", authController.logout);

module.exports = router;
