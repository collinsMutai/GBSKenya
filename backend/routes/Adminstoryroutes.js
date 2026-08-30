const express = require("express");

const {
  getStories,
  getStoryById,
  publishStory,
  unpublishStory,
  deleteStory,
  getFilterOptions,
} = require("../controllers/adminStoryController");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

// Everything in this router requires an admin
router.use(requireAuth, requireRole("admin"));

// ----------------------------------------------
// Stories
// ----------------------------------------------

// Filter dropdown options (category / condition enums)
// GET /api/admin/stories/meta/options
router.get("/meta/options", getFilterOptions);

// All stories, including unpublished drafts
// GET /api/admin/stories
//
// Optional:
// ?published=true
// ?published=false
// ?category=...
// ?condition=...
// ?search=...
router.get("/", getStories);

// Single story
router.get("/:storyId", getStoryById);

// Publish
router.patch("/:storyId/publish", publishStory);

// Unpublish
router.patch("/:storyId/unpublish", unpublishStory);

// Delete
router.delete("/:storyId", deleteStory);

module.exports = router;