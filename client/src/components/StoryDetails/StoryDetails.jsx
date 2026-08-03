import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./StoryDetails.css";
import { stories } from "../../data/stories.js";

export default function StoryDetails() {
  const { slug } = useParams();

  const story = stories.find((story) => story.slug === slug);

  if (!story) {
    return (
      <div className="container section">
        <h2>Story not found</h2>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Patient story"
        title={story.title}
        subtitle={`A ${story.category.toLowerCase()} journey shared by ${story.author}.`}
      />

      <motion.article
        className="section story-detail"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="container story-detail__container">
          <div className="story-detail__meta">
            <span>{story.condition}</span>

            <span>{story.category}</span>
          </div>

          <img
            src={story.image}
            alt={story.title}
            className="story-detail__image"
          />

          <div className="story-detail__body">
            <p className="story-detail__author">Shared by {story.author}</p>

            {story.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.article>

      <section className="section story-comments">
        <div className="container">
          <div className="story-comments__card">
            <h2>Comments & reactions</h2>

            <p>
              Comments are moderated before appearing publicly to maintain a
              safe and supportive community.
            </p>

            <textarea placeholder="Share your thoughts..." />

            <button className="button">Submit comment</button>
          </div>
        </div>
      </section>
    </>
  );
}
