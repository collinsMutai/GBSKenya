import { motion } from "framer-motion";
import {
  ArrowUpRight,
  HeartHandshake,
  Stethoscope,
  Brain,
  HandCoins,
  Accessibility,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./ServicesPage.css";

const services = [
  {
    icon: HeartHandshake,
    number: "01",
    title: "Survivor Support",
    description:
      "Compassionate support and guidance for survivors and families navigating the effects of gender-based violence.",
    link: "/services/mental-health",
  },
  {
    icon: Stethoscope,
    number: "02",
    title: "Diagnosis & Treatment",
    description:
      "Information and guidance to help individuals understand conditions, treatment options, and available healthcare services.",
    link: "/services/diagnosis-treatment",
  },
  {
    icon: Brain,
    number: "03",
    title: "Mental Health",
    description:
      "Resources focused on emotional wellbeing, trauma recovery, resilience, and finding appropriate mental health support.",
    link: "/services/mental-health",
  },
  {
    icon: HandCoins,
    number: "04",
    title: "Financial Support",
    description:
      "Information about financial assistance, practical resources, and pathways to support for individuals and families.",
    link: "/services/financial-support",
  },
  {
    icon: Accessibility,
    number: "05",
    title: "Rehabilitation",
    description:
      "Support and information around recovery, rehabilitation, independence, and rebuilding everyday life.",
    link: "/services/rehabilitation",
  },
  {
    icon: BookOpen,
    number: "06",
    title: "Education & Resources",
    description:
      "Accessible educational materials, guides, downloads, and information to help communities make informed decisions.",
    link: "/services/downloads",
  },
  {
    icon: HelpCircle,
    number: "07",
    title: "Frequently Asked Questions",
    description:
      "Clear answers to common questions about our work, support services, resources, and how to get help.",
    link: "/services/faq",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
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

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support, care & resources"
        title="Services designed around people."
        subtitle="We connect survivors, families, communities, and partners with practical information, support, education, and pathways to care."
      />

      <main className="services-page">
        <section className="section services-page__section">
          <div className="container">

            {/* ==========================================
                INTRO
            ========================================== */}

            <div className="services-page__intro">
              <div>
                <span className="eyebrow">
                  What we offer
                </span>

                <h2>
                  Support that meets
                  <span> people where they are.</span>
                </h2>
              </div>

              <p>
                Every person's experience is different. Our services and
                resources are designed to make reliable information,
                compassionate support, and practical pathways easier to find.
              </p>
            </div>

            {/* ==========================================
                SERVICES GRID
            ========================================== */}

            <div className="services-page__grid">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <motion.a
                    key={service.number}
                    href={service.link}
                    className="services-page__card"
                    initial="hidden"
                    whileInView="show"
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    variants={fadeUp}
                    transition={{
                      delay: index * 0.05,
                    }}
                  >
                    <div className="services-page__card-top">
                      <span className="services-page__number">
                        {service.number}
                      </span>

                      <div className="services-page__icon">
                        <Icon size={21} />
                      </div>
                    </div>

                    <div className="services-page__card-content">
                      <h3>{service.title}</h3>

                      <p>{service.description}</p>
                    </div>

                    <div className="services-page__card-link">
                      <span>Explore service</span>

                      <ArrowUpRight size={17} />
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* ==========================================
                CONDITIONS / GLOBAL EDUCATION
            ========================================== */}

            <motion.div
              className="services-page__feature"
              initial="hidden"
              whileInView="show"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              variants={fadeUp}
            >
              <div className="services-page__feature-content">
                <span className="eyebrow">
                  Knowledge creates possibility
                </span>

                <h3>
                  Understand the issues.
                  <span> Find a way forward.</span>
                </h3>

                <p>
                  Explore our educational resources to better understand
                  gender-based violence, its impact, prevention, recovery,
                  available services, and ways communities can take action.
                </p>

                <a
                  href="/services/conditions"
                  className="services-page__feature-button"
                >
                  Explore our resources
                  <ArrowUpRight size={17} />
                </a>
              </div>

              <div className="services-page__feature-side">
                <div className="services-page__feature-line" />

                <span>
                  Information
                  <br />
                  Support
                  <br />
                  Education
                  <br />
                  Action
                </span>
              </div>
            </motion.div>

            {/* ==========================================
                HELP STRIP
            ========================================== */}

            <motion.div
              className="services-page__help"
              initial="hidden"
              whileInView="show"
              viewport={{
                once: true,
                amount: 0.25,
              }}
              variants={fadeUp}
            >
              <div className="services-page__help-icon">
                <HeartHandshake size={21} />
              </div>

              <div className="services-page__help-copy">
                <span>Not sure where to start?</span>

                <p>
                  You don't need to know which service you need before reaching
                  out. Contact our team and we'll help you find the right
                  information or support.
                </p>
              </div>

              <a
                href="/contact"
                className="services-page__help-link"
              >
                Contact us
                <ArrowUpRight size={16} />
              </a>
            </motion.div>

          </div>
        </section>
      </main>
    </>
  );
}