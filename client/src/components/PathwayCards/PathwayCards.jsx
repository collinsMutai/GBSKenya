import { motion } from "framer-motion";
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
    y: 16,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function PathwayCards() {
  return (
    <section className="pathways">
      <div className="container">
        {/* Section Header */}
        <div className="pathways__header">
          <p className="eyebrow">Everyone has a role</p>

          <h2 className="pathways__title">We meet you where you are</h2>

          <p className="pathways__intro">
            Improving patient outcomes in this healthcare space requires the
            input of all stakeholders in the patient journey. Whether you are
            living with one of these conditions, supporting someone, providing
            care, or looking for ways to contribute as a stakeholder, there is a
            place for you in our community.
          </p>
        </div>

        {/* Pathway Cards */}
        <motion.div
          className="pathways__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >
          {pathways.map((pathway) => (
            <motion.div
              key={pathway.tag}
              className="pathways__card-wrapper"
              variants={item}
            >
              <Link to={pathway.to} className="pathways__card">
                <div className="pathways__card-content">
                  <p className="eyebrow pathways__card-tag">{pathway.tag}</p>

                  <h3 className="pathways__card-title">{pathway.title}</h3>

                  <p className="pathways__card-body">{pathway.body}</p>
                </div>

                <div className="pathways__card-footer">
                  <span className="pathways__card-cta">
                    {pathway.cta}
                    <span aria-hidden="true"> →</span>
                  </span>

                  {/* <span className="pathways__card-destination">
                    {pathway.destination}
                  </span> */}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
