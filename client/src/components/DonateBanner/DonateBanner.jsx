import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Smartphone, CreditCard, X } from 'lucide-react'
import './DonateBanner.css'

export default function DonateBanner() {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState('mpesa')

  return (
    <>
      <section className="section donate-banner">
        <motion.div
          className="container donate-banner__inner"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <div className="donate-banner__text">
            <h2 className="donate-banner__title">
              Your support keeps this community going
            </h2>

            <p className="donate-banner__body">
              Every contribution helps us reach more patients, run more support
              groups, and expand access to diagnosis and care across Kenya.
            </p>
          </div>

          <div className="donate-banner__actions">
            <button
              type="button"
              className="donate-btn"
              onClick={() => setOpen(true)}
            >
              <Heart size={18} />
              Donate
            </button>

            <a href="/contact" className="btn btn-ghost">
              Partner with us
            </a>
          </div>
        </motion.div>
      </section>

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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>

              <div className="modal-tabs">
                <button
                  className={method === 'mpesa' ? 'active' : ''}
                  onClick={() => setMethod('mpesa')}
                >
                  <Smartphone size={16} />
                  M-Pesa
                </button>

                <button
                  className={method === 'paypal' ? 'active' : ''}
                  onClick={() => setMethod('paypal')}
                >
                  <CreditCard size={16} />
                  PayPal
                </button>
              </div>

              <div className="modal-body">
                {method === 'mpesa' ? (
                  <>
                    <h3>Donate via M-Pesa</h3>

                    <p>Use the details below to make your donation.</p>

                    <div className="payment-card">
                      <strong>Paybill:</strong> 123456
                    </div>

                    <div className="payment-card">
                      <strong>Account:</strong> CML Kenya
                    </div>

                    <p className="payment-note">
                      Thank you for supporting our mission.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>Donate via PayPal</h3>

                    <p>Donate securely using PayPal.</p>

                    <a
                      href="https://paypal.me/yourlink"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="paypal-btn"
                    >
                      Continue to PayPal
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}