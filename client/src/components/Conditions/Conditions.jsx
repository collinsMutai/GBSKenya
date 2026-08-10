import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Conditions.css";

import gbsImage from "../../assets/img1.jpeg";
import cidpImage from "../../assets/img2.jpeg";
import neuropathyImage from "../../assets/img3.jpeg";

const conditions = [
  {
    short: "GBS",
    name: "Guillain-Barré Syndrome",
    body: "GBS is an inflammatory disorder of the peripheral nerves, the nerves outside the brain and spinal cord. It is characterised by the rapid onset of weakness and can cause paralysis affecting the legs, arms, breathing muscles and face.",
    image: gbsImage,
    accent: "var(--marigold-500)",
    to: "/resources/conditions",
  },
  {
    short: "CIDP",
    name: "Chronic Inflammatory Demyelinating Polyneuropathy",
    body: "CIDP is a rare disorder of the peripheral nerves characterised by gradually increasing weakness and sensory loss, often accompanied by loss of reflexes. Unlike GBS, CIDP progresses over a longer period.",
    image: cidpImage,
    accent: "var(--canopy-500)",
    to: "/resources/conditions",
  },
  {
    short: "Associated Neuropathies",
    name: "Associated Neuropathies",
    body: "The Foundation also works to improve awareness and support for other neuropathies associated with the GBS/CIDP spectrum, including Multifocal Motor Neuropathy (MMN), Acute Motor Axonal Neuropathy (AMAN) and Miller Fisher Syndrome.",
    image: neuropathyImage,
    accent: "var(--canopy-700)",
    to: "/resources/conditions",
  },
];

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 60 : -60,
  }),

  center: {
    opacity: 1,
    x: 0,
  },

  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -60 : 60,
  }),
};

export default function ConditionsIntro() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const condition = conditions[current];

  const nextSlide = () => {
    setDirection(1);

    setCurrent((prev) =>
      prev === conditions.length - 1 ? 0 : prev + 1,
    );
  };

  const previousSlide = () => {
    setDirection(-1);

    setCurrent((prev) =>
      prev === 0 ? conditions.length - 1 : prev - 1,
    );
  };

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  return (
    <section className="conditions">
      <div className="container">

        {/* Section introduction */}
        <div className="conditions__header">
          <div>
            <p className="eyebrow">
              Understanding the conditions
            </p>

            <h2 className="conditions__title">
              Awareness is the first step towards better care
            </h2>
          </div>

          <p className="conditions__intro">
            GBS, CIDP and associated neuropathies affect the peripheral
            nervous system and can significantly impact movement, sensation
            and everyday life. Understanding these conditions is an important
            step towards early recognition, appropriate care and better
            outcomes.
          </p>
        </div>

        {/* Carousel */}
        <div className="conditions__carousel">

          <div className="conditions__visual">
            <AnimatePresence
              mode="wait"
              custom={direction}
            >
              <motion.img
                key={condition.short}
                src={condition.image}
                alt={condition.name}
                className="conditions__image"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </AnimatePresence>

            <div
              className="conditions__visual-accent"
              style={{
                backgroundColor: condition.accent,
              }}
            />

            <div className="conditions__visual-label">
              {condition.short}
            </div>
          </div>

          {/* Content */}
          <div className="conditions__content">

            <div className="conditions__counter">
              <span>
                {String(current + 1).padStart(2, "0")}
              </span>

              <span className="conditions__counter-line" />

              <span>
                {String(conditions.length).padStart(2, "0")}
              </span>
            </div>

            <AnimatePresence
              mode="wait"
              custom={direction}
            >
              <motion.div
                key={condition.short}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p
                  className="conditions__number"
                  style={{ color: condition.accent }}
                >
                  {condition.short}
                </p>

                <h3 className="conditions__name">
                  {condition.name}
                </h3>

                <p className="conditions__body">
                  {condition.body}
                </p>

                <Link
                  to={condition.to}
                  className="conditions__cta"
                >
                  Learn More
                  <ArrowUpRight size={18} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="conditions__controls">

              <div className="conditions__dots">
                {conditions.map((item, index) => (
                  <button
                    key={item.short}
                    type="button"
                    className={`conditions__dot ${
                      current === index ? "is-active" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to ${item.short}`}
                    aria-current={
                      current === index ? "true" : undefined
                    }
                  />
                ))}
              </div>

              <div className="conditions__arrows">
                <button
                  type="button"
                  onClick={previousSlide}
                  className="conditions__arrow"
                  aria-label="Previous condition"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="conditions__arrow"
                  aria-label="Next condition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="conditions__bottom">
          <span />
          <p>
            Learn about the conditions. Recognise the signs. Know where
            to find support.
          </p>
        </div>

      </div>
    </section>
  );
}