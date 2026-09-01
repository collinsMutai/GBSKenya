import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Heart,
  Lock,
  Stethoscope,
  Scale,
  Info,
} from "lucide-react";
import { useState } from "react";

import "./KnowYourRights.css";

const rights = [
  {
    id: "safety",
    label: "Safety",
    icon: ShieldCheck,
    title: "You have the right to feel safe.",
    description:
      "No one has the right to threaten, hurt, intimidate, or control you through violence. If you are experiencing harm, your safety deserves to be taken seriously.",
    points: [
      "You can seek protection from further harm.",
      "You can ask someone you trust for help.",
      "You can decide what feels safest for you right now.",
    ],
  },
  {
    id: "dignity",
    label: "Dignity",
    icon: Heart,
    title: "You have the right to be treated with dignity.",
    description:
      "Your experience matters. You deserve to be listened to and treated with compassion without being blamed or judged for what happened.",
    points: [
      "You deserve respectful treatment.",
      "You do not have to justify your experience.",
      "Violence is never your fault.",
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: Lock,
    title: "You have the right to privacy.",
    description:
      "Your personal information, conversations, and experiences should be handled with appropriate care and confidentiality.",
    points: [
      "Ask how your information will be used.",
      "Ask who may have access to your information.",
      "Share only what you feel comfortable sharing.",
    ],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: Stethoscope,
    title: "You have the right to seek healthcare.",
    description:
      "You can seek medical attention when you need it and ask questions about your health, treatment, and available care.",
    points: [
      "You can ask questions about your care.",
      "You can ask for information in a way you understand.",
      "You can discuss available healthcare options.",
    ],
  },
  {
    id: "choice",
    label: "Choice",
    icon: Scale,
    title: "You have the right to make informed choices.",
    description:
      "Where appropriate, you should be supported to understand your options and make decisions about the kind of assistance you want.",
    points: [
      "You can ask questions before making decisions.",
      "You can take time to understand your options.",
      "Your choices should be respected wherever possible.",
    ],
  },
];

export default function KnowYourRights() {
  const shouldReduceMotion = useReducedMotion();

  const [activeId, setActiveId] = useState(rights[0].id);

  const activeRight =
    rights.find((right) => right.id === activeId) || rights[0];

  const Icon = activeRight.icon;

  return (
    <section
      className="know-rights"
      aria-labelledby="know-rights-title"
    >
      <div className="container">
        <div className="know-rights__top">
          <div>
            <span className="know-rights__eyebrow">
              YOUR RIGHTS
            </span>

            <h2 id="know-rights-title">
              Know what you
              <span> deserve.</span>
            </h2>
          </div>

          <p>
            Understanding your rights can make it easier to ask questions,
            seek support, and make informed choices. Select a topic to learn
            more.
          </p>
        </div>

        <div className="know-rights__guide">
          <nav
            className="know-rights__nav"
            aria-label="Rights topics"
          >
            <div className="know-rights__nav-label">
              <span>Explore</span>
              <span>{String(rights.length).padStart(2, "0")}</span>
            </div>

            {rights.map((right, index) => {
              const ItemIcon = right.icon;
              const isActive = right.id === activeId;

              return (
                <button
                  key={right.id}
                  type="button"
                  className={`know-rights__tab ${
                    isActive ? "is-active" : ""
                  }`}
                  onClick={() => setActiveId(right.id)}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className="know-rights__tab-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <ItemIcon size={17} strokeWidth={1.8} />

                  <span>{right.label}</span>

                  <span className="know-rights__tab-line" />
                </button>
              );
            })}
          </nav>

          <div className="know-rights__panel">
            <div className="know-rights__panel-decoration">
              <span />
              <span />
              <span />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeRight.id}
                className="know-rights__panel-content"
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 12 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: -8 }
                }
                transition={{ duration: 0.35 }}
              >
                <div className="know-rights__panel-icon">
                  <Icon size={25} strokeWidth={1.7} />
                </div>

                <span className="know-rights__panel-label">
                  Right to {activeRight.label.toLowerCase()}
                </span>

                <h3>{activeRight.title}</h3>

                <p className="know-rights__panel-description">
                  {activeRight.description}
                </p>

                <div className="know-rights__points">
                  {activeRight.points.map((point) => (
                    <div
                      className="know-rights__point"
                      key={point}
                    >
                      <span className="know-rights__point-mark">
                        ✓
                      </span>

                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="know-rights__panel-footer">
              <Info size={15} />

              <span>
                Information about rights and services can differ by
                location. This guide is for general education.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
