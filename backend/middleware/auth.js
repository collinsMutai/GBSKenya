const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.session.userId).lean();

    if (!user || !user.isActive) {
      req.session.destroy(() => {});

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission",
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
