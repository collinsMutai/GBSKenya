const mongoose = require("mongoose");
const Comment = require("../models/Comment");

// --------------------------------------------------
// GET /api/admin/comments
// GET /api/admin/comments?status=pending
// GET /api/admin/comments?status=approved
// GET /api/admin/comments?status=rejected
// GET /api/admin/comments?storyId=...
// --------------------------------------------------

const getComments = async (req, res, next) => {
  try {
    const { status, storyId } = req.query;

    const filter = {};

    // ----------------------------------------------
    // Status filter
    // ----------------------------------------------

    if (status) {
      const allowedStatuses = [
        "pending",
        "approved",
        "rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Use pending, approved, or rejected.",
        });
      }

      filter.status = status;
    }

    // ----------------------------------------------
    // Story filter
    // ----------------------------------------------

    if (storyId) {
      if (!mongoose.Types.ObjectId.isValid(storyId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid story ID",
        });
      }

      filter.storyId = storyId;
    }

    // ----------------------------------------------
    // Query
    // ----------------------------------------------

    const comments = await Comment.find(filter)
      .populate("userId", "name email")
      .populate("storyId", "title slug")
      .populate("moderatedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // ----------------------------------------------
    // Response
    // ----------------------------------------------

    res.status(200).json({
      success: true,
      count: comments.length,
      filters: {
        status: status || "all",
        storyId: storyId || null,
      },
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// GET /api/admin/comments/:commentId
// --------------------------------------------------

const getCommentById = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(commentId)
      .populate("userId", "name email")
      .populate("storyId", "title slug")
      .populate("moderatedBy", "name email")
      .lean();

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/admin/comments/:commentId/approve
// --------------------------------------------------

const approveComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.status = "approved";
    comment.moderatedAt = new Date();
    comment.moderatedBy = req.user._id;

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "name email")
      .populate("storyId", "title slug")
      .populate("moderatedBy", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Comment approved successfully",
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/admin/comments/:commentId/reject
// --------------------------------------------------

const rejectComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.status = "rejected";
    comment.moderatedAt = new Date();
    comment.moderatedBy = req.user._id;

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("userId", "name email")
      .populate("storyId", "title slug")
      .populate("moderatedBy", "name email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Comment rejected successfully",
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// DELETE /api/admin/comments/:commentId
// --------------------------------------------------

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  getCommentById,
  approveComment,
  rejectComment,
  deleteComment,
};
