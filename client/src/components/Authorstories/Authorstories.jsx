import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaPen,
  FaTrash,
  FaPenNib,
  FaArrowRotateRight,
} from "react-icons/fa6";
import "./AuthorStories.css";

const API_URL = "http://localhost:5000/api";

export default function AuthorStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionId, setActionId] = useState(null);
  const [actionError, setActionError] = useState("");

  const [refreshToken, setRefreshToken] = useState(0);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/stories/mine`,
        { credentials: "include" },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to load your stories",
        );
      }

      setStories(result.data || []);
    } catch (err) {
      console.error("Failed to fetch author stories:", err);

      setError(
        err.message ||
          "Something went wrong while loading your stories.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories, refreshToken]);

  // --------------------------------------------------
  // Publish / unpublish
  // --------------------------------------------------

  const togglePublish = async (story) => {
    try {
      setActionId(story._id);
      setActionError("");

      const response = await fetch(
        `${API_URL}/stories/${story._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published: !story.published,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to update story",
        );
      }

      setRefreshToken((token) => token + 1);
    } catch (err) {
      console.error("Failed to toggle publish:", err);
      setActionError(err.message || "Failed to update story");
    } finally {
      setActionId(null);
    }
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (story) => {
    const confirmed = window.confirm(
      `Delete "${story.title}" permanently? This can't be undone.`,
    );

    if (!confirmed) return;

    try {
      setActionId(story._id);
      setActionError("");

      const response = await fetch(
        `${API_URL}/stories/${story._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to delete story",
        );
      }

      setRefreshToken((token) => token + 1);
    } catch (err) {
      console.error("Failed to delete story:", err);
      setActionError(err.message || "Failed to delete story");
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return "";

    try {
      return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="author-stories">

      <div className="author-stories__header">
        <h2>My stories</h2>

        <div className="author-stories__header-actions">
          <button
            type="button"
            className="author-stories__refresh"
            onClick={() =>
              setRefreshToken((token) => token + 1)
            }
            disabled={loading}
          >
            <FaArrowRotateRight
              className={loading ? "spin" : ""}
            />
          </button>

          <Link to="/add-story" className="btn btn-primary">
            <FaPenNib />
            Write a new story
          </Link>
        </div>
      </div>

      {actionError && (
        <div className="author-stories__banner">
          {actionError}
        </div>
      )}

      <div className="author-stories__card">

        {loading && (
          <div className="author-stories__state">
            <p>Loading your stories...</p>
          </div>
        )}

        {!loading && error && (
          <div className="author-stories__state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="author-stories__state">
            <p>
              You haven't written any stories yet.{" "}
              <Link to="/add-story">Write your first one</Link>.
            </p>
          </div>
        )}

        {!loading && !error && stories.length > 0 && (
          <div className="author-stories__table-wrap">
            <table className="author-stories-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Created</th>
                  <th className="author-stories-table__actions-col">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {stories.map((story) => {
                  const isBusy = actionId === story._id;

                  return (
                    <tr key={story._id}>
                      <td className="author-stories-table__title">
                        {story.published ? (
                          <Link
                            to={`/stories/${story.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {story.title}
                          </Link>
                        ) : (
                          <span>{story.title}</span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`dashboard-pill ${
                            story.published
                              ? "dashboard-pill--published"
                              : "dashboard-pill--draft"
                          }`}
                        >
                          {story.published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </td>

                      <td>{story.views || 0}</td>

                      <td>{formatDate(story.createdAt)}</td>

                      <td>
                        <div className="author-stories-table__actions">

                          <Link
                            to={`/add-story?id=${story._id}`}
                            className="author-story-action"
                            title="Edit"
                          >
                            <FaPen />
                          </Link>

                          {story.published ? (
                            <button
                              type="button"
                              className="author-story-action"
                              onClick={() =>
                                togglePublish(story)
                              }
                              disabled={isBusy}
                              title="Unpublish"
                            >
                              <FaEyeSlash />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="author-story-action"
                              onClick={() =>
                                togglePublish(story)
                              }
                              disabled={isBusy}
                              title="Publish"
                            >
                              <FaEye />
                            </button>
                          )}

                          <button
                            type="button"
                            className="author-story-action author-story-action--delete"
                            onClick={() =>
                              handleDelete(story)
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