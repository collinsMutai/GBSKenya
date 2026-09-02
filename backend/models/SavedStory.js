const mongoose = require("mongoose");

const savedStorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate saves
savedStorySchema.index(
  { userId: 1, storyId: 1 },
  { unique: true },
);

module.exports = mongoose.model(
  "SavedStory",
  savedStorySchema,
);
