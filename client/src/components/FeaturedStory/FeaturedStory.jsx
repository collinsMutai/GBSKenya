import { motion } from 'framer-motion'
import './FeaturedStory.css'

// Static placeholder for now — once /api/posts exists, swap this for a
// fetch of the latest published, or editor-pinned, resilience story.
const story = {
  tag: 'Long-term patient',
  title: 'Finding my community after a CIDP diagnosis',
  excerpt:
    'It took two years and three hospitals before I had a name for what was happening to my body. What I found afterward was a community that finally understood.',
  author: 'Wanjiru M.',
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function FeaturedStory() {
  return (
    <section className="section featured-story">
      <div className="container featured-story__grid">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <p className="eyebrow">From resilience stories</p>
          <h2 className="featured-story__title">{story.title}</h2>
          <p className="featured-story__excerpt">{story.excerpt}</p>
          <p className="featured-story__byline">
            — {story.author}, {story.tag}
          </p>
          <a href="/stories" className="btn btn-outline featured-story__cta">
            Read more stories
          </a>
        </motion.div>

        <motion.div
          className="featured-story__quote-card"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="featured-story__quote">
            "I found more than information — I found people who understood."
          </p>
        </motion.div>
      </div>
    </section>
  )
}