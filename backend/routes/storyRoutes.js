const express = require("express");

const {
  getStories,
  getStoryBySlug,
  getMyStories,
  createStory,
  updateStory,
  deleteStory,
} = require("../controllers/storyController");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

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

// Get the logged-in user's own stories.
// Includes both published stories and drafts.
// Available to user, author and admin.
router.get(
  "/mine",
  requireAuth,
  getMyStories,
);

// --------------------------------------------------
// Create story
// --------------------------------------------------
//
// Available to:
// - user
// - author
// - admin
//
// The controller is responsible for enforcing
// publication permissions:
//
// user   -> always draft
// author -> can publish or save as draft
// admin  -> can publish or save as draft
//
router.post(
  "/",
  requireAuth,
  requireRole("user", "author", "admin"),
  createStory,
);

// --------------------------------------------------
// Update story
// --------------------------------------------------
//
// The controller handles ownership:
//
// user   -> own stories only, cannot publish
// author -> own stories, can publish
// admin  -> any story, can publish
//
router.patch(
  "/:id",
  requireAuth,
  requireRole("user", "author", "admin"),
  updateStory,
);

// --------------------------------------------------
// Delete story
// --------------------------------------------------
//
// The controller handles ownership:
//
// user   -> own stories only
// author -> own stories
// admin  -> any story
//
router.delete(
  "/:id",
  requireAuth,
  requireRole("user", "author", "admin"),
);

module.exports = router;