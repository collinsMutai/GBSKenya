import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./Leadership.css";
import img1 from "../../assets/img1.jpeg"
import img2 from "../../assets/img2.jpeg"
import img3 from "../../assets/img3.jpeg"
import img4 from "../../assets/img4.jpeg"



const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};


function LinkedinIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}


const leaders = [
  {
    name: "Joseph K Yego",
    role: "Chairperson",
    image: img1,
    bio: "Provides strategic leadership, partnerships, and advocacy to strengthen support for people affected by GBS, CIDP, and MMN.",
    email: "chair@gbskenya.org",
    linkedin: "#",
  },
  {
    name: "Violet Nelly Amukonyi",
    role: "Vice Chairperson",
    image: img2,
    bio: "Supports governance, community engagement, and collaboration with healthcare partners.",
    email: "vicechair@gbskenya.org",
    linkedin: "#",
  },
  {
    name: "Koech Kiplangat Collins",
    role: "Secretary",
    image: "https://i.pravatar.cc/600?img=68",
    bio: "Coordinates communication, administration, and stakeholder engagement.",
    email: "secretary@gbskenya.org",
    linkedin: "#",
  },
  {
    name: "Marylyn Stacy Kasandi Alali",
    role: "Treasurer",
    image: img4,
    bio: "Provides financial oversight and supports sustainable programmes.",
    email: "treasurer@gbskenya.org",
    linkedin: "#",
  },
  {
    name: "Rose Mumbua Musyoka",
    role: "Treasurer",
    image: img2,
    bio: "Provides financial oversight and supports sustainable programmes.",
    email: "treasurer@gbskenya.org",
    linkedin: "#",
  },
];


export default function Leadership() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Our Leadership"
        subtitle="Meet the people guiding GBS Foundation Kenya with a commitment to advocacy, patient support, partnerships, and better neurological healthcare."
      />


      {/* Board & Commitment */}

      <motion.section
        className="section leadership-board"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container">

          <div className="section-head">

            <p className="eyebrow">
              Governance & Commitment
            </p>

            <h2>
              Leading with compassion and accountability
            </h2>

            <p>
              Our leadership team brings together advocates, professionals,
              and community representatives working together to improve
              awareness, support, and access to care for people living with
              GBS, CIDP, MMN, and related conditions.
            </p>

          </div>



          <div className="leadership-board__card">


            <div className="leadership-board__intro">

              <p className="eyebrow">
                Our Board
              </p>

              <h3>
                Leading with integrity and purpose
              </h3>

              <p>
                Our independent Board provides strategic direction and
                responsible oversight while bringing together patient advocates,
                professionals, and community representatives committed to
                advancing the Foundation’s mission.
              </p>

            </div>



            <div className="leadership-board__intro">

              <p className="eyebrow">
                Our Commitment
              </p>

              <h3>
                Putting patients and families first
              </h3>

              <p>
                Through responsible governance and collaboration, our leaders
                help ensure GBS Foundation Kenya remains transparent,
                community-focused, and driven by the needs of those we serve.
              </p>

            </div>


          </div>



          <div className="leadership-board__commitments">


            <div className="leadership-board__item">

              <h4>
                Patient First
              </h4>

              <p>
                Every decision is centred around the needs, dignity, and
                wellbeing of patients and their families.
              </p>

            </div>



            <div className="leadership-board__item">

              <h4>
                Transparency
              </h4>

              <p>
                We maintain responsible stewardship, ethical leadership, and
                accountability to our community and partners.
              </p>

            </div>



            <div className="leadership-board__item">

              <h4>
                Collaboration
              </h4>

              <p>
                We work alongside healthcare providers, organisations, and
                communities to create lasting impact.
              </p>

            </div>


          </div>


        </div>

      </motion.section>



      {/* Leadership Team */}

      <motion.section
        className="section leadership-team"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >

        <div className="container">


          <div className="section-head">

            <p className="eyebrow">
              Leadership team
            </p>

            <h2>
              Meet our leaders
            </h2>

          </div>



          <div className="leadership-grid">

            {leaders.map((leader, index) => (

              <motion.article
                key={leader.name}
                className="leader card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >


                <img
                  src={leader.image}
                  alt={leader.name}
                  className="leader__image"
                />



                <div className="leader__content">


                  <div className="leader__header">

                    <div>

                      <p className="eyebrow">
                        {leader.role}
                      </p>

                      <h3>
                        {leader.name}
                      </h3>

                    </div>



                    <div className="leader__links">

                      <a
                        href={`mailto:${leader.email}`}
                        aria-label={`Email ${leader.name}`}
                      >
                        <Mail size={17}/>
                      </a>


                      <a
                        href={leader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${leader.name} LinkedIn`}
                      >
                        <LinkedinIcon />
                      </a>

                    </div>


                  </div>



                  <p>
                    {leader.bio}
                  </p>


                </div>


              </motion.article>

            ))}

          </div>


        </div>

      </motion.section>

    </>
  );
}