
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  Users,
} from 'lucide-react'
import './EventDetails.css'

const events = [
  {
    slug: 'nairobi-support-group',

    date: '09',
    month: 'AUG',
    year: '2026',

    title: 'Nairobi support group meetup',
    type: 'Community meetup',

    time: '10:00 AM – 1:00 PM',
    location: 'Nairobi, Kenya',
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

    registrationLink: '#',

    resources: [
      {
        label: 'Event information',
        href: '#',
      },
    ],
  },

  {
    slug: 'cidp-webinar',

    date: '23',
    month: 'AUG',
    year: '2026',

    title: 'Understanding CIDP — webinar',
    type: 'Online session',

    time: '3:00 PM – 4:30 PM EAT',
    location: 'Online — Zoom',
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

    registrationLink: '#',

    resources: [
      {
        label: 'Webinar information',
        href: '#',
      },
    ],
  },

  {
    slug: 'mombasa-coast-chapter',

    date: '06',
    month: 'SEP',
    year: '2026',

    title: 'Mombasa coast chapter meeting',
    type: 'Chapter meeting',

    time: '11:00 AM – 2:00 PM',
    location: 'Mombasa, Kenya',
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

    registrationLink: '#',

    resources: [
      {
        label: 'Chapter meeting information',
        href: '#',
      },
    ],
  },
]

export default function EventDetails() {
  const { slug } = useParams()

  const event = events.find(
    (item) => item.slug === slug
  )

  if (!event) {
    return (
      <main className="event-details event-details--not-found">
        <div className="event-details__container">

          <p className="event-details__eyebrow">
            Event
          </p>

          <h1>
            Event not found.
          </h1>

          <p>
            The event you're looking for may have
            been removed or is no longer available.
          </p>

          <Link
            to="/get-involved"
            className="event-details__back"
          >
            <ArrowLeft size={17} />
            Back to events
          </Link>

        </div>
      </main>
    )
  }

  return (
    <main className="event-details">

      {/* =================================
          HERO
      ================================= */}

      <section className="event-details__hero">

        <div className="event-details__container">

          <Link
            to="/get-involved"
            className="event-details__back"
          >
            <ArrowLeft size={17} />
            Back to events
          </Link>

          <div className="event-details__hero-grid">

            {/* Date */}

            <div className="event-details__date">

              <span className="event-details__day">
                {event.date}
              </span>

              <span className="event-details__month">
                {event.month}
              </span>

              <span className="event-details__year">
                {event.year}
              </span>

            </div>

            {/* Heading */}

            <div className="event-details__hero-content">

              <span className="event-details__type">
                {event.type}
              </span>

              <h1>
                {event.title}
              </h1>

              <p>
                Meet, learn, share, and connect
                with the community.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          EVENT META
      ================================= */}

      <section className="event-details__meta">

        <div className="event-details__container">

          <div className="event-details__meta-grid">

            <div className="event-details__meta-item">

              <Clock3 size={20} />

              <div>
                <span>
                  Date &amp; time
                </span>

                <strong>
                  {event.month} {event.date}, {event.year}
                  <br />
                  {event.time}
                </strong>
              </div>

            </div>


            <div className="event-details__meta-item">

              <MapPin size={20} />

              <div>
                <span>
                  Location
                </span>

                <strong>
                  {event.location}
                </strong>
              </div>

            </div>


            <div className="event-details__meta-item">

              <UserRound size={20} />

              <div>
                <span>
                  Organiser
                </span>

                <strong>
                  {event.organiser}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          MAIN CONTENT
      ================================= */}

      <section className="event-details__content">

        <div className="event-details__container">

          <div className="event-details__content-grid">

            {/* =================================
                INFORMATION
            ================================= */}

            <div className="event-details__main">

              {/* About */}

              <section className="event-details__section">

                <div className="event-details__section-number">
                  01
                </div>

                <div>

                  <h2>
                    About this event
                  </h2>

                  <p>
                    {event.description}
                  </p>

                </div>

              </section>


              {/* Who should attend */}

              <section className="event-details__section">

                <div className="event-details__section-number">
                  02
                </div>

                <div>

                  <h2>
                    Who should attend
                  </h2>

                  <p>
                    {event.audience}
                  </p>

                </div>

              </section>


              {/* Speakers */}

              <section className="event-details__section">

                <div className="event-details__section-number">
                  03
                </div>

                <div>

                  <h2>
                    Speakers &amp; partners
                  </h2>

                  <ul className="event-details__list">

                    {event.speakers.map((speaker) => (
                      <li key={speaker}>
                        {speaker}
                      </li>
                    ))}

                  </ul>

                </div>

              </section>

            </div>


            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="event-details__sidebar">

              {/* Registration */}

              <div className="event-details__registration">

                <Users
                  size={24}
                  strokeWidth={1.8}
                />

                <p className="event-details__registration-label">
                  Reserve your place
                </p>

                <h2>
                  Join the
                  <br />
                  community.
                </h2>

                <p>
                  {event.registration}
                </p>

                <a
                  href={event.registrationLink}
                  className="event-details__register"
                >
                  <span>
                    Register for this event
                  </span>

                  <ArrowUpRight size={18} />
                </a>

              </div>


              {/* Resources */}

              {event.resources?.length > 0 && (

                <div className="event-details__resources">

                  <span>
                    Resources
                  </span>

                  {event.resources.map((resource) => (

                    <a
                      key={resource.label}
                      href={resource.href}
                    >
                      <span>
                        {resource.label}
                      </span>

                      <ArrowUpRight size={16} />

                    </a>

                  ))}

                </div>

              )}

            </aside>

          </div>

        </div>

      </section>


      {/* =================================
          BACK TO EVENTS
      ================================= */}

      <section className="event-details__footer">

        <div className="event-details__container">

          <Link
            to="/get-involved"
            className="event-details__footer-link"
          >
            <ArrowLeft size={18} />
            View all upcoming events
          </Link>

        </div>

      </section>

    </main>
  )
}

