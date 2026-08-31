const express = require("express");

const {
  getUsers,
  getUserById,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteUser,
  getFilterOptions,
} = require("../controllers/Adminusercontroller");

const {
  requireAuth,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

// Everything in this router requires an admin
router.use(requireAuth, requireRole("admin"));

// ----------------------------------------------
// Users
// ----------------------------------------------

// Filter dropdown options (role enum)
// GET /api/admin/users/meta/options
router.get("/meta/options", getFilterOptions);

// All users
// GET /api/admin/users
//
// Optional:
// ?role=user | author | admin
// ?isActive=true | false
// ?search=...
router.get("/", getUsers);

// Single user
router.get("/:userId", getUserById);

// Change role
router.patch("/:userId/role", updateUserRole);

// Activate
router.patch("/:userId/activate", activateUser);

// Deactivate
router.patch("/:userId/deactivate", deactivateUser);

// Delete
router.delete("/:userId", deleteUser);

module.exports = router;