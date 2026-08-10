import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, ChevronDown } from "lucide-react";
import "./Navbar.css";
import logo from "../../assets/logo.jpeg";

const links = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "About us",
    to: "/about/who-we-are",
    children: [
      {
        label: "Who We Are",
        to: "/about/who-we-are",
      },
      {
        label: "Leadership",
        to: "/about/leadership",
      },
      {
        label: "Our Medical Advisory Board",
        to: "/about/medical-advisory-board",
      },
    ],
  },
  {
    label: "Resilience stories",
    to: "/stories",
  },
  {
    label: "Support resources",
    to: "/resources",
  },
    {
    label: "Get Involved",
    to: "/get-involved",
    children: [
      {
        label: "Patient and Caregiver Survey",
        to: "/get-involved/patient-caregiver-survey",
      },
      {
        label: "Partner with us",
        to: "/get-involved/partner-with-us",
      },
      {
        label: "Donate",
        to: "/get-involved/donate",
      },
    ],
  },
  {
    label: "Contact us",
    to: "/contact",
  },

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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 10.2 2.2.1 4.4-.6 6-2C3 14.5.5 9.6 3 5.7c2.3 2.8 5.7 4.2 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 2.8-.6 3-1.9z" />
    </svg>
  );
}

function InstagramIcon({ size = 24, ...props }) {
  return (
    <svg {...iconBase} width={size} height={size} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 24, ...props }) {
  return (
    <svg {...iconBase} width={size} height={size} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M12 13a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);

  // Prevent page scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    setMobileDropdownOpen(null);
  };

  return (
    <header className="navbar">
      {/* ==============================
          Top Bar
      ============================== */}

      <div className="topbar">
        <div className="container topbar__row">
          <div className="topbar__contact">
            <a
              href="mailto:info@gbsfoundationkenya.org"
              className="topbar__item"
            >
              <Mail size={14} />
              <span>info@gbsfoundationkenya.org</span>
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

      {/* ==============================
          Main Navigation
      ============================== */}

      <div className="container navbar__row">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <img src={logo} alt="GBS Foundation Kenya" className="navbar__logo" />
        </Link>

        {/* Desktop Navigation */}
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
        </nav>

        {/* Mobile Menu Button */}
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

      {/* ==============================
          Mobile Menu
      ============================== */}

      {open && (
        <nav className="navbar__mobile">
          {links.map((link) =>
            link.children ? (
              <div key={link.to} className="navbar__mobile-group">
                <button
                  type="button"
                  className="navbar__link navbar__mobile-group-trigger"
                  onClick={() =>
                    setMobileDropdownOpen((prev) =>
                      prev === link.to ? null : link.to,
                    )
                  }
                  aria-expanded={mobileDropdownOpen === link.to}
                >
                  {link.label}

                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    style={{
                      transform:
                        mobileDropdownOpen === link.to
                          ? "rotate(180deg)"
                          : "none",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {mobileDropdownOpen === link.to && (
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
        </nav>
      )}
    </header>
  );
}
