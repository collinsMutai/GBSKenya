const Story = require("../models/Story");

// GET /api/stories
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

      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { author: regex },
      ];
    }

    const stories = await Story.find(filter)
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

// GET /api/stories/:slug
const getStoryBySlug = async (req, res, next) => {
  try {
    const story = await Story.findOne({
      slug: req.params.slug,
      published: true,
    }).lean();

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

// POST /api/stories
const createStory = async (req, res, next) => {
  try {
    const {
      slug,
      title,
      author,
      condition,
      category,
      image,
      excerpt,
      content,
      published,
    } = req.body;

    if (
      !slug ||
      !title ||
      !author ||
      !condition ||
      !category ||
      !excerpt ||
      !content
    ) {
      return res.status(400).json({
        success: false,
        message: "Required story fields are missing",
      });
    }

    const existingStory = await Story.findOne({ slug });

    if (existingStory) {
      return res.status(409).json({
        success: false,
        message: "A story with this slug already exists",
      });
    }

    const story = await Story.create({
      slug,
      title,
      author,
      condition,
      category,
      image,
      excerpt,
      content,
      published: published ?? false,
    });

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/stories/:id
const updateStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const allowedFields = [
      "slug",
      "title",
      "author",
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

    await story.save();

    res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/stories/:id
const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

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
