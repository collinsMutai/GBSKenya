import { motion } from 'framer-motion'
import './PathwayCards.css'

const pathways = [
  {
    tag: 'Newly diagnosed',
    title: 'Just diagnosed? Start here.',
    body: 'Understand what GBS, CIDP, or MMN means for you and what to expect in the weeks ahead.',
    to: '/resources',
  },
  {
    tag: 'Long-term patients',
    title: 'Living with it, growing through it',
    body: 'Resources for managing symptoms, remission, and life years into your diagnosis.',
    to: '/resources',
  },
  {
    tag: 'Caregivers & family',
    title: 'Support for supporters',
    body: 'Guidance and community for the people caring for someone with GBS, CIDP, or MMN.',
    to: '/resources',
  },
  {
    tag: 'Healthcare professionals',
    title: 'Champion better care',
    body: 'Clinical guidelines, referral pathways, and ways to partner with us across Kenya.',
    to: '/resources',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function PathwayCards() {
  return (
    <section className="section pathways">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Everyone has a role</p>
          <h2>We meet you where you are</h2>
          <p>Whichever part of this journey you're on, there's a next step waiting for you.</p>
        </div>

        <motion.div
          className="pathways__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {pathways.map((p) => (
            <motion.a key={p.title} href={p.to} className="pathways__card" variants={item}>
              <p className="eyebrow">{p.tag}</p>
              <h3 className="pathways__card-title">{p.title}</h3>
              <p className="pathways__card-body">{p.body}</p>
              <span className="pathways__card-arrow" aria-hidden="true">→</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}