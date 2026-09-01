import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

import "./NewsletterSignup.css";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/newsletter/subscribe`,
        {
          email,
        },
      );

      toast.success(data.message || "You're now connected with us.");
      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to subscribe. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="newsletter"
      aria-labelledby="newsletter-title"
    >
      <div className="container newsletter__container">

        {/* Top rule */}

        <div className="newsletter__top">
          <span className="newsletter__label">
            Stay connected
          </span>

          <span className="newsletter__index">
            06 / COMMUNITY
          </span>
        </div>

        {/* Main content */}

        <motion.div
          className="newsletter__main"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65 }}
        >
          <div className="newsletter__statement">
            <h2 id="newsletter-title">
              Keep the conversation
              <span> going.</span>
            </h2>

            <p>
              Receive occasional updates about GBV awareness,
              survivor support, community programmes, resources,
              and opportunities to take action.
            </p>
          </div>

          <div className="newsletter__action">

            <div className="newsletter__action-heading">
              <span>Receive updates</span>

              <Mail size={17} />
            </div>

            <form
              className="newsletter__form"
              onSubmit={handleSubscribe}
            >
              <div className="newsletter__field">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  autoComplete="email"
                  required
                  disabled={loading}
                  aria-label="Email address"
                />

                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe to updates"
                >
                  {loading ? (
                    <Loader2
                      size={18}
                      className="newsletter__spinner"
                    />
                  ) : (
                    <ArrowUpRight size={19} />
                  )}
                </button>
              </div>
            </form>

            <p className="newsletter__privacy">
              Your information is kept private. Unsubscribe whenever
              you choose.
            </p>
          </div>
        </motion.div>

        {/* Bottom statement */}

        <div className="newsletter__bottom">
          <span>
            Awareness
          </span>

          <span className="newsletter__bottom-line" />

          <span>
            Support
          </span>

          <span className="newsletter__bottom-line" />

          <span>
            Prevention
          </span>

          <span className="newsletter__bottom-line" />

          <span>
            Community
          </span>
        </div>

      </div>
    </section>
  );
}
