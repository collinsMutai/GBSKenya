import { Link } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa6";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer__main">

          {/* ==========================================
              BRAND
          ========================================== */}

          <div className="footer__brand-column">
            <span className="footer__label">
              GBV Foundation Kenya
            </span>

            <h2 className="footer__statement">
              Building safer
              <br />
              communities
              <br />
              <em>together.</em>
            </h2>

            <p className="footer__blurb">
              Working to prevent gender-based violence, support survivors,
              strengthen communities, and connect people with trusted
              information and services across Kenya.
            </p>
          </div>


          {/* ==========================================
              NAVIGATION
          ========================================== */}

          <div className="footer__navigation">

            <div className="footer__column">
              <span className="footer__label">
                Explore
              </span>

              <nav className="footer__links">

                <Link to="/">
                  Home
                </Link>

                <Link to="/about">
                  About
                </Link>

                <Link to="/services">
                  Services
                </Link>

                <Link to="/survivor-stories">
                  Survivor Stories
                </Link>

                <Link to="/contact">
                  Contact Us
                </Link>

              </nav>
            </div>


            {/* ==========================================
                CONTACT
            ========================================== */}

            <div className="footer__column footer__contact">
              <span className="footer__label">
                Reach us
              </span>

              <div className="footer__contact-info">

                <span>
                  Nairobi, Kenya
                </span>

                <a href="mailto:hello@gbvfoundationkenya.org">
                  hello@gbvfoundationkenya.org
                </a>

                <a href="tel:+254700000000">
                  +254 700 000 000
                </a>

              </div>
            </div>

          </div>

        </div>


        {/* ==========================================
            BOTTOM
        ========================================== */}

        <div className="footer__bottom">

          <p>
            © {new Date().getFullYear()} GBV Foundation Kenya.
            All rights reserved.
          </p>

          <div className="footer__bottom-links">

            <Link to="/privacy">
              Privacy
            </Link>

            <Link to="/terms">
              Terms
            </Link>

            <a
              href="#top"
              className="footer__top"
              aria-label="Back to top"
            >
              <span>
                Back to top
              </span>

              <FaArrowUp />
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}