import { motion } from 'framer-motion'
import './EventsPreview.css'

const events = [
  { date: 'Aug 09, 2026', title: 'Nairobi support group meetup', location: 'Nairobi' },
  { date: 'Aug 23, 2026', title: 'Understanding CIDP — webinar', location: 'Virtual' },
  { date: 'Sep 06, 2026', title: 'Mombasa coast chapter meeting', location: 'Mombasa' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}

export default function EventsPreview() {
  return (
    <section className="section section--tight events-preview">
      <div className="container">
        <div className="section-head events-preview__head">
          <p className="eyebrow">Upcoming events</p>
          <h2>Connect with the community</h2>
        </div>

        <motion.div
          className="events-preview__list"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {events.map((e, i) => (
            <motion.a
              key={e.title}
              href="/resources"
              className="events-preview__row"
              variants={item}
              style={i === 0 ? { borderTop: '1px solid var(--line)' } : undefined}
            >
              <span className="events-preview__date">{e.date}</span>
              <span className="events-preview__title">{e.title}</span>
              <span className="events-preview__location">{e.location}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}