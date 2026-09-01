import { motion } from "framer-motion";
import "./PageHeader.css";

const heroImage = "https://demo.awaikenthemes.com/aasha/wp-content/uploads/2026/02/page-header-bg.jpg";

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section
      className="page-header"
      style={{ "--page-header-image": `url(${heroImage})` }}
    >
      <div className="page-header__overlay" />

      <motion.div
        className="container page-header__inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="page-header__content">
          {eyebrow && (
            <p className="eyebrow eyebrow--on-dark page-header__eyebrow">
              {eyebrow}
            </p>
          )}

          <h1 className="page-header__title">{title}</h1>

          {subtitle && (
            <p className="page-header__subtitle">{subtitle}</p>
          )}
        </div>
      </motion.div>

      <div className="page-header__bottom" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
