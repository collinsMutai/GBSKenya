require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");


const app = express();

// Trust proxy
// Needed when deployed behind a reverse proxy such as Render,
// Railway, Nginx, Cloudflare, etc.
app.set("trust proxy", 1);

// --------------------------------------------------
// Security Headers
// --------------------------------------------------

app.use(helmet());

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",").map((origin) =>
  origin.trim(),
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // e.g. Postman, curl, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight requests
app.options("*", cors());

// --------------------------------------------------
// Body Parser
// --------------------------------------------------

app.use(
  express.json({
    limit: "10kb",
  }),
);

// --------------------------------------------------
// Prevent NoSQL Injection
// --------------------------------------------------

app.use(mongoSanitize());

// --------------------------------------------------
// Prevent HTTP Parameter Pollution
// --------------------------------------------------

app.use(hpp());

// --------------------------------------------------
// Rate Limiting
// --------------------------------------------------

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

// --------------------------------------------------
// Session Authentication
// --------------------------------------------------

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in environment variables");
}

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    name: isProduction ? "__Host-sessionId" : "sessionId",

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,

      secure: isProduction,

      sameSite: isProduction ? "none" : "lax",

      maxAge: 1000 * 60 * 60 * 24 * 7,

      path: "/",
    },
  }),
);

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/contact", require("./routes/contactRoutes"));

app.use("/api/newsletter", require("./routes/newsletterRoutes"));

app.use("/api/stories", require("./routes/storyRoutes"));

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use(require("./middleware/notFound"));

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------

app.use(require("./middleware/errorHandler"));

module.exports = app;
