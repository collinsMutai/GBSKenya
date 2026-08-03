import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, MapPin, CalendarDays, Building2 } from 'lucide-react'
import './ImpactStats.css'

const stats = [
  { icon: Users, value: 1200, suffix: '+', label: 'Patients & caregivers reached' },
  { icon: MapPin, value: 18, suffix: '', label: 'Counties with active support' },
  { icon: CalendarDays, value: 24, suffix: '', label: 'Support group meetups held' },
  { icon: Building2, value: 9, suffix: '', label: 'Partner hospitals & clinics' },
]

function CountUp({ value, suffix, duration = 1.4 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = null
    let frame

    const step = (timestamp) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function ImpactStats() {
  return (
    <section className="impact-stats">
      <div className="container impact-stats__inner">
        <motion.div
          className="impact-stats__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {stats.map((s) => (
            <motion.div key={s.label} className="impact-stats__item" variants={item}>
              <span className="impact-stats__icon">
                <s.icon size={20} strokeWidth={2} />
              </span>
              <p className="impact-stats__value">
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="impact-stats__label">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}