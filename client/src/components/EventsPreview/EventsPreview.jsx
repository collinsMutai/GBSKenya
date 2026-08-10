
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './EventsPreview.css'

const events = [
  {
    id: 1,
    slug: 'nairobi-support-group',
    date: 'Aug 09, 2026',
    title: 'Nairobi support group meetup',
    location: 'Nairobi',
    type: 'Community meetup',
    color: 'green',

    time: '10:00 AM – 1:00 PM',
    organiser: 'Community Support Team',

    description:
      'A welcoming support group meetup bringing together patients, caregivers, family members, and community supporters. The session provides an opportunity to connect, share experiences, learn from one another, and access practical support.',

    audience:
      'Patients, caregivers, family members, volunteers, and anyone supporting people living with CIDP and related conditions.',

    speakers: [
      'Community support facilitators',
      'Guest healthcare professionals',
      'Patient and caregiver representatives',
    ],

    registration:
      'Registration is required to help us plan seating, materials, and refreshments. Please register before attending.',
  },

  {
    id: 2,
    slug: 'cidp-webinar',
    date: 'Aug 23, 2026',
    title: 'Understanding CIDP — webinar',
    location: 'Online — Zoom',
    type: 'Online session',
    color: 'coral',

    time: '3:00 PM – 4:30 PM EAT',
    organiser: 'Community Support Team',

    description:
      'An educational online session exploring CIDP, treatment journeys, symptom management, rehabilitation, and ways patients and caregivers can access meaningful support. The session will also provide an opportunity for participants to ask questions.',

    audience:
      'Patients, caregivers, families, healthcare professionals, students, volunteers, and anyone interested in learning more about CIDP.',

    speakers: [
      'Neurology and healthcare professionals',
      'Rehabilitation specialists',
      'Patient and caregiver advocates',
    ],

    registration:
      'Registration is required. Registered participants will receive the webinar access link and joining instructions before the event.',
  },

  {
    id: 3,
    slug: 'mombasa-coast-chapter',
    date: 'Sep 06, 2026',
    title: 'Mombasa coast chapter meeting',
    location: 'Mombasa, Kenya',
    type: 'Chapter meeting',
    color: 'yellow',

    time: '11:00 AM – 2:00 PM',
    organiser: 'Coast Chapter Team',

    description:
      'A local chapter meeting bringing together patients, caregivers, families, volunteers, and community partners across the coast. The meeting will focus on peer support, community connection, awareness, and planning future activities for the region.',

    audience:
      'Patients, caregivers, families, volunteers, community health partners, and supporters in Mombasa and surrounding counties.',

    speakers: [
      'Coast Chapter representatives',
      'Community support facilitators',
      'Invited healthcare and community partners',
    ],

    registration:
      'Registration is required. Venue and attendance details will be shared with registered participants before the meeting.',
  },
]

const slideVariants = {
  enter: {
    opacity: 0,
    x: 50,
    rotate: 1.5,
  },

  center: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },

  exit: {
    opacity: 0,
    x: -50,
    rotate: -1.5,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function EventsPreview() {
  const [currentEvent, setCurrentEvent] = useState(0)
  const [paused, setPaused] = useState(false)

  const event = events[currentEvent]

  const nextEvent = () => {
    setCurrentEvent(
      (current) => (current + 1) % events.length
    )
  }

  const previousEvent = () => {
    setCurrentEvent(
      (current) =>
        (current - 1 + events.length) % events.length
    )
  }

  useEffect(() => {
    if (paused) return

    const interval = setInterval(nextEvent, 7000)

    return () => clearInterval(interval)
  }, [paused])

  return (
    <section className="events-preview">
      <div className="events-preview__container">

        {/* =================================
            HEADER
        ================================== */}

        <div className="events-preview__head">
          <div>
            <p className="events-preview__eyebrow">
              Community calendar
            </p>

            <h2 className="events-preview__heading">
              Upcoming
              <br />
              <span>events.</span>
            </h2>
          </div>

          <p className="events-preview__intro">
            Meet, learn and connect with others
            across the community.
          </p>
        </div>

        {/* =================================
            FLYER STAGE
        ================================== */}

        <div
          className="events-preview__stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">

            {/* =================================
                CLICKABLE EVENT FLYER

                Each flyer goes to:
                /get-involved/events/:slug
            ================================== */}

            <motion.a
              key={event.slug}
              href={`/get-involved/events/${event.slug}`}
              className={`events-preview__flyer events-preview__flyer--${event.color}`}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-label={`View full details for ${event.title}`}
            >

              {/* Decorative shapes */}

              <div
                className="events-preview__shape events-preview__shape--one"
                aria-hidden="true"
              />

              <div
                className="events-preview__shape events-preview__shape--two"
                aria-hidden="true"
              />

              <div
                className="events-preview__shape events-preview__shape--three"
                aria-hidden="true"
              />

              {/* =================================
                  FLYER HEADER
              ================================== */}

              <div className="events-preview__flyer-top">
                <span className="events-preview__type">
                  {event.type}
                </span>

                <span className="events-preview__number">
                  {String(currentEvent + 1).padStart(2, '0')}
                </span>
              </div>

              {/* =================================
                  FLYER BODY
              ================================== */}

              <div className="events-preview__flyer-body">

                <div className="events-preview__date-block">
                  <span className="events-preview__day">
                    {new Date(event.date).getDate()}
                  </span>

                  <span className="events-preview__month">
                    {new Date(event.date)
                      .toLocaleString('en-US', {
                        month: 'short',
                      })
                      .toUpperCase()}
                  </span>
                </div>

                <div className="events-preview__details">
                  <h3>{event.title}</h3>

                  <div className="events-preview__location">
                    <span aria-hidden="true">
                      ↳
                    </span>

                    {event.location}
                  </div>
                </div>

              </div>

              {/* =================================
                  FLYER FOOTER
              ================================== */}

              <div className="events-preview__flyer-bottom">
                <span>
                  View full event details
                </span>

                <span
                  className="events-preview__arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>

            </motion.a>

          </AnimatePresence>
        </div>

        {/* =================================
            NAVIGATION
        ================================== */}

        <div className="events-preview__controls">

          <div className="events-preview__navigation">

            <button
              type="button"
              className="events-preview__button"
              onClick={previousEvent}
              aria-label="Previous event"
            >
              <span aria-hidden="true">
                ←
              </span>
            </button>

            <div
              className="events-preview__counter"
              aria-label={`Event ${
                currentEvent + 1
              } of ${events.length}`}
            >
              <strong>
                {String(currentEvent + 1).padStart(
                  2,
                  '0'
                )}
              </strong>

              <span>/</span>

              <span>
                {String(events.length).padStart(
                  2,
                  '0'
                )}
              </span>
            </div>

            <button
              type="button"
              className="events-preview__button"
              onClick={nextEvent}
              aria-label="Next event"
            >
              <span aria-hidden="true">
                →
              </span>
            </button>

          </div>

        </div>

      </div>
    </section>
  )
}

