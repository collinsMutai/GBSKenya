import { motion } from "framer-motion";
import {
  ArrowUpRight,
  HeartHandshake,
  ShieldCheck,
  Users,
  Target,
  Eye,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./AboutPage.css";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 25,
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

const values = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Safety first",
    text: "We put the safety, dignity, privacy, and wellbeing of survivors and communities at the centre of our work.",
  },
  {
    icon: HeartHandshake,
    number: "02",
    title: "Compassion",
    text: "We create spaces where people can be heard, respected, and supported without judgement.",
  },
  {
    icon: Users,
    number: "03",
    title: "Community",
    text: "We work alongside communities, professionals, organisations, and partners to create meaningful change.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="Building a safer future, together."
        subtitle="GBV Foundation Kenya works to prevent gender-based violence, strengthen support systems, and help create communities where every person can live with dignity and safety."
      />

      <main className="about-page">
        {/* ==========================================
            INTRO
        ========================================== */}

        <section className="section about-page__section">
          <div className="container">

            <motion.div
              className="about-page__intro"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <div className="about-page__intro-heading">
                <span className="eyebrow">
                  GBV Foundation Kenya
                </span>

                <h2>
                  Creating change
                  <span> where it matters most.</span>
                </h2>
              </div>

              <div className="about-page__intro-copy">
                <p>
                  Gender-based violence affects individuals, families, and
                  entire communities. We believe meaningful change begins when
                  people have access to safety, information, support, and the
                  opportunity to be heard.
                </p>

                <p>
                  Our work brings together prevention, education, survivor
                  support, community engagement, and partnerships to strengthen
                  responses to gender-based violence across Kenya.
                </p>
              </div>
            </motion.div>

            {/* ==========================================
                FEATURE CARD
            ========================================== */}

            <motion.div
              className="about-page__feature"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <div className="about-page__feature-image">
                <img
                  src="https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/why-choose-us-image-2.jpg"
                  alt="Community members supporting one another"
                  loading="lazy"
                />

                <div className="about-page__feature-overlay" />
              </div>

              <div className="about-page__feature-content">
                <span className="about-page__feature-label">
                  Our approach
                </span>

                <h3>
                  Change happens when
                  <span> people work together.</span>
                </h3>

                <p>
                  We believe no single organisation can address gender-based
                  violence alone. Lasting progress requires survivors,
                  communities, healthcare professionals, institutions,
                  organisations, and partners to work together.
                </p>

                <a
                  href="/contact"
                  className="about-page__feature-link"
                >
                  Talk to our team
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </motion.div>

            {/* ==========================================
                MISSION / VISION
            ========================================== */}

            <div className="about-page__purpose">

              <motion.article
                className="about-page__purpose-card about-page__purpose-card--dark"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
              >
                <div className="about-page__purpose-icon">
                  <Target size={21} />
                </div>

                <span>Our mission</span>

                <h3>
                  Prevent violence.
                  <br />
                  Strengthen support.
                </h3>

                <p>
                  To contribute to the prevention of gender-based violence and
                  strengthen access to compassionate, informed, and survivor-
                  centred support.
                </p>
              </motion.article>

              <motion.article
                className="about-page__purpose-card"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
              >
                <div className="about-page__purpose-icon">
                  <Eye size={21} />
                </div>

                <span>Our vision</span>

                <h3>
                  A Kenya where
                  <br />
                  everyone is safe.
                </h3>

                <p>
                  A future where gender-based violence is prevented, survivors
                  are supported with dignity, and communities are equipped to
                  build safer environments for everyone.
                </p>
              </motion.article>

            </div>

            {/* ==========================================
                VALUES
            ========================================== */}

            <motion.div
              className="about-page__values-heading"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <div>
                <span className="eyebrow">What guides us</span>

                <h2>
                  The values behind
                  <span> our work.</span>
                </h2>
              </div>

              <p>
                Everything we do is guided by a commitment to dignity,
                accountability, compassion, and meaningful community impact.
              </p>
            </motion.div>

            <motion.div
              className="about-page__values"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
            >
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <motion.article
                    key={value.number}
                    className="about-page__value"
                    variants={fadeUp}
                  >
                    <div className="about-page__value-top">
                      <span>{value.number}</span>

                      <div className="about-page__value-icon">
                        <Icon size={19} />
                      </div>
                    </div>

                    <h3>{value.title}</h3>

                    <p>{value.text}</p>
                  </motion.article>
                );
              })}
            </motion.div>

            {/* ==========================================
                CTA
            ========================================== */}

            <motion.section
              className="about-page__cta"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
            >
              <div>
                <span className="eyebrow">
                  Be part of the change
                </span>

                <h2>
                  Safer communities
                  <span> start with all of us.</span>
                </h2>
              </div>

              <a
                href="/contact"
                className="about-page__cta-link"
              >
                Get in touch
                <ArrowUpRight size={18} />
              </a>
            </motion.section>

          </div>
        </section>
      </main>
    </>
  );
}