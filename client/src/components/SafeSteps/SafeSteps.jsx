import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ShieldCheck,
  PhoneCall,
  MapPin,
  Users,
  FileText,
  LockKeyhole,
  ArrowDown,
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

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
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

  const { scrollYProgress } = useScroll();

  /*
   * The image moves vertically slower than the page.
   * This creates the parallax effect.
   */
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-12%", "12%"],
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.08, 1.16],
  );

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0.58, 0.68],
  );

  return (
    <section
      className="safe-steps"
      aria-labelledby="safe-steps-title"
    >
      {/* ==========================================
          PARALLAX IMAGE
      ========================================== */}

      <div
        className="safe-steps__background"
        aria-hidden="true"
      >
        <motion.div
          className="safe-steps__background-image"
          style={
            shouldReduceMotion
              ? {}
              : {
                  y: backgroundY,
                  scale: imageScale,
                }
          }
        />

        <motion.div
          className="safe-steps__overlay"
          style={
            shouldReduceMotion
              ? {}
              : {
                  opacity: overlayOpacity,
                }
          }
        />

        <div className="safe-steps__gradient" />
      </div>

      <div className="container safe-steps__container">
        {/* ==========================================
            INTRO
        ========================================== */}

        <motion.div
          className="safe-steps__intro"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 25,
                }
          }
          whileInView={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="safe-steps__intro-label">
            <span className="safe-steps__line" />
            <span>Safety &amp; preparedness</span>
          </div>

          <div className="safe-steps__intro-main">
            <h2 id="safe-steps-title">
              Small steps can make
              <span> a difference.</span>
            </h2>

            <p>
              If you or someone you know is experiencing gender-based
              violence, there is no single right way to respond. Start
              with the step that feels safest for you.
            </p>
          </div>

          <div className="safe-steps__scroll">
            <ArrowDown size={15} />
            <span>Explore the steps</span>
          </div>
        </motion.div>

        {/* ==========================================
            STEPS
        ========================================== */}

        <div className="safe-steps__content">
          <div
            className="safe-steps__rail"
            aria-hidden="true"
          />

          <div className="safe-steps__list">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  className="safe-step"
                  initial={
                    shouldReduceMotion
                      ? false
                      : "hidden"
                  }
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  variants={itemVariants}
                >
                  <div className="safe-step__number">
                    {step.number}
                  </div>

                  <div className="safe-step__marker">
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="safe-step__body">
                    <span className="safe-step__label">
                      Step {index + 1}
                    </span>

                    <h3>{step.title}</h3>

                    <p>{step.description}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            REASSURANCE
        ========================================== */}

        <motion.div
          className="safe-steps__reassurance"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          whileInView={
            shouldReduceMotion
              ? {}
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <ShieldCheck size={20} />

          <div>
            <strong>
              You are in control of your next step.
            </strong>

            <p>
              You do not have to do everything at once. Choose
              what feels safest and most manageable for you.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
