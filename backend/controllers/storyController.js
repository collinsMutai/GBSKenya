const mongoose = require("mongoose");
const Story = require("../models/Story");

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const normalizeString = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
};

const normalizeSlug = (value) => {
  return normalizeString(value)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
};

const getEnumValues = (field) => {
  const schemaType = Story.schema.path(field);

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

const getEnumErrorMessage = (field, value) => {
  const allowedValues = getEnumValues(field);

  const label =
    field.charAt(0).toUpperCase() + field.slice(1);

  if (!allowedValues.length) {
    return null;
  }

  return `${label} "${value}" is invalid. Allowed values: ${allowedValues.join(
    ", ",
  )}`;
};

const isValidStoryId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// --------------------------------------------------
// GET /api/stories
// Public
//
// Returns published stories only.
// --------------------------------------------------

const getStories = async (req, res, next) => {
  try {
    const {
      category,
      condition,
      search,
    } = req.query;

    const filter = {
      published: true,
    };

    if (category) {
      filter.category = normalizeString(category);
    }

    if (condition) {
      filter.condition = normalizeString(condition);
    }

    if (search) {
      const safeSearch = normalizeString(search);

      if (safeSearch) {
        const regex = new RegExp(
          safeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        );

        filter.$or = [
          { title: regex },
          { excerpt: regex },
        ];
      }
    }

    const stories = await Story.find(filter)
      .populate("authorId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
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
//
// Returns one published story.
// Increments views atomically.
// --------------------------------------------------

const getStoryBySlug = async (req, res, next) => {
  try {
    const slug = normalizeSlug(req.params.slug);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Invalid story slug",
      });
    }

    const story = await Story.findOneAndUpdate(
      {
        slug,
        published: true,
      },
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      },
    )
      .populate("authorId", "name")
      .lean();

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// GET /api/stories/mine
// Protected
//
// Returns all stories owned by the logged-in user.
// Includes drafts and published stories.
// --------------------------------------------------

const getMyStories = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const stories = await Story.find({
      authorId: req.user._id,
    })
      .populate("authorId", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// POST /api/stories
// Protected
//
// user    -> draft only
// author  -> draft or published
// admin   -> draft or published
// --------------------------------------------------

const createStory = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

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

    const normalizedSlug = normalizeSlug(slug);
    const normalizedTitle = normalizeString(title);
    const normalizedCondition = normalizeString(condition);
    const normalizedCategory = normalizeString(category);
    const normalizedImage = normalizeString(image);
    const normalizedExcerpt = normalizeString(excerpt);

    // ------------------------------------------------
    // Required fields
    // ------------------------------------------------

    if (
      !normalizedSlug ||
      !normalizedTitle ||
      !normalizedCondition ||
      !normalizedCategory ||
      !normalizedExcerpt ||
      content === undefined ||
      content === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Required story fields are missing",
      });
    }

    // ------------------------------------------------
    // Validate condition
    // ------------------------------------------------

    if (
      !isValidEnumValue(
        "condition",
        normalizedCondition,
      )
    ) {
      return res.status(400).json({
        success: false,
        field: "condition",
        message: getEnumErrorMessage(
          "condition",
          normalizedCondition,
        ),
        allowedValues: getEnumValues("condition"),
      });
    }

    // ------------------------------------------------
    // Validate category
    // ------------------------------------------------

    if (
      !isValidEnumValue(
        "category",
        normalizedCategory,
      )
    ) {
      return res.status(400).json({
        success: false,
        field: "category",
        message: getEnumErrorMessage(
          "category",
          normalizedCategory,
        ),
        allowedValues: getEnumValues("category"),
      });
    }

    // ------------------------------------------------
    // Check slug uniqueness
    // ------------------------------------------------

    const existingStory = await Story.findOne({
      slug: normalizedSlug,
    });

    if (existingStory) {
      return res.status(409).json({
        success: false,
        field: "slug",
        message: "A story with this slug already exists",
      });
    }

    // ------------------------------------------------
    // Publication permissions
    // ------------------------------------------------

    const requestedPublished = parseBoolean(published);

    const canPublish =
      req.user.role === "author" ||
      req.user.role === "admin";

    /*
     * Normal users can create stories,
     * but their stories are always drafts.
     */
    const shouldPublish =
      canPublish && requestedPublished;

    // ------------------------------------------------
    // Create story
    // ------------------------------------------------

    const story = await Story.create({
      slug: normalizedSlug,
      title: normalizedTitle,

      // Never accept authorId from req.body.
      authorId: req.user._id,

      condition: normalizedCondition,
      category: normalizedCategory,
      image: normalizedImage,
      excerpt: normalizedExcerpt,
      content,

      published: shouldPublish,

      views: 0,
    });

    const populatedStory = await Story.findById(
      story._id,
    )
      .populate("authorId", "name email")
      .lean();

    return res.status(201).json({
      success: true,
      message: shouldPublish
        ? "Story published successfully"
        : "Story saved as a draft",
      data: populatedStory,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      const validationErrors = Object.values(
        error.errors || {},
      ).map((item) => ({
        field: item.path,
        value: item.value,
        message: item.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Story validation failed",
        errors: validationErrors,
      });
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        field: "slug",
        message: "A story with this slug already exists",
      });
    }

    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/stories/:id
// Protected
//
// user    -> own stories, cannot publish
// author  -> own stories, can publish
// admin   -> any story, can publish
// --------------------------------------------------

const updateStory = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!isValidStoryId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID",
      });
    }

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // ------------------------------------------------
    // Ownership
    // ------------------------------------------------

    const isOwner =
      story.authorId &&
      story.authorId.toString() ===
        req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own stories",
      });
    }

    // ------------------------------------------------
    // Slug
    // ------------------------------------------------

    if (req.body.slug !== undefined) {
      const slug = normalizeSlug(req.body.slug);

      if (!slug) {
        return res.status(400).json({
          success: false,
          field: "slug",
          message: "Story slug cannot be empty",
        });
      }

      story.slug = slug;
    }

    // ------------------------------------------------
    // Title
    // ------------------------------------------------

    if (req.body.title !== undefined) {
      const title = normalizeString(req.body.title);

      if (!title) {
        return res.status(400).json({
          success: false,
          field: "title",
          message: "Story title cannot be empty",
        });
      }

      story.title = title;
    }

    // ------------------------------------------------
    // Condition
    // ------------------------------------------------

    if (req.body.condition !== undefined) {
      const condition = normalizeString(
        req.body.condition,
      );

      if (
        !isValidEnumValue(
          "condition",
          condition,
        )
      ) {
        return res.status(400).json({
          success: false,
          field: "condition",
          message: getEnumErrorMessage(
            "condition",
            condition,
          ),
          allowedValues: getEnumValues("condition"),
        });
      }

      story.condition = condition;
    }

    // ------------------------------------------------
    // Category
    // ------------------------------------------------

    if (req.body.category !== undefined) {
      const category = normalizeString(
        req.body.category,
      );

      if (
        !isValidEnumValue(
          "category",
          category,
        )
      ) {
        return res.status(400).json({
          success: false,
          field: "category",
          message: getEnumErrorMessage(
            "category",
            category,
          ),
          allowedValues: getEnumValues("category"),
        });
      }

      story.category = category;
    }

    // ------------------------------------------------
    // Image
    // ------------------------------------------------

    if (req.body.image !== undefined) {
      story.image = normalizeString(req.body.image);
    }

    // ------------------------------------------------
    // Excerpt
    // ------------------------------------------------

    if (req.body.excerpt !== undefined) {
      const excerpt = normalizeString(
        req.body.excerpt,
      );

      if (!excerpt) {
        return res.status(400).json({
          success: false,
          field: "excerpt",
          message: "Story excerpt cannot be empty",
        });
      }

      story.excerpt = excerpt;
    }

    // ------------------------------------------------
    // Content
    // ------------------------------------------------

    if (req.body.content !== undefined) {
      if (
        req.body.content === null ||
        req.body.content === ""
      ) {
        return res.status(400).json({
          success: false,
          field: "content",
          message: "Story content cannot be empty",
        });
      }

      story.content = req.body.content;
    }

    // ------------------------------------------------
    // Publication
    // ------------------------------------------------

    if (req.body.published !== undefined) {
      const requestedPublished = parseBoolean(
        req.body.published,
      );

      const canPublish =
        req.user.role === "author" ||
        req.user.role === "admin";

      // Normal users cannot publish.
      if (requestedPublished && !canPublish) {
        return res.status(403).json({
          success: false,
          message:
            "Your story must be reviewed before it can be published",
        });
      }

      story.published = requestedPublished;
    }

    // ------------------------------------------------
    // Slug uniqueness
    // ------------------------------------------------

    const duplicateStory = await Story.findOne({
      slug: story.slug,
      _id: { $ne: story._id },
    });

    if (duplicateStory) {
      return res.status(409).json({
        success: false,
        field: "slug",
        message: "A story with this slug already exists",
      });
    }

    // ------------------------------------------------
    // Save
    // ------------------------------------------------

    await story.save();

    const updatedStory =
      await Story.findById(story._id)
        .populate("authorId", "name email")
        .lean();

    return res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: updatedStory,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      const validationErrors = Object.values(
        error.errors || {},
      ).map((item) => ({
        field: item.path,
        value: item.value,
        message: item.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Story validation failed",
        errors: validationErrors,
      });
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        field: "slug",
        message: "A story with this slug already exists",
      });
    }

    next(error);
  }
};

// --------------------------------------------------
// DELETE /api/stories/:id
// Protected
//
// Owner or admin can delete.
// --------------------------------------------------

const deleteStory = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!isValidStoryId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID",
      });
    }

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const isOwner =
      story.authorId &&
      story.authorId.toString() ===
        req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own stories",
      });
    }

    await story.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

module.exports = {
  getStories,
  getStoryBySlug,
  getMyStories,
  createStory,
  updateStory,
  deleteStory,
};
