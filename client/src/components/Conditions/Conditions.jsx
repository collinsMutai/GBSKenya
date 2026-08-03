import { motion } from 'framer-motion'
import './Conditions.css'

const conditions = [
  {
    short: 'GBS',
    name: 'Guillain-Barré Syndrome',
    body: 'A rare condition where the immune system attacks the nerves, causing sudden weakness that usually develops over days.',
  },
  {
    short: 'CIDP',
    name: 'Chronic Inflammatory Demyelinating Polyneuropathy',
    body: 'A long-term nerve condition causing progressive weakness and numbness, often mistaken for other illnesses at first.',
  },
  {
    short: 'MMN',
    name: 'Multifocal Motor Neuropathy',
    body: 'A rare nerve disorder causing slowly progressive muscle weakness, most often in the arms.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function ConditionsIntro() {
  return (
    <section className="section section--tight conditions">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Understanding the conditions</p>
          <h2>Trusted, plain-language information</h2>
          <p>
            Reviewed with input from our medical advisory network, so you can understand a
            diagnosis without the jargon.
          </p>
        </div>

        <motion.div
          className="conditions__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {conditions.map((c) => (
            <motion.div key={c.short} className="conditions__card" variants={item}>
              <p className="conditions__code">{c.short}</p>
              <h3 className="conditions__name">{c.name}</h3>
              <p className="conditions__body">{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}