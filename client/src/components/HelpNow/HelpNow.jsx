import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import "./HelpNow.css";

const options = [
  {
    image:
      "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/why-choose-us-image-2.jpg",
    number: "01",
    title: "Call for urgent help",
    text: "If you are in immediate danger, contact local emergency services or a trusted person who can help you get somewhere safe.",
  },
  {
    image:
      "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/why-choose-us-image-1.jpg",
    number: "02",
    title: "Move somewhere safer",
    text: "If possible, go to a place where you feel protected. You do not need to make every decision at once.",
  },
  {
    image:
      "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/our-benefit-image-1.jpg",
    number: "03",
    title: "Tell someone",
    text: "Reach out to someone you trust. You can simply say that you need help without explaining everything.",
  },
];

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function HelpNow() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="help-now" aria-labelledby="help-now-title">
      <div className="help-now__sticky">
        <div className="help-now__container">
          <motion.div
            className="help-now__panel"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    scale: 0.97,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? {}
                : {
                    opacity: 1,
                    scale: 1,
                  }
            }
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="help-now__topline">
              <div className="help-now__alert">
                <span className="help-now__pulse" />
                <AlertCircle size={17} />
                <span>NEED HELP RIGHT NOW?</span>
              </div>

              <span className="help-now__label">
                Your safety comes first
              </span>
            </div>

            <div className="help-now__header">
              <h2 id="help-now-title">
                You don't have to
                <span> face this alone.</span>
              </h2>

              <p>
                If you or someone you know is experiencing gender-based
                violence, start with whatever feels safest. You don't have to
                have everything figured out before asking for help.
              </p>
            </div>

            <motion.div
              className="help-now__options"
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={{
                hidden: {},

                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
            >
              {options.map((option) => (
                <motion.div
                  key={option.title}
                  className="help-now__option"
                  variants={itemVariants}
                >
                  <span className="help-now__number">
                    {option.number}
                  </span>

                  <div className="help-now__option-image">
                    <img
                      src={option.image}
                      alt=""
                      loading="lazy"
                    />
                  </div>

                  <div className="help-now__option-content">
                    <h3>{option.title}</h3>

                    <p>{option.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="help-now__footer">
              <div className="help-now__note">
                <span className="help-now__note-line" />

                <span>
                  You are allowed to ask for help.
                </span>
              </div>

              <a
                href="/resources"
                className="help-now__link"
              >
                Explore support resources
                <ArrowRight size={17} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
