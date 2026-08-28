const express = require("express");

const {
  getCommentsForStory,
  createComment,
} = require("../controllers/commentController");

const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Public approved comments
router.get("/story/:storyId", getCommentsForStory);

// Logged-in users can comment
router.post("/", requireAuth, createComment);

module.exports = router;
