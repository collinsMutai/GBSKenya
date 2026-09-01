import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, User } from "lucide-react";

import LoginModal from "../loginmodal/LoginModal";

import "./Navbar.css";

/* ==============================
   Navigation Links
============================== */

const links = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "About",
    to: "/about",
  },
  {
    label: "Services",
    to: "/services",
  },
  {
    label: "Survivor Stories",
    to: "/survivor-stories",
  },
  {
    label: "Contact Us",
    to: "/contact",
  },
];

/* ==============================
   Social Icons
============================== */

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
      <circle
        cx="17.5"
        cy="6.5"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
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

/* ==============================
   Navbar
============================== */

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);

  /* Prevent page scrolling when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close mobile menu */
  const closeMenu = () => {
    setOpen(false);
  };

  /* Open login modal */
  const openLogin = () => {
    closeMenu();
    setLoginOpen(true);
  };

  /* Login success */
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);

    console.log("Logged in user:", loggedInUser);
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
              href="mailto:info@gbvfoundationkenya.org"
              className="topbar__item"
            >
              <Mail size={14} />
              <span>info@gbvfoundationkenya.org</span>
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
        {/* Text Logo */}

        <Link
          to="/"
          className="navbar__brand navbar__text-logo"
          onClick={closeMenu}
          aria-label="GBV Foundation Kenya Home"
        >
          <span className="navbar__logo-main">GBV</span>
          <span className="navbar__logo-sub">FOUNDATION KENYA</span>
        </Link>

        {/* ==============================
            Desktop Navigation
        ============================== */}

        <nav className="navbar__links" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="navbar__link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ==============================
            Desktop Login
        ============================== */}

        <button
          type="button"
          className="navbar__login"
          onClick={openLogin}
          aria-label="Login"
          title="Login"
        >
          <User size={19} />

          <span>{user ? user.name : "Login"}</span>
        </button>

        {/* ==============================
            Mobile Menu Button
        ============================== */}

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
        <nav className="navbar__mobile" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="navbar__link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Login */}

          <button
            type="button"
            className="navbar__mobile-login"
            onClick={openLogin}
          >
            <User size={20} />

            <span>{user ? user.name : "Login"}</span>
          </button>
        </nav>
      )}

      {/* ==============================
          Login Modal
      ============================== */}

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
}
