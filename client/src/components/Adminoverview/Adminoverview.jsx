import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaComments,
  FaUsers,
  FaUserPen,
  FaTriangleExclamation,
  FaArrowRight,
} from "react-icons/fa6";
import "./AdminOverview.css";

const API_URL = "http://localhost:5000/api";

export default function AdminOverview() {
  // --------------------------------------------------
  // Raw data
  // --------------------------------------------------

  const [stories, setStories] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch everything in parallel
  // --------------------------------------------------

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          storiesRes,
          commentsRes,
          usersRes,
          authorsRes,
        ] = await Promise.all([
          fetch(`${API_URL}/admin/stories`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/admin/comments`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/admin/users`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/admin/authors`, {
            credentials: "include",
          }),
        ]);

        const [
          storiesData,
          commentsData,
          usersData,
          authorsData,
        ] = await Promise.all([
          storiesRes.json(),
          commentsRes.json(),
          usersRes.json(),
          authorsRes.json(),
        ]);

        if (!storiesRes.ok || storiesData.success === false) {
          throw new Error(
            storiesData.message || "Failed to load stories",
          );
        }

        if (!commentsRes.ok || commentsData.success === false) {
          throw new Error(
            commentsData.message || "Failed to load comments",
          );
        }

        if (!usersRes.ok || usersData.success === false) {
          throw new Error(
            usersData.message || "Failed to load users",
          );
        }

        if (!authorsRes.ok || authorsData.success === false) {
          throw new Error(
            authorsData.message || "Failed to load authors",
          );
        }

        setStories(storiesData.data || []);
        setComments(commentsData.data || []);
        setUsers(usersData.data || []);
        setAuthors(authorsData.data || []);
      } catch (err) {
        console.error(
          "Failed to load dashboard overview:",
          err,
        );

        setError(
          err.message ||
            "Something went wrong while loading the dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  // --------------------------------------------------
  // Derived stats
  // --------------------------------------------------

  const publishedCount = stories.filter(
    (story) => story.published,
  ).length;

  const draftCount = stories.length - publishedCount;

  const pendingComments = comments.filter(
    (comment) => (comment.status || "pending") === "pending",
  );

  const authorRoleCount = users.filter(
    (user) => user.role === "author",
  ).length;

  const adminRoleCount = users.filter(
    (user) => user.role === "admin",
  ).length;

  // --------------------------------------------------
  // Recent activity
  // --------------------------------------------------

  const recentStories = [...stories]
    .sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )
    .slice(0, 5);

  const recentComments = [...comments]
    .sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )
    .slice(0, 5);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const formatDate = (value) => {
    if (!value) return "";

    try {
      return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getStoryStoryAuthor = (story) =>
    story.authorId?.name || "Unknown author";

  const getCommentAuthor = (comment) =>
    comment.userId?.name || "Anonymous";

  // --------------------------------------------------
  // Loading / error
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="dashboard-overview__state">
        <div className="dashboard-overview__spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-overview__state">
        <p>{error}</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="dashboard-overview">

      {/* ==========================================
          NEEDS ATTENTION
      ========================================== */}

      {pendingComments.length > 0 && (
        <Link
          to="/admin/comments?status=pending"
          className="dashboard-overview__alert"
        >
          <FaTriangleExclamation />

          <span>
            <strong>
              {pendingComments.length} comment
              {pendingComments.length === 1 ? "" : "s"}
            </strong>{" "}
            waiting for moderation
          </span>

          <FaArrowRight className="dashboard-overview__alert-arrow" />
        </Link>
      )}

      {/* ==========================================
          STAT CARDS
      ========================================== */}

      <div className="dashboard-overview__stats">

        <Link
          to="/admin/stories"
          className="dashboard-stat-card"
        >
          <span className="dashboard-stat-card__icon dashboard-stat-card__icon--purple">
            <FaBookOpen />
          </span>

          <div>
            <strong>{stories.length}</strong>
            <span>Stories</span>
          </div>

          <div className="dashboard-stat-card__breakdown">
            <span>{publishedCount} published</span>
            <span>{draftCount} draft</span>
          </div>
        </Link>

        <Link
          to="/admin/comments"
          className="dashboard-stat-card"
        >
          <span className="dashboard-stat-card__icon dashboard-stat-card__icon--gold">
            <FaComments />
          </span>

          <div>
            <strong>{comments.length}</strong>
            <span>Comments</span>
          </div>

          <div className="dashboard-stat-card__breakdown">
            <span
              className={
                pendingComments.length > 0
                  ? "dashboard-stat-card__flag"
                  : ""
              }
            >
              {pendingComments.length} pending
            </span>
          </div>
        </Link>

        <Link to="/admin/users" className="dashboard-stat-card">
          <span className="dashboard-stat-card__icon dashboard-stat-card__icon--terracotta">
            <FaUsers />
          </span>

          <div>
            <strong>{users.length}</strong>
            <span>Users</span>
          </div>

          <div className="dashboard-stat-card__breakdown">
            <span>{adminRoleCount} admin</span>
            <span>{authorRoleCount} author</span>
          </div>
        </Link>

        <Link
          to="/admin/authors"
          className="dashboard-stat-card"
        >
          <span className="dashboard-stat-card__icon dashboard-stat-card__icon--purple">
            <FaUserPen />
          </span>

          <div>
            <strong>{authors.length}</strong>
            <span>Authors</span>
          </div>

          <div className="dashboard-stat-card__breakdown">
            <span>
              {stories.length} total stories written
            </span>
          </div>
        </Link>

      </div>

      {/* ==========================================
          RECENT ACTIVITY
      ========================================== */}

      <div className="dashboard-overview__activity">

        <div className="dashboard-activity-card">
          <div className="dashboard-activity-card__head">
            <h3>Recent stories</h3>

            <Link to="/admin/stories">View all</Link>
          </div>

          {recentStories.length === 0 ? (
            <p className="dashboard-activity-card__empty">
              No stories yet.
            </p>
          ) : (
            <ul>
              {recentStories.map((story) => (
                <li key={story._id}>
                  <div>
                    <strong>{story.title}</strong>
                    <span>
                      By {getStoryStoryAuthor(story)} ·{" "}
                      {formatDate(story.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`dashboard-pill ${
                      story.published
                        ? "dashboard-pill--published"
                        : "dashboard-pill--draft"
                    }`}
                  >
                    {story.published ? "Published" : "Draft"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-activity-card">
          <div className="dashboard-activity-card__head">
            <h3>Recent comments</h3>

            <Link to="/admin/comments">View all</Link>
          </div>

          {recentComments.length === 0 ? (
            <p className="dashboard-activity-card__empty">
              No comments yet.
            </p>
          ) : (
            <ul>
              {recentComments.map((comment) => {
                const status = comment.status || "pending";

                return (
                  <li key={comment._id}>
                    <div>
                      <strong className="dashboard-activity-card__comment-text">
                        {comment.text}
                      </strong>
                      <span>
                        {getCommentAuthor(comment)} ·{" "}
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    <span
                      className={`dashboard-pill dashboard-pill--${status}`}
                    >
                      {status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
}