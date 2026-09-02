const express = require("express");

const {
  saveStory,
  unsaveStory,
  getSavedStories,
  getSavedStoryStatus,
} = require("../controllers/savedStoryController");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// --------------------------------------------------
// All saved-story routes require authentication
// --------------------------------------------------

// Get current user's saved stories
router.get(
  "/",
  requireAuth,
  getSavedStories,
);

// Check whether current user saved a story
router.get(
  "/:storyId",
  requireAuth,
  getSavedStoryStatus,
);

// Save a story
router.post(
  "/:storyId",
  requireAuth,
  saveStory,
);

// Remove a saved story
router.delete(
  "/:storyId",
  requireAuth,
  unsaveStory,
);

module.exports = router;