import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaArrowRotateRight,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import "./AdminStories.css";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "true", label: "Published" },
  { key: "false", label: "Drafts" },
];

export default function AdminStories() {
  const [searchParams, setSearchParams] = useSearchParams();

  // "published" query param drives both the fetch and the
  // active tab: "" (all), "true", or "false".
  const publishedFilter = searchParams.get("published") || "";

  // --------------------------------------------------
  // Stories state
  // --------------------------------------------------

  const [stories, setStories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const search = searchParams.get("search") || "";

  // --------------------------------------------------
  // Per-row action state
  // --------------------------------------------------

  const [actionStoryId, setActionStoryId] = useState(null);
  const [actionError, setActionError] = useState("");

  const [refreshToken, setRefreshToken] = useState(0);

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const API_URL = "http://localhost:5000/api";

  // --------------------------------------------------
  // Fetch stories
  // --------------------------------------------------

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (publishedFilter) {
        params.set("published", publishedFilter);
      }

      if (search) {
        params.set("search", search);
      }

      const query = params.toString()
        ? `?${params.toString()}`
        : "";

      const response = await fetch(
        `${API_URL}/admin/stories${query}`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to load stories",
        );
      }

      setStories(result.data || []);
      setCount(
        typeof result.count === "number"
          ? result.count
          : (result.data || []).length,
      );
    } catch (err) {
      console.error("Failed to fetch admin stories:", err);

      setError(
        err.message ||
          "Something went wrong while loading stories.",
      );

      setStories([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [publishedFilter, search]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories, refreshToken]);

  // --------------------------------------------------
  // Tab switching
  // --------------------------------------------------

  const handleTabChange = (tabValue) => {
    const next = new URLSearchParams(searchParams);

    if (tabValue) {
      next.set("published", tabValue);
    } else {
      next.delete("published");
    }

    setSearchParams(next);
  };

  // --------------------------------------------------
  // Search submit
  // --------------------------------------------------

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const next = new URLSearchParams(searchParams);
    const trimmed = searchInput.trim();

    if (trimmed) {
      next.set("search", trimmed);
    } else {
      next.delete("search");
    }

    setSearchParams(next);
  };

  // --------------------------------------------------
  // Publish / Unpublish
  // --------------------------------------------------

  const handlePublish = async (storyId) => {
    await runAction(
      storyId,
      `${API_URL}/admin/stories/${storyId}/publish`,
      "PATCH",
      "Failed to publish story",
    );
  };

  const handleUnpublish = async (storyId) => {
    await runAction(
      storyId,
      `${API_URL}/admin/stories/${storyId}/unpublish`,
      "PATCH",
      "Failed to unpublish story",
    );
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (storyId, title) => {
    const confirmed = window.confirm(
      `Delete "${title}" permanently? This can't be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await runAction(
      storyId,
      `${API_URL}/admin/stories/${storyId}`,
      "DELETE",
      "Failed to delete story",
    );
  };

  // --------------------------------------------------
  // Shared action runner
  // --------------------------------------------------

  const runAction = async (
    storyId,
    url,
    method,
    fallbackMessage,
  ) => {
    try {
      setActionStoryId(storyId);
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

      // Refetch the current filtered list so status badges
      // and counts stay accurate after the change.
      setRefreshToken((token) => token + 1);
    } catch (err) {
      console.error("Admin story action failed:", err);

      setActionError(
        err.message || fallbackMessage,
      );
    } finally {
      setActionStoryId(null);
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

  const getAuthorName = (story) =>
    story.authorId?.name || "Unknown author";

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="admin-stories">

      <div className="admin-stories__header">
        <div>
          <span className="admin-stories__eyebrow">
            Content
          </span>

          <h2>Stories</h2>
        </div>

        <button
          type="button"
          className="admin-stories__refresh"
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

      <div className="admin-stories__controls">

        <div className="admin-stories__tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key || "all"}
              type="button"
              className={`admin-stories__tab ${
                publishedFilter === tab.key
                  ? "admin-stories__tab--active"
                  : ""
              }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          className="admin-stories__search"
          onSubmit={handleSearchSubmit}
        >
          <FaMagnifyingGlass />

          <input
            type="text"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Search title or excerpt..."
            aria-label="Search stories"
          />

          {search && (
            <button
              type="button"
              className="admin-stories__search-clear"
              onClick={() => {
                setSearchInput("");

                const next = new URLSearchParams(
                  searchParams,
                );

                next.delete("search");
                setSearchParams(next);
              }}
            >
              Clear
            </button>
          )}
        </form>

      </div>

      <div className="admin-stories__card">

        <div className="admin-stories__card-heading">
          <span>
            {loading
              ? "Loading..."
              : `${count} stor${count === 1 ? "y" : "ies"}`}
          </span>
        </div>

        {actionError && (
          <div className="admin-stories__banner admin-stories__banner--error">
            {actionError}
          </div>
        )}

        {loading && (
          <div className="admin-stories__state">
            <div className="admin-stories__spinner" />
            <p>Loading stories...</p>
          </div>
        )}

        {!loading && error && (
          <div className="admin-stories__state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="admin-stories__state">
            <p>No stories found for this filter.</p>
          </div>
        )}

        {!loading && !error && stories.length > 0 && (
          <div className="admin-stories__table-wrap">
            <table className="admin-stories-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Condition</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="admin-stories-table__actions-col">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {stories.map((story) => {
                  const isBusy =
                    actionStoryId === story._id;

                  return (
                    <tr key={story._id}>
                      <td className="admin-stories-table__title">
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

                      <td>{getAuthorName(story)}</td>

                      <td>{story.condition}</td>

                      <td>{story.category}</td>

                      <td>
                        <span
                          className={`status-pill ${
                            story.published
                              ? "status-pill--published"
                              : "status-pill--draft"
                          }`}
                        >
                          {story.published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </td>

                      <td>
                        {formatDate(story.createdAt)}
                      </td>

                      <td>
                        <div className="admin-stories-table__actions">

                          {story.published ? (
                            <button
                              type="button"
                              className="admin-story-action admin-story-action--unpublish"
                              onClick={() =>
                                handleUnpublish(
                                  story._id,
                                )
                              }
                              disabled={isBusy}
                              title="Unpublish"
                            >
                              <FaEyeSlash />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="admin-story-action admin-story-action--publish"
                              onClick={() =>
                                handlePublish(
                                  story._id,
                                )
                              }
                              disabled={isBusy}
                              title="Publish"
                            >
                              <FaEye />
                            </button>
                          )}

                          <button
                            type="button"
                            className="admin-story-action admin-story-action--delete"
                            onClick={() =>
                              handleDelete(
                                story._id,
                                story.title,
                              )
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