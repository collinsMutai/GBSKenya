const User = require("../models/User");

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const normalizeString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

/*
 * Get enum values directly from the User schema.
 * Kept in sync with models/User.js.
 */
const getEnumValues = (field) => {
  const schemaType = User.schema.path(field);

  if (!schemaType || !Array.isArray(schemaType.enumValues)) {
    return [];
  }

  return schemaType.enumValues;
};

const isValidEnumValue = (field, value) => {
  const allowedValues = getEnumValues(field);

  if (!allowedValues.length) {
    return true;
  }

  return allowedValues.includes(value);
};

// --------------------------------------------------
// GET /api/admin/users
// Protected: admin
//
// Optional query params:
// ?role=user | author | admin
// ?isActive=true | false
// ?search=...   (matches name or email)
// --------------------------------------------------

const getUsers = async (req, res, next) => {
  try {
    const { role, isActive, search } = req.query;

    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (isActive === "true") {
      filter.isActive = true;
    } else if (isActive === "false") {
      filter.isActive = false;
    }

    if (search) {
      const safeSearch = String(search).trim();

      if (safeSearch) {
        const regex = new RegExp(
          safeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        );

        filter.$or = [{ name: regex }, { email: regex }];
      }
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// GET /api/admin/users/:userId
// Protected: admin
// --------------------------------------------------

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/admin/users/:userId/role
// Protected: admin
// Body: { role: "user" | "author" | "admin" }
// --------------------------------------------------

const updateUserRole = async (req, res, next) => {
  try {
    const role = normalizeString(req.body.role);

    if (!role) {
      return res.status(400).json({
        success: false,
        field: "role",
        message: "Role is required",
      });
    }

    if (!isValidEnumValue("role", role)) {
      return res.status(400).json({
        success: false,
        field: "role",
        message: `Role "${role}" is invalid. Allowed values: ${getEnumValues(
          "role",
        ).join(", ")}`,
        allowedValues: getEnumValues("role"),
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------------
    // Prevent an admin from demoting themselves and
    // accidentally locking themselves out of the panel.
    // ------------------------------------------------

    const isSelf =
      req.user &&
      req.user._id.toString() === user._id.toString();

    if (isSelf && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    user.role = role;
    await user.save();

    const updatedUser = await User.findById(user._id).lean();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/admin/users/:userId/activate
// Protected: admin
// --------------------------------------------------

const activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = true;
    await user.save();

    const updatedUser = await User.findById(user._id).lean();

    res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/admin/users/:userId/deactivate
// Protected: admin
// --------------------------------------------------

const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------------
    // Prevent an admin from deactivating their own
    // account and losing access to the panel.
    // ------------------------------------------------

    const isSelf =
      req.user &&
      req.user._id.toString() === user._id.toString();

    if (isSelf) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    user.isActive = false;
    await user.save();

    const updatedUser = await User.findById(user._id).lean();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// DELETE /api/admin/users/:userId
// Protected: admin
// --------------------------------------------------

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------------
    // Prevent an admin from deleting their own account.
    // ------------------------------------------------

    const isSelf =
      req.user &&
      req.user._id.toString() === user._id.toString();

    if (isSelf) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// GET /api/admin/users/meta/options
// Protected: admin
//
// So the admin UI can render role filter/select options
// without hardcoding the enum values on the frontend.
// --------------------------------------------------

const getFilterOptions = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        roles: getEnumValues("role"),
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteUser,
  getFilterOptions,
};