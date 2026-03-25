/**
 * Shared animation variants for the Home page sections.
 * Uses framer-motion's variant pattern for consistent fade-up reveals.
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
  }),
};
