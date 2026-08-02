import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <h3 className="footer__brand">GBS Foundation Kenya</h3>
          <p className="footer__blurb">
            An independent Kenya-registered NGO working in partnership with GBS|CIDP Foundation
            International to bring trusted information, care, and community to people living with
            Guillain-Barré Syndrome, CIDP, and MMN across Kenya.
          </p>
        </div>

        <div>
          <p className="eyebrow eyebrow--on-dark">Explore</p>
          <div className="footer__links">
            <Link to="/about/who-we-are">About us</Link>
            <Link to="/stories">Resilience stories</Link>
            <Link to="/resources">Support resources</Link>
            <Link to="/contact">Contact us</Link>
          </div>
        </div>

        <div>
          <p className="eyebrow eyebrow--on-dark">Reach us</p>
          <div className="footer__links">
            <span>Nairobi, Kenya</span>
            <a href="mailto:hello@gbsfoundationkenya.org">hello@gbsfoundationkenya.org</a>
            <a href="tel:+254700000000">+254 700 000 000</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          © {new Date().getFullYear()} GBS Foundation Kenya. All rights reserved.
        </div>
      </div>
    </footer>
  )
}