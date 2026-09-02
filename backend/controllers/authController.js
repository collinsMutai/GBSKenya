const argon2 = require("argon2");
const User = require("../models/User");

/* ==========================================
   USER RESPONSE
========================================== */

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio || "",
  socialLinks: {
    twitter: user.socialLinks?.twitter || "",
    linkedin: user.socialLinks?.linkedin || "",
    website: user.socialLinks?.website || "",
  },
});

/* ==========================================
   REGISTER
========================================== */

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Unable to create account with those details",
      });
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    req.session.userId = user._id.toString();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   LOGIN
========================================== */

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.userId = user._id.toString();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   GET CURRENT USER
========================================== */

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   LOGOUT
========================================== */

const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie(isProduction ? "__Host-sessionId" : "sessionId", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

/* ==========================================
   UPDATE PROFILE
========================================== */

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    const { name, bio, socialLinks } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      if (trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 100 characters",
        });
      }

      user.name = trimmedName;
    }

    if (bio !== undefined) {
      user.bio = String(bio).trim();
    }

    if (socialLinks !== undefined) {
      user.socialLinks = {
        twitter: socialLinks.twitter?.trim() || "",
        linkedin: socialLinks.linkedin?.trim() || "",
        website: socialLinks.website?.trim() || "",
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: formatUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
};
