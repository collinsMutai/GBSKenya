import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import "./PathwayCards.css";

const pathways = [
  {
    tag: "Patients",
    title: "Your experience matters.",
    body: "Connect with others, access support and information, and help ensure that the voices and experiences of people living with GBS, CIDP and associated neuropathies remain at the centre of the conversation.",
    cta: "Join Our Community",
    destination: "Get Involved → Become a Member",
    to: "/get-involved/patient-caregiver-survey",
  },
  {
    tag: "Caregivers & Families",
    title: "You don't have to navigate the journey alone.",
    body: "Find practical information, support resources and guidance for supporting someone affected by GBS, CIDP and associated neuropathies.",
    cta: "Find Support",
    destination: "Support Resources",
    to: "/resources",
  },
  {
    tag: "Healthcare Professionals",
    title: "Help strengthen recognition and care.",
    body: "Join opportunities for knowledge exchange and professional collaboration aimed at improving recognition, diagnosis, referral and care.",
    cta: "Work With Us",
    destination: "Get Involved → Partner With Us",
    to: "/get-involved/partner-with-us",
  },
  {
    tag: "Healthcare Institutions & Industry Partners",
    title: "Help build a stronger care ecosystem.",
    body: "Partner with us to advance awareness, strengthen patient support and improve access to timely and affordable treatment.",
    cta: "Partner With Us",
    destination: "Get Involved → Partner With Us",
    to: "/get-involved/partner-with-us",
  },
];

const headerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const headerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

// Card slides in from below with a clipped "reveal" wipe
const item = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
  },
};

const titleReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.15 },
  },
};

function MagneticCard({ pathway, index }) {
  const ref = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 14, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 150, damping: 14, mass: 0.4 });

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // pull strength — subtle, capped
    mx.set(relX * 0.06);
    my.set(relY * 0.08);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div className="pathways__card-wrapper" variants={item}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: sx, y: sy }}
        className="pathways__card-magnet"
      >
        <Link to={pathway.to} className="pathways__card">
          <motion.span
            className="pathways__card-dot"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
            aria-hidden="true"
          />

          <div className="pathways__card-content">
            <p className="eyebrow pathways__card-tag">{pathway.tag}</p>

            <div className="pathways__card-title-mask">
              <motion.h3
                className="pathways__card-title"
                variants={titleReveal}
              >
                {pathway.title}
              </motion.h3>
            </div>

            <p className="pathways__card-body">{pathway.body}</p>
          </div>

          <div className="pathways__card-footer">
            <span className="pathways__card-cta">
              {pathway.cta}
              <span className="pathways__card-cta-underline" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function PathwayCards() {
  return (
    <section className="pathways">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="pathways__header"
          variants={headerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.p className="eyebrow" variants={headerItem}>
            Everyone has a role
          </motion.p>

          <motion.h2 className="pathways__title" variants={headerItem}>
            We meet you where you are
          </motion.h2>

          <motion.p className="pathways__intro" variants={headerItem}>
            Improving patient outcomes in this healthcare space requires the
            input of all stakeholders in the patient journey. Whether you are
            living with one of these conditions, supporting someone, providing
            care, or looking for ways to contribute as a stakeholder, there is
            a place for you in our community.
          </motion.p>
        </motion.div>

        {/* Pathway Cards */}
        <motion.div
          className="pathways__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {pathways.map((pathway, index) => (
            <MagneticCard key={pathway.tag} pathway={pathway} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}