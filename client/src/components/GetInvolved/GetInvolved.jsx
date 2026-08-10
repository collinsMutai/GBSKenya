
import './GetInvolved.css'

const events = [
  {
    id: 'nairobi-support-group',
    date: 'August 09, 2026',
    day: '09',
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

    registration:
      'Registration is required to help us plan seating, materials, and refreshments. Please register before attending.',

    speakers: [
      'Community support facilitators',
      'Guest healthcare professionals',
      'Patient and caregiver representatives',
    ],

    documents: [
      {
        label: 'Event information',
        href: '#',
      },
    ],

    color: 'green',
  },

  {
    id: 'cidp-webinar',
    date: 'August 23, 2026',
    day: '23',
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

    registration:
      'Registration is required. Registered participants will receive the webinar access link and joining instructions before the event.',

    speakers: [
      'Neurology and healthcare professionals',
      'Rehabilitation specialists',
      'Patient and caregiver advocates',
    ],

    documents: [
      {
        label: 'Webinar information',
        href: '#',
      },
    ],

    color: 'coral',
  },

  {
    id: 'mombasa-chapter',
    date: 'September 06, 2026',
    day: '06',
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

    registration:
      'Registration is required. Venue and attendance details will be shared with registered participants before the meeting.',

    speakers: [
      'Coast Chapter representatives',
      'Community support facilitators',
      'Invited healthcare and community partners',
    ],

    documents: [
      {
        label: 'Chapter meeting information',
        href: '#',
      },
    ],

    color: 'yellow',
  },
]

function EventIcon({ type }) {
  if (type === 'time') {
    return '◷'
  }

  if (type === 'location') {
    return '⌖'
  }

  if (type === 'organiser') {
    return '◎'
  }

  return '•'
}

function EventCard({ event }) {
  return (
    <article
      id={`events-${event.id}`}
      className={`get-involved__event get-involved__event--${event.color}`}
    >
      {/* =================================
          EVENT HEADER
      ================================== */}

      <div className="get-involved__event-header">

        <div className="get-involved__event-date">
          <span className="get-involved__event-day">
            {event.day}
          </span>

          <div className="get-involved__event-date-meta">
            <span>{event.month}</span>
            <span>{event.year}</span>
          </div>
        </div>

        <div className="get-involved__event-heading">

          <span className="get-involved__event-type">
            {event.type}
          </span>

          <h2>
            {event.title}
          </h2>
        </div>

      </div>

      {/* =================================
          EVENT META
      ================================== */}

      <div className="get-involved__event-meta">

        <div className="get-involved__meta-item">
          <span className="get-involved__meta-icon">
            <EventIcon type="time" />
          </span>

          <div>
            <span className="get-involved__meta-label">
              Date & time
            </span>

            <strong>
              {event.date}
            </strong>

            <span>
              {event.time}
            </span>
          </div>
        </div>

        <div className="get-involved__meta-item">
          <span className="get-involved__meta-icon">
            <EventIcon type="location" />
          </span>

          <div>
            <span className="get-involved__meta-label">
              Location
            </span>

            <strong>
              {event.location}
            </strong>
          </div>
        </div>

        <div className="get-involved__meta-item">
          <span className="get-involved__meta-icon">
            <EventIcon type="organiser" />
          </span>

          <div>
            <span className="get-involved__meta-label">
              Organiser
            </span>

            <strong>
              {event.organiser}
            </strong>
          </div>
        </div>

      </div>

      {/* =================================
          EVENT CONTENT
      ================================== */}

      <div className="get-involved__event-content">

        <div className="get-involved__event-main">

          <section className="get-involved__event-section">
            <span className="get-involved__section-number">
              01
            </span>

            <div>
              <h3>
                About this event
              </h3>

              <p>
                {event.description}
              </p>
            </div>
          </section>


          <section className="get-involved__event-section">
            <span className="get-involved__section-number">
              02
            </span>

            <div>
              <h3>
                Who should attend
              </h3>

              <p>
                {event.audience}
              </p>
            </div>
          </section>


          <section className="get-involved__event-section">
            <span className="get-involved__section-number">
              03
            </span>

            <div>
              <h3>
                Speakers & partners
              </h3>

              <ul className="get-involved__speaker-list">
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
            REGISTRATION PANEL
        ================================== */}

        <aside className="get-involved__registration">

          <span className="get-involved__registration-eyebrow">
            Reserve your place
          </span>

          <h3>
            Join the
            <br />
            community.
          </h3>

          <p>
            {event.registration}
          </p>

          <a
            href="#register"
            className="get-involved__register-button"
          >
            Register for this event
            <span aria-hidden="true">
              ↗
            </span>
          </a>

        </aside>

      </div>


      {/* =================================
          DOCUMENTS / LINKS
      ================================== */}

      {event.documents.length > 0 && (
        <div className="get-involved__documents">

          <div>
            <span className="get-involved__documents-label">
              Resources
            </span>

            <h3>
              Event information
            </h3>
          </div>

          <div className="get-involved__document-links">
            {event.documents.map((document) => (
              <a
                key={document.label}
                href={document.href}
                className="get-involved__document-link"
              >
                {document.label}

                <span aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>

        </div>
      )}

    </article>
  )
}

export default function GetInvolved() {
  return (
    <main className="get-involved">

      {/* =================================
          HERO
      ================================== */}

      <section className="get-involved__hero">

        <div className="get-involved__hero-inner">

          <div>
            <p className="get-involved__eyebrow">
              Get involved
            </p>

            <h1>
              Come together.
              <br />
              <span>Make an impact.</span>
            </h1>
          </div>

          <p className="get-involved__hero-intro">
            Connect with patients, caregivers,
            healthcare professionals, and community
            partners through our upcoming events,
            meetings, and learning sessions.
          </p>

        </div>

      </section>


      {/* =================================
          EVENTS
      ================================== */}

      <section
        id="events"
        className="get-involved__events"
      >

        <div className="get-involved__events-container">

          <header className="get-involved__events-header">

            <div>
              <span className="get-involved__eyebrow">
                Community calendar
              </span>

              <h2>
                Upcoming
                <br />
                <span>events.</span>
              </h2>
            </div>

            <p>
              Find opportunities to meet,
              learn, share, and connect with
              others across the community.
            </p>

          </header>


          <div className="get-involved__event-list">

            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))}

          </div>

        </div>

      </section>


      {/* =================================
          REGISTRATION PLACEHOLDER
      ================================== */}

      <section
        id="register"
        className="get-involved__register"
      >

        <div className="get-involved__register-inner">

          <span className="get-involved__eyebrow">
            Stay connected
          </span>

          <h2>
            Want to hear about
            <br />
            <span>future events?</span>
          </h2>

          <p>
            Register your interest and we'll keep
            you informed about upcoming community
            meetings, webinars, support groups,
            and other activities.
          </p>

          <a
            href="/contact"
            className="get-involved__contact-button"
          >
            Get in touch
            <span aria-hidden="true">
              ↗
            </span>
          </a>

        </div>

      </section>

    </main>
  )
}

