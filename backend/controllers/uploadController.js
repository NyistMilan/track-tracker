const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.spotifyId;
    if (!userId) {
      return cb(new Error("User not authenticated"), null);
    }

    const stagingDir = path.join(__dirname, `../../airflow/staging/${userId}/`);

    if (!fs.existsSync(stagingDir)) {
      fs.mkdirSync(stagingDir, { recursive: true });
    }

    cb(null, stagingDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/json") {
      cb(null, true);
    } else {
      cb(new Error("Only JSON files are allowed"), false);
    }
  },
});

exports.uploadFiles = (req, res) => {
  const uploadMiddleware = upload.array("files");

  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("Error during file upload:", err.message);
      return res.status(500).json({ message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  });
};
