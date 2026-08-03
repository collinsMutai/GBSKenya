import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Activity,
  HeartPulse,
  CircleCheck,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./UnderstandingConditions.css";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
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

const conditions = [
  {
    name: "Guillain-Barré Syndrome (GBS)",
    icon: Activity,
    description:
      "GBS is a rare neurological disorder in which the body's immune system attacks the peripheral nerves. Symptoms often develop rapidly and can include weakness, tingling, numbness, and difficulty walking.",
    symptoms: [
      "Progressive muscle weakness",
      "Tingling in hands and feet",
      "Difficulty walking",
      "Facial weakness",
      "Difficulty swallowing or breathing in severe cases",
    ],
    treatment:
      "Treatment may include intravenous immunoglobulin (IVIg), plasma exchange, rehabilitation, and supportive care.",
    outlook:
      "Many people recover well, although recovery may take months or longer depending on severity.",
  },
  {
    name: "Chronic Inflammatory Demyelinating Polyneuropathy (CIDP)",
    icon: Brain,
    description:
      "CIDP is a chronic autoimmune disease affecting the peripheral nerves. Symptoms develop over weeks or months and may continue without treatment.",
    symptoms: [
      "Weakness in arms and legs",
      "Loss of balance",
      "Numbness",
      "Reduced reflexes",
      "Fatigue",
    ],
    treatment:
      "Treatment commonly includes IVIg, corticosteroids, plasma exchange, and ongoing rehabilitation.",
    outlook:
      "Many people successfully manage CIDP with long-term treatment and regular follow-up.",
  },
  {
    name: "Multifocal Motor Neuropathy (MMN)",
    icon: HeartPulse,
    description:
      "MMN is a rare condition that mainly affects motor nerves, leading to muscle weakness without significant sensory loss.",
    symptoms: [
      "Weakness in hands or arms",
      "Difficulty gripping objects",
      "Muscle cramps",
      "Muscle twitching",
    ],
    treatment:
      "IVIg is the primary treatment and often improves muscle strength and function.",
    outlook:
      "Early diagnosis and treatment can help maintain independence and quality of life.",
  },
];

export default function UnderstandingConditions() {
  return (
    <>
      <PageHeader
        eyebrow="Support Resources"
        title="Understanding GBS, CIDP & MMN"
        subtitle="Learn about these neurological conditions in plain language, including symptoms, diagnosis, treatment, and recovery."
      />

      <motion.section
        className="section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="container">
          {conditions.map((condition) => {
            const Icon = condition.icon;

            return (
              <article key={condition.name} className="condition-card">
                <div className="condition-heading">
                  <div className="condition-icon">
                    <Icon size={34} strokeWidth={2} />
                  </div>

                  <h2>{condition.name}</h2>
                </div>

                <p>{condition.description}</p>

                <h3 className="condition-subtitle">
                  <CircleCheck size={18} />
                  Common Symptoms
                </h3>

                <ul>
                  {condition.symptoms.map((symptom) => (
                    <li key={symptom}>{symptom}</li>
                  ))}
                </ul>

                <h3 className="condition-subtitle">
                  <HeartPulse size={18} />
                  Treatment
                </h3>

                <p>{condition.treatment}</p>

                <h3 className="condition-subtitle">
                  <Activity size={18} />
                  Outlook
                </h3>

                <p>{condition.outlook}</p>
              </article>
            );
          })}
        </div>
      </motion.section>

      <section className="section resources-tip">
        <div className="container">
          <div className="resources-tip__card">
            <h2>Early diagnosis matters</h2>

            <p>
              If you experience sudden weakness, numbness, or difficulty
              walking, seek medical attention promptly. Early diagnosis and
              treatment can improve outcomes and reduce complications.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="resources-help__card">
            <h2>Looking for treatment options in Kenya?</h2>

            <p>
              Explore hospitals, neurologists, and rehabilitation services that
              support people living with GBS, CIDP, and MMN.
            </p>

            <Link
              to="/resources/diagnosis-treatment"
              className="btn btn-primary"
            >
              Find Care
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}