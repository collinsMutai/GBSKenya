const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    condition: {
      type: String,
      required: true,
      enum: ["GBS", "CIDP", "MMN"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Newly Diagnosed",
        "Caregiver",
        "Long-Term",
        "Advocacy",
      ],
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // TipTap JSON document
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Story", storySchema);
