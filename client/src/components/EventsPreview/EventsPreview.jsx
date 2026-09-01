import { Link } from "react-router-dom";
import { FaLocationDot, FaArrowRight } from "react-icons/fa6";
import "./EventsPreview.css";

// --------------------------------------------------
// Placeholder events — replace with real dates/details,
// or wire this up to a backend events endpoint later.
// Slugs here must match the ones in EventDetails.jsx.
// --------------------------------------------------

const events = [
  {
    slug: "nairobi-survivor-support-circle",
    date: "2026-08-09",
    title: "Nairobi survivor support circle",
    location: "Nairobi, Kenya",
    type: "Community meetup",
  },
  {
    slug: "understanding-gbv-webinar",
    date: "2026-08-23",
    title: "Understanding GBV — webinar",
    location: "Online — Zoom",
    type: "Online session",
  },
  {
    slug: "mombasa-coast-chapter",
    date: "2026-09-06",
    title: "Mombasa coast chapter meeting",
    location: "Mombasa, Kenya",
    type: "Chapter meeting",
  },
];

export default function EventsPreview() {
  return (
    <section className="section events-preview">
      <div className="container">

        <div className="section-head events-preview__head">
          <div>
            <span className="eyebrow">
              Community calendar
            </span>

            <h2>Upcoming events</h2>
          </div>

          <p>
            Meet, learn, and connect with others across
            the community — every event is open and free
            to attend.
          </p>
        </div>

        <div className="events-preview__list">
          {events.map((event) => {
            const eventDate = new Date(event.date);

            return (
              <Link
                to={`/get-involved/events/${event.slug}`}
                className="event-row"
                key={event.slug}
              >
                <div className="event-row__date">
                  <span className="event-row__day">
                    {eventDate.getDate()}
                  </span>

                  <span className="event-row__month">
                    {eventDate
                      .toLocaleString("en-US", {
                        month: "short",
                      })
                      .toUpperCase()}
                  </span>
                </div>

                <div className="event-row__body">
                  <span className="event-row__type">
                    {event.type}
                  </span>

                  <h3>{event.title}</h3>

                  <span className="event-row__location">
                    <FaLocationDot />
                    {event.location}
                  </span>
                </div>

                <span className="event-row__arrow">
                  <FaArrowRight />
                </span>
              </Link>
            );
          })}
        </div>

        <Link
          to="/get-involved"
          className="btn btn-outline events-preview__cta"
        >
          View all events
        </Link>

      </div>
    </section>
  );
}