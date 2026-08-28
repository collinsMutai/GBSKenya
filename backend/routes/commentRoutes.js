const express = require("express");

const {
  getCommentsForStory,
  createComment,
  getPendingComments,
  approveComment,
  deleteComment,
} = require("../controllers/commentController");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

// --------------------------------------------------
// Public
// --------------------------------------------------

// Only approved comments are returned
router.get(
  "/story/:storyId",
  getCommentsForStory,
);

// --------------------------------------------------
// Authenticated users
// --------------------------------------------------

// Logged-in users can submit comments
router.post(
  "/",
  requireAuth,
  createComment,
);

// --------------------------------------------------
// Admin moderation
// --------------------------------------------------

// Get all comments waiting for approval
router.get(
  "/pending",
  requireAuth,
  requireRole("admin"),
  getPendingComments,
);

// Approve a comment
router.patch(
  "/:id/approve",
  requireAuth,
  requireRole("admin"),
  approveComment,
);

// Delete/reject a comment
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  deleteComment,
);

module.exports = router;
