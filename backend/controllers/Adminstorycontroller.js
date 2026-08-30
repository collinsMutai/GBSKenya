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

/*
 * Get enum values directly from the Story schema.
 * Kept in sync with models/Story.js, same approach
 * used in the public storyController.
 */
const getEnumValues = (field) => {
  const schemaType = Story.schema.path(field);

  if (!schemaType || !Array.isArray(schemaType.enumValues)) {
    return [];
  }

  return schemaType.enumValues;
};

// --------------------------------------------------
// GET /api/admin/stories
// Protected: admin
//
// Optional query params:
// ?published=true | ?published=false   (omit for all stories)
// ?category=...
// ?condition=...
// ?search=...   (matches title or excerpt)
// --------------------------------------------------

const getStories = async (req, res, next) => {
  try {
    const {
      published,
      category,
      condition,
      search,
    } = req.query;

    const filter = {};

    // Unlike the public endpoint, admins can see drafts too.
    // Only apply a published filter if one was explicitly requested.
    if (published === "true") {
      filter.published = true;
    } else if (published === "false") {
      filter.published = false;
    }

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
          "i",
        );

        filter.$or = [{ title: regex }, { excerpt: regex }];
      }
    }

    const stories = await Story.find(filter)
      .populate("authorId", "name email")
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
// GET /api/admin/stories/:storyId
// Protected: admin
// --------------------------------------------------

const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .populate("authorId", "name email")
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
// PATCH /api/admin/stories/:storyId/publish
// Protected: admin
// --------------------------------------------------

const publishStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    story.published = true;
    await story.save();

    const updatedStory = await Story.findById(story._id)
      .populate("authorId", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Story published successfully",
      data: updatedStory,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/admin/stories/:storyId/unpublish
// Protected: admin
// --------------------------------------------------

const unpublishStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    story.published = false;
    await story.save();

    const updatedStory = await Story.findById(story._id)
      .populate("authorId", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Story unpublished successfully",
      data: updatedStory,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// DELETE /api/admin/stories/:storyId
// Protected: admin
//
// Unlike the public deleteStory, no ownership check is
// needed here - this route is already gated to admins only.
// --------------------------------------------------

const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
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

// --------------------------------------------------
// GET /api/admin/stories/meta/options
// Protected: admin
//
// Small helper endpoint so the admin UI can render
// category/condition filter dropdowns without hardcoding
// the enum values on the frontend.
// --------------------------------------------------

const getFilterOptions = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        conditions: getEnumValues("condition"),
        categories: getEnumValues("category"),
      },
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
  getStoryById,
  publishStory,
  unpublishStory,
  deleteStory,
  getFilterOptions,
};