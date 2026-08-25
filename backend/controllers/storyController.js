const Story = require("../models/Story");

// --------------------------------------------------
// GET /api/stories
// Public
// --------------------------------------------------

const getStories = async (req, res, next) => {
  try {
    const { category, condition, search } = req.query;

    const filter = {
      published: true,
    };

    if (category) {
      filter.category = category;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (search) {
      const regex = new RegExp(search, "i");

      filter.$or = [{ title: regex }, { excerpt: regex }];
    }

    const stories = await Story.find(filter)
      .populate("authorId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// GET /api/stories/:slug
// Public
// --------------------------------------------------

const getStoryBySlug = async (req, res, next) => {
  try {
    const story = await Story.findOne({
      slug: req.params.slug,
      published: true,
    })
      .populate("authorId", "name")
      .lean();

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// POST /api/stories
// Protected: author/admin
// --------------------------------------------------

const createStory = async (req, res, next) => {
  try {
    const {
      slug,
      title,
      condition,
      category,
      image,
      excerpt,
      content,
      published,
    } = req.body;

    if (!slug || !title || !condition || !category || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Required story fields are missing",
      });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingStory = await Story.findOne({
      slug: normalizedSlug,
    });

    if (existingStory) {
      return res.status(409).json({
        success: false,
        message: "A story with this slug already exists",
      });
    }

    const story = await Story.create({
      slug: normalizedSlug,

      title: title.trim(),

      // IMPORTANT:
      // Never accept authorId from req.body.
      // Get it from the authenticated session.
      authorId: req.user._id,

      condition,

      category,

      image: image?.trim() || "",

      excerpt: excerpt.trim(),

      content,

      published: published ?? false,
    });

    const populatedStory = await Story.findById(story._id)
      .populate("authorId", "name email")
      .lean();

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: populatedStory,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/stories/:id
// Protected: owner/admin
// --------------------------------------------------

const updateStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // ------------------------------------------------
    // Ownership check
    // ------------------------------------------------

    const isOwner = story.authorId.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own stories",
      });
    }

    // ------------------------------------------------
    // Allowed fields
    // ------------------------------------------------

    const allowedFields = [
      "slug",
      "title",
      "condition",
      "category",
      "image",
      "excerpt",
      "content",
      "published",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        story[field] = req.body[field];
      }
    });

    if (story.slug) {
      story.slug = story.slug.trim().toLowerCase();
    }

    if (story.title) {
      story.title = story.title.trim();
    }

    if (story.excerpt) {
      story.excerpt = story.excerpt.trim();
    }

    if (story.image) {
      story.image = story.image.trim();
    }

    await story.save();

    const updatedStory = await Story.findById(story._id)
      .populate("authorId", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: updatedStory,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// DELETE /api/stories/:id
// Protected: owner/admin
// --------------------------------------------------

const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // ------------------------------------------------
    // Ownership check
    // ------------------------------------------------

    const isOwner = story.authorId.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own stories",
      });
    }

    await story.deleteOne();

    res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStories,
  getStoryBySlug,
  createStory,
  updateStory,
  deleteStory,
};
