import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  PhoneCall,
  MapPin,
  Users,
  FileText,
  LockKeyhole,
} from "lucide-react";

import "./SafeSteps.css";

const steps = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Think About Immediate Safety",
    description:
      "If you feel unsafe, move to a place where you feel protected. This could be with someone you trust, at a safe location, or somewhere away from immediate danger.",
  },
  {
    number: "02",
    icon: Users,
    title: "Reach Someone You Trust",
    description:
      "You do not have to explain everything at once. Contact a trusted friend, family member, colleague, community leader, or support professional.",
  },
  {
    number: "03",
    icon: PhoneCall,
    title: "Seek Help",
    description:
      "Reach out to appropriate emergency, medical, psychosocial, legal, or protection services depending on what you need right now.",
  },
  {
    number: "04",
    icon: MapPin,
    title: "Choose a Safe Place",
    description:
      "Consider where you can go if you need to leave quickly. Keep important contacts and directions accessible when it is safe to do so.",
  },
  {
    number: "05",
    icon: FileText,
    title: "Keep Important Information Safe",
    description:
      "Where appropriate, keep copies of important documents, contact information, medical records, or other information somewhere secure.",
  },
  {
    number: "06",
    icon: LockKeyhole,
    title: "Protect Your Privacy",
    description:
      "Review who can access your phone, accounts, location, and personal information. Use privacy settings that feel appropriate for your situation.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
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
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function SafeSteps() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="safe-steps">
      <div className="container">
        {/* ==========================================
            INTRO
        ========================================== */}

        <motion.div
          className="safe-steps__intro"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="safe-steps__intro-copy">
            <span className="safe-steps__eyebrow">
              SAFETY &amp; PREPAREDNESS
            </span>

            <h2>
              Small steps can make
              <span> a difference.</span>
            </h2>
          </div>

          <p>
            If you or someone you know is experiencing gender-based violence,
            there is no single right way to respond. Start with the step that
            feels safest for you.
          </p>
        </motion.div>

        {/* ==========================================
            SAFETY STEPS
        ========================================== */}

        <motion.div
          className="safe-steps__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <motion.article
                key={step.number}
                className="safe-step"
                variants={item}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -5,
                      }
                }
              >
                <div className="safe-step__top">
                  <span className="safe-step__number">
                    {step.number}
                  </span>

                  <div className="safe-step__icon">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}