import { motion, useReducedMotion } from "framer-motion";
import {
  Shield,
  Heart,
  Scale,
  Smartphone,
  Wallet,
  Brain,
} from "lucide-react";

import "./WhatIsGBV.css";

const forms = [
  {
    icon: Shield,
    title: "Physical Violence",
    text: "Acts that cause physical harm, injury, or fear of physical harm.",
  },
  {
    icon: Heart,
    title: "Sexual Violence",
    text: "Any sexual act or behavior that happens without freely given consent.",
  },
  {
    icon: Brain,
    title: "Emotional & Psychological Abuse",
    text: "Behaviors such as threats, humiliation, intimidation, isolation, or controlling behavior.",
  },
  {
    icon: Wallet,
    title: "Economic Abuse",
    text: "Using money, employment, property, or financial resources to control or restrict another person.",
  },
  {
    icon: Smartphone,
    title: "Digital Abuse",
    text: "Using technology, social media, or digital communication to threaten, monitor, harass, or control someone.",
  },
  {
    icon: Scale,
    title: "Coercion & Control",
    text: "Patterns of behavior designed to restrict a person's freedom, choices, independence, or safety.",
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

export default function WhatIsGBV() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="what-is-gbv">
      <div className="container">
        <div className="what-is-gbv__layout">
          {/* ==============================
              Intro
          ============================== */}

          <motion.div
            className="what-is-gbv__intro"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="what-is-gbv__eyebrow">
              Understanding GBV
            </span>

            <h2 className="what-is-gbv__title">
              Gender-based violence is more than physical violence.
            </h2>

            <p className="what-is-gbv__description">
              Gender-based violence (GBV) refers to harmful acts directed at a
              person because of their gender or that disproportionately affect
              people because of gender. It can happen in homes, relationships,
              workplaces, schools, communities, and online spaces.
            </p>

            <div className="what-is-gbv__statement">
              <span className="what-is-gbv__statement-line" />

              <p>
                GBV can affect people of every age, background, and
                circumstance. Recognizing the signs is an important step
                toward prevention, safety, and support.
              </p>
            </div>
          </motion.div>

          {/* ==============================
              Forms of GBV
          ============================== */}

          <motion.div
            className="what-is-gbv__content"
            variants={containerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="what-is-gbv__heading-row">
              <span>Forms of GBV</span>
            </div>

            <div className="what-is-gbv__grid">
              {forms.map((form) => {
                const Icon = form.icon;

                return (
                  <motion.article
                    key={form.title}
                    className="what-is-gbv__card"
                    variants={cardVariants}
                  >
                    <div className="what-is-gbv__icon">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>

                    <div className="what-is-gbv__card-body">
                      <h3>{form.title}</h3>

                      <p>{form.text}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
