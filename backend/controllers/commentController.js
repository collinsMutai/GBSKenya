const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Story = require("../models/Story");

const createComment = async (req, res, next) => {
  try {
    const { storyId, text } = req.body;

    if (!storyId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Story ID and comment text are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID",
      });
    }

    const story = await Story.findOne({
      _id: storyId,
      published: true,
    });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const comment = await Comment.create({
      storyId,
      userId: req.user._id,
      text: text.trim(),
      approved: false,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "name")
      .lean();

    res.status(201).json({
      success: true,
      message: "Comment submitted for moderation",
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentsForStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID",
      });
    }

    const comments = await Comment.find({
      storyId,
      approved: true,
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsForStory,
};
