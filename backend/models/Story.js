const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    // ------------------------------------------------
    // Story URL slug
    // ------------------------------------------------
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // ------------------------------------------------
    // Story title
    // ------------------------------------------------
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // ------------------------------------------------
    // Authenticated user who owns the story
    // ------------------------------------------------
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ------------------------------------------------
    // Medical condition
    // ------------------------------------------------
    condition: {
      type: String,
      required: true,
      enum: ["GBS", "CIDP", "MMN"],
    },

    // ------------------------------------------------
    // Story category
    // ------------------------------------------------
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

    // ------------------------------------------------
    // Optional story image
    // ------------------------------------------------
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // ------------------------------------------------
    // Short story description
    // ------------------------------------------------
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // ------------------------------------------------
    // TipTap JSON document
    // ------------------------------------------------
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // ------------------------------------------------
    // Publication status
    //
    // IMPORTANT:
    // The model does NOT decide who can publish.
    // That security rule belongs in the controller.
    //
    // Regular users:
    //   published = false
    //
    // Authors/admins:
    //   may publish according to controller rules.
    // ------------------------------------------------
    published: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ------------------------------------------------
    // Number of public views
    // ------------------------------------------------
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// --------------------------------------------------
// Helpful compound index
//
// Makes queries such as:
//
// Story.find({
//   authorId: userId,
//   published: true,
// })
//
// more efficient.
// --------------------------------------------------

storySchema.index({
  authorId: 1,
  published: 1,
});

module.exports = mongoose.model("Story", storySchema);