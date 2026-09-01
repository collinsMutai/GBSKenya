import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaMagnifyingGlass,
  FaArrowRight,
  FaEnvelope,
  FaHandHoldingHeart,
} from "react-icons/fa6";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./AllStories.css";

const API_URL = "http://localhost:5000/api";
const PAGE_SIZE = 6;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 22,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function AllStories() {
  // --------------------------------------------------
  // Data
  // --------------------------------------------------

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // --------------------------------------------------
  // Newsletter widget
  // --------------------------------------------------

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  // --------------------------------------------------
  // Fetch stories from API
  // --------------------------------------------------

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/stories`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load stories");
        }

        setStories(result.data || []);
      } catch (err) {
        console.error("Failed to fetch stories:", err);

        setError(err.message || "Unable to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // --------------------------------------------------
  // Reset to page 1 whenever filters change
  // --------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [activeCategory, search]);

  // --------------------------------------------------
  // Categories, computed from real data (with counts)
  // rather than a hardcoded list.
  // --------------------------------------------------

  const categories = useMemo(() => {
    const counts = new Map();

    stories.forEach((story) => {
      if (!story.category) return;
      counts.set(story.category, (counts.get(story.category) || 0) + 1);
    });

    return [
      { name: "All", count: stories.length },
      ...Array.from(counts.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count })),
    ];
  }, [stories]);

  // --------------------------------------------------
  // Filtered + paginated stories
  // --------------------------------------------------

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesCategory =
        activeCategory === "All" || story.category === activeCategory;

      const matchesSearch =
        !query ||
        story.title?.toLowerCase().includes(query) ||
        story.excerpt?.toLowerCase().includes(query) ||
        story.authorId?.name?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [stories, activeCategory, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStories.length / PAGE_SIZE),
  );

  const paginatedStories = filteredStories.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // --------------------------------------------------
  // Recent stories widget (independent of filters)
  // --------------------------------------------------

  const recentStories = useMemo(() => {
    return [...stories]
      .sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )
      .slice(0, 3);
  }, [stories]);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Newsletter submit
  // --------------------------------------------------

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = newsletterEmail.trim();

    if (!trimmedEmail) {
      return;
    }

    try {
      setNewsletterStatus("submitting");
      setNewsletterMessage("");

      const response = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to subscribe right now.",
        );
      }

      setNewsletterStatus("success");
      setNewsletterMessage("You're subscribed. Thank you.");
      setNewsletterEmail("");
    } catch (err) {
      console.error("Newsletter signup failed:", err);

      setNewsletterStatus("error");
      setNewsletterMessage(
        err.message || "Unable to subscribe right now.",
      );
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      <PageHeader
        eyebrow="Survivor stories"
        title="Stories of strength"
        subtitle="Real stories shared by survivors and community members — read at your own pace, filter by category, or search for what speaks to you."
      />

      <section className="section all-stories">
        <div className="container all-stories__layout">

          {/* ==========================================
              MAIN LIST
          ========================================== */}

          <div className="all-stories__main">

            {loading && (
              <p className="all-stories__loading">
                Loading stories...
              </p>
            )}

            {!loading && error && (
              <p className="all-stories__empty">{error}</p>
            )}

            {!loading && !error && (
              <>
                <p className="all-stories__count">
                  {filteredStories.length}{" "}
                  {filteredStories.length === 1
                    ? "story"
                    : "stories"}
                </p>

                {filteredStories.length === 0 ? (
                  <p className="all-stories__empty">
                    No stories match your search yet — try
                    another category.
                  </p>
                ) : (
                  <>
                    <motion.div
                      className="all-stories__list"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {paginatedStories.map((story) => (
                        <motion.article
                          key={story._id}
                          className="story-post"
                          variants={item}
                        >
                          {story.image && (
                            <Link
                              to={`/stories/${story.slug}`}
                              className="story-post__image-wrap"
                            >
                              <img
                                src={story.image}
                                alt={story.title}
                              />
                            </Link>
                          )}

                          <div className="story-post__body">
                            <div className="story-post__meta">
                              {story.category && (
                                <span>{story.category}</span>
                              )}

                              <span className="story-post__date">
                                {formatDate(story.createdAt)}
                              </span>
                            </div>

                            <h2>
                              <Link
                                to={`/stories/${story.slug}`}
                              >
                                {story.title}
                              </Link>
                            </h2>

                            {story.excerpt && (
                              <p>{story.excerpt}</p>
                            )}

                            <div className="story-post__footer">
                              <span className="story-post__author">
                                By{" "}
                                {story.authorId?.name ||
                                  "Community member"}
                              </span>

                              <Link
                                to={`/stories/${story.slug}`}
                                className="story-post__link"
                              >
                                Read story
                                <FaArrowRight />
                              </Link>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </motion.div>

                    {totalPages > 1 && (
                      <div className="all-stories__pagination">
                        <button
                          type="button"
                          onClick={() =>
                            setPage((current) =>
                              Math.max(1, current - 1),
                            )
                          }
                          disabled={page === 1}
                        >
                          Prev
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, index) => index + 1,
                        ).map((pageNumber) => (
                          <button
                            key={pageNumber}
                            type="button"
                            className={
                              pageNumber === page
                                ? "is-active"
                                : ""
                            }
                            onClick={() => setPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            setPage((current) =>
                              Math.min(
                                totalPages,
                                current + 1,
                              ),
                            )
                          }
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

          </div>

          {/* ==========================================
              SIDEBAR
          ========================================== */}

          <aside className="all-stories__sidebar">

            {/* Search */}

            <div className="stories-widget">
              <form
                className="stories-widget__search"
                onSubmit={(event) => event.preventDefault()}
              >
                <FaMagnifyingGlass />

                <input
                  type="search"
                  placeholder="Search stories..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  aria-label="Search stories"
                />
              </form>
            </div>

            {/* Categories */}

            <div className="stories-widget">
              <h3 className="stories-widget__title">
                Browse by category
              </h3>

              <ul className="stories-widget__categories">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button
                      type="button"
                      className={
                        cat.name === activeCategory
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        setActiveCategory(cat.name)
                      }
                    >
                      <span>{cat.name}</span>
                      <span className="stories-widget__count">
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent stories */}

            {recentStories.length > 0 && (
              <div className="stories-widget">
                <h3 className="stories-widget__title">
                  Recent stories
                </h3>

                <div className="stories-widget__recent">
                  {recentStories.map((story) => (
                    <Link
                      to={`/stories/${story.slug}`}
                      className="recent-story"
                      key={story._id}
                    >
                      {story.image && (
                        <img
                          src={story.image}
                          alt={story.title}
                        />
                      )}

                      <div>
                        <span>
                          {formatDate(story.createdAt)}
                        </span>
                        <h4>{story.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Need support */}

            <div className="stories-widget stories-widget--support">
              <FaHandHoldingHeart className="stories-widget__support-icon" />

              <h3>Need support?</h3>

              <p>
                If reading these stories brings something up
                for you, help is available whenever you're
                ready.
              </p>

              <Link
                to="/resources"
                className="btn btn-outline"
              >
                Find support
              </Link>
            </div>

            {/* Newsletter */}

            <div className="stories-widget stories-widget--newsletter">
              <FaEnvelope className="stories-widget__newsletter-icon" />

              <h3>Join our mailing list</h3>

              <p>
                Get new stories and community updates in
                your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={newsletterEmail}
                  onChange={(event) =>
                    setNewsletterEmail(event.target.value)
                  }
                  disabled={newsletterStatus === "submitting"}
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={newsletterStatus === "submitting"}
                >
                  {newsletterStatus === "submitting"
                    ? "Subscribing..."
                    : "Subscribe"}
                </button>
              </form>

              {newsletterMessage && (
                <p
                  className={`stories-widget__newsletter-message ${
                    newsletterStatus === "error"
                      ? "is-error"
                      : "is-success"
                  }`}
                >
                  {newsletterMessage}
                </p>
              )}
            </div>

          </aside>

        </div>
      </section>
    </>
  );
}