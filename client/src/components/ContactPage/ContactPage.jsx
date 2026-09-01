import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import PageHeader from "../PageHeader/PageHeader.jsx";
import "./ContactPage.css";

const inquiryTypes = [
  "General inquiry",
  "Survivor support",
  "Volunteer",
  "Partnership",
  "Media",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: inquiryTypes[0],
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please enter your message.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      toast.success("Your message has been sent. We'll be in touch soon.");

      setForm({
        name: "",
        email: "",
        type: inquiryTypes[0],
        message: "",
      });
    } catch (error) {
      toast.error(
        error.message || "Unable to send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="We're here to listen"
        title="Reach out when you're ready."
        subtitle="Whether you're looking for support, want to get involved, or simply have a question about our work, you can reach our team here."
      />

      <main className="contact-page">
        <section className="section contact-page__section">
          <div className="container">

            <div className="contact-page__intro">
              <div>
                <span className="eyebrow">Contact GBV Foundation Kenya</span>

                <h2>
                  A safe place to
                  <span> start a conversation.</span>
                </h2>
              </div>

              <p>
                You don't need to have everything figured out before reaching
                out. Tell us what you need, and we'll help connect you with the
                right information, people, or support.
              </p>
            </div>

            <div className="contact-page__layout">

              {/* =========================
                  CONTACT PANEL
              ========================= */}

              <motion.aside
                className="contact-page__panel"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
              >
                <div className="contact-page__panel-top">
                  <div className="contact-page__panel-icon">
                    <ShieldCheck size={22} />
                  </div>

                  <span>Here when you need us</span>
                </div>

                <h3>
                  Talk to someone
                  <br />
                  you can trust.
                </h3>

                <p className="contact-page__panel-copy">
                  Our team can help you find information, understand available
                  support options, connect with services, or explore ways to
                  contribute to preventing gender-based violence.
                </p>

                <div className="contact-page__details">

                  <a
                    href="mailto:info@gbvfoundationkenya.org"
                    className="contact-page__detail"
                  >
                    <span className="contact-page__detail-icon">
                      <Mail size={17} />
                    </span>

                    <span>
                      <small>Email us</small>
                      info@gbvfoundationkenya.org
                    </span>

                    <ArrowUpRight size={16} />
                  </a>

                  <a
                    href="tel:+254700000000"
                    className="contact-page__detail"
                  >
                    <span className="contact-page__detail-icon">
                      <Phone size={17} />
                    </span>

                    <span>
                      <small>Call us</small>
                      +254 700 000 000
                    </span>

                    <ArrowUpRight size={16} />
                  </a>

                  <div className="contact-page__detail">
                    <span className="contact-page__detail-icon">
                      <MapPin size={17} />
                    </span>

                    <span>
                      <small>Based in</small>
                      Nairobi, Kenya
                    </span>
                  </div>

                </div>

                <div className="contact-page__availability">
                  <Clock3 size={16} />

                  <span>
                    <strong>Office hours</strong>
                    Monday – Friday · 8:00 AM – 5:00 PM
                  </span>
                </div>
              </motion.aside>

              {/* =========================
                  FORM
              ========================= */}

              <motion.div
                className="contact-page__form-wrap"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
              >
                <div className="contact-page__form-heading">
                  <span>Send us a message</span>

                  <p>
                    Complete the short form below and a member of our team will
                    get back to you.
                  </p>
                </div>

                <form
                  className="contact-page__form"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="contact-page__fields-row">
                    <div className="contact-page__field">
                      <label htmlFor="name">Your name</label>

                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          update("name", e.target.value)
                        }
                        placeholder="Your name"
                      />

                      {errors.name && (
                        <p className="contact-page__error">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="contact-page__field">
                      <label htmlFor="email">Email address</label>

                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          update("email", e.target.value)
                        }
                        placeholder="you@example.com"
                      />

                      {errors.email && (
                        <p className="contact-page__error">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="contact-page__field">
                    <label htmlFor="type">
                      What would you like to talk about?
                    </label>

                    <select
                      id="type"
                      value={form.type}
                      onChange={(e) =>
                        update("type", e.target.value)
                      }
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-page__field">
                    <label htmlFor="message">Your message</label>

                    <textarea
                      id="message"
                      rows={7}
                      value={form.message}
                      onChange={(e) =>
                        update("message", e.target.value)
                      }
                      placeholder="Tell us how we can help..."
                    />

                    {errors.message && (
                      <p className="contact-page__error">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="contact-page__form-footer">
                    <p>
                      Your information is treated with care and used only to
                      respond to your enquiry.
                    </p>

                    <button
                      type="submit"
                      className="contact-page__submit"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send message"}
                      {!loading && <ArrowUpRight size={17} />}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* =========================
                SUPPORT STRIP
            ========================= */}

            <motion.div
              className="contact-page__support"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
            >
              <div className="contact-page__support-icon">
                <MessageCircle size={21} />
              </div>

              <div className="contact-page__support-copy">
                <span>Need support now?</span>

                <p>
                  If you are experiencing or responding to gender-based
                  violence, you can reach out for support without waiting to
                  complete the form.
                </p>
              </div>

              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-page__whatsapp"
              >
                Chat on WhatsApp
                <ArrowUpRight size={16} />
              </a>
            </motion.div>

            {/* =========================
                LOCATION
            ========================= */}

            <div className="contact-page__location">
              <div className="contact-page__location-copy">
                <span className="eyebrow">Find us</span>

                <h3>Nairobi, Kenya</h3>

                <p>
                  Our work connects communities, survivors, service providers,
                  and partners across Kenya.
                </p>
              </div>

              <div className="contact-page__map">
                <iframe
                  title="GBV Foundation Kenya office location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=36.78%2C-1.32%2C36.86%2C-1.24&layer=mapnik&marker=-1.286389%2C36.817223"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}