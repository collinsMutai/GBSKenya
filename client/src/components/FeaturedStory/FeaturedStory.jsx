import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './FeaturedStory.css'

import img1 from '../../assets/Violet_Nelly_Amukonyi.jpeg'
import img2 from '../../assets/Marylyn_Stacy_Kasandi_Alali.jpeg'
import Joseph_K_Yego from "../../assets/Joseph_K_Yego.jpeg"
import img4 from '../../assets/img2.jpeg'

const stories = [
  {
    tag: 'Long-term patient',
    title: 'Finding my community after a CIDP diagnosis',
    excerpt:
      'It took two years and three hospitals before I had a name for what was happening to my body. What I found afterward was a community that finally understood.',
    author: 'Wanjiru M.',
    image: img1,
  },
  {
    tag: 'Finding strength',
    title: 'Learning to live at my own pace',
    excerpt:
      'Some days are harder than others, but I have learned that slowing down does not mean giving up. It means listening to what my body needs.',
    author: 'Amina K.',
    image: img2,
  },
  {
    tag: 'Community',
    title: 'The people who helped me feel less alone',
    excerpt:
      'Connecting with others who understood my experience changed the way I thought about my diagnosis and gave me hope for what comes next.',
    author: 'David N.',
    image: Joseph_K_Yego,
  },
  {
    tag: 'Resilience',
    title: 'Small victories became my biggest milestones',
    excerpt:
      'Recovery did not happen overnight. I learned to celebrate every small step along the way.',
    author: 'Njeri W.',
    image: img4,
  },
  {
    tag: 'Hope',
    title: 'Finding hope in an unexpected place',
    excerpt:
      'The hardest chapter of my life eventually introduced me to people and experiences I never expected.',
    author: 'James O.',
    image: Joseph_K_Yego,
  },
  {
    tag: 'Living well',
    title: 'What I wish I knew at the beginning',
    excerpt:
      'Looking back, there are so many things I wish someone had told me when I was first diagnosed.',
    author: 'Grace M.',
    image: img4,
  },
]

const slideVariants = {
  enter: {
    opacity: 0,
    x: 60,
  },
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const imageVariants = {
  enter: {
    scale: 1.08,
  },
  center: {
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    scale: 1.02,
    transition: {
      duration: 0.35,
    },
  },
}

export default function FeaturedStory() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const totalSlides = stories.length
  const story = stories[currentSlide]

  const nextSlide = () => {
    setCurrentSlide((slide) => (slide + 1) % totalSlides)
  }

  const previousSlide = () => {
    setCurrentSlide(
      (slide) => (slide - 1 + totalSlides) % totalSlides
    )
  }

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(nextSlide, 6500)

    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <section
      className="featured-story"
      aria-label="Patient stories"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="featured-story__container">

        <div className="featured-story__header">
          <div>
            <p className="featured-story__eyebrow">
              From resilience stories
            </p>

            <h2 className="featured-story__heading">
              Real stories.
              <br />
              <span>Real strength.</span>
            </h2>
          </div>

          <p className="featured-story__intro">
            Honest experiences from people learning to
            navigate life, diagnosis, recovery, and
            everything in between.
          </p>
        </div>

        <div className="featured-story__slider">
          <AnimatePresence mode="wait">
            <motion.article
              key={currentSlide}
              className="featured-story__slide"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="featured-story__visual">
                <motion.img
                  src={story.image}
                  alt=""
                  className="featured-story__image"
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                />

                <div className="featured-story__image-overlay" />

                <span className="featured-story__image-number">
                  {String(currentSlide + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="featured-story__content">

                <div className="featured-story__meta">
                  <span className="featured-story__tag">
                    {story.tag}
                  </span>

                  <span className="featured-story__separator">
                    /
                  </span>

                  <span className="featured-story__count">
                    {String(currentSlide + 1).padStart(2, '0')}
                    <span> / </span>
                    {String(totalSlides).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="featured-story__title">
                  {story.title}
                </h3>

                <p className="featured-story__excerpt">
                  {story.excerpt}
                </p>

                <div className="featured-story__footer">
                  <div className="featured-story__author">
                    <span className="featured-story__author-line" />
                    <span>{story.author}</span>
                  </div>

                  <a
                    href="/stories"
                    className="featured-story__link"
                  >
                    <span>Read their story</span>
                    <span
                      className="featured-story__link-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="featured-story__controls">

          <div className="featured-story__progress">
            <span
              className="featured-story__progress-fill"
              style={{
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              }}
            />
          </div>

          <div className="featured-story__navigation">

            <button
              type="button"
              className="featured-story__arrow"
              onClick={previousSlide}
              aria-label="Previous story"
            >
              <span aria-hidden="true">←</span>
            </button>

            <div className="featured-story__pagination">
              <strong>
                {String(currentSlide + 1).padStart(2, '0')}
              </strong>

              <span>/</span>

              <span>
                {String(totalSlides).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              className="featured-story__arrow"
              onClick={nextSlide}
              aria-label="Next story"
            >
              <span aria-hidden="true">→</span>
            </button>

          </div>
        </div>

      </div>
    </section>
  )
}