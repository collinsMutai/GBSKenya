
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  Users,
  MapPin,
  CalendarDays,
  Building2,
} from 'lucide-react'
import './ImpactStats.css'

const stats = [
  {
    icon: Users,
    value: 1200,
    suffix: '+',
    label: 'Patients & caregivers reached',
  },
  {
    icon: MapPin,
    value: 18,
    suffix: '',
    label: 'Counties with active support',
  },
  {
    icon: CalendarDays,
    value: 24,
    suffix: '',
    label: 'Support group meetups held',
  },
  {
    icon: Building2,
    value: 9,
    suffix: '',
    label: 'Partner hospitals & clinics',
  },
]

function CountUp({ value, suffix, duration = 1.4 }) {
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
    amount: 0.6,
  })

  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    let start = null
    let frame

    const step = (timestamp) => {
      if (start === null) start = timestamp

      const progress = Math.min(
        (timestamp - start) / (duration * 1000),
        1
      )

      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplay(Math.round(eased * value))

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
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
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function ImpactStats() {
  const sectionRef = useRef(null)

  /*
   * Tracks the section's position in the viewport.
   * 0 = section entering viewport
   * 1 = section leaving viewport
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  /*
   * Move the background independently from the content.
   */
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['-15%', '15%']
  )

  return (
    <section
      ref={sectionRef}
      className="impact-stats"
    >
      {/* PARALLAX IMAGE */}
      <motion.div
        className="impact-stats__background"
        style={{ y: backgroundY }}
        aria-hidden="true"
      />

      {/* IMAGE OVERLAY */}
      <div
        className="impact-stats__overlay"
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="impact-stats__inner">
        <motion.div
          className="impact-stats__grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.4,
          }}
        >
          {stats.map((s) => {
            const Icon = s.icon

            return (
              <motion.div
                key={s.label}
                className="impact-stats__item"
                variants={item}
              >
                <div className="impact-stats__icon">
                  <Icon
                    size={20}
                    strokeWidth={2}
                  />
                </div>

                <div className="impact-stats__value">
                  <CountUp
                    value={s.value}
                    suffix={s.suffix}
                  />
                </div>

                <div className="impact-stats__label">
                  {s.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

