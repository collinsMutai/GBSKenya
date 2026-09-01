import { ShieldCheck, HeartHandshake, LockKeyhole } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import "./TrustStatement.css";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Survivor-Centered",
    text: "We respect every survivor's experience, choices, dignity, and right to make informed decisions about their own journey.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy & Confidentiality",
    text: "We promote safe, respectful access to support while treating personal information and survivor experiences with care.",
  },
  {
    icon: HeartHandshake,
    title: "Compassionate Support",
    text: "We connect survivors, families, communities, and service providers with practical information and appropriate support.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function TrustStatement() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="trust-statement">
      <div className="container">
        <motion.div
          className="trust-statement__intro"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="trust-statement__eyebrow">
            A safer path forward
          </span>

          <h2 className="trust-statement__title">
            Your safety, dignity and voice matter.
          </h2>

          <p className="trust-statement__lead">
            Gender-based violence can affect anyone. You do not have to face
            it alone. GBV Foundation Kenya works to create a trusted space
            where survivors, families, and communities can find information,
            understanding, and pathways to appropriate support.
          </p>
        </motion.div>

        <motion.div
          className="trust-statement__points"
          variants={container}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
        >
          {trustPoints.map((point) => {
            const Icon = point.icon;

            return (
              <motion.article
                key={point.title}
                className="trust-statement__point"
                variants={item}
              >
                <div className="trust-statement__icon">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <div>
                  <h3>{point.title}</h3>

                  <p>{point.text}</p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
