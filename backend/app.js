require("dotenv").config();
const express = require("express");
const mongoose = require("./config/mongodb");
const authRoutes = require("./routes/auth");
const trackRoutes = require("./routes/tracks");
const uploadRoutes = require("./routes/upload");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Security Headers
app.use(helmet());

// Logging Middleware
app.use(morgan("dev"));

// JSON Parsing Middleware
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secure_random_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/tracks", trackRoutes);
app.use("/upload", uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server Listening
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server running on ${process.env.BACKEND_URL}`);
});
