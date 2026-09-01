import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaMagnifyingGlass,
  FaArrowRotateRight,
  FaPen,
  FaXmark,
  FaFloppyDisk,
  FaXTwitter,
  FaLinkedinIn,
  FaLink,
  FaBookOpen,
} from "react-icons/fa6";
import "./AdminAuthors.css";

export default function AdminAuthors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  // --------------------------------------------------
  // Authors state
  // --------------------------------------------------

  const [authors, setAuthors] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState(search);

  const [refreshToken, setRefreshToken] = useState(0);

  // --------------------------------------------------
  // Inline edit state
  // --------------------------------------------------

  // The id of the author currently being edited, or null.
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    bio: "",
    twitter: "",
    linkedin: "",
    website: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const API_URL = "http://localhost:5000/api";

  // --------------------------------------------------
  // Fetch authors
  // --------------------------------------------------

  const fetchAuthors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const query = search
        ? `?search=${encodeURIComponent(search)}`
        : "";

      const response = await fetch(
        `${API_URL}/admin/authors${query}`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to load authors",
        );
      }

      setAuthors(result.data || []);
      setCount(
        typeof result.count === "number"
          ? result.count
          : (result.data || []).length,
      );
    } catch (err) {
      console.error("Failed to fetch admin authors:", err);

      setError(
        err.message ||
          "Something went wrong while loading authors.",
      );

      setAuthors([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors, refreshToken]);

  // --------------------------------------------------
  // Search
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

  const clearSearch = () => {
    setSearchInput("");

    const next = new URLSearchParams(searchParams);
    next.delete("search");
    setSearchParams(next);
  };

  // --------------------------------------------------
  // Start / cancel editing
  // --------------------------------------------------

  const startEditing = (author) => {
    setEditingId(author._id);
    setSaveError("");

    setEditForm({
      bio: author.bio || "",
      twitter: author.socialLinks?.twitter || "",
      linkedin: author.socialLinks?.linkedin || "",
      website: author.socialLinks?.website || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setSaveError("");
  };

  // --------------------------------------------------
  // Save profile
  // --------------------------------------------------

  const handleSave = async (authorId) => {
    try {
      setSaving(true);
      setSaveError("");

      const response = await fetch(
        `${API_URL}/admin/authors/${authorId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: editForm.bio,
            socialLinks: {
              twitter: editForm.twitter,
              linkedin: editForm.linkedin,
              website: editForm.website,
            },
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        const firstError = result.errors?.[0]?.message;

        throw new Error(
          firstError ||
            result.message ||
            "Failed to save author profile",
        );
      }

      // Update the row in place instead of a full refetch,
      // since we already have the updated author back.
      setAuthors((current) =>
        current.map((author) =>
          author._id === authorId
            ? { ...author, ...result.data }
            : author,
        ),
      );

      setEditingId(null);
    } catch (err) {
      console.error(
        "Failed to save author profile:",
        err,
      );

      setSaveError(
        err.message ||
          "Failed to save author profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getInitial = (name) =>
    (name || "?").charAt(0).toUpperCase();

  const normalizeUrl = (value) => {
    if (!value) {
      return "";
    }

    return /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="admin-authors">

      <div className="admin-authors__header">
        <div>
          <span className="admin-authors__eyebrow">
            Content
          </span>

          <h2>Authors</h2>
        </div>

        <button
          type="button"
          className="admin-authors__refresh"
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

      <form
        className="admin-authors__search"
        onSubmit={handleSearchSubmit}
      >
        <FaMagnifyingGlass />

        <input
          type="text"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
          placeholder="Search authors by name or email..."
          aria-label="Search authors"
        />

        {search && (
          <button
            type="button"
            className="admin-authors__search-clear"
            onClick={clearSearch}
          >
            Clear
          </button>
        )}
      </form>

      <div className="admin-authors__count">
        {loading
          ? "Loading..."
          : `${count} author${count === 1 ? "" : "s"}`}
      </div>

      {loading && (
        <div className="admin-authors__state">
          <div className="admin-authors__spinner" />
          <p>Loading authors...</p>
        </div>
      )}

      {!loading && error && (
        <div className="admin-authors__state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && authors.length === 0 && (
        <div className="admin-authors__state">
          <p>
            No authors found. Promote a user to "author"
            from the Users page to see them here.
          </p>
        </div>
      )}

      {!loading && !error && authors.length > 0 && (
        <div className="admin-authors__grid">
          {authors.map((author) => {
            const isEditing = editingId === author._id;

            return (
              <div
                className="author-card"
                key={author._id}
              >

                <div className="author-card__top">

                  <div className="author-card__identity">
                    <div className="author-card__avatar">
                      {getInitial(author.name)}
                    </div>

                    <div>
                      <h3>{author.name}</h3>
                      <span>{author.email}</span>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      className="author-card__edit-btn"
                      onClick={() =>
                        startEditing(author)
                      }
                      title="Edit profile"
                    >
                      <FaPen />
                    </button>
                  )}

                </div>

                <div className="author-card__stats">
                  <div className="author-card__stat">
                    <FaBookOpen />
                    <strong>
                      {author.storyCount}
                    </strong>
                    <span>total</span>
                  </div>

                  <div className="author-card__stat">
                    <span className="author-card__dot author-card__dot--published" />
                    <strong>
                      {author.publishedCount}
                    </strong>
                    <span>published</span>
                  </div>

                  <div className="author-card__stat">
                    <span className="author-card__dot author-card__dot--draft" />
                    <strong>
                      {author.draftCount}
                    </strong>
                    <span>drafts</span>
                  </div>
                </div>

                {!isEditing && (
                  <>
                    <p className="author-card__bio">
                      {author.bio || (
                        <em>No bio yet.</em>
                      )}
                    </p>

                    {(author.socialLinks?.twitter ||
                      author.socialLinks?.linkedin ||
                      author.socialLinks?.website) && (
                      <div className="author-card__socials">
                        {author.socialLinks?.twitter && (
                          <a
                            href={normalizeUrl(
                              author.socialLinks.twitter,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X / Twitter"
                          >
                            <FaXTwitter />
                          </a>
                        )}

                        {author.socialLinks?.linkedin && (
                          <a
                            href={normalizeUrl(
                              author.socialLinks
                                .linkedin,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                          >
                            <FaLinkedinIn />
                          </a>
                        )}

                        {author.socialLinks?.website && (
                          <a
                            href={normalizeUrl(
                              author.socialLinks.website,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Website"
                          >
                            <FaLink />
                          </a>
                        )}
                      </div>
                    )}
                  </>
                )}

                {isEditing && (
                  <div className="author-card__edit-form">

                    <label>
                      Bio
                      <textarea
                        value={editForm.bio}
                        onChange={(event) =>
                          setEditForm((form) => ({
                            ...form,
                            bio: event.target.value,
                          }))
                        }
                        maxLength={500}
                        rows={3}
                        placeholder="A short author bio..."
                      />

                      <span className="author-card__char-count">
                        {editForm.bio.length}/500
                      </span>
                    </label>

                    <label>
                      X / Twitter
                      <input
                        type="text"
                        value={editForm.twitter}
                        onChange={(event) =>
                          setEditForm((form) => ({
                            ...form,
                            twitter:
                              event.target.value,
                          }))
                        }
                        placeholder="twitter.com/username"
                      />
                    </label>

                    <label>
                      LinkedIn
                      <input
                        type="text"
                        value={editForm.linkedin}
                        onChange={(event) =>
                          setEditForm((form) => ({
                            ...form,
                            linkedin:
                              event.target.value,
                          }))
                        }
                        placeholder="linkedin.com/in/username"
                      />
                    </label>

                    <label>
                      Website
                      <input
                        type="text"
                        value={editForm.website}
                        onChange={(event) =>
                          setEditForm((form) => ({
                            ...form,
                            website:
                              event.target.value,
                          }))
                        }
                        placeholder="example.com"
                      />
                    </label>

                    {saveError && (
                      <div className="author-card__save-error">
                        {saveError}
                      </div>
                    )}

                    <div className="author-card__edit-actions">
                      <button
                        type="button"
                        className="author-card__save-btn"
                        onClick={() =>
                          handleSave(author._id)
                        }
                        disabled={saving}
                      >
                        <FaFloppyDisk />
                        <span>
                          {saving
                            ? "Saving..."
                            : "Save"}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="author-card__cancel-btn"
                        onClick={cancelEditing}
                        disabled={saving}
                      >
                        <FaXmark />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}