const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ------------------------------------------------
    // Author profile fields
    //
    // Only meaningful for role: "author", but left
    // available on the schema generally rather than
    // split into a separate model/collection - simplest
    // option given how few fields these are.
    // ------------------------------------------------

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    socialLinks: {
      twitter: {
        type: String,
        trim: true,
        default: "",
      },

      linkedin: {
        type: String,
        trim: true,
        default: "",
      },

      website: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);