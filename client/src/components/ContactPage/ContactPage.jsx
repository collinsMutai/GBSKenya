import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react'
import PageHeader from '../PageHeader/PageHeader.jsx'
import './ContactPage.css'

const inquiryTypes = ['General inquiry', 'Volunteer', 'Partnership', 'Media']

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: inquiryTypes[0],
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.email.trim() || !form.email.includes('@')) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (!form.message.trim()) nextErrors.message = 'Please add a short message.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    // TODO: wire to POST /api/contact once the backend exists.
    setSubmitted(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="Whether you have a question, want to volunteer, or are exploring a partnership — we'd love to hear from you."
      />

      <section className="section contact-page">
        <div className="container contact-page__grid">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            {submitted ? (
              <div className="contact-page__success">
                <CheckCircle2 size={22} strokeWidth={2} />
                <div>
                  <p className="contact-page__success-title">Message sent</p>
                  <p className="contact-page__success-body">
                    Thank you for reaching out — someone from our team will get back to you soon.
                  </p>
                </div>
              </div>
            ) : (
              <form className="contact-page__form" onSubmit={handleSubmit} noValidate>
                <div className="contact-page__field">
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Jane Wanjiru"
                  />
                  {errors.name && <p className="contact-page__error">{errors.name}</p>}
                </div>

                <div className="contact-page__field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="contact-page__error">{errors.email}</p>}
                </div>

                <div className="contact-page__field">
                  <label htmlFor="type">What's this about?</label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => update('type', e.target.value)}
                  >
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="contact-page__field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Tell us a bit about what you need..."
                  />
                  {errors.message && <p className="contact-page__error">{errors.message}</p>}
                </div>

                <button type="submit" className="btn btn-primary">Send message</button>
              </form>
            )}
          </motion.div>

          <motion.div
            className="contact-page__sidebar"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="contact-page__info-card">
              <p className="eyebrow">Reach us directly</p>

              <a href="mailto:hello@gbsfoundationkenya.org" className="contact-page__info-row">
                <Mail size={18} strokeWidth={2} />
                <span>hello@gbsfoundationkenya.org</span>
              </a>

              <a href="tel:+254700000000" className="contact-page__info-row">
                <Phone size={18} strokeWidth={2} />
                <span>+254 700 000 000</span>
              </a>

              <div className="contact-page__info-row">
                <MapPin size={18} strokeWidth={2} />
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            <div className="contact-page__navigator-card">
              <MessageCircle size={22} strokeWidth={2} />
              <p className="contact-page__navigator-title">Talk to a Health Navigator</p>
              <p className="contact-page__navigator-body">
                Newly diagnosed and not sure where to start? Message us on WhatsApp and a health
                navigator will walk you through your next steps.
              </p>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-donate"
              >
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="container contact-page__map"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <iframe
            title="GBS Foundation Kenya office location"
            src="https://www.openstreetmap.org/export/embed.html?bbox=36.78%2C-1.32%2C36.86%2C-1.24&layer=mapnik&marker=-1.286389%2C36.817223"
            loading="lazy"
          />
        </motion.div>
      </section>
    </>
  )
}