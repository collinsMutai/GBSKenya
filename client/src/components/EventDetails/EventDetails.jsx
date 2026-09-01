import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowUpRightFromSquare,
  FaClock,
  FaLocationDot,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import "./EventDetails.css";

// --------------------------------------------------
// Placeholder events — slugs must match EventsPreview.jsx.
// --------------------------------------------------

const events = [
  {
    slug: "nairobi-survivor-support-circle",

    date: "09",
    month: "AUG",
    year: "2026",

    title: "Nairobi survivor support circle",
    type: "Community meetup",

    time: "10:00 AM – 1:00 PM",
    location: "Nairobi, Kenya",
    organiser: "Community Support Team",

    description:
      "A welcoming support circle bringing together survivors, family members, friends, and community supporters. The session provides an opportunity to connect, share at your own pace, learn from one another, and access practical support.",

    audience:
      "Survivors, family members, friends, volunteers, and anyone supporting someone affected by gender-based violence.",

    speakers: [
      "Community support facilitators",
      "Counselors and case workers",
      "Survivor and community advocates",
    ],

    registration:
      "Registration is required to help us plan seating, materials, and refreshments. Please register before attending.",

    registrationLink: "#",

    resources: [
      {
        label: "Event information",
        href: "#",
      },
    ],
  },

  {
    slug: "understanding-gbv-webinar",

    date: "23",
    month: "AUG",
    year: "2026",

    title: "Understanding GBV — webinar",
    type: "Online session",

    time: "3:00 PM – 4:30 PM EAT",
    location: "Online — Zoom",
    organiser: "Community Support Team",

    description:
      "An educational online session exploring what gender-based violence looks like, safety planning, available support services, and ways survivors and their communities can access meaningful help. The session includes time for participant questions.",

    audience:
      "Survivors, families, community members, service providers, students, volunteers, and anyone wanting to learn more about GBV.",

    speakers: [
      "Counselors and legal advocates",
      "Case workers and social workers",
      "Survivor and community advocates",
    ],

    registration:
      "Registration is required. Registered participants will receive the webinar access link and joining instructions before the event.",

    registrationLink: "#",

    resources: [
      {
        label: "Webinar information",
        href: "#",
      },
    ],
  },

  {
    slug: "mombasa-coast-chapter",

    date: "06",
    month: "SEP",
    year: "2026",

    title: "Mombasa coast chapter meeting",
    type: "Chapter meeting",

    time: "11:00 AM – 2:00 PM",
    location: "Mombasa, Kenya",
    organiser: "Coast Chapter Team",

    description:
      "A local chapter meeting bringing together survivors, families, volunteers, and community partners across the coast. The meeting focuses on peer support, community connection, awareness, and planning future activities for the region.",

    audience:
      "Survivors, families, volunteers, community health partners, and supporters in Mombasa and surrounding counties.",

    speakers: [
      "Coast Chapter representatives",
      "Community support facilitators",
      "Invited health and community partners",
    ],

    registration:
      "Registration is required. Venue and attendance details will be shared with registered participants before the meeting.",

    registrationLink: "#",

    resources: [
      {
        label: "Chapter meeting information",
        href: "#",
      },
    ],
  },
];

export default function EventDetails() {
  const { slug } = useParams();

  const event = events.find((item) => item.slug === slug);

  // --------------------------------------------------
  // Not found
  // --------------------------------------------------

  if (!event) {
    return (
      <main className="event-details event-details--not-found">
        <div className="container">

          <p className="eyebrow">Event</p>

          <h1>Event not found.</h1>

          <p>
            The event you're looking for may have been
            removed or is no longer available.
          </p>

          <Link
            to="/get-involved"
            className="event-details__back"
          >
            <FaArrowLeft />
            Back to events
          </Link>

        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <main className="event-details">

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="event-details__hero">
        <div className="container">

          <Link
            to="/get-involved"
            className="event-details__back"
          >
            <FaArrowLeft />
            Back to events
          </Link>

          <span className="eyebrow">{event.type}</span>

          <h1>{event.title}</h1>

          <p className="event-details__lead">
            Meet, learn, share, and connect with the
            community.
          </p>

          <div className="event-details__meta-row">

            <span>
              <FaClock />
              {event.month} {event.date}, {event.year}
              {" · "}
              {event.time}
            </span>

            <span>
              <FaLocationDot />
              {event.location}
            </span>

            <span>
              <FaUser />
              {event.organiser}
            </span>

          </div>

        </div>
      </section>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <section className="section event-details__content">
        <div className="container event-details__content-grid">

          <div className="event-details__main">

            <div className="event-details__section">
              <span className="event-details__section-number">
                01
              </span>

              <div>
                <h2>About this event</h2>
                <p>{event.description}</p>
              </div>
            </div>

            <div className="event-details__section">
              <span className="event-details__section-number">
                02
              </span>

              <div>
                <h2>Who should attend</h2>
                <p>{event.audience}</p>
              </div>
            </div>

            <div className="event-details__section">
              <span className="event-details__section-number">
                03
              </span>

              <div>
                <h2>Speakers &amp; partners</h2>

                <ul className="event-details__list">
                  {event.speakers.map((speaker) => (
                    <li key={speaker}>{speaker}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          <aside className="event-details__sidebar">

            <div className="event-details__registration">
              <FaUsers />

              <span className="event-details__registration-label">
                Reserve your place
              </span>

              <h2>Join the community.</h2>

              <p>{event.registration}</p>

              <a
                href={event.registrationLink}
                className="event-details__register"
              >
                <span>Register for this event</span>
                <FaArrowUpRightFromSquare />
              </a>
            </div>

            {event.resources?.length > 0 && (
              <div className="event-details__resources">
                <span>Resources</span>

                {event.resources.map((resource) => (
                  <a
                    key={resource.label}
                    href={resource.href}
                  >
                    <span>{resource.label}</span>
                    <FaArrowUpRightFromSquare />
                  </a>
                ))}
              </div>
            )}

          </aside>

        </div>
      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <section className="event-details__footer">
        <div className="container">
          <Link
            to="/get-involved"
            className="event-details__footer-link"
          >
            <FaArrowLeft />
            View all upcoming events
          </Link>
        </div>
      </section>

    </main>
  );
}