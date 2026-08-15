import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Conditions.css";

import gbsImage from "../../assets/Violet_Nelly_Amukonyi.jpeg";
import cidpImage from "../../assets/Marylyn_Stacy_Kasandi_Alali.jpeg";
import neuropathyImage from "../../assets/Joseph_K_Yego.jpeg"

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

// Image: scale + soft clip-path wipe for carousel transitions
const imageVariants = {
  enter: (direction) => ({
    opacity: 0,
    scale: 1.12,
    clipPath: direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
  }),
  center: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0 0 0)",
  },
  exit: (direction) => ({
    opacity: 0,
    scale: 1.06,
    clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
  }),
};

const labelVariants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const textContainerVariants = {
  enter: { opacity: 1 },
  center: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
  exit: { opacity: 1 },
};

const textItemVariants = {
  enter: { opacity: 0, y: 18 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

// Scroll-reveal variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUpDelay = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  },
});

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
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
        <motion.div
          className="conditions__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div variants={fadeUp}>
            <p className="eyebrow">Understanding the conditions</p>
            <h2 className="conditions__title">
              Awareness is the first step towards better care
            </h2>
          </motion.div>

          <motion.p
            className="conditions__intro"
            variants={fadeUpDelay(0.15)}
          >
            GBS, CIDP and associated neuropathies affect the peripheral
            nervous system and can significantly impact movement, sensation
            and everyday life. Understanding these conditions is an important
            step towards early recognition, appropriate care and better
            outcomes.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className="conditions__carousel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={scaleIn}
        >

          <div className="conditions__visual">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={condition.short}
                src={condition.image}
                alt={condition.name}
                className="conditions__image"
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>

            <motion.div
              className="conditions__visual-accent"
              animate={{ backgroundColor: condition.accent }}
              transition={{ duration: 0.4 }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={condition.short}
                className="conditions__visual-label"
                variants={labelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {condition.short}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="conditions__content">

            <div className="conditions__counter">
              <motion.span
                key={`current-${current}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {String(current + 1).padStart(2, "0")}
              </motion.span>

              <span className="conditions__counter-line" />

              <span>{String(conditions.length).padStart(2, "0")}</span>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={condition.short}
                variants={textContainerVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.p
                  className="conditions__number"
                  style={{ color: condition.accent }}
                  variants={textItemVariants}
                >
                  {condition.short}
                </motion.p>

                <motion.h3
                  className="conditions__name"
                  variants={textItemVariants}
                >
                  {condition.name}
                </motion.h3>

                <motion.p
                  className="conditions__body"
                  variants={textItemVariants}
                >
                  {condition.body}
                </motion.p>

                <motion.div variants={textItemVariants}>
                  <Link to={condition.to} className="conditions__cta">
                    Learn More
                    <ArrowUpRight size={18} />
                  </Link>
                </motion.div>
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
                    aria-current={current === index ? "true" : undefined}
                  />
                ))}
              </div>

              <div className="conditions__arrows">
                <motion.button
                  type="button"
                  onClick={previousSlide}
                  className="conditions__arrow"
                  aria-label="Previous condition"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ChevronLeft size={20} />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={nextSlide}
                  className="conditions__arrow"
                  aria-label="Next condition"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom statement */}
        <motion.div
          className="conditions__bottom"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeUp}
        >
          <span />
          <p>
            Learn about the conditions. Recognise the signs. Know where
            to find support.
          </p>
        </motion.div>

      </div>
    </section>
  );
}