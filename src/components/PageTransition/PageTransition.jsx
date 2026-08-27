import { motion } from 'framer-motion'

// The fade+rise every page's content does on enter/exit
// (CLAUDE-CODE-BRIEF.md section 8: "opacity 0.32s, translateY(16px)").
//
// This must be applied to each section's own root element, not a wrapper
// around it — the section roots are position:fixed, and a transformed
// *ancestor* becomes the containing block for fixed-position descendants,
// which would silently break their positioning mid-animation. Motion
// applied to the fixed element itself has no such problem: its own
// children are position:absolute/relative, not fixed-to-viewport.
const VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
}

function PageTransition({ className, stopClicks = false, children }) {
  return (
    <motion.div
      className={className}
      variants={VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.32, ease: 'easeOut' }}
      onClick={stopClicks ? (e) => e.stopPropagation() : undefined}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
