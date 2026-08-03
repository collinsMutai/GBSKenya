import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Hospital,
  WalletCards,
  Accessibility,
  HeartHandshake,
  FileText,
  CircleHelp,
  Globe2,
  ArrowRight,
} from "lucide-react";

import PageHeader from "../PageHeader/PageHeader.jsx";
import "./ResourcesHome.css";

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


const resources = [
  {
    title: "Understanding GBS, CIDP & MMN",
    description:
      "Learn about symptoms, diagnosis, treatment options, and recovery in plain language.",
    icon: Stethoscope,
    link: "/resources/conditions",
  },

  {
    title: "Diagnosis & Treatment in Kenya",
    description:
      "Find hospitals, neurologists, and specialist centres across Kenya.",
    icon: Hospital,
    link: "/resources/diagnosis-treatment",
  },

  {
    title: "Financial Support",
    description:
      "Learn about SHA, insurance, disability support, and financial assistance.",
    icon: WalletCards,
    link: "/resources/financial-support",
  },

  {
    title: "Physiotherapy & Rehabilitation",
    description:
      "Explore rehabilitation centres and physiotherapy services that support recovery.",
    icon: Accessibility,
    link: "/resources/rehabilitation",
  },

  {
    title: "Mental Health & Counselling",
    description:
      "Support for patients, caregivers, and families navigating recovery.",
    icon: HeartHandshake,
    link: "/resources/mental-health",
  },

  {
    title: "Download Centre",
    description:
      "Patient guides, caregiver checklists, medication trackers, and more.",
    icon: FileText,
    link: "/resources/downloads",
  },

  {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about GBS, CIDP, MMN, and recovery.",
    icon: CircleHelp,
    link: "/resources/faq",
  },

  {
    title: "Global Education & Research",
    description:
      "Access international education resources, webinars, and research updates.",
    icon: Globe2,
    link: "/resources/global",
  },
];


export default function ResourcesHome() {

  return (
    <>

      <PageHeader
        eyebrow="Support Resources"
        title="Helping You Navigate Every Step of the Journey"
        subtitle="Trusted information, practical guidance, and support services for people living with GBS, CIDP, MMN, caregivers, and healthcare professionals in Kenya."
      />


      <motion.section
        className="section resources-intro"
        initial="hidden"
        whileInView="show"
        viewport={{ once:true, amount:.3 }}
        variants={fadeUp}
      >

        <div className="container">

          <div className="resources-intro__card">

            <h2>
              Find the support you need
            </h2>

            <p>
              Whether you have recently been diagnosed, are supporting a loved
              one, or are looking for specialist services, our resource centre
              brings together trusted information and practical guidance to help
              you make informed decisions throughout your journey.
            </p>

          </div>

        </div>

      </motion.section>



      <motion.section
        className="section resources-grid-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once:true, amount:.2 }}
        variants={fadeUp}
      >

        <div className="container">


          <div className="section-head">

            <p className="eyebrow">
              Explore Resources
            </p>

            <h2>
              Support at your fingertips
            </h2>

          </div>



          <div className="resources-grid">


            {resources.map((resource,index)=>{

              const Icon = resource.icon;

              return (

                <motion.article
                  key={resource.title}
                  className="resource-card"
                  initial={{
                    opacity:0,
                    y:20
                  }}
                  whileInView={{
                    opacity:1,
                    y:0
                  }}
                  viewport={{
                    once:true
                  }}
                  transition={{
                    duration:.5,
                    delay:index*.08
                  }}
                >


                  <div className="resource-icon">

                    <Icon
                      size={32}
                      strokeWidth={2}
                    />

                  </div>



                  <h3>
                    {resource.title}
                  </h3>



                  <p>
                    {resource.description}
                  </p>



                  <Link to={resource.link}>

                    Learn more

                    <ArrowRight size={17}/>

                  </Link>


                </motion.article>

              );

            })}


          </div>


        </div>


      </motion.section>



      <section className="section resources-help">

        <div className="container">

          <div className="resources-help__card">


            <h2>
              Need more assistance?
            </h2>


            <p>
              Can't find what you're looking for? Our team can help connect you
              with the right information, support services, and healthcare
              providers.
            </p>


            <Link
              to="/contact"
              className="btn btn-primary"
            >

              Contact Us

              <ArrowRight size={18}/>

            </Link>


          </div>

        </div>

      </section>


    </>
  );
}