import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CreditCard,
  Heart,
  Smartphone,
  X,
} from "lucide-react";

import "./DonateBanner.css";

const impactItems = [
  {
    value: "01",
    label: "Patient education",
  },
  {
    value: "02",
    label: "Support & connection",
  },
  {
    value: "03",
    label: "Community outreach",
  },
];

export default function DonateBanner() {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("mpesa");

  return (
    <>
      <section
        className="donate-banner"
        aria-labelledby="donate-banner-title"
      >
        <div className="container donate-banner__container">
          {/* ==========================================
              LEFT — MESSAGE
          ========================================== */}

          <motion.div
            className="donate-banner__message"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="donate-banner__label">
              <span className="donate-banner__label-dot" />
              SUPPORT THE MISSION
            </div>

            <h2 id="donate-banner-title">
              Help make sure
              <span> no one walks alone.</span>
            </h2>

            <p>
              Your contribution helps us create spaces where people affected
              by gender-based violence can find information, connection,
              practical support, and hope.
            </p>

            <div className="donate-banner__impact">
              {impactItems.map((item) => (
                <div
                  className="donate-banner__impact-item"
                  key={item.value}
                >
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ==========================================
              RIGHT — DONATION CARD
          ========================================== */}

          <motion.div
            className="donate-banner__card"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            <div className="donate-banner__card-top">
              <div className="donate-banner__heart">
                <Heart size={21} strokeWidth={1.8} />
              </div>

              <span>MAKE AN IMPACT</span>
            </div>

            <div className="donate-banner__card-content">
              <h3>
                Give what
                <br />
                <em>you can.</em>
              </h3>

              <p>
                Every contribution, large or small, helps us continue
                supporting survivors and strengthening communities.
              </p>
            </div>

            <button
              type="button"
              className="donate-banner__primary"
              onClick={() => setOpen(true)}
            >
              <span>Donate now</span>

              <span className="donate-banner__primary-icon">
                <ArrowUpRight size={17} />
              </span>
            </button>

            <a
              href="/contact"
              className="donate-banner__partner"
            >
              <span>Interested in partnering?</span>
              <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          DONATION MODAL
      ========================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            className="donate-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="donate-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="donate-modal-title"
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              transition={{
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="donate-modal__close"
                onClick={() => setOpen(false)}
                aria-label="Close donation window"
              >
                <X size={19} />
              </button>

              <div className="donate-modal__header">
                <span className="donate-modal__eyebrow">
                  SUPPORT OUR WORK
                </span>

                <h3 id="donate-modal-title">
                  Choose how you'd
                  <br />
                  like to <span>give.</span>
                </h3>
              </div>

              {/* Payment methods */}

              <div className="donate-modal__tabs">
                <button
                  type="button"
                  className={method === "mpesa" ? "active" : ""}
                  onClick={() => setMethod("mpesa")}
                >
                  <Smartphone size={17} />
                  <span>M-Pesa</span>
                </button>

                <button
                  type="button"
                  className={method === "paypal" ? "active" : ""}
                  onClick={() => setMethod("paypal")}
                >
                  <CreditCard size={17} />
                  <span>PayPal</span>
                </button>
              </div>

              <div className="donate-modal__body">
                {method === "mpesa" ? (
                  <>
                    <div className="donate-modal__method-heading">
                      <span>01</span>

                      <div>
                        <h4>Donate via M-Pesa</h4>
                        <p>
                          Use the details below to make your contribution.
                        </p>
                      </div>
                    </div>

                    <div className="donate-payment">
                      <span>PAYBILL</span>
                      <strong>123456</strong>
                    </div>

                    <div className="donate-payment">
                      <span>ACCOUNT</span>
                      <strong>CML Kenya</strong>
                    </div>

                    <p className="donate-modal__note">
                      Thank you for helping us build stronger, safer
                      communities.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="donate-modal__method-heading">
                      <span>02</span>

                      <div>
                        <h4>Donate via PayPal</h4>
                        <p>
                          Continue securely through PayPal.
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://paypal.me/yourlink"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="donate-paypal"
                    >
                      <span>Continue to PayPal</span>
                      <ArrowUpRight size={17} />
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
