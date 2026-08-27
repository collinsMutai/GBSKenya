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
    .replace(/\s+/g, "-");
};

/*
 * Get enum values directly from the Story schema.
 *
 * This keeps the controller synchronized with:
 * models/Story.js
 *
 * Example:
 * condition: ["GBS", "CIDP"]
 * category: ["Newly Diagnosed", "Living With GBS"]
 */
const getEnumValues = (field) => {
  const schemaType = Story.schema.path(field);

  if (!schemaType || !Array.isArray(schemaType.enumValues)) {
    return [];
  }

  return schemaType.enumValues;
};

const isValidEnumValue = (field, value) => {
  const allowedValues = getEnumValues(field);

  /*
   * If the schema does not define an enum,
   * don't block the value here.
   */
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
    ", "
  )}`;
};

// --------------------------------------------------
// GET /api/stories
// Public
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
      filter.category = category;
    }

    if (condition) {
      filter.condition = condition;
    }

    if (search) {
      const safeSearch = String(search).trim();

      if (safeSearch) {
        const regex = new RegExp(
          safeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i"
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
    const slug = normalizeSlug(req.params.slug);

    const story = await Story.findOne({
      slug,
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

    // ------------------------------------------------
    // Normalize values
    // ------------------------------------------------

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
      !content
    ) {
      return res.status(400).json({
        success: false,
        message: "Required story fields are missing",
      });
    }

    // ------------------------------------------------
    // Validate condition enum
    // ------------------------------------------------

    if (
      !isValidEnumValue(
        "condition",
        normalizedCondition
      )
    ) {
      return res.status(400).json({
        success: false,
        field: "condition",
        message: getEnumErrorMessage(
          "condition",
          normalizedCondition
        ),
        allowedValues: getEnumValues("condition"),
      });
    }

    // ------------------------------------------------
    // Validate category enum
    // ------------------------------------------------

    if (
      !isValidEnumValue(
        "category",
        normalizedCategory
      )
    ) {
      return res.status(400).json({
        success: false,
        field: "category",
        message: getEnumErrorMessage(
          "category",
          normalizedCategory
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
        message:
          "A story with this slug already exists",
      });
    }

    // ------------------------------------------------
    // Auth check
    // ------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ------------------------------------------------
    // Create story
    // ------------------------------------------------

    const story = await Story.create({
      slug: normalizedSlug,

      title: normalizedTitle,

      /*
       * IMPORTANT:
       * Never accept authorId from req.body.
       */
      authorId: req.user._id,

      condition: normalizedCondition,

      category: normalizedCategory,

      image: normalizedImage,

      excerpt: normalizedExcerpt,

      content,

      published: Boolean(published),
    });

    // ------------------------------------------------
    // Populate author
    // ------------------------------------------------

    const populatedStory = await Story.findById(
      story._id
    )
      .populate("authorId", "name email")
      .lean();

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: populatedStory,
    });
  } catch (error) {
    // ------------------------------------------------
    // Mongoose validation fallback
    // ------------------------------------------------

    if (error?.name === "ValidationError") {
      const validationErrors = Object.values(
        error.errors || {}
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

    // ------------------------------------------------
    // Duplicate key fallback
    // ------------------------------------------------

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A story with this slug already exists",
      });
    }

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

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
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
        message:
          "You can only edit your own stories",
      });
    }

    // ------------------------------------------------
    // Normalize incoming values
    // ------------------------------------------------

    if (req.body.slug !== undefined) {
      story.slug = normalizeSlug(req.body.slug);

      if (!story.slug) {
        return res.status(400).json({
          success: false,
          field: "slug",
          message: "Story slug cannot be empty",
        });
      }
    }

    if (req.body.title !== undefined) {
      story.title = normalizeString(req.body.title);

      if (!story.title) {
        return res.status(400).json({
          success: false,
          field: "title",
          message: "Story title cannot be empty",
        });
      }
    }

    if (req.body.condition !== undefined) {
      const condition = normalizeString(
        req.body.condition
      );

      if (
        !isValidEnumValue(
          "condition",
          condition
        )
      ) {
        return res.status(400).json({
          success: false,
          field: "condition",
          message: getEnumErrorMessage(
            "condition",
            condition
          ),
          allowedValues: getEnumValues("condition"),
        });
      }

      story.condition = condition;
    }

    if (req.body.category !== undefined) {
      const category = normalizeString(
        req.body.category
      );

      if (
        !isValidEnumValue(
          "category",
          category
        )
      ) {
        return res.status(400).json({
          success: false,
          field: "category",
          message: getEnumErrorMessage(
            "category",
            category
          ),
          allowedValues: getEnumValues("category"),
        });
      }

      story.category = category;
    }

    if (req.body.image !== undefined) {
      story.image = normalizeString(
        req.body.image
      );
    }

    if (req.body.excerpt !== undefined) {
      story.excerpt = normalizeString(
        req.body.excerpt
      );

      if (!story.excerpt) {
        return res.status(400).json({
          success: false,
          field: "excerpt",
          message:
            "Story excerpt cannot be empty",
        });
      }
    }

    if (req.body.content !== undefined) {
      story.content = req.body.content;
    }

    if (req.body.published !== undefined) {
      story.published = Boolean(
        req.body.published
      );
    }

    // ------------------------------------------------
    // Slug uniqueness
    // ------------------------------------------------

    if (story.slug) {
      const duplicateStory =
        await Story.findOne({
          slug: story.slug,
          _id: { $ne: story._id },
        });

      if (duplicateStory) {
        return res.status(409).json({
          success: false,
          field: "slug",
          message:
            "A story with this slug already exists",
        });
      }
    }

    // ------------------------------------------------
    // Save
    // ------------------------------------------------

    await story.save();

    // ------------------------------------------------
    // Populate author
    // ------------------------------------------------

    const updatedStory =
      await Story.findById(story._id)
        .populate("authorId", "name email")
        .lean();

    res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: updatedStory,
    });
  } catch (error) {
    // ------------------------------------------------
    // Mongoose validation fallback
    // ------------------------------------------------

    if (error?.name === "ValidationError") {
      const validationErrors = Object.values(
        error.errors || {}
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

    // ------------------------------------------------
    // Duplicate key fallback
    // ------------------------------------------------

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A story with this slug already exists",
      });
    }

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
    // Auth check
    // ------------------------------------------------

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ------------------------------------------------
    // Ownership check
    // ------------------------------------------------

    const isOwner =
      story.authorId &&
      story.authorId.toString() ===
        req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own stories",
      });
    }

    // ------------------------------------------------
    // Delete
    // ------------------------------------------------

    await story.deleteOne();

    res.status(200).json({
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
  createStory,
  updateStory,
  deleteStory,
};
