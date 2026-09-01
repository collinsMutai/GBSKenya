import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";

import "./SurvivorVoices.css";

const img1 = "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/about-us-image-1.jpg";
const img2 = "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/about-us-body-image.jpg";
const img3 = "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/03/our-impact-image-2.jpg";
const img4 = "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/about-us-image-2.jpg";

const stories = [
  {
    id: 1,
    category: "Finding Strength",
    title: "Finding strength after a difficult chapter",
    excerpt:
      "Sharing my story helped me begin to understand that what happened to me was not my fault.",
    author: "Violet N.",
    image: img1,
    featured: true,
  },
  {
    id: 2,
    category: "Asking for Help",
    title: "Learning that asking for help is strength",
    excerpt:
      "Reaching out to someone I trusted became one of the most important steps in my journey.",
    author: "Marylyn S.",
    image: img2,
  },
  {
    id: 3,
    category: "Resilience",
    title: "Rebuilding my confidence",
    excerpt:
      "Every small step forward reminds me that my future still belongs to me.",
    author: "Joseph K.",
    image: img3,
  },
  {
    id: 4,
    category: "Hope",
    title: "A new beginning was possible",
    excerpt:
      "With support and time, I started seeing possibilities again.",
    author: "Njeri W.",
    image: img4,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function SurvivorVoices() {
  const shouldReduceMotion = useReducedMotion();

  const featuredStory = stories.find((story) => story.featured);
  const supportingStories = stories.filter((story) => !story.featured);

  return (
    <section
      className="survivor-voices"
      aria-labelledby="survivor-voices-title"
    >
      <div className="survivor-voices__container">

        {/* HEADER */}

        <motion.div
          className="survivor-voices__header"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
        >
          <div className="survivor-voices__heading-group">
            <div className="survivor-voices__label">
              <span className="survivor-voices__label-dot" />
              Survivor voices
            </div>

            <h2 id="survivor-voices-title">
              You are not
              <span> alone.</span>
            </h2>
          </div>

          <div className="survivor-voices__header-right">
            <p>
              Real experiences shared by survivors who have walked different
              paths toward safety, healing, and hope.
            </p>

            <a href="/stories" className="survivor-voices__view-all">
              Explore all stories
              <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>

        {/* STORY GRID */}

        <motion.div
          className="survivor-voices__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {/* FEATURED CARD */}

          <motion.article
            className="survivor-voices__featured"
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    y: -5,
                  }
            }
          >
            <a href="/stories" className="survivor-voices__featured-link">
              <div className="survivor-voices__featured-image-wrap">
                <img
                  src={featuredStory.image}
                  alt={`Survivor story from ${featuredStory.author}`}
                  className="survivor-voices__featured-image"
                />

                <div className="survivor-voices__image-shade" />

                <div className="survivor-voices__featured-badge">
                  <Heart size={14} fill="currentColor" />
                  <span>Featured voice</span>
                </div>
              </div>

              <div className="survivor-voices__featured-content">
                <div className="survivor-voices__story-meta">
                  <span>{featuredStory.category}</span>
                  <span className="survivor-voices__meta-dot" />
                  <span>{featuredStory.author}</span>
                </div>

                <h3>{featuredStory.title}</h3>

                <p>{featuredStory.excerpt}</p>

                <span className="survivor-voices__read">
                  Read story
                  <span className="survivor-voices__read-icon">
                    <ArrowUpRight size={15} />
                  </span>
                </span>
              </div>
            </a>
          </motion.article>

          {/* SUPPORTING STORIES */}

          <div className="survivor-voices__side">
            {supportingStories.map((story) => (
              <motion.article
                key={story.id}
                className="survivor-voices__card"
                variants={cardVariants}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        x: 4,
                      }
                }
              >
                <a href="/stories" className="survivor-voices__card-link">
                  <div className="survivor-voices__card-image-wrap">
                    <img
                      src={story.image}
                      alt={`Survivor story from ${story.author}`}
                      className="survivor-voices__card-image"
                    />
                  </div>

                  <div className="survivor-voices__card-content">
                    <div className="survivor-voices__story-meta">
                      <span>{story.category}</span>
                    </div>

                    <h3>{story.title}</h3>

                    <p>{story.excerpt}</p>

                    <div className="survivor-voices__card-footer">
                      <span>{story.author}</span>

                      <span className="survivor-voices__small-arrow">
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* BOTTOM MESSAGE */}

        <motion.div
          className="survivor-voices__bottom"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <div className="survivor-voices__bottom-icon">
            <MessageCircle size={18} />
          </div>

          <p>
            Every story is different. Every survivor deserves to be heard,
            respected, and believed.
          </p>

          <a href="/add-story">
            Share your story
            <ArrowUpRight size={15} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}