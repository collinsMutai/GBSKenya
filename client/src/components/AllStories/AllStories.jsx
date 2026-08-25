import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./AllStories.css";

const API_URL = "http://localhost:5000/api";


const tags = [
  "All",
  "Newly Diagnosed",
  "Caregiver",
  "Long-Term",
  "Advocacy",
  "MMN",
  "CIDP",
  "GBS",
];

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
  const [stories, setStories] = useState([]);
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (error) {
        console.error("Failed to fetch stories:", error);

        setError(error.message || "Unable to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // --------------------------------------------------
  // Filter stories
  // --------------------------------------------------

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesTag =
        activeTag === "All" ||
        story.category === activeTag ||
        story.condition === activeTag;

      const matchesSearch =
        !query ||
        story.title?.toLowerCase().includes(query) ||
        story.excerpt?.toLowerCase().includes(query) ||
        story.authorId?.name?.toLowerCase().includes(query);

      return matchesTag && matchesSearch;
    });
  }, [stories, activeTag, search]);

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="All Stories"
        subtitle="Every story shared by our community, in one place — filter by tag or search to find what speaks to you."
      />

      <section className="section all-stories">
        <div className="container">
          {/* ----------------------------------------- */}
          {/* Filters */}
          {/* ----------------------------------------- */}

          <div className="all-stories__filters">
            <input
              type="search"
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search stories"
            />

            <div className="all-stories__tags">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={tag === activeTag ? "is-active" : ""}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ----------------------------------------- */}
          {/* Loading */}
          {/* ----------------------------------------- */}

          {loading && (
            <p className="all-stories__loading">Loading stories...</p>
          )}

          {/* ----------------------------------------- */}
          {/* Error */}
          {/* ----------------------------------------- */}

          {!loading && error && <p className="all-stories__empty">{error}</p>}

          {/* ----------------------------------------- */}
          {/* Stories */}
          {/* ----------------------------------------- */}

          {!loading && !error && (
            <>
              <p className="all-stories__count">
                {filteredStories.length}{" "}
                {filteredStories.length === 1 ? "story" : "stories"}
              </p>

              {filteredStories.length === 0 ? (
                <p className="all-stories__empty">
                  No stories match your search yet — try another tag.
                </p>
              ) : (
                <motion.div
                  className="all-stories__grid"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {filteredStories.map((story) => (
                    <motion.article
                      key={story._id}
                      className="story-card card"
                      variants={item}
                    >
                      {story.image && (
                        <img src={story.image} alt={story.title} />
                      )}

                      <div className="story-card__content">
                        <div className="story-card__tags">
                          <span>{story.category}</span>

                          <span>{story.condition}</span>
                        </div>

                        <h3>{story.title}</h3>

                        <p>{story.excerpt}</p>

                        <small>
                          By {story.authorId?.name || "Community member"}
                        </small>

                        <Link to={`/stories/${story.slug}`}>Read story →</Link>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
