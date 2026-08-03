import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import "./NewsletterSignup.css";

export default function NewsletterSignup() {
  return (
    <section className="section newsletter">
      <motion.div
        className="container newsletter__inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6 }}
      >
        <div className="newsletter__content">
          <span className="eyebrow">Stay Connected</span>

          <h2 className="newsletter__title">
            Get trusted CML updates delivered to your inbox
          </h2>

          <p className="newsletter__text">
            Receive educational resources, patient stories, upcoming events,
            support group announcements, and the latest news from GBS Kenya.
          </p>
        </div>

        <form
          className="newsletter__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="newsletter__input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Subscribe
          </button>
        </form>

        <p className="newsletter__privacy">
          We respect your privacy. No spam, unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}