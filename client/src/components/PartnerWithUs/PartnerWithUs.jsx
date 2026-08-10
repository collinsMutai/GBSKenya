
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import "./PartnerWithUs.css";

export default function PartnerWithUs() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="partner-page">
      {/* ==============================
          Hero
      ============================== */}

      <section className="partner-hero">
        <div className="container partner-hero__inner">
          <span className="partner-hero__eyebrow">
            Get Involved
          </span>

          <h1 className="partner-hero__title">
            Partner With Us
          </h1>

          <p className="partner-hero__description">
            We welcome organisations, healthcare providers, community groups,
            researchers, and other partners who share our commitment to
            improving the lives of people affected by GBS, CIDP, and related
            neuropathies. Tell us how you would like to work with us, and
            together we can create meaningful impact.
          </p>
        </div>
      </section>

      {/* ==============================
          Form Section
      ============================== */}

      <section className="partner-form-section">
        <div className="container partner-form-layout">
          {/* Intro */}
          <div className="partner-form-intro">
            <span className="partner-section__eyebrow">
              Let's Work Together
            </span>

            <h2>
              Start a conversation
            </h2>

            <p>
              Whether you are interested in supporting our programmes,
              collaborating on research, providing services, raising
              awareness, or exploring another form of partnership, we would
              love to hear from you.
            </p>

            <p>
              Please complete the form and a member of our team will get in
              touch with you.
            </p>
          </div>

          {/* Form */}
          <div className="partner-form-card">
            {submitted ? (
              <div className="partner-success">
                <CheckCircle2 size={52} />

                <h2>
                  Thank you for reaching out.
                </h2>

                <p>
                  We have received your partnership enquiry and will be in
                  touch with you soon.
                </p>

                <button
                  type="button"
                  className="partner-secondary-button"
                  onClick={() => setSubmitted(false)}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form
                className="partner-form"
                onSubmit={(event) => {
                  handleSubmit(event);
                }}
              >
                <div className="partner-form__header">
                  <h2>
                    Partnership Enquiry
                  </h2>

                  <p>
                    Tell us a little about your organisation and how you would
                    like to partner with us.
                  </p>
                </div>

                <div className="partner-form__grid">
                  {/* Organisation */}
                  <div className="partner-field partner-field--full">
                    <label htmlFor="organisation">
                      Organisation name
                      <span>*</span>
                    </label>

                    <input
                      id="organisation"
                      name="organisation"
                      type="text"
                      placeholder="Enter organisation name"
                      required
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="partner-field">
                    <label htmlFor="contactName">
                      Contact person
                      <span>*</span>
                    </label>

                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      placeholder="Full name"
                      required
                    />
                  </div>

                  {/* Position */}
                  <div className="partner-field">
                    <label htmlFor="position">
                      Position / role
                    </label>

                    <input
                      id="position"
                      name="position"
                      type="text"
                      placeholder="Your role"
                    />
                  </div>

                  {/* Email */}
                  <div className="partner-field">
                    <label htmlFor="email">
                      Email address
                      <span>*</span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@organisation.org"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="partner-field">
                    <label htmlFor="phone">
                      Phone number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+254 ..."
                    />
                  </div>

                  {/* Website */}
                  <div className="partner-field partner-field--full">
                    <label htmlFor="website">
                      Organisation website
                    </label>

                    <input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://www.example.org"
                    />
                  </div>

                  {/* Partnership Type */}
                  <div className="partner-field partner-field--full">
                    <label htmlFor="partnershipType">
                      How would you like to partner with us?
                      <span>*</span>
                    </label>

                    <select
                      id="partnershipType"
                      name="partnershipType"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select an option
                      </option>

                      <option value="programmes">
                        Programme collaboration
                      </option>

                      <option value="healthcare">
                        Healthcare / clinical partnership
                      </option>

                      <option value="research">
                        Research collaboration
                      </option>

                      <option value="awareness">
                        Awareness and advocacy
                      </option>

                      <option value="funding">
                        Funding or sponsorship
                      </option>

                      <option value="community">
                        Community partnership
                      </option>

                      <option value="services">
                        Professional or in-kind support
                      </option>

                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="partner-field partner-field--full">
                    <label htmlFor="message">
                      Tell us about your partnership idea
                      <span>*</span>
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Tell us about your organisation, what you would like to collaborate on, and how you think we could work together."
                      required
                    />
                  </div>

                  {/* Consent */}
                  <div className="partner-consent partner-field--full">
                    <label className="partner-checkbox">
                      <input
                        type="checkbox"
                        name="consent"
                        required
                      />

                      <span>
                        I agree that GBS Foundation Kenya may use the
                        information provided to contact me regarding this
                        partnership enquiry.
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="partner-submit-button"
                >
                  Send Partnership Enquiry
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

