import { motion } from "framer-motion";
import {
  WalletCards,
  ShieldCheck,
  FileCheck,
  HeartHandshake,
  Info,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./FinancialSupport.css";

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

const supportOptions = [
  {
    title: "Social Health Authority (SHA)",
    icon: ShieldCheck,
    description:
      "Learn how Kenya's health coverage system can support access to medical care, hospital services, and treatment needs.",
  },

  {
    title: "Medical Cost Planning",
    icon: WalletCards,
    description:
      "Understand common healthcare expenses including consultations, investigations, medication, rehabilitation, and follow-up care.",
  },

  {
    title: "Keeping Medical Records",
    icon: FileCheck,
    description:
      "Maintain copies of diagnosis reports, prescriptions, treatment plans, and rehabilitation notes to support continuity of care.",
  },

  {
    title: "Family & Community Support",
    icon: HeartHandshake,
    description:
      "Connect with caregivers, support networks, and community organisations that can help during recovery.",
  },
];

export default function FinancialSupport() {
  return (
    <>
      <PageHeader
        eyebrow="Support Resources"
        title="Financial Assistance & Healthcare Support"
        subtitle="Guidance on navigating healthcare costs, SHA coverage, insurance options, and practical support for people living with GBS, CIDP, and MMN."
      />

      <motion.section
        className="section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="container">
          <div className="financial-intro card">
            <WalletCards size={42} />

            <h2>Planning your healthcare journey</h2>

            <p>
              Rare neurological conditions may involve hospital visits,
              specialist consultations, rehabilitation, medication, and ongoing
              care. Understanding available financial support options can help
              families prepare and make informed decisions.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Financial Guidance</p>

            <h2>Support options available</h2>
          </div>

          <div className="financial-grid">
            {supportOptions.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  className="financial-card"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                >
                  <div className="financial-icon">
                    <Icon size={32} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section financial-note">
        <div className="container">
          <div className="financial-note__card">
            <Info size={34} />

            <div>
              <h2>Important reminder</h2>

              <p>
                Healthcare coverage and benefits may change over time. Always
                confirm current requirements and eligibility directly with
                official healthcare providers and relevant government services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
