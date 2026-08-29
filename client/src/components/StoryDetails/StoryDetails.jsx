import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaFacebookF,
  FaHeart,
  FaLink,
  FaLinkedinIn,
  FaRegHeart,
  FaShareNodes,
  FaWhatsapp,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./StoryDetails.css";

export default function StoryDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // --------------------------------------------------
  // Story state
  // --------------------------------------------------

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Like state
  // --------------------------------------------------

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // --------------------------------------------------
  // Comment state
  // --------------------------------------------------

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  // --------------------------------------------------
  // Share state
  // --------------------------------------------------

  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  // --------------------------------------------------
  // Related stories state
  // --------------------------------------------------

  const [relatedStories, setRelatedStories] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState("");

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const API_URL = "http://localhost:5000/api";

  // --------------------------------------------------
  // Fetch story
  // --------------------------------------------------

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/stories/${encodeURIComponent(slug)}`,
          {
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load story",
          );
        }

        setStory(result.data);

        // Your current Story model does not yet contain
        // a likes field, so this safely defaults to 0.
        setLikeCount(result.data?.likes || 0);
      } catch (err) {
        console.error("Failed to fetch story:", err);

        setError(
          err.message ||
            "Something went wrong while loading the story.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      // Reset related stories whenever the slug changes so we
      // don't briefly show the previous story's related list.
      setRelatedStories([]);
      fetchStory();

      // Scroll to top when navigating between stories.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [slug]);

  // --------------------------------------------------
  // Fetch comments
  // --------------------------------------------------

  useEffect(() => {
    const fetchComments = async () => {
      if (!story?._id) {
        return;
      }

      try {
        setCommentsLoading(true);
        setCommentError("");

        const response = await fetch(
          `${API_URL}/comments/story/${story._id}`,
          {
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load comments",
          );
        }

        setComments(result.data || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);

        setCommentError(
          err.message || "Unable to load comments.",
        );
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [story]);

  // --------------------------------------------------
  // Fetch related stories (same category, excluding this one)
  // --------------------------------------------------

  useEffect(() => {
    const fetchRelated = async () => {
      if (!story?.category) {
        return;
      }

      try {
        setRelatedLoading(true);
        setRelatedError("");

        const response = await fetch(
          `${API_URL}/stories?category=${encodeURIComponent(
            story.category,
          )}&limit=4`,
          {
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load related stories",
          );
        }

        const list = (result.data || [])
          .filter(
            (item) =>
              item._id !== story._id &&
              item.slug !== story.slug,
          )
          .slice(0, 3);

        setRelatedStories(list);
      } catch (err) {
        console.error(
          "Failed to fetch related stories:",
          err,
        );

        setRelatedError(
          err.message || "Unable to load related stories.",
        );
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [story]);

  // --------------------------------------------------
  // Story URL
  // --------------------------------------------------

  const storyUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  }, [slug]);

  // --------------------------------------------------
  // Author
  // --------------------------------------------------

  const authorName =
    story?.authorId?.name || "Anonymous";

  // --------------------------------------------------
  // Back navigation
  // --------------------------------------------------

  const handleBack = () => {
    // If the user arrived from within the app (e.g. the stories
    // list), go back in history; otherwise fall back to /stories.
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/stories");
    }
  };

  // --------------------------------------------------
  // TipTap helpers
  // --------------------------------------------------

  const getNodeText = (node) => {
    if (!node) {
      return "";
    }

    if (node.type === "text") {
      return node.text || "";
    }

    if (node.type === "hardBreak") {
      return "\n";
    }

    if (Array.isArray(node.content)) {
      return node.content.map(getNodeText).join("");
    }

    return "";
  };

  // --------------------------------------------------
  // Render TipTap content
  // --------------------------------------------------

  const renderContentNode = (node, index) => {
    if (!node) {
      return null;
    }

    if (node.type === "paragraph") {
      const text = getNodeText(node);

      if (!text.trim()) {
        return <p key={index}>&nbsp;</p>;
      }

      return <p key={index}>{text}</p>;
    }

    if (node.type === "heading") {
      const text = getNodeText(node);
      const level = node.attrs?.level || 2;

      if (level === 1) {
        return <h2 key={index}>{text}</h2>;
      }

      if (level === 3) {
        return <h3 key={index}>{text}</h3>;
      }

      if (level === 4) {
        return <h4 key={index}>{text}</h4>;
      }

      return <h2 key={index}>{text}</h2>;
    }

    if (node.type === "bulletList") {
      return (
        <ul key={index}>
          {node.content?.map(
            (listItem, itemIndex) => (
              <li key={itemIndex}>
                {getNodeText(listItem)}
              </li>
            ),
          )}
        </ul>
      );
    }

    if (node.type === "orderedList") {
      return (
        <ol key={index}>
          {node.content?.map(
            (listItem, itemIndex) => (
              <li key={itemIndex}>
                {getNodeText(listItem)}
              </li>
            ),
          )}
        </ol>
      );
    }

    if (node.type === "blockquote") {
      return (
        <blockquote key={index}>
          {node.content?.map(
            (child, childIndex) =>
              renderContentNode(
                child,
                childIndex,
              ),
          )}
        </blockquote>
      );
    }

    if (node.type === "codeBlock") {
      return (
        <pre key={index}>
          <code>{getNodeText(node)}</code>
        </pre>
      );
    }

    if (node.type === "horizontalRule") {
      return <hr key={index} />;
    }

    return null;
  };

  // --------------------------------------------------
  // Like
  // --------------------------------------------------

  const handleLike = () => {
    setLiked((previousLiked) => {
      if (previousLiked) {
        setLikeCount((count) =>
          Math.max(0, count - 1),
        );

        return false;
      }

      setLikeCount((count) => count + 1);

      return true;
    });
  };

  // --------------------------------------------------
  // Copy link
  // --------------------------------------------------

  const copyStoryLink = async () => {
    if (!storyUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(storyUrl);

      setCopied(true);
      setShareMessage("Story link copied!");

      setTimeout(() => {
        setCopied(false);
        setShareMessage("");
      }, 2500);
    } catch (err) {
      console.error(
        "Failed to copy link:",
        err,
      );

      setShareMessage(
        "Unable to copy the link.",
      );
    }
  };

  // --------------------------------------------------
  // Native share
  // --------------------------------------------------

  const handleNativeShare = async () => {
    if (!story) {
      return;
    }

    const shareData = {
      title: story.title,
      text:
        story.excerpt ||
        `Read ${story.title}`,
      url: storyUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await copyStoryLink();
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error(
          "Share failed:",
          err,
        );
      }
    }
  };

  // --------------------------------------------------
  // Share window
  // --------------------------------------------------

  const openShareWindow = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer,width=700,height=600",
    );
  };

  // --------------------------------------------------
  // Facebook
  // --------------------------------------------------

  const shareOnFacebook = () => {
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        storyUrl,
      )}`,
    );
  };

  // --------------------------------------------------
  // X
  // --------------------------------------------------

  const shareOnX = () => {
    openShareWindow(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        storyUrl,
      )}&text=${encodeURIComponent(
        story.title,
      )}`,
    );
  };

  // --------------------------------------------------
  // WhatsApp
  // --------------------------------------------------

  const shareOnWhatsApp = () => {
    openShareWindow(
      `https://wa.me/?text=${encodeURIComponent(
        `${story.title}\n\n${storyUrl}`,
      )}`,
    );
  };

  // --------------------------------------------------
  // LinkedIn
  // --------------------------------------------------

  const shareOnLinkedIn = () => {
    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        storyUrl,
      )}`,
    );
  };

  // --------------------------------------------------
  // Email
  // --------------------------------------------------

  const shareByEmail = () => {
    window.location.href =
      `mailto:?subject=${encodeURIComponent(
        story.title,
      )}&body=${encodeURIComponent(
        `I thought you might find this story helpful:\n\n${storyUrl}`,
      )}`;
  };

  // --------------------------------------------------
  // Submit Comment
  // --------------------------------------------------

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      return;
    }

    if (!story?._id) {
      setCommentError(
        "Unable to identify this story.",
      );

      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentError("");
      setCommentMessage("");

      const response = await fetch(
        `${API_URL}/comments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            storyId: story._id,
            text: trimmedComment,
          }),
        },
      );

      const result = await response.json();

      // ------------------------------------------------
      // Authentication error
      // ------------------------------------------------

      if (response.status === 401) {
        throw new Error(
          "Please log in before posting a comment.",
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to submit comment",
        );
      }

      // ------------------------------------------------
      // Clear textarea
      // ------------------------------------------------

      setComment("");

      // ------------------------------------------------
      // Comment is awaiting moderation
      // ------------------------------------------------

      setCommentMessage(
        "Your comment has been submitted and is awaiting moderation.",
      );
    } catch (err) {
      console.error(
        "Failed to submit comment:",
        err,
      );

      setCommentError(
        err.message ||
          "Unable to submit your comment.",
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="story-state">
        <div className="container">
          <div className="story-state__card">
            <div className="story-loading__spinner" />

            <h2>Loading story...</h2>

            <p>
              Preparing this patient story
              for you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !story) {
    return (
      <div className="story-state">
        <div className="container">
          <div className="story-state__card">
            <span className="story-state__eyebrow">
              Patient story
            </span>

            <h2>Story not found</h2>

            <p>
              {error ||
                "The story you're looking for could not be found."}
            </p>

            <button
              type="button"
              className="button story-back-button story-back-button--centered"
              onClick={handleBack}
            >
              <FaArrowLeft />
              <span>Back to stories</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Story content
  // --------------------------------------------------

  const contentNodes =
    story.content?.content || [];

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      <PageHeader
        eyebrow="Patient story"
        title={story.title}
        subtitle={`A ${story.category.toLowerCase()} journey shared by ${authorName}.`}
      />

      <motion.main
        className="story-detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">

          {/* ==========================================
              BACK BUTTON
          ========================================== */}

          <button
            type="button"
            className="story-back-button"
            onClick={handleBack}
          >
            <FaArrowLeft />
            <span>Back to stories</span>
          </button>

          <div className="story-detail__layout">

            {/* ==========================================
                MAIN STORY
            ========================================== */}

            <article className="story-detail__main">

              <div className="story-detail__meta">
                <span className="story-detail__tag">
                  {story.condition}
                </span>

                <span className="story-detail__tag">
                  {story.category}
                </span>

                <span className="story-detail__read-time">
                  Patient story
                </span>
              </div>

              {/* Hero */}

              {story.image && (
                <motion.div
                  className="story-detail__hero"
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                >
                  <img
                    src={story.image}
                    alt={story.title}
                    className="story-detail__image"
                  />

                  <div className="story-detail__image-overlay">
                    <span>
                      <FaHeart />
                      {likeCount}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Article */}

              <div className="story-detail__article">

                <div className="story-detail__author-row">

                  <div className="story-detail__avatar">
                    {authorName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <span className="story-detail__author-label">
                      Shared by
                    </span>

                    <strong>
                      {authorName}
                    </strong>
                  </div>

                </div>

                {story.excerpt && (
                  <div className="story-detail__intro">
                    {story.excerpt}
                  </div>
                )}

                <div className="story-detail__body">
                  {contentNodes.map(
                    (node, index) =>
                      renderContentNode(
                        node,
                        index,
                      ),
                  )}
                </div>

              </div>

              {/* Article actions */}

              <div className="story-detail__actions">

                <button
                  type="button"
                  className={`story-action ${
                    liked
                      ? "story-action--liked"
                      : ""
                  }`}
                  onClick={handleLike}
                >
                  {liked ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}

                  <span>
                    {liked
                      ? "Liked"
                      : "Like"}
                  </span>

                  <strong>
                    {likeCount}
                  </strong>
                </button>

                <button
                  type="button"
                  className="story-action"
                  onClick={handleNativeShare}
                >
                  <FaShareNodes />

                  <span>
                    Share story
                  </span>
                </button>

                <button
                  type="button"
                  className="story-action"
                  onClick={copyStoryLink}
                >
                  <FaLink />

                  <span>
                    {copied
                      ? "Copied"
                      : "Copy link"}
                  </span>
                </button>

              </div>

              {/* ======================================
                  RELATED STORIES
              ====================================== */}

              {(relatedLoading ||
                relatedStories.length > 0) && (
                <section className="story-related">

                  <div className="story-related__heading">
                    <span className="story-sidebar__eyebrow">
                      Keep reading
                    </span>

                    <h3>
                      Related stories
                    </h3>
                  </div>

                  {relatedLoading && (
                    <div className="story-comments-loading">
                      Loading related stories...
                    </div>
                  )}

                  {!relatedLoading &&
                    relatedStories.length > 0 && (
                      <div className="story-related__grid">

                        {relatedStories.map(
                          (item) => (
                            <Link
                              key={item._id}
                              to={`/stories/${item.slug}`}
                              className="story-related__card"
                            >
                              {item.image && (
                                <div className="story-related__image-wrap">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="story-related__image"
                                  />
                                </div>
                              )}

                              <div className="story-related__body">
                                <span className="story-related__tag">
                                  {item.category}
                                </span>

                                <h4>
                                  {item.title}
                                </h4>

                                {item.excerpt && (
                                  <p>
                                    {item.excerpt}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ),
                        )}

                      </div>
                    )}

                </section>
              )}

              {!relatedLoading &&
                relatedStories.length === 0 &&
                relatedError && (
                  <div className="story-share-message">
                    {relatedError}
                  </div>
                )}

            </article>

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <aside className="story-detail__sidebar">

              <div className="story-sidebar">

                {/* ======================================
                    Author
                ====================================== */}

                <section className="story-sidebar__card story-sidebar__author">

                  <span className="story-sidebar__eyebrow">
                    About the storyteller
                  </span>

                  <div className="story-sidebar__author-avatar">
                    {authorName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <h3>
                    {authorName}
                  </h3>

                  <p>
                    A community member
                    sharing their
                    experience,
                    perspective, and
                    journey with
                    others.
                  </p>

                </section>

                {/* ======================================
                    Like
                ====================================== */}

                <section className="story-sidebar__card story-sidebar__like">

                  <div className="story-sidebar__card-heading">

                    <div>
                      <span className="story-sidebar__eyebrow">
                        Support this story
                      </span>

                      <h3>
                        Found this helpful?
                      </h3>
                    </div>

                    <FaHeart />

                  </div>

                  <p>
                    Let the storyteller
                    know their experience
                    matters to the
                    community.
                  </p>

                  <button
                    type="button"
                    className={`story-like-button ${
                      liked
                        ? "story-like-button--liked"
                        : ""
                    }`}
                    onClick={handleLike}
                  >
                    {liked ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}

                    {liked
                      ? "You liked this"
                      : "Like this story"}

                    <span>
                      {likeCount}
                    </span>
                  </button>

                </section>

                {/* ======================================
                    Share
                ====================================== */}

                <section className="story-sidebar__card story-sidebar__share">

                  <div className="story-sidebar__card-heading">

                    <div>
                      <span className="story-sidebar__eyebrow">
                        Spread the word
                      </span>

                      <h3>
                        Share this story
                      </h3>
                    </div>

                    <FaShareNodes />

                  </div>

                  <p>
                    Help someone else
                    discover a story
                    that may make them
                    feel less alone.
                  </p>

                  <div className="story-share-grid">

                    <button
                      type="button"
                      className="story-social story-social--facebook"
                      onClick={
                        shareOnFacebook
                      }
                      aria-label="Share on Facebook"
                      title="Share on Facebook"
                    >
                      <FaFacebookF />
                    </button>

                    <button
                      type="button"
                      className="story-social story-social--x"
                      onClick={shareOnX}
                      aria-label="Share on X"
                      title="Share on X"
                    >
                      <FaXTwitter />
                    </button>

                    <button
                      type="button"
                      className="story-social story-social--whatsapp"
                      onClick={
                        shareOnWhatsApp
                      }
                      aria-label="Share on WhatsApp"
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp />
                    </button>

                    <button
                      type="button"
                      className="story-social story-social--linkedin"
                      onClick={
                        shareOnLinkedIn
                      }
                      aria-label="Share on LinkedIn"
                      title="Share on LinkedIn"
                    >
                      <FaLinkedinIn />
                    </button>

                    <button
                      type="button"
                      className="story-social story-social--email"
                      onClick={
                        shareByEmail
                      }
                      aria-label="Share by email"
                      title="Share by email"
                    >
                      <FaEnvelope />
                    </button>

                    <button
                      type="button"
                      className="story-social story-social--copy"
                      onClick={
                        copyStoryLink
                      }
                      aria-label="Copy story link"
                      title="Copy story link"
                    >
                      <FaLink />
                    </button>

                  </div>

                  {shareMessage && (
                    <div className="story-share-message">
                      {shareMessage}
                    </div>
                  )}

                </section>

                {/* ======================================
                    Comments
                ====================================== */}

                <section className="story-sidebar__card story-sidebar__comments">

                  <div className="story-sidebar__card-heading">

                    <div>
                      <span className="story-sidebar__eyebrow">
                        Join the conversation
                      </span>

                      <h3>
                        Comments
                      </h3>
                    </div>

                    <span className="story-comment-count">
                      {comments.length}
                    </span>

                  </div>

                  <p>
                    Comments are moderated
                    to keep this a safe
                    and supportive
                    community.
                  </p>

                  {/* Comment form */}

                  <form
                    className="story-comment-form"
                    onSubmit={
                      handleCommentSubmit
                    }
                  >
                    <textarea
                      value={comment}
                      onChange={(event) =>
                        setComment(
                          event.target.value,
                        )
                      }
                      placeholder="Share your thoughts..."
                      aria-label="Write a comment"
                      maxLength={1000}
                      disabled={
                        commentSubmitting
                      }
                    />

                    <button
                      type="submit"
                      className="button story-comment-submit"
                      disabled={
                        !comment.trim() ||
                        commentSubmitting
                      }
                    >
                      {commentSubmitting
                        ? "Posting..."
                        : "Post comment"}
                    </button>
                  </form>

                  {/* Comment success message */}

                  {commentMessage && (
                    <div className="story-share-message">
                      {commentMessage}
                    </div>
                  )}

                  {/* Comment error */}

                  {commentError && (
                    <div className="story-share-message">
                      {commentError}
                    </div>
                  )}

                  {/* Loading comments */}

                  {commentsLoading && (
                    <div className="story-comments-loading">
                      Loading comments...
                    </div>
                  )}

                  {/* Comments */}

                  {!commentsLoading &&
                    comments.length > 0 && (
                      <div className="story-comments-list">

                        {comments.map((item) => {
                          const commentAuthor =
                            item.userId?.name ||
                            "Anonymous";

                          return (
                            <div
                              className="story-comment"
                              key={item._id}
                            >
                              <div className="story-comment__avatar">
                                {commentAuthor
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="story-comment__content">

                                <strong>
                                  {
                                    commentAuthor
                                  }
                                </strong>

                                <p>
                                  {
                                    item.text
                                  }
                                </p>

                              </div>
                            </div>
                          );
                        })}

                      </div>
                    )}

                  {/* No comments */}

                  {!commentsLoading &&
                    comments.length === 0 &&
                    !commentError && (
                      <div className="story-comments-empty">
                        <p>
                          No comments yet.
                          Be the first to
                          join the
                          conversation.
                        </p>
                      </div>
                    )}

                </section>

                {/* ======================================
                    Follow
                ====================================== */}

                <section className="story-sidebar__card story-sidebar__follow">

                  <span className="story-sidebar__eyebrow">
                    Stay connected
                  </span>

                  <h3>
                    Follow our community
                  </h3>

                  <p>
                    Stay connected with
                    stories, support, and
                    community updates.
                  </p>

                  <div className="story-follow-icons">

                    <a
                      href="#facebook"
                      aria-label="Facebook"
                    >
                      <FaFacebookF />
                    </a>

                    <a
                      href="#twitter"
                      aria-label="X"
                    >
                      <FaXTwitter />
                    </a>

                    <a
                      href="#linkedin"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedinIn />
                    </a>

                    <a
                      href="#whatsapp"
                      aria-label="WhatsApp"
                    >
                      <FaWhatsapp />
                    </a>

                  </div>

                </section>

              </div>

            </aside>

          </div>
        </div>
      </motion.main>
    </>
  );
}