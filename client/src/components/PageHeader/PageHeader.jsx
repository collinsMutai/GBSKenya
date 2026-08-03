import { motion } from 'framer-motion'
import './PageHeader.css'

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="page-header">
      <motion.div
        className="container page-header__inner"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {eyebrow && <p className="eyebrow eyebrow--on-dark">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </motion.div>
    </section>
  )
}