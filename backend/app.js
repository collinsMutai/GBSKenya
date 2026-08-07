require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

const app = express();

// Security Headers
app.use(helmet());

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map((origin) =>
  origin.trim()
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());
// Body Parser
app.use(
  express.json({
    limit: "10kb",
  }),
);

// Prevent NoSQL Injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

// Routes
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));

// 404 Handler
app.use(require("./middleware/notFound"));

// Global Error Handler
app.use(require("./middleware/errorHandler"));

module.exports = app;
