const mongoose = require("mongoose");

const SavedStory = require("../models/SavedStory");
const Story = require("../models/Story");

// --------------------------------------------------
// SAVE STORY
// POST /api/saved-stories/:storyId
// Protected
// --------------------------------------------------

const saveStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;

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

    const existingSave = await SavedStory.findOne({
      userId: req.user._id,
      storyId,
    });

    if (existingSave) {
      return res.status(409).json({
        success: false,
        message: "Story is already saved",
        data: existingSave,
      });
    }

    const savedStory = await SavedStory.create({
      userId: req.user._id,
      storyId,
    });

    const populatedSave = await SavedStory.findById(
      savedStory._id,
    )
      .populate("storyId", "title slug excerpt image authorId")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Story saved successfully",
      data: populatedSave,
    });
  } catch (error) {
    // Handles the unique userId + storyId index
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Story is already saved",
      });
    }

    next(error);
  }
};

// --------------------------------------------------
// UNSAVE STORY
// DELETE /api/saved-stories/:storyId
// Protected
// --------------------------------------------------

const unsaveStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID",
      });
    }

    const savedStory = await SavedStory.findOneAndDelete({
      userId: req.user._id,
      storyId,
    });

    if (!savedStory) {
      return res.status(404).json({
        success: false,
        message: "Story is not saved",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Story removed from saved stories",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// GET SAVED STORIES
// GET /api/saved-stories
// Protected
// --------------------------------------------------

const getSavedStories = async (req, res, next) => {
  try {
    const savedStories = await SavedStory.find({
      userId: req.user._id,
    })
      .populate({
        path: "storyId",
        select:
          "title slug excerpt image condition category authorId published views createdAt",
        populate: {
          path: "authorId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: savedStories.length,
      data: savedStories,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// CHECK IF STORY IS SAVED
// GET /api/saved-stories/:storyId
// Protected
// --------------------------------------------------

const getSavedStoryStatus = async (req, res, next) => {
  try {
    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid story ID",
      });
    }

    const savedStory = await SavedStory.findOne({
      userId: req.user._id,
      storyId,
    }).lean();

    return res.status(200).json({
      success: true,
      data: {
        saved: Boolean(savedStory),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveStory,
  unsaveStory,
  getSavedStories,
  getSavedStoryStatus,
};