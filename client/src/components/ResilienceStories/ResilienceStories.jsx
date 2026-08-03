import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./ResilienceStories.css";
import { stories } from "../../data/stories.js";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};



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

export default function ResilienceStories() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Resilience Stories"
        subtitle="Real experiences from people living with GBS, CIDP, MMN, and caregivers sharing journeys of recovery, adaptation, advocacy, and hope."
      />

      {/* Featured Story */}

      <motion.section
        className="section resilience-feature"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container">
          <div className="resilience-feature__card">
            <div>
              <p className="eyebrow">Featured story</p>

              <h2>Finding hope after GBS</h2>

              <p>
                A personal journey of recovery, resilience, and discovering
                strength through support and community.
              </p>

              <Link
                to="/stories/finding-strength-after-diagnosis"
                className="button"
              >
                Read story
              </Link>
            </div>

            <div className="resilience-feature__media">
              <div className="video-placeholder">▶</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Story Library */}

      <motion.section
        className="section resilience-library"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Stories</p>

            <h2>Community experiences</h2>
          </div>

          <div className="resilience-filters">
            <input type="search" placeholder="Search stories..." />

            <div className="resilience-tags">
              {tags.map((tag) => (
                <button key={tag}>{tag}</button>
              ))}
            </div>
          </div>

          <div className="resilience-grid">
            {stories.map((story, index) => (
              <motion.article
                key={story.slug}
                className="story-card card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
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
          </div>
        </div>
      </motion.section>

      {/* Submit Story */}

      <section className="section resilience-submit">
        <div className="container">
          <div className="resilience-submit__card">
            <p className="eyebrow">Share your story</p>

            <h2>Your experience can inspire someone else</h2>

            <p>
              Community members and caregivers are invited to share their
              journeys. All submissions are reviewed before publication.
            </p>

            <form className="story-form">
              <input placeholder="Your name" />

              <input placeholder="Email (optional)" />

              <input placeholder="Story title" />

              <select>
                <option>Select condition</option>

                <option>GBS</option>

                <option>CIDP</option>

                <option>MMN</option>
              </select>

              <textarea placeholder="Tell your story" />

              <button className="button">Submit story</button>
            </form>
          </div>
        </div>
      </section>

      {/* Moderated Comments */}

      <section className="section resilience-comments">
        <div className="container">
          <div className="resilience-comments__card">
            <h2>Comments & reactions</h2>

            <p>
              Community responses are moderated before appearing publicly to
              maintain a safe and supportive environment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
