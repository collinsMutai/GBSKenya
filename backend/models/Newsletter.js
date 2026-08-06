const mongoose = require("mongoose");
const crypto = require("crypto");

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    active: {
      type: Boolean,
      default: true,
    },

    unsubscribeToken: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Newsletter", newsletterSchema);