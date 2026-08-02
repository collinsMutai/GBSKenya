import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./Hero.css";
import heroImage from "../../assets/hero.jpg";
import { useEffect, useState } from "react";


const headlines = [
  "Supporting Patients Across Kenya",
  "Building Hope Through Community",
  "Empowering Families With Knowledge",
  "Advocating for GBS, CIDP & MMN",
];
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % headlines.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);
  return (
    <section className="hero">
      <motion.div
        className="hero__bg"
        style={{ backgroundImage: `url(${heroImage})` }}
        initial={{ scale: 1.08 }}
        animate={
          shouldReduceMotion
            ? { scale: 1.08 }
            : {
                scale: [1.08, 1.15, 1.08],
                x: ["0%", "-1%", "0%"],
                y: ["0%", "-1%", "0%"],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />

      <div className="hero__overlay" />

      <div className="hero__gradient" />

      <motion.div
        className="container hero__inner"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h1 className="hero__title">
          You Are Not Alone.
          <span className="hero__changing">
            <AnimatePresence mode="wait">
              <motion.span
                key={headlines[current]}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -25,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                {headlines[current]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p variants={item} className="hero__subtitle">
          Helping people living with Guillain-Barré Syndrome, Chronic
          Inflammatory Demyelinating Polyneuropathy (CIDP), and Multifocal Motor
          Neuropathy (MMN) through education, advocacy, community support, and
          hope.
        </motion.p>

        <motion.div variants={item} className="hero__actions">
          <motion.a
            href="/resources"
            className="btn btn-primary"
            whileHover={{
              y: -5,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            Get Support
          </motion.a>

          <motion.a
            href="/about/who-we-are"
            className="btn btn-ghost"
            whileHover={{
              y: -5,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 10, 0],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        ↓
      </motion.div>
    </section>
  );
}
