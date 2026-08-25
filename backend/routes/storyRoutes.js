const express = require("express");

const {
  getStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory,
} = require("../controllers/storyController");

const router = express.Router();

// Public
router.get("/", getStories);
router.get("/:slug", getStoryBySlug);

// Admin/editor
router.post("/", createStory);
router.patch("/:id", updateStory);
router.delete("/:id", deleteStory);

module.exports = router;
