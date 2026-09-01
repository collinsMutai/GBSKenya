import { motion, useReducedMotion } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  Scale,
  Brain,
  UsersRound,
  ArrowRight,
} from "lucide-react";

import "./SupportServices.css";

const services = [
  {
    icon: HeartHandshake,
    title: "Safe & Confidential Support",
    description:
      "A compassionate starting point for survivors seeking information, guidance, or a safe person to talk to.",
  },
  {
    icon: Stethoscope,
    title: "Medical Support",
    description:
      "Connect with appropriate healthcare services for medical attention, treatment, documentation, and follow-up care.",
  },
  {
    icon: Brain,
    title: "Psychosocial Support",
    description:
      "Access information and referrals that can support emotional wellbeing, recovery, and long-term resilience.",
  },
  {
    icon: Scale,
    title: "Legal & Justice Support",
    description:
      "Find guidance and referral pathways for survivors who choose to explore their legal rights and available justice options.",
  },
  {
    icon: ShieldCheck,
    title: "Safety Planning",
    description:
      "Practical information to help survivors consider immediate safety, trusted contacts, and available protection services.",
  },
  {
    icon: UsersRound,
    title: "Community & Referral Support",
    description:
      "Connect with trusted organizations and community services that can provide specialized assistance when needed.",
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

export default function SupportServices() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="support-services">
      <div className="container">
        <motion.div
          className="support-services__header"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="support-services__eyebrow">
            SUPPORT WHEN YOU NEED IT
          </span>

          <h2 className="support-services__title">
            You deserve support.
            <span> You do not have to navigate this alone.</span>
          </h2>

          <p className="support-services__intro">
            Survivors may need different kinds of support at different stages.
            We help make it easier to understand the options available and
            connect with appropriate services.
          </p>
        </motion.div>

        <motion.div
          className="support-services__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.article
                key={service.title}
                className="support-service"
                variants={item}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -6,
                      }
                }
              >
                <div className="support-service__icon">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <div className="support-service__content">
                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <a
                    href="/resources"
                    className="support-service__link"
                  >
                    Learn more
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          className="support-services__footer"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="support-services__footer-copy">
            <ShieldCheck size={22} />

            <div>
              <strong>Your safety and privacy matter.</strong>

              <p>
                If you are in immediate danger, contact emergency services or
                reach out to someone you trust who can help you stay safe.
              </p>
            </div>
          </div>

          <a
            href="/resources"
            className="support-services__button"
          >
            Explore Support
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
