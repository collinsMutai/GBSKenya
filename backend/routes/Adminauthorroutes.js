const express = require("express");

const {
  getAuthors,
  getAuthorById,
  updateAuthorProfile,
} = require("../controllers/Adminauthorcontroller");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

// Everything in this router requires an admin
router.use(requireAuth, requireRole("admin"));

// ----------------------------------------------
// Authors
// ----------------------------------------------

// All authors, with story counts
// GET /api/admin/authors
//
// Optional:
// ?search=...
router.get("/", getAuthors);

// Single author, including their stories
router.get("/:authorId", getAuthorById);

// Update bio / social links
router.patch("/:authorId", updateAuthorProfile);

module.exports = router;