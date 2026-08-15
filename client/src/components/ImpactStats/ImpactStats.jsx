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

  // once: false — re-triggers every time this number re-enters view
  const inView = useInView(ref, {
    once: false,
    amount: 0.6,
  })

  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) {
      // Reset to 0 on exit so it counts up fresh next time it re-enters
      setDisplay(0)
      return
    }

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

/* =========================================
   ANIMATION VARIANTS
   ========================================= */

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const iconVariants = {
  hidden: {
    opacity: 0,
    scale: 0.4,
    rotate: -50,
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 14,
      delay: 0.05,
    },
  },
}

const valueVariants = {
  hidden: {
    opacity: 0,
    scale: 1.3,
    filter: 'blur(6px)',
  },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.15,
    },
  },
}

const lineVariants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.35,
    },
  },
}

const labelVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.4,
    },
  },
}

const backgroundEntranceVariants = {
  hidden: { opacity: 0, scale: 1.18 },
  show: {
    opacity: 1,
    scale: 1.08, // settles at the parallax's own "resting" zoom level
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
}

const overlayEntranceVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
}

export default function ImpactStats() {
  const sectionRef = useRef(null)

  // once: false — replays on every entry, and fires immediately if the
  // section is already visible on first page load
  const isInView = useInView(sectionRef, {
    once: false,
    amount: 0.15,
  })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['-15%', '15%']
  )

  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.08, 1, 1.08]
  )

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.9, 0.75, 0.9]
  )

  return (
    <section
      ref={sectionRef}
      className="impact-stats"
    >
      {/* PARALLAX + ZOOM IMAGE */}
      <motion.div
        className="impact-stats__background"
        variants={backgroundEntranceVariants}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        style={
          isInView
            ? { y: backgroundY, scale: backgroundScale }
            : undefined
        }
        aria-hidden="true"
      />

      {/* IMAGE OVERLAY */}
      <motion.div
        className="impact-stats__overlay"
        variants={overlayEntranceVariants}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        style={isInView ? { opacity: overlayOpacity } : undefined}
        aria-hidden="true"
      />

      {/* CONTENT */}
      <div className="impact-stats__inner">
        <motion.div
          className="impact-stats__grid"
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {stats.map((s) => {
            const Icon = s.icon

            return (
              <motion.div
                key={s.label}
                className="impact-stats__item"
                variants={item}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="impact-stats__icon"
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: 6 }}
                >
                  <Icon
                    size={20}
                    strokeWidth={2}
                  />
                </motion.div>

                <motion.div
                  className="impact-stats__value"
                  variants={valueVariants}
                >
                  <CountUp
                    value={s.value}
                    suffix={s.suffix}
                  />
                </motion.div>

                <motion.div
                  className="impact-stats__value-line"
                  variants={lineVariants}
                  aria-hidden="true"
                />

                <motion.div
                  className="impact-stats__label"
                  variants={labelVariants}
                >
                  {s.label}
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}