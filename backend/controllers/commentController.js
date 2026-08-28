const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Story = require("../models/Story");

// --------------------------------------------------
// Create comment
// --------------------------------------------------

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

    return res.status(201).json({
      success: true,
      message: "Comment submitted for moderation",
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Get approved comments for story
// --------------------------------------------------

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

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Get pending comments
// --------------------------------------------------

const getPendingComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      approved: false,
    })
      .populate("userId", "name email")
      .populate("storyId", "title slug")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Approve comment
// --------------------------------------------------

const approveComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        approved: true,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "name email")
      .populate("storyId", "title slug")
      .lean();

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment approved successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Reject / delete comment
// --------------------------------------------------

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsForStory,
  getPendingComments,
  approveComment,
  deleteComment,
};
