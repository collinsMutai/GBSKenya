const express = require("express");

const {
  getComments,
  getCommentById,
  approveComment,
  rejectComment,
  deleteComment,
} = require("../controllers/adminCommentController");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

// Everything in this router requires an admin
router.use(requireAuth, requireRole("admin"));

// ----------------------------------------------
// Comments
// ----------------------------------------------

// All comments
// GET /api/admin/comments
//
// Optional:
// ?status=pending
// ?status=approved
// ?status=rejected
// ?storyId=...
router.get("/", getComments);

// Single comment
router.get("/:commentId", getCommentById);

// Approve
router.patch(
  "/:commentId/approve",
  approveComment,
);

// Reject
router.patch(
  "/:commentId/reject",
  rejectComment,
);

// Delete
router.delete(
  "/:commentId",
  deleteComment,
);

module.exports = router;
