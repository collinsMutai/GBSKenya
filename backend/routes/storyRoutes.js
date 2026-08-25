const express = require("express");

const {
  getStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory,
} = require("../controllers/storyController");

const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// --------------------------------------------------
// Public Routes
// --------------------------------------------------

// Get all published stories
router.get("/", getStories);

// Get a single published story
router.get("/:slug", getStoryBySlug);

// --------------------------------------------------
// Protected Routes
// --------------------------------------------------

// Create story
// Requires logged-in author or admin
router.post("/", requireAuth, requireRole("author", "admin"), createStory);

// Update story
// Requires logged-in author or admin
router.patch("/:id", requireAuth, requireRole("author", "admin"), updateStory);

// Delete story
// Requires logged-in author or admin
router.delete("/:id", requireAuth, requireRole("author", "admin"), deleteStory);

module.exports = router;
