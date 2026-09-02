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

// --------------------------------------------------
// TRUST PROXY
// --------------------------------------------------

app.set("trust proxy", 1);

// --------------------------------------------------
// SECURITY HEADERS
// --------------------------------------------------

app.use(helmet());

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  }),
);

// --------------------------------------------------
// BODY PARSER
// --------------------------------------------------

app.use(
  express.json({
    limit: "10kb",
  }),
);

// --------------------------------------------------
// SECURITY SANITIZATION
// --------------------------------------------------

app.use(mongoSanitize());

app.use(hpp());

// --------------------------------------------------
// RATE LIMITING
// --------------------------------------------------

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

// --------------------------------------------------
// SESSION AUTHENTICATION
// --------------------------------------------------

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET is not defined in environment variables",
  );
}

if (!process.env.MONGO_URI) {
  throw new Error(
    "MONGO_URI is not defined in environment variables",
  );
}

const isProduction =
  process.env.NODE_ENV === "production";

app.use(
  session({
    name: isProduction
      ? "__Host-sessionId"
      : "sessionId",

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

      sameSite: isProduction
        ? "none"
        : "lax",

      maxAge:
        1000 *
        60 *
        60 *
        24 *
        7,

      path: "/",
    },
  }),
);

// --------------------------------------------------
// PUBLIC ROUTES
// --------------------------------------------------

app.use(
  "/api/auth",
  require("./routes/authRoutes"),
);


app.use(
  "/api/newsletter",
  require("./routes/newsletterRoutes"),
);

app.use(
  "/api/stories",
  require("./routes/storyRoutes"),
);

// --------------------------------------------------
// PROTECTED USER ROUTES
// --------------------------------------------------

app.use(
  "/api/comments",
  require("./routes/commentRoutes"),
);

app.use(
  "/api/saved-stories",
  require("./routes/savedStoryRoutes"),
);

// --------------------------------------------------
// ADMIN ROUTES
// --------------------------------------------------

app.use(
  "/api/admin/comments",
  require("./routes/adminCommentRoutes"),
);

app.use(
  "/api/admin/stories",
  require("./routes/Adminstoryroutes"),
);

app.use(
  "/api/admin/users",
  require("./routes/Adminuserroutes"),
);

app.use(
  "/api/admin/authors",
  require("./routes/Adminauthorroutes"),
);

// --------------------------------------------------
// 404 HANDLER
// --------------------------------------------------

app.use(require("./middleware/notFound"));

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use(require("./middleware/errorHandler"));

module.exports = app;