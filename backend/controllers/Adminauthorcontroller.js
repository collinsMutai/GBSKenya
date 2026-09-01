const User = require("../models/User");
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
 * Attach { storyCount, publishedCount, draftCount } to each
 * author by aggregating the Story collection in one query,
 * rather than running a count query per author.
 */
const attachStoryCounts = async (authors) => {
  const authorIds = authors.map((author) => author._id);

  const counts = await Story.aggregate([
    {
      $match: {
        authorId: { $in: authorIds },
      },
    },
    {
      $group: {
        _id: "$authorId",
        total: { $sum: 1 },
        published: {
          $sum: {
            $cond: ["$published", 1, 0],
          },
        },
      },
    },
  ]);

  const countsByAuthorId = new Map(
    counts.map((entry) => [entry._id.toString(), entry]),
  );

  return authors.map((author) => {
    const entry = countsByAuthorId.get(
      author._id.toString(),
    );

    return {
      ...author,
      storyCount: entry?.total || 0,
      publishedCount: entry?.published || 0,
      draftCount: entry ? entry.total - entry.published : 0,
    };
  });
};

// --------------------------------------------------
// GET /api/admin/authors
// Protected: admin
//
// Optional query params:
// ?search=...   (matches name or email)
//
// Only returns users with role "author" - promoting a
// user to "author" happens on the Users page.
// --------------------------------------------------

const getAuthors = async (req, res, next) => {
  try {
    const { search } = req.query;

    const filter = { role: "author" };

    if (search) {
      const safeSearch = String(search).trim();

      if (safeSearch) {
        const regex = new RegExp(
          safeSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        );

        filter.$or = [{ name: regex }, { email: regex }];
      }
    }

    const authors = await User.find(filter)
      .sort({ name: 1 })
      .lean();

    const authorsWithCounts = await attachStoryCounts(
      authors,
    );

    res.status(200).json({
      success: true,
      count: authorsWithCounts.length,
      data: authorsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// GET /api/admin/authors/:authorId
// Protected: admin
//
// Includes the author's stories so the admin can see what
// they've written without leaving the page.
// --------------------------------------------------

const getAuthorById = async (req, res, next) => {
  try {
    const author = await User.findOne({
      _id: req.params.authorId,
      role: "author",
    }).lean();

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    const [authorWithCounts] = await attachStoryCounts([
      author,
    ]);

    const stories = await Story.find({
      authorId: author._id,
    })
      .select("title slug published createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...authorWithCounts,
        stories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/admin/authors/:authorId
// Protected: admin
//
// Body: { bio, socialLinks: { twitter, linkedin, website } }
// --------------------------------------------------

const updateAuthorProfile = async (req, res, next) => {
  try {
    const author = await User.findOne({
      _id: req.params.authorId,
      role: "author",
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    if (req.body.bio !== undefined) {
      author.bio = normalizeString(req.body.bio);
    }

    if (
      req.body.socialLinks !== undefined &&
      typeof req.body.socialLinks === "object"
    ) {
      const { twitter, linkedin, website } =
        req.body.socialLinks;

      if (twitter !== undefined) {
        author.socialLinks.twitter =
          normalizeString(twitter);
      }

      if (linkedin !== undefined) {
        author.socialLinks.linkedin =
          normalizeString(linkedin);
      }

      if (website !== undefined) {
        author.socialLinks.website =
          normalizeString(website);
      }
    }

    await author.save();

    const updatedAuthor = await User.findById(
      author._id,
    ).lean();

    const [authorWithCounts] = await attachStoryCounts([
      updatedAuthor,
    ]);

    res.status(200).json({
      success: true,
      message: "Author profile updated successfully",
      data: authorWithCounts,
    });
  } catch (error) {
    // ------------------------------------------------
    // Mongoose validation fallback (e.g. bio too long)
    // ------------------------------------------------

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
        message: "Author profile validation failed",
        errors: validationErrors,
      });
    }

    next(error);
  }
};

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

module.exports = {
  getAuthors,
  getAuthorById,
  updateAuthorProfile,
};