import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, ChevronDown } from "lucide-react";
import "./Navbar.css";
import logo from "../../assets/logo.jpeg";

const links = [
  { label: "Home", to: "/" },
  {
    label: "About us",
    to: "/about/who-we-are",
    children: [
      { label: "Who We Are", to: "/about/who-we-are" },
      { label: "Leadership", to: "/about/leadership" },
      {
        label: "Global Medical Advisory Board",
        to: "/about/medical-advisory-board",
      },
    ],
  },
  { label: "Resilience stories", to: "/stories" },
  { label: "Support resources", to: "/resources" },
  { label: "Contact us", to: "/contact" },
];

const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function FacebookIcon({ size = 24, ...props }) {
  return (
    <svg {...iconBase} width={size} height={size} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ size = 24, ...props }) {
  return (
    <svg {...iconBase} width={size} height={size} {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

function InstagramIcon({ size = 24, ...props }) {
  return (
    <svg {...iconBase} width={size} height={size} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 24, ...props }) {
  return (
    <svg {...iconBase} width={size} height={size} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Prevent page scrolling while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setMobileAboutOpen(false);
  };

  return (
    <header className="navbar">
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar__row">
          <div className="topbar__contact">
            <a
              href="mailto:hello@gbsfoundationkenya.org"
              className="topbar__item"
            >
              <Mail size={14} />
              <span>hello@gbsfoundationkenya.org</span>
            </a>

            <a href="tel:+254700000000" className="topbar__item">
              <Phone size={14} />
              <span>+254 700 000 000</span>
            </a>
          </div>

          <div className="topbar__socials">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon size={15} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <TwitterIcon size={15} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon size={15} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container navbar__row">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <img src={logo} alt="GBS Foundation Kenya" className="navbar__logo" />
        </Link>

        <nav className="navbar__links">
          {links.map((link) =>
            link.children ? (
              <div
                key={link.to}
                className="navbar__dropdown"
                onMouseEnter={() => setOpenDropdown(link.to)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={link.to}
                  className="navbar__link navbar__dropdown-trigger"
                >
                  {link.label}
                  <ChevronDown size={14} />
                </Link>

                <div
                  className={`navbar__dropdown-panel ${
                    openDropdown === link.to ? "is-open" : ""
                  }`}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="navbar__dropdown-link"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={link.to} to={link.to} className="navbar__link">
                {link.label}
              </Link>
            ),
          )}

          <Link to="/resources" className="btn btn-primary">
            Donate
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="navbar__toggle"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Fullscreen Mobile Menu */}
      {open && (
        <nav className="navbar__mobile">
          {links.map((link) =>
            link.children ? (
              <div key={link.to} className="navbar__mobile-group">
                <button
                  type="button"
                  className="navbar__link navbar__mobile-group-trigger"
                  onClick={() => setMobileAboutOpen((prev) => !prev)}
                  aria-expanded={mobileAboutOpen}
                >
                  {link.label}
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    style={{
                      transform: mobileAboutOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
                {mobileAboutOpen && (
                  <div className="navbar__mobile-submenu">
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="navbar__mobile-sublink"
                        onClick={closeMenu}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="navbar__link"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ),
          )}

          <Link
            to="/resources"
            className="btn btn-primary navbar__mobile-cta"
            onClick={closeMenu}
          >
            Donate
          </Link>
        </nav>
      )}
    </header>
  );
}
