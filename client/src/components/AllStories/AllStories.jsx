import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./AllStories.css";
import { stories } from "../../data/stories.js";

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
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AllStories() {
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return stories.filter((s) => {
      const matchesTag =
        activeTag === "All" ||
        s.category === activeTag ||
        s.condition === activeTag;
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        s.excerpt.toLowerCase().includes(query) ||
        s.author.toLowerCase().includes(query);
      return matchesTag && matchesSearch;
    });
  }, [activeTag, search]);

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="All Stories"
        subtitle="Every story shared by our community, in one place — filter by tag or search to find what speaks to you."
      />

      <section className="section all-stories">
        <div className="container">
          <div className="all-stories__filters">
            <input
              type="search"
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  key={story.slug}
                  className="story-card card"
                  variants={item}
                >
                  <img src={story.image} alt={story.title} />

                  <div className="story-card__content">
                    <div className="story-card__tags">
                      <span>{story.category}</span>
                      <span>{story.condition}</span>
                    </div>

                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                    <small>By {story.author}</small>

                    <Link to={`/stories/${story.slug}`}>Read story →</Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
