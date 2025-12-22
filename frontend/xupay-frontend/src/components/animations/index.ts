export { PageTransition } from './PageTransition'
export { StaggerContainer } from './StaggerContainer'
export { FadeIn, SlideIn, ScaleIn } from './Transitions'

// Export animation variants for use in components
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

