import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCheck,
  FaXmark,
  FaTrash,
  FaArrowRotateRight,
} from "react-icons/fa6";
import "./AdminComments.css";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminComments() {
  const [searchParams, setSearchParams] = useSearchParams();

  // The "status" query param drives both the fetch and the
  // active tab, so links like /admin/comments?status=pending
  // from the sidebar work without any extra state.
  const status = searchParams.get("status") || "";

  // --------------------------------------------------
  // Comments state
  // --------------------------------------------------

  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Per-row action state
  // --------------------------------------------------

  // Tracks which comment id currently has an approve/reject/delete
  // request in flight, so we can disable just that row's buttons.
  const [actionCommentId, setActionCommentId] = useState(null);
  const [actionError, setActionError] = useState("");

  // Bumped after a successful action to trigger a refetch.
  const [refreshToken, setRefreshToken] = useState(0);

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const API_URL = "http://localhost:5000/api";

  // --------------------------------------------------
  // Fetch comments
  // --------------------------------------------------

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const query = status
        ? `?status=${encodeURIComponent(status)}`
        : "";

      const response = await fetch(
        `${API_URL}/admin/comments${query}`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to load comments",
        );
      }

      setComments(result.data || []);
      setCount(
        typeof result.count === "number"
          ? result.count
          : (result.data || []).length,
      );
    } catch (err) {
      console.error("Failed to fetch admin comments:", err);

      setError(
        err.message ||
          "Something went wrong while loading comments.",
      );

      setComments([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshToken]);

  // --------------------------------------------------
  // Tab switching
  // --------------------------------------------------

  const handleTabChange = (tabStatus) => {
    if (tabStatus) {
      setSearchParams({ status: tabStatus });
    } else {
      setSearchParams({});
    }
  };

  // --------------------------------------------------
  // Approve
  // --------------------------------------------------

  const handleApprove = async (commentId) => {
    await runAction(
      commentId,
      `${API_URL}/admin/comments/${commentId}/approve`,
      "PATCH",
      "Failed to approve comment",
    );
  };

  // --------------------------------------------------
  // Reject
  // --------------------------------------------------

  const handleReject = async (commentId) => {
    await runAction(
      commentId,
      `${API_URL}/admin/comments/${commentId}/reject`,
      "PATCH",
      "Failed to reject comment",
    );
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm(
      "Delete this comment permanently? This can't be undone.",
    );

    if (!confirmed) {
      return;
    }

    await runAction(
      commentId,
      `${API_URL}/admin/comments/${commentId}`,
      "DELETE",
      "Failed to delete comment",
    );
  };

  // --------------------------------------------------
  // Shared action runner
  // --------------------------------------------------

  const runAction = async (
    commentId,
    url,
    method,
    fallbackMessage,
  ) => {
    try {
      setActionCommentId(commentId);
      setActionError("");

      const response = await fetch(url, {
        method,
        credentials: "include",
      });

      const result = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || fallbackMessage,
        );
      }

      // Simplest correct approach: refetch the current filtered
      // list so counts and status badges stay accurate. For a
      // high-traffic moderation queue you'd want to update the
      // row in place instead, but a refetch keeps this reliable.
      setRefreshToken((token) => token + 1);
    } catch (err) {
      console.error("Admin comment action failed:", err);

      setActionError(
        err.message || fallbackMessage,
      );
    } finally {
      setActionCommentId(null);
    }
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    try {
      return new Date(value).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
    } catch {
      return "";
    }
  };

  const getAuthorName = (comment) =>
    comment.userId?.name || "Anonymous";

  const getStoryInfo = (comment) => {
    // storyId may come back populated ({ _id, title, slug })
    // or as a plain id string, depending on the controller.
    if (comment.storyId && typeof comment.storyId === "object") {
      return {
        title: comment.storyId.title || "Untitled story",
        slug: comment.storyId.slug || null,
      };
    }

    return { title: "Story", slug: null };
  };

  const statusLabel = useMemo(() => {
    const match = STATUS_TABS.find(
      (tab) => tab.key === status,
    );

    return match ? match.label : "All";
  }, [status]);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="admin-comments">

      <div className="admin-comments__header">
        <div>
          <span className="admin-comments__eyebrow">
            Moderation
          </span>

          <h2>Comments</h2>
        </div>

        <button
          type="button"
          className="admin-comments__refresh"
          onClick={() =>
            setRefreshToken((token) => token + 1)
          }
          disabled={loading}
        >
          <FaArrowRotateRight
            className={loading ? "spin" : ""}
          />
          <span>Refresh</span>
        </button>
      </div>

      <div className="admin-comments__tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key || "all"}
            type="button"
            className={`admin-comments__tab ${
              status === tab.key
                ? "admin-comments__tab--active"
                : ""
            }`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-comments__card">

        <div className="admin-comments__card-heading">
          <span>
            {loading
              ? "Loading..."
              : `${count} ${
                  statusLabel === "All"
                    ? ""
                    : statusLabel.toLowerCase() + " "
                }comment${count === 1 ? "" : "s"}`}
          </span>
        </div>

        {actionError && (
          <div className="admin-comments__banner admin-comments__banner--error">
            {actionError}
          </div>
        )}

        {loading && (
          <div className="admin-comments__state">
            <div className="admin-comments__spinner" />
            <p>Loading comments...</p>
          </div>
        )}

        {!loading && error && (
          <div className="admin-comments__state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && comments.length === 0 && (
          <div className="admin-comments__state">
            <p>No comments found for this filter.</p>
          </div>
        )}

        {!loading && !error && comments.length > 0 && (
          <div className="admin-comments__table-wrap">
            <table className="admin-comments-table">
              <thead>
                <tr>
                  <th>Comment</th>
                  <th>Author</th>
                  <th>Story</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th className="admin-comments-table__actions-col">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {comments.map((comment) => {
                  const isBusy =
                    actionCommentId === comment._id;

                  const story = getStoryInfo(comment);
                  const commentStatus =
                    comment.status || "pending";

                  return (
                    <tr key={comment._id}>
                      <td className="admin-comments-table__text">
                        <span title={comment.text}>
                          {comment.text}
                        </span>
                      </td>

                      <td>{getAuthorName(comment)}</td>

                      <td>
                        {story.slug ? (
                          <Link
                            to={`/stories/${story.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-comments-table__story-link"
                          >
                            {story.title}
                          </Link>
                        ) : (
                          <span>{story.title}</span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge status-badge--${commentStatus}`}
                        >
                          {commentStatus}
                        </span>
                      </td>

                      <td>
                        {formatDate(comment.createdAt)}
                      </td>

                      <td>
                        <div className="admin-comments-table__actions">

                          {commentStatus !== "approved" && (
                            <button
                              type="button"
                              className="admin-comment-action admin-comment-action--approve"
                              onClick={() =>
                                handleApprove(comment._id)
                              }
                              disabled={isBusy}
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                          )}

                          {commentStatus !== "rejected" && (
                            <button
                              type="button"
                              className="admin-comment-action admin-comment-action--reject"
                              onClick={() =>
                                handleReject(comment._id)
                              }
                              disabled={isBusy}
                              title="Reject"
                            >
                              <FaXmark />
                            </button>
                          )}

                          <button
                            type="button"
                            className="admin-comment-action admin-comment-action--delete"
                            onClick={() =>
                              handleDelete(comment._id)
                            }
                            disabled={isBusy}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}