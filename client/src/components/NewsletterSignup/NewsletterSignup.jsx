import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";
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
        }
      );

      toast.success(data.message || "Successfully subscribed!");

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
            Get trusted GBS & CIDP updates delivered to your inbox
          </h2>

          <p className="newsletter__text">
            Receive educational resources, patient stories, upcoming events,
            support group announcements, advocacy initiatives, and the latest
            news from the GBS | CIDP Kenya Chapter.
          </p>
        </div>

        <form
          className="newsletter__form"
          onSubmit={handleSubscribe}
        >
          <div className="newsletter__input">
            <Mail size={18} />

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        <p className="newsletter__privacy">
          We respect your privacy. No spam, unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}