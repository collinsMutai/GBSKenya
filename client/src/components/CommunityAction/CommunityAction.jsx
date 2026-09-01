import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import "./CommunityAction.css";

const ACTIONS = [
  {
    number: "01",
    title: "Learn",
    text: "Know the signs. Understand GBV. Share accurate information.",
  },
  {
    number: "02",
    title: "Speak up",
    text: "Challenge harmful behaviour and help make safety everyone's responsibility.",
  },
  {
    number: "03",
    title: "Stand with survivors",
    text: "Listen without judgement and help survivors find trusted support.",
  },
];

export default function CommunityAction() {
  return (
    <section className="community-action">
      <div className="container">

        <div className="community-action__layout">

          {/* LEFT STATEMENT */}

          <div className="community-action__statement">
            <span className="community-action__label">
              Community action
            </span>

            <h2>
              A safer
              <br />
              community
              <br />
              <em>starts here.</em>
            </h2>

            <p>
              Preventing gender-based violence is something we can
              all take part in. What we learn, say, and do matters.
            </p>

            <Link
              to="/get-involved"
              className="community-action__cta"
            >
              <span>Get involved</span>
              <span className="community-action__cta-icon">
                <FaArrowRight />
              </span>
            </Link>
          </div>

          {/* RIGHT ACTIONS */}

          <div className="community-action__actions">
            {ACTIONS.map((action) => (
              <article
                className="community-action__action"
                key={action.number}
              >
                <div className="community-action__action-top">
                  <span>{action.number}</span>

                  <FaArrowRight
                    className="community-action__action-arrow"
                    aria-hidden="true"
                  />
                </div>

                <h3>{action.title}</h3>

                <p>{action.text}</p>
              </article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}