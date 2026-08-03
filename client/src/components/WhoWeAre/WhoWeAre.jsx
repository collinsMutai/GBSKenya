import { motion } from 'framer-motion'
import PageHeader from '../PageHeader/PageHeader.jsx'
import './WhoWeAre.css'

const values = [
  {
    title: 'Equity',
    body: 'Everyone deserves access to trusted information and care, regardless of where in Kenya they live.',
  },
  {
    title: 'Hope',
    body: 'A diagnosis is the start of a chapter, not the end of the story — we hold onto that for the people we serve.',
  },
  {
    title: 'Community',
    body: 'No one should have to navigate a rare diagnosis alone. We build spaces where people find each other.',
  },
  {
    title: 'Advocacy',
    body: 'We speak up for better recognition, referral pathways, and care standards for GBS, CIDP, and MMN in Kenya.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function WhoWeAre() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Who We Are"
        subtitle="Connecting Kenyan patients, caregivers, and healthcare providers with trusted information and support for GBS, CIDP, and MMN."
      />

      <motion.section
        className="section who-we-are__mission"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container who-we-are__grid">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2 className="who-we-are__heading">
              Trusted support, close to home
            </h2>
            <p className="who-we-are__text">
              We connect Kenyan patients, caregivers, and healthcare providers with trusted
              information and support for Guillain-Barré Syndrome, CIDP, and MMN — from the
              moment of diagnosis through every stage of recovery and life afterward.
            </p>
          </div>
          <div>
            <p className="eyebrow">Our vision</p>
            <h2 className="who-we-are__heading">
              A Kenya where no one navigates this alone
            </h2>
            <p className="who-we-are__text">
              We're working toward a future where every person affected by a rare neurological
              diagnosis in Kenya has access to accurate information, competent care, and a
              community that understands.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="section section--tight who-we-are__story"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container who-we-are__story-inner">
          <p className="eyebrow">Our story</p>
          <h2 className="who-we-are__heading">How we started</h2>
          <p className="who-we-are__text">
            GBS Foundation Kenya was founded by patients, caregivers, and clinicians who saw
            firsthand how little accurate information and support existed for people diagnosed
            with Guillain-Barré Syndrome, CIDP, or MMN in Kenya. What began as a small support
            circle has grown into a foundation working with hospitals, county health departments,
            and international partners to close that gap — one diagnosis, one family, one support
            group at a time.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="section section--tight who-we-are__affiliation"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container">
          <div className="who-we-are__affiliation-card">
            <p className="eyebrow">Our affiliation</p>
            <p className="who-we-are__affiliation-text">
              GBS Foundation Kenya is an independent, Kenya-registered NGO working in partnership
              with GBS|CIDP Foundation International to extend trusted GBS, CIDP, and MMN care
              and support to East Africa. We share a mission with our international partner, but
              operate as our own organization, governed by our own board, and accountable to the
              communities we serve here in Kenya.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="section who-we-are__values"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What we stand for</p>
            <h2>Our core values</h2>
          </div>

          <div className="who-we-are__values-grid">
            {values.map((v) => (
              <div key={v.title} className="card who-we-are__value-card">
                <h3 className="who-we-are__value-title">{v.title}</h3>
                <p className="who-we-are__value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="section section--tight who-we-are__registration"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <div className="container">
          <div className="who-we-are__registration-card">
            <p className="eyebrow">Registration</p>
            <p className="who-we-are__text">
              GBS Foundation Kenya is registered as a Non-Governmental Organization in Kenya
              (registration number to be added) and is governed by an independent board of
              directors. We publish an annual report covering our programs, reach, and finances —
              available on our Impact page.
            </p>
          </div>
        </div>
      </motion.section>
    </>
  )
}